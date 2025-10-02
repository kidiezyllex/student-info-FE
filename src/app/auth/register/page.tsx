"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRegister } from "@/hooks/useAuth"
import { useSendVerificationCodeToEmail, useVerifyCodeFromEmail } from "@/hooks/useEmail"
import { toast } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { mutateAsync: registerUser, isPending } = useRegister()
  const { mutateAsync: sendVerificationCode, isPending: isSendingCode } = useSendVerificationCodeToEmail()
  const { mutateAsync: verifyCode, isPending: isVerifyingCode } = useVerifyCodeFromEmail()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    verificationCode: ""
  })
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    verificationCode?: string
    general?: string
  }>({})
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!formData.name) {
      newErrors.name = "Name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    
    if (!showCodeInput && !formData.password) {
      newErrors.password = "Password is required"
    } else if (!showCodeInput && formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    if (showCodeInput && !formData.verificationCode) {
      newErrors.verificationCode = "Verification code is required"
    } else if (showCodeInput && formData.verificationCode && formData.verificationCode.length !== 6) {
      newErrors.verificationCode = "Verification code must be 6 digits"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = async () => {
    if (!formData.name) {
      setErrors({ name: "Name is required" })
      return
    }
    
    if (!formData.email) {
      setErrors({ email: "Email is required" })
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Invalid email format" })
      return
    }

    if (!formData.password) {
      setErrors({ password: "Password is required" })
      return
    }

    if (formData.password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" })
      return
    }

    try {
      const response = await sendVerificationCode({ email: formData.email })
      setShowCodeInput(true)
      setFormData(prev => ({ ...prev, verificationCode: "" }))
      toast.success(response?.message || "Verification code has been sent to your email")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send verification code")
    }
  }

  const handleConfirm = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const response = await verifyCode({
        email: formData.email,
        code: formData.verificationCode
      })

      if (response.status === true) {
        toast.success(response?.message || "Verification successful!")
        
        const registerResponse = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "student"
        })

        if (registerResponse?.data?.token) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', registerResponse.data.token)
            localStorage.setItem('accessToken', registerResponse.data.token)
          }
          
          toast.success("Registration successful!")
          
          setShowCodeInput(false)
          setFormData(prev => ({ ...prev, verificationCode: "" }))
          
          const role = registerResponse.data.role
          if (role === 'admin') {
            window.location.href = '/admin'
          } else if (role === 'coordinator') {
            window.location.href = '/coordinator'
          } else {
            window.location.href = '/student'
          }
        } else {
          toast.error("Registration failed: No token received")
        }
      } else {
        toast.error(response.message || "Verification failed")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid verification code")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleContinue()
  }

  return (
    <div
      style={{
        backgroundImage: "url('/images/vgu-bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="h-screen w-screen flex justify-center items-center"
    >
      <div className="max-w-xl min-w-[400px] mx-auto bg-white/30 backdrop-blur-lg shadow-lg border-0 overflow-hidden rounded-xl">
        <div className="flex flex-col items-center gap-4 py-4 bg-white/30 backdrop-blur-lg shadow-lg border-0 rounded-none">
          <Image
            height={300}
            width={300}
            draggable={false}
            quality={100}
            src="/images/vgu-logo.webp"
            alt="vgu-logo"
            className="w-auto h-20"
          />
        </div>

        <div className="bg-white/20 w-full backdrop-blur-lg shadow-lg border-0 rounded-none overflow-hidden">
          <div className="bg-transparent shadow-none p-4 rounded-none border-none pb-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-800 mb-2">Create your account</h1>
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
                  {errors.general}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-10 border-gray-200 transition-all duration-200 bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your full name"
                    disabled={isPending || isSendingCode}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-10 border-gray-200 transition-all duration-200 bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your email"
                    disabled={isPending || isSendingCode}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {!showCodeInput && (
                  <div>
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="h-10 border-gray-200 transition-all duration-200 bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-12"
                        placeholder="Enter your password"
                        disabled={isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>
                )}

                {showCodeInput && (
                  <div>
                    <Label htmlFor="verificationCode" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Verification Code (6 digits)
                    </Label>
                    <Input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      className="h-10 border-gray-200 transition-all duration-200 bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter verification code"
                      disabled={isPending || isVerifyingCode}
                      maxLength={6}
                    />
                    {errors.verificationCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.verificationCode}</p>
                    )}
                  </div>
                )}
              </div>

              {!showCodeInput ? (
                <Button
                  type="submit"
                  disabled={isPending || isSendingCode}
                  className="w-full h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-orange-500/25 hover:shadow-sm hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSendingCode ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    "Continue"
                  )}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleContinue}
                    disabled={isSendingCode}
                    className="flex-1 h-10 bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-all duration-200 transform hover:-translate-y-0.5 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSendingCode ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      "Resend Code"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isPending || isVerifyingCode || !formData.verificationCode}
                    className="flex-1 h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-orange-500/25 hover:shadow-sm hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isVerifyingCode ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </div>
              )}

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
