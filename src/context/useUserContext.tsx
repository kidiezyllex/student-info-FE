"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

import { clearToken, setTokenToLocalStorage } from "@/utils/tokenStorage"
import { IProfileResponse } from "@/interface/response/auth"
import { QueryClient } from "@tanstack/react-query"
import { useRouter, usePathname } from "next/navigation"
import cookies from "js-cookie"
import { useClerkUserProfile } from "@/hooks/useClerkUserProfile"
import { useAuth } from "@clerk/nextjs"

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

const setCookie = (name: string, value: string, days = 30) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const token = cookies.get("accessToken")
  const isPublicRoute = pathname === "/login" || pathname?.startsWith("/login/") || pathname === "/register"
  
  // 使用Clerk认证和用户信息
  const { isLoaded: isClerkLoaded, isSignedIn } = useAuth()
  const { profile: clerkProfile, isAdmin, isCoordinator, isStudent, getUserRole } = useClerkUserProfile()
  
  const [user, setUser] = useState<null | Record<string, any>>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser) : null
    }
    return null
  })
  const [profile, setProfile] = useState<IProfileResponse | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false)

  const loginUser = (userInfo: any, token: string) => {
    setUser(userInfo)
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token)
      localStorage.setItem("token", token) 
    }
    cookies.set("accessToken", token, { expires: 7 })
    setCookie("accessToken", token, 7)
    setTokenToLocalStorage(token)
    fetchUserProfile()
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
      if (typeof window !== "undefined") {
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
      // 使用Clerk用户信息创建profile
      if (clerkProfile) {
        const clerkProfileData: IProfileResponse = {
          status: true,
          message: "Profile retrieved successfully from Clerk",
          data: {
            _id: clerkProfile.id,
            name: clerkProfile.name,
            email: clerkProfile.email,
            role: clerkProfile.role,
            gender: "unknown",
            active: true,
            savedNotifications: [],
            createdAt: clerkProfile.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: clerkProfile.updatedAt?.toISOString() || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            lastProfileUpdate: new Date().toISOString(),
            __v: 0,
            studentInfo: {
              achievements: [],
              scholarships: [],
              status: "active"
            },
            coordinatorInfo: {
              experience: [],
              publications: [],
              qualifications: [],
              researchInterests: [],
              specialization: []
            },
            profileSettings: {
              isPublic: true,
              showEmail: true,
              showPhone: false,
              allowMessages: true,
              emailNotifications: true
            }
          },
          errors: {},
          timestamp: new Date().toISOString()
        }
        setProfile(clerkProfileData)
        if (typeof window !== "undefined") {
          localStorage.setItem("userProfile", JSON.stringify(clerkProfileData))
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile))
      }
    }
  }, [])

  // 当Clerk用户信息可用时，自动更新profile
  useEffect(() => {
    if (clerkProfile && isClerkLoaded) {
      fetchUserProfile()
    }
  }, [clerkProfile, isClerkLoaded])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        localStorage.removeItem("user")
      }
    }
  }, [user])

  const logoutUser = () => {
    clearToken()
    setUser(null)
    setProfile(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("userProfile")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("token")
    }
    cookies.remove("accessToken")
    deleteCookie("accessToken")
    router.push("/sign-in")
    queryClient.clear()
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loginUser,
        logoutUser,
        fetchUserProfile,
        isLoadingProfile: isLoadingProfile || !isClerkLoaded || false,
        isAuthenticated: !!user || !!profile || isSignedIn,
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

