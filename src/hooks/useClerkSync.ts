import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useLogin, useRegister } from "./useAuth"
import { toast } from "react-toastify"

export const useClerkSync = () => {
  const { isLoaded, isSignedIn, user: clerkUser } = useAuth()
  const [isSyncing, setIsSyncing] = useState(false)
  
  const { mutate: loginUser } = useLogin()
  const { mutate: registerUser } = useRegister()

  const syncUserToDatabase = async (action: 'login' | 'register') => {
    if (!clerkUser) return

    setIsSyncing(true)
    
    try {
      const userData = {
        name: clerkUser.fullName || clerkUser.firstName || "",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        password: "clerk_authenticated", // Password được xử lý bởi Clerk
        role: "student" // Default role
      }

      if (action === 'login') {
        loginUser(
          {
            email: userData.email,
            password: userData.password,
          },
          {
            onSuccess: (response) => {
              if (response.data && response.data.token) {
                toast.success("Login successfully!")
                localStorage.setItem('userToken', response.data.token)
                localStorage.setItem('userRole', response.data.role)
              } else {
                createUserInDatabase(userData)
              }
            },
            onError: () => {
              createUserInDatabase(userData)
            },
          }
        )
      } else if (action === 'register') {
        createUserInDatabase(userData)
      }
    } catch (error) {
      console.error("Error syncing user:", error)
      toast.error("Error syncing user with database")
    } finally {
      setIsSyncing(false)
    }
  }

  const createUserInDatabase = (userData: any) => {
    registerUser(
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            toast.success("User created in database successfully!")
          } else {
            toast.error(response.message || "Failed to create user in database")
          }
        },
        onError: (error: any) => {
          let errorMessage = "Failed to create user in database!"
          if (error?.message) {
            errorMessage = error.message
          } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message
          } else if (typeof error === 'string') {
            errorMessage = error
          }
          toast.error(errorMessage)
        },
      }
    )
  }

  return {
    isLoaded,
    isSignedIn,
    clerkUser,
    isSyncing,
    syncUserToDatabase,
  }
}
