"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

import { clearToken, setTokenToLocalStorage } from "@/utils/tokenStorage"
import { IProfileResponse } from "@/interface/response/auth"
import { QueryClient } from "@tanstack/react-query"
import { useRouter, usePathname } from "next/navigation"
import cookies from "js-cookie"

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
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<null | Record<string, any>>(null)
  const [profile, setProfile] = useState<IProfileResponse | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false)
  
  const token = isClient ? cookies.get("accessToken") : null
  const isPublicRoute = pathname === "/auth/login" || pathname?.startsWith("/auth/login/") || pathname === "/auth/register"

  const loginUser = (userInfo: any, token: string) => {
    setUser(userInfo)
    if (isClient) {
      localStorage.setItem("accessToken", token)
      localStorage.setItem("token", JSON.stringify({ token }))
      cookies.set("accessToken", token, { expires: 7 })
      setCookie("accessToken", token, 7)
      setTokenToLocalStorage(token)
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
        } else {
          console.log("👤 No stored profile found")
        }
      }
    } catch (error) {
      console.error( error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize user and profile from localStorage on client side
  useEffect(() => {
    if (isClient) {
      const storedUser = localStorage.getItem("user")
      const storedProfile = localStorage.getItem("userProfile")
      
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile))
        setIsLoadingProfile(false) // Set loading to false immediately when profile is loaded from localStorage
      }
    }
  }, [isClient])

  useEffect(() => {
    if (isClient && token) {
      fetchUserProfile()
    }
  }, [token, isClient])

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
    if (isClient) {
      localStorage.removeItem("userProfile")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("token")
      cookies.remove("accessToken")
      deleteCookie("accessToken")
    }
    router.push("/auth/login")
    queryClient.clear()
  }

  const isAuthenticatedValue = isClient ? (!!user || !!profile || !!token) : false

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

