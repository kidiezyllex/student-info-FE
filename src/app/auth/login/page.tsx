"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/hooks/useAuth"
import { useSendVerificationCodeToEmail, useVerifyCodeFromEmail } from "@/hooks/useEmail"
import { useUser } from "@/context/useUserContext"
import { toast } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { mutateAsync: loginUser, isPending } = useLogin()
  const { loginUser: setUserContext, fetchUserProfile } = useUser()
  const { mutateAsync: sendVerificationCode, isPending: isSendingCode } = useSendVerificationCodeToEmail()
  const { mutateAsync: verifyCode, isPending: isVerifyingCode } = useVerifyCodeFromEmail()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verificationCode: ""
  })
  const [passwordResetErrors, setPasswordResetErrors] = useState<{
    resetCode?: string
    newPassword?: string
    confirmPassword?: string
  }>({})
  const [errors, setErrors] = useState<{
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
    const isAdminEmail = formData.email.toLowerCase().includes('admin')
    const isCoordinatorEmail = formData.email.toLowerCase().includes('coordinator')
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if ((!showCodeInput || isAdminEmail || isCoordinatorEmail) && !formData.password) {
      newErrors.password = "Password is required"
    } else if ((!showCodeInput || isAdminEmail || isCoordinatorEmail) && formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (showCodeInput && !isAdminEmail && !isCoordinatorEmail && !formData.verificationCode) {
      newErrors.verificationCode = "Verification code is required"
    } else if (showCodeInput && !isAdminEmail && !isCoordinatorEmail && formData.verificationCode && formData.verificationCode.length !== 6) {
      newErrors.verificationCode = "Verification code must be 6 digits"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDirectLogin = async () => {
    if (!formData.password) {
      setErrors({ password: "Password is required" })
      return
    }
    try {
      const loginResponse = await loginUser({
        email: formData.email,
        password: formData.password
      })
      if (loginResponse?.status === true && loginResponse?.data?.token) {
        if (typeof window !== 'undefined') {
          const token = loginResponse.data.token
          const role = loginResponse.data.role
          const userProfile = JSON.stringify(loginResponse)
          localStorage.setItem('token', token)
          localStorage.setItem('accessToken', token)
          localStorage.setItem('userProfile', userProfile)
          setUserContext(loginResponse.data, token)
          setTimeout(() => {
            fetchUserProfile()
            setTimeout(() => {
              const responseData = loginResponse.data as any
              let redirectPath = `/${role}`
              if (role === 'coordinator' && responseData.department) {
                const departmentName = typeof responseData.department === 'string'
                  ? responseData.department
                  : responseData.department?.name || responseData.department?.code || 'unknown'
                redirectPath = `/coordinator/${departmentName}`
              }
              router.push(redirectPath)
            }, 100)
          }, 100)
        }
        toast.success("Successfully logged in as Admin!")
      } else {
        toast.error("Login failed: No token received")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed"
      toast.error(errorMessage)
    }
  }

  const handleContinue = async () => {
    if (!formData.email) {
      setErrors({ email: "Email is required" })
      return
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Invalid email format" })
      return
    }
    if (formData.email.toLowerCase().includes('admin') || formData.email.toLowerCase().includes('coordinator')) {
      await handleDirectLogin()
      return
    }
    try {
      const response = await sendVerificationCode({ email: formData.email })
      setShowCodeInput(true)
      setFormData(prev => ({ ...prev, verificationCode: "" }))
      toast.success(response?.message || "Verification code has been sent to your email")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to send verification code"
      toast.error(errorMessage)
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
        const loginResponse = await loginUser({
          email: formData.email,
          password: formData.password
        })
        if (loginResponse?.status === true && loginResponse?.data?.token) {
          if (typeof window !== 'undefined') {
            const token = loginResponse.data.token
            const role = loginResponse.data.role
            const userProfile = JSON.stringify(loginResponse)
            localStorage.setItem('token', token)
            localStorage.setItem('accessToken', token)
            localStorage.setItem('userProfile', userProfile)
            setUserContext(loginResponse.data, token)
            setTimeout(() => {
              fetchUserProfile()
              const responseData = loginResponse.data as any
              let redirectPath = `/${role}`
              if (role === 'coordinator' && responseData.department) {
                const departmentName = typeof responseData.department === 'string'
                  ? responseData.department
                  : responseData.department?.name || responseData.department?.code || 'unknown'
                redirectPath = `/coordinator/${departmentName}`
              }
              router.push(redirectPath)
            }, 200)
          }
          toast.success("Login successful!")
          setShowCodeInput(false)
          setFormData(prev => ({ ...prev, verificationCode: "" }))
        } else {
          toast.error("Login failed: No token received")
        }
      } else {
        toast.error(response.message || "Verification failed")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Invalid verification code"
      toast.error(errorMessage)
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
                <h1 className="text-xl font-semibold text-gray-800 mb-2">Login to your account</h1>
              </div>
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
                  {errors.general}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-800 mb-2 block">
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
                {(!showCodeInput || formData.email.toLowerCase().includes('admin') || formData.email.toLowerCase().includes('coordinator')) && (
                  <div>
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-800 mb-2 block">
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
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
                {showCodeInput && !formData.email.toLowerCase().includes('admin') && !formData.email.toLowerCase().includes('coordinator') && (
                  <div>
                    <Label htmlFor="verificationCode" className="text-sm font-semibold text-gray-800 mb-2 block">
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
              {!showCodeInput || formData.email.toLowerCase().includes('admin') || formData.email.toLowerCase().includes('coordinator') ? (
                <Button
                  type="submit"
                  disabled={isPending || isSendingCode}
                  className="w-full h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-orange-500/25 hover:shadow-sm hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending && (formData.email.toLowerCase().includes('admin') || formData.email.toLowerCase().includes('coordinator')) ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : isSendingCode ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (formData.email.toLowerCase().includes('admin') || formData.email.toLowerCase().includes('coordinator')) ? (
                    "Login"
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
              <div className="flex justify-between items-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Forgot password?
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
