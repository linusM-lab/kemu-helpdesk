"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { userService } from "@/lib/user-service"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    registrationNumber: "",
    password: "",
    confirmPassword: "",
    userType: "student",
    studentId: "",
    staffId: "",
    department: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate email
    if (!isValidEmail(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid KEMU email address",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate registration number if provided
    if (formData.registrationNumber && !isValidRegistrationNumber(formData.registrationNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid registration number (e.g., ist-1-1121-1/2025)",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Add the user using the user service
      userService.addUser({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        registrationNumber: formData.registrationNumber || undefined,
        role: formData.userType as "student" | "staff" | "admin" | "superadmin",
        department: formData.department,
        active: true,
        password: formData.password,
      })

      toast({
        title: "Success",
        description: "Your account has been created. You can now log in.",
      })

      router.push("/login")
    } catch (error) {
      console.error("Error registering user:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const departments = [
    "Computer Science",
    "Business Administration",
    "Education",
    "Health Sciences",
    "Theology",
    "Agriculture",
    "Engineering",
    "Social Sciences",
    "IT Support",
    "Administration",
    "Finance",
    "Human Resources",
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg" style={{ backgroundColor: "#ffffff" }}>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ke-MU-Brand-Logo-1.jpg-Uxw8eB1OlYPQCH09ldbKc122s2LpzS.jpeg"
                alt="Kenya Methodist University Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center" style={{ color: "#000000" }}>
            Create an Account
          </CardTitle>
          <CardDescription className="text-center" style={{ color: "#666666" }}>
            Register to access the KEMU Helpdesk system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" style={{ color: "#000000" }}>
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" style={{ color: "#000000" }}>
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#000000" }}>
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@kemu.ac.ke"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
              />
              <p className="text-xs" style={{ color: "#666666" }}>
                Use your KEMU email (e.g., name@kemu.ac.ke or student@stu.kemu.ac.ke)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationNumber" style={{ color: "#000000" }}>
                Registration Number
              </Label>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                placeholder="ist-1-1121-1/2025"
                value={formData.registrationNumber}
                onChange={handleChange}
                style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
              />
              <p className="text-xs" style={{ color: "#666666" }}>
                Enter your registration number (e.g., ist-1-1121-1/2025)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: "#000000" }}>
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" style={{ color: "#000000" }}>
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ color: "#000000" }}>User Type</Label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) => handleSelectChange("userType", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" style={{ color: "#000000" }}>
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staff" id="staff" />
                  <Label htmlFor="staff" style={{ color: "#000000" }}>
                    Staff
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.userType === "student" && (
              <div className="space-y-2">
                <Label htmlFor="studentId" style={{ color: "#000000" }}>
                  Student ID
                </Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
                />
              </div>
            )}

            {formData.userType === "staff" && (
              <div className="space-y-2">
                <Label htmlFor="staffId" style={{ color: "#000000" }}>
                  Staff ID
                </Label>
                <Input
                  id="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleChange}
                  required
                  style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="department" style={{ color: "#000000" }}>
                Department
              </Label>
              <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                <SelectTrigger
                  id="department"
                  style={{ color: "#000000", backgroundColor: "#ffffff", borderColor: "#cccccc" }}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm" style={{ color: "#000000" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#4a5568" }} className="hover:underline">
              Login here
            </Link>
          </div>
          <div className="text-center text-xs" style={{ color: "#666666" }}>
            By registering, you agree to our{" "}
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

