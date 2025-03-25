"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { userService } from "@/lib/user-service"

export default function LoginPage() {
  const [loginIdentifier, setLoginIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState("email")
  const router = useRouter()
  const { toast } = useToast()

  // Function to validate registration number format
  const isValidRegistrationNumber = (regNo: string) => {
    // Match formats like ist-1-1121-1/2025 or ist-1121-1/2025
    const regNoPattern = /^[a-z]+-\d+-?\d+-\d+\/\d{4}$/i
    return regNoPattern.test(regNo)
  }

  // Function to validate email format
  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@(stu\.)?kemu\.ac\.ke$/i
    return emailPattern.test(email)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (!loginIdentifier || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate login identifier based on selected method
    if (loginMethod === "registration" && !isValidRegistrationNumber(loginIdentifier)) {
      toast({
        title: "Error",
        description: "Please enter a valid registration number (e.g., ist-1-1121-1/2025)",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (loginMethod === "email" && !isValidEmail(loginIdentifier)) {
      toast({
        title: "Error",
        description: "Please enter a valid KEMU email address",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Authenticate user using the user service
      const user = userService.authenticateUser(loginIdentifier, password)

      if (user) {
        toast({
          title: "Success",
          description: `Welcome, ${user.name}`,
        })

        // Redirect based on user role
        if (user.role === "admin" || user.role === "superadmin" || user.email.includes("@admin.kemu.ac.ke")) {
          router.push("/admin/dashboard")
        } else if (user.role === "staff" || user.email.includes("@staff.kemu.ac.ke")) {
          router.push("/staff/dashboard")
        } else {
          router.push("/dashboard")
        }
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during login:", error)
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md" style={{ backgroundColor: "#ffffff" }}>
        <CardHeader className="space-y-1 items-center">
          <div className="w-32 h-32 relative mb-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ke-MU-Brand-Logo-1.jpg-Uxw8eB1OlYPQCH09ldbKc122s2LpzS.jpeg"
              alt="Kenya Methodist University Logo"
              fill
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center" style={{ color: "#000000" }}>
            Login to KEMU Helpdesk
          </CardTitle>
          <CardDescription className="text-center" style={{ color: "#666666" }}>
            Enter your credentials to access the helpdesk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" value={loginMethod} onValueChange={setLoginMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email" style={{ color: loginMethod === "email" ? "#4a5568" : "#666666" }}>
                Email
              </TabsTrigger>
              <TabsTrigger
                value="registration"
                style={{ color: loginMethod === "registration" ? "#4a5568" : "#666666" }}
              >
                Registration No.
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginIdentifier" style={{ color: "#000000" }}>
                  {loginMethod === "email" ? "Email" : "Registration Number"}
                </Label>
                <Input
                  id="loginIdentifier"
                  type={loginMethod === "email" ? "email" : "text"}
                  placeholder={loginMethod === "email" ? "your.email@kemu.ac.ke" : "ist-1-1121-1/2025"}
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                  style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
                />
                {loginMethod === "email" && (
                  <p className="text-xs" style={{ color: "#666666" }}>
                    Use your KEMU email (e.g., name@kemu.ac.ke or student@stu.kemu.ac.ke)
                  </p>
                )}
                {loginMethod === "registration" && (
                  <p className="text-xs" style={{ color: "#666666" }}>
                    Enter your registration number (e.g., ist-1-1121-1/2025)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" style={{ color: "#000000" }}>
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    style={{ color: "#4a5568" }}
                    className="text-sm font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" style={{ color: "#666666" }} />
                    ) : (
                      <Eye className="h-4 w-4" style={{ color: "#666666" }} />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "#4a5568", color: "#ffffff" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm" style={{ color: "#000000" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#4a5568" }} className="font-medium hover:underline">
              Register here
            </Link>
          </div>
          <div className="text-center text-xs" style={{ color: "#666666" }}>
            By logging in, you agree to our{" "}
            <Link href="#" style={{ color: "#4a5568" }} className="hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" style={{ color: "#4a5568" }} className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

