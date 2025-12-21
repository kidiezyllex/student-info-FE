"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSendPasswordResetCode } from "@/hooks/useEmail"
import { toast } from "react-toastify"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { mutateAsync: sendPasswordReset, isPending: isSendingReset } = useSendPasswordResetCode()
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{
    email?: string
  }>({})

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setErrors({ email: "Email is required" })
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Invalid email format" })
      return
    }
    
    try {
      await sendPasswordReset({ email })
      toast.success("Password reset code has been sent to your email")
      // Navigate to reset-password page with email as query param
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to send password reset code"
      toast.error(errorMessage)
    }
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
            <form onSubmit={handleSendPasswordReset} className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-gray-800 mb-2">Forgot Password?</h1>
                <p className="text-sm text-gray-600">Enter your email address and we'll send you a code to reset your password</p>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-800 mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="h-10 border-gray-200 transition-all duration-200 bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your email"
                  disabled={isSendingReset}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSendingReset || !email}
                className="w-full h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-orange-500/25 hover:shadow-sm hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSendingReset ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Code"
                )}
              </Button>

              <div className="flex justify-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

