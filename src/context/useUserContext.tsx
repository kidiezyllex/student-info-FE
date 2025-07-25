"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

import { clearToken, setTokenToLocalStorage } from "@/utils/tokenStorage"
import { IProfileResponse } from "@/interface/response/auth"
import { QueryClient } from "@tanstack/react-query"
import { useRouter, usePathname } from "next/navigation"
import cookies from "js-cookie"
import { useGetUserProfile } from "@/hooks/useUser"

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
  const isPublicRoute = pathname === "/login" || pathname === "/register"
  const { data: profileData, refetch: refetchProfile, isLoading: isProfileLoading } = useGetUserProfile({ enabled: !!token && !isPublicRoute })
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
      await refetchProfile()
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

  useEffect(() => {
    if (profileData) {
      setProfile(profileData)
      if (typeof window !== "undefined") {
        localStorage.setItem("userProfile", JSON.stringify(profileData))
      }
    }
  }, [profileData])

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
        isLoadingProfile: isProfileLoading || isLoadingProfile,
        isAuthenticated: !!user || !!profile,
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

