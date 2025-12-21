"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState, useMemo } from "react"

import { clearToken, setTokenToLocalStorage } from "@/utils/tokenStorage"
import { IProfileResponse } from "@/interface/response/auth"
import { QueryClient } from "@tanstack/react-query"
import { useRouter, usePathname } from "next/navigation"

const queryClient = new QueryClient()

type UserContextType = {
  user: null | Record<string, any>
  profile: IProfileResponse | null
  loginUser: (userInfo: any, token: string) => void
  logoutUser: () => void
  fetchUserProfile: () => Promise<void>
  isLoadingProfile: boolean
  isAuthenticated: boolean
  updateUserProfile?: (data: any) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<null | Record<string, any>>(null)
  const [profile, setProfile] = useState<IProfileResponse | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false)
  
  const [hasToken, setHasToken] = useState(false)
  const isPublicRoute = pathname === "/auth/login" || pathname?.startsWith("/auth/login/") || pathname === "/auth/register" || pathname === "/admin/auth/login"

  const loginUser = (userInfo: any, token: string) => {
    setUser(userInfo)
    setHasToken(true)
    if (isClient) {
      localStorage.setItem("accessToken", token)
      localStorage.setItem("token", token)
      setTokenToLocalStorage(token)
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile)
          setProfile(parsedProfile)
        } catch (error) {
          console.error("Error parsing stored profile:", error)
        }
      }
    }
  }

  const updateUserProfile = (data: any) => {
    if (profile && profile.data) {
      setProfile({
        ...profile,
        data: {
          ...profile.data,
          ...data
        }
      })
      if (isClient) {
        localStorage.setItem("userProfile", JSON.stringify({
          ...profile,
          data: {
            ...profile.data,
            ...data
          }
        }))
      }
    }
  }

  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true)
      if (isClient) {
        const storedProfile = localStorage.getItem("userProfile")
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile)
          setProfile(parsedProfile)
        } 
      }
    } catch (error) {
      console.error( error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Set client flag and initialize from localStorage immediately
  useEffect(() => {
    setIsClient(true)
    
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      const storedProfile = localStorage.getItem("userProfile")
      const storedToken = localStorage.getItem("accessToken") || localStorage.getItem("token")
      
      if (storedToken) {
        setHasToken(true)
      }
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Error parsing stored user:", error)
        }
      }
      
      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile)
          setProfile(parsedProfile)
          setIsLoadingProfile(false)
        } catch (error) {
          console.error("Error parsing stored profile:", error)
        }
      }
      
      if (storedToken) {
        fetchUserProfile()
      }
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        localStorage.removeItem("user")
      }
    }
  }, [user, isClient])

  const logoutUser = () => {
    clearToken()
    setUser(null)
    setProfile(null)
    setHasToken(false)
    if (isClient) {
      localStorage.removeItem("userProfile")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("token")
    }
    router.push("/auth/login")
    queryClient.clear()
  }

  const isAuthenticatedValue = useMemo(() => {
    if (!isClient) {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("accessToken") || localStorage.getItem("token")
        const storedProfile = localStorage.getItem("userProfile")
        return !!(storedToken || storedProfile)
      }
      return false
    }
    return !!(user || profile || hasToken)
  }, [isClient, user, profile, hasToken])

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loginUser,
        logoutUser,
        fetchUserProfile,
        isLoadingProfile: isLoadingProfile,
        isAuthenticated: isAuthenticatedValue,
        updateUserProfile
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

