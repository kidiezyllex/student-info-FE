"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingSpinner from "../ui/LoadingSpinner"
import { useGetClerkUserProfile } from "@/hooks/useUser"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const [isCheckingRole, setIsCheckingRole] = useState(false)
  
  const { data: userProfile, isLoading: isLoadingProfile } = useGetClerkUserProfile({
    enabled: isLoaded && isSignedIn
  })

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (isLoaded && isSignedIn && userProfile && !isLoadingProfile) {
      checkUserRole()
    }
  }, [isLoaded, isSignedIn, userProfile, isLoadingProfile])

  const checkUserRole = () => {
    if (!allowedRoles || allowedRoles.length === 0) {
      return
    }

    setIsCheckingRole(true)
    
    const userRole = userProfile?.data?.role || "student"
    
    if (!allowedRoles.includes(userRole)) {
      if (userRole === "admin") {
        router.push("/admin")
      } else if (userRole === "coordinator") {
        router.push("/coordinator")
      } else {
        router.push("/student")
      }
    }
    
    setIsCheckingRole(false)
  }

  if (!isLoaded || isLoadingProfile || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
} 