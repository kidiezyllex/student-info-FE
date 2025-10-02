"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingSpinner from "../ui/LoadingSpinner"
import { useUser } from "@/context/useUserContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoadingProfile, profile } = useUser()
  const router = useRouter()
  const [isCheckingRole, setIsCheckingRole] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !isLoadingProfile && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isClient, isLoadingProfile, isAuthenticated, router])

  useEffect(() => {
    if (isClient && isAuthenticated && profile && !isLoadingProfile) {
      checkUserRole()
    }
  }, [isClient, isAuthenticated, profile, isLoadingProfile])

  const checkUserRole = () => {
    if (!allowedRoles || allowedRoles.length === 0) {
      return
    }

    setIsCheckingRole(true)
    
    const userRole = profile?.data?.role || "student"
    
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

  // Optimized loading states - reduced loading time by checking localStorage first
  if (!isClient) {
    // Check localStorage immediately for faster initial render
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('userProfile')
      const hasToken = localStorage.getItem('accessToken')
      
      if (storedProfile && hasToken) {
        // Return children immediately if we have stored auth data
        return <>{children}</>
      }
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isLoadingProfile || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
} 