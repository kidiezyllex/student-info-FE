"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUser } from "@/context/useUserContext"
import { useLogin } from "@/hooks/useAuth"
import { toast } from "react-toastify"
import Image from "next/image"

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là trường bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { loginUser } = useUser()
  const { mutate: login, isPending } = useLogin()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: FormValues) => {
    login(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: (response) => {
          if (response.data && response.data.token) {
            // Create user object for loginUser function
            const userInfo = {
              _id: response.data._id,
              name: response.data.name,
              email: response.data.email,
              isAdmin: response.data.isAdmin
            }
            loginUser(userInfo, response.data.token)
            toast.success(response.message || "Login successfully!")
            router.push("/admin")
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
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card className="max-w-xl w-[500px] mx-auto">
        <CardHeader className="flex flex-col items-center gap-4 py-4">
        <Image 
						height={300}
						width={300}
						draggable={false}
						quality={100}
						src="/images/logo.svg" alt="logo" className="w-auto h-8" />
          <p className="text-2xl font-bold leading-none tracking-tight uppercase text-primary">Login to continue</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          placeholder="example@gmail.com"
                          className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50"
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
                    <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/50"
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
                className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium  shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5 rounded-sm"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Additional links */}
          <div className="text-center space-y-4">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Forgot password?
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-mainTextV1">or</span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Register now</button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}
