"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Mail, Lock, LogIn, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUser } from "@/context/useUserContext"
import { useLogin, useRegister } from "@/hooks/useAuth"
import { toast } from "react-toastify"
import Image from "next/image"
import Link from "next/link"

const formSchema = z.object({
  name: z.string().optional(), // Make name optional for login, required for register
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true) // New state to toggle between login and register
  const { loginUser } = useUser()
  const { mutate: login, isPending: isLoginPending } = useLogin()
  const { mutate: registerUser, isPending: isRegisterPending } = useRegister()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: FormValues) => {
    if (isLogin) {
      // Login logic
      login(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: (response) => {
            if (response.data && response.data.token) {
              const userInfo = {
                _id: response.data._id,
                name: response.data.name,
                email: response.data.email,
                isAdmin: response.data.isAdmin
              }
              loginUser(userInfo, response.data.token)
              toast.success(response.message || "Login successfully!")
              if (response.data.role === "admin") {
                router.push("/admin")
              }
              else if (response.data.role === "coordinator") {
                router.push("/coordinator")
              }
              else {
                router.push("/student")
              }
            } else {
              toast.error(response.message || "Login failed!")
            }
          },
          onError: (error: any) => {
            let errorMessage = "Login failed, please try again!"
            if (error?.message) {
              errorMessage = error.message
            } else if (error?.response?.data?.message) {
              errorMessage = error.response.data.message
            } else if (typeof error === 'string') {
              errorMessage = error
            }
            toast.error(errorMessage)
          },
        },
      )
    } else {
      // Register logic
      registerUser(
        {
          name: values.name || "", // Name is required for registration
          email: values.email,
          password: values.password,
          role: "student"
        },
        {
          onSuccess: (response) => {
            toast.success(response.message || "Registration successful! Please login.")
            setIsLogin(true) // Switch back to login form after successful registration
            form.reset() // Clear form fields
          },
          onError: (error: any) => {
            let errorMessage = "Registration failed, please try again!"
            if (error?.message) {
              errorMessage = error.message
            } else if (error?.response?.data?.message) {
              errorMessage = error.response.data.message
            } else if (typeof error === 'string') {
              errorMessage = error
            }
            toast.error(errorMessage)
          },
        },
      )
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleForm = () => {
    setIsLogin((prev) => !prev)
    form.reset() // Clear form fields when switching forms
  }

  return (
    <div
    style={{
      backgroundImage: "url('/images/vgu-bg.png')",
      backgroundSize: "100% 100%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    className="h-screen w-screen flex justify-center items-center">
      <Card className="max-w-xl w-[500px] mx-auto bg-white/30 backdrop-blur-lg shadow-lg border border-white/20">
        <CardHeader className="flex flex-col items-center gap-4 py-4 bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 rounded-t-lg">
        <Image
						height={300}
						width={300}
						draggable={false}
						quality={100}
						src="/images/vgu-logo.avif" alt="vgu-logo" className="w-auto h-20" />
          <CardTitle className="text-2xl font-semibold text-gray-800">{isLogin ? "Login to your account" : "Register for an account"}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 bg-white/20 backdrop-blur-lg shadow-lg border border-white/20 rounded-b-lg overflow-y-auto !h-[400px] hide-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {!isLogin && ( // Render name field only for registration
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-gray-700">Name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                          <Input
                            placeholder="Your Name"
                            className="pl-10 h-12 border-gray-200 transition-all duration-200 bg-white/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-700">Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          placeholder="example@gmail.com"
                          className="pl-10 h-12 border-gray-200 transition-all duration-200 bg-white/50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-12 h-12 border-gray-200 transition-all duration-200 bg-white/50"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-500 hover:bg-gray-100/50"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold  shadow-orange-500/25 hover:shadow-sm hover:shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5 rounded-sm"
                disabled={isLogin ? isLoginPending : isRegisterPending}
              >
                {isLogin ? (
                  isLoginPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </div>
                  )
                ) : (
                  isRegisterPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Registering...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Register</span>
                    </div>
                  )
                )}
              </Button>
            </form>
          </Form>

          {/* Additional links */}
          <div className="text-center space-y-4">
            {isLogin ? (
              <button className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                Forgot password?
              </button>
            ) : null}


            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-mainTextV1">or</span>
              </div>
            </div>

            {isLogin ? (
              <p className="text-sm text-gray-700">
                Don&apos;t have an account?{" "}
                <button
                onClick={toggleForm}
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                  Register now
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <button
                  onClick={toggleForm}
                  className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>

  )
}
