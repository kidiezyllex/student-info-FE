"use client"

import { SignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useClerkSync } from "@/hooks/useClerkSync"
import { ClerkVerificationHandler } from "@/components/auth/ClerkVerificationHandler"
import Image from "next/image"

export default function SignUpPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn, isSyncing, syncUserToDatabase } = useClerkSync()
  const [verificationComplete, setVerificationComplete] = useState(false)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      syncUserToDatabase('register')
    }
  }, [isLoaded, isSignedIn, syncUserToDatabase])

  const handleVerificationComplete = (userData: any) => {
    setVerificationComplete(true)
  }

  const handleVerificationError = (error: any) => {
    console.error('验证过程中出现错误:', error)
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
      <div className="max-w-xl mx-auto bg-white/30 backdrop-blur-lg shadow-lg border-0 overflow-hidden rounded-xl">
        <div className="flex flex-col items-center gap-4 py-4 bg-white/30 backdrop-blur-lg shadow-lg border-0 rounded-none">
          <Image
            height={300}
            width={300}
            draggable={false}
            quality={100}
            src="/images/vgu-logo.avif" 
            alt="vgu-logo" 
            className="w-auto h-20" 
          />
        </div>
        
        <div className="bg-white/20 backdrop-blur-lg shadow-lg border-0 rounded-none overflow-hidden w-fit">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-orange-500/25 hover:shadow-sm hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 rounded-sm",
                card: "bg-transparent shadow-none p-4 !rounded-none !border-none border-0 rounded-none pb-10",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/50 border-gray-200 hover:bg-white/70 transition-all duration-200",
                formFieldInput: "h-12 border-gray-200 transition-all duration-200 bg-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                formFieldLabel: "text-sm font-semibold text-gray-700",
                dividerLine: "bg-gray-200",
                dividerText: "bg-white px-2 text-gray-600 text-xs uppercase",
                footerActionLink: "text-orange-600 hover:text-orange-700 font-semibold transition-colors",
                footerAction: "text-sm text-gray-700",
                formFieldLabelRow: "mb-2",
                formField: "mb-6",
                formButtonPrimary__loading: "opacity-70 cursor-not-allowed",
                formButtonPrimary__loading__spinner: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              }
            }}
            afterSignUpUrl="/student"
            signInUrl="/login"
            redirectUrl="/student"
          />
        </div>

        {/* 邮箱验证处理器 */}
        <ClerkVerificationHandler
          onVerificationComplete={handleVerificationComplete}
          onError={handleVerificationError}
          role="student"
        />
      </div>
    </div>
  )
}
