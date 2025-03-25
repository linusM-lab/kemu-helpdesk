"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Search, Trash, UserPlus } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { emailService } from "@/lib/email-service"
import { userService, type User } from "@/lib/user-service"

export default function UserManagementPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  // Load users on component mount
  useEffect(() => {
    try {
      const loadedUsers = userService.getUsers()
      setUsers(loadedUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please refresh the page.",
        variant: "destructive",
      })
    }
  }, [toast])

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    role: "student" as const,
    department: "",
    password: "",
    confirmPassword: "",
    sendWelcomeEmail: true,
  })

  // Function to validate registration number format
  const isValidRegistrationNumber = (regNo: string) => {
    if (!regNo) return true // Empty is valid (optional)
    // Match formats like ist-1-1121-1/2025 or ist-1121-1/2025
    const regNoPattern = /^[a-z]+-\d+-?\d+-\d+\/\d{4}$/i
    return regNoPattern.test(regNo)
  }

  // Function to validate email format
  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@(stu\.|staff\.|admin\.)?kemu\.ac\.ke$/i
    return emailPattern.test(email)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!newUser.name || !newUser.email || !newUser.department || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate email
    if (!isValidEmail(newUser.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid KEMU email address",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate registration number if provided
    if (newUser.registrationNumber && !isValidRegistrationNumber(newUser.registrationNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid registration number (e.g., ist-1-1121-1/2025)",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Add the user using the user service
      const addedUser = userService.addUser({
        name: newUser.name,
        email: newUser.email,
        registrationNumber: newUser.registrationNumber || undefined,
        role: newUser.role,
        department: newUser.department,
        active: true,
        password: newUser.password,
      })

      // Update the local state
      setUsers(userService.getUsers())

      // Send welcome email if option is selected
      if (newUser.sendWelcomeEmail) {
        try {
          await emailService.sendEmail({
            to: newUser.email,
            subject: "Welcome to KEMU Helpdesk",
            text: `
          Dear ${newUser.name},
          
          Your account has been created on the KEMU Helpdesk system.
          
          Email: ${newUser.email}
          Registration Number: ${newUser.registrationNumber || "N/A"}
          Role: ${newUser.role}
          Department: ${newUser.department}
          
          You can now log in using your email or registration number and the password provided to you.
          
          Best regards,
          KEMU Helpdesk Team
        `,
          })
        } catch (error) {
          console.error("Failed to send welcome email:", error)
        }
      }

      // Reset form
      setNewUser({
        name: "",
        email: "",
        registrationNumber: "",
        role: "student",
        department: "",
        password: "",
        confirmPassword: "",
        sendWelcomeEmail: true,
      })

      toast({
        title: "Success",
        description: "User has been added successfully",
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleUserStatus = (userId: number) => {
    try {
      const user = userService.getUserById(userId)
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        })
        return
      }

      // Check if this is the only superadmin
      if (user.role === "superadmin") {
        const superadminCount = users.filter((u) => u.role === "superadmin").length
        if (superadminCount <= 1) {
          toast({
            title: "Error",
            description: "Cannot deactivate the only Super Admin account",
            variant: "destructive",
          })
          return
        }
      }

      // Update the user status
      userService.updateUser(userId, { active: !user.active })

      // Update the local state
      setUsers(userService.getUsers())

      toast({
        title: "Success",
        description: `User status has been ${!user.active ? "activated" : "deactivated"}`,
      })
    } catch (error) {
      console.error("Error toggling user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.registrationNumber && user.registrationNumber.toLowerCase().includes(query)) ||
      user.department.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  })

  const superAdminCount = users.filter((u) => u.role === "superadmin").length

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#000000" }}>
              User Management
            </h1>
            <p style={{ color: "#666666" }}>Manage users and their access to the helpdesk system</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4" style={{ color: "#666666" }} />
              <Input
                placeholder="Search users..."
                className="pl-8 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ color: "#000000", backgroundColor: "#ffffff" }}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: "#4a5568", color: "#ffffff" }}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" style={{ backgroundColor: "#ffffff" }}>
                <DialogHeader>
                  <DialogTitle style={{ color: "#000000" }}>Add New User</DialogTitle>
                  <DialogDescription style={{ color: "#666666" }}>
                    Create a new user account for the helpdesk system.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" style={{ color: "#000000" }}>
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                        style={{ color: "#000000", backgroundColor: "#ffffff" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" style={{ color: "#000000" }}>
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                        style={{ color: "#000000", backgroundColor: "#ffffff" }}
                      />
                      <p className="text-xs" style={{ color: "#666666" }}>
                        Format: name@kemu.ac.ke, student@stu.kemu.ac.ke, or staff@staff.kemu.ac.ke
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber" style={{ color: "#000000" }}>
                        Registration Number
                      </Label>
                      <Input
                        id="registrationNumber"
                        value={newUser.registrationNumber}
                        onChange={(e) => setNewUser({ ...newUser, registrationNumber: e.target.value })}
                        style={{ color: "#000000", backgroundColor: "#ffffff" }}
                      />
                      <p className="text-xs" style={{ color: "#666666" }}>
                        Format for students: ist-1-1121-1/2025 or ist-1121-1/2025
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" style={{ color: "#000000" }}>
                        Role
                      </Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: "student" | "staff" | "admin" | "superadmin") =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger id="role" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" style={{ color: "#000000" }}>
                        Department
                      </Label>
                      <Select
                        value={newUser.department}
                        onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                      >
                        <SelectTrigger id="department" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                          <SelectItem value="IT Support">IT Support</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Library">Library</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Business Administration">Business Administration</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Health Sciences">Health Sciences</SelectItem>
                          <SelectItem value="Academics">Academics</SelectItem>
                          <SelectItem value="Admissions">Admissions</SelectItem>
                          <SelectItem value="Facilities">Facilities</SelectItem>
                          <SelectItem value="Student Affairs">Student Affairs</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" style={{ color: "#000000" }}>
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                        style={{ color: "#000000", backgroundColor: "#ffffff" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" style={{ color: "#000000" }}>
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        required
                        style={{ color: "#000000", backgroundColor: "#ffffff" }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sendWelcomeEmail"
                        checked={newUser.sendWelcomeEmail}
                        onCheckedChange={(checked) => setNewUser({ ...newUser, sendWelcomeEmail: checked })}
                      />
                      <Label htmlFor="sendWelcomeEmail" style={{ color: "#000000" }}>
                        Send welcome email
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      style={{ backgroundColor: "#4a5568", color: "#ffffff" }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create User"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle style={{ color: "#000000" }}>User Management</CardTitle>
                <CardDescription style={{ color: "#666666" }}>
                  Manage staff, admin, and student accounts
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button style={{ backgroundColor: "#4a5568", color: "#ffffff" }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" style={{ backgroundColor: "#ffffff" }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: "#000000" }}>Add New User</DialogTitle>
                    <DialogDescription style={{ color: "#666666" }}>
                      Create a new user account for the helpdesk system.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddUser}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" style={{ color: "#000000" }}>
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          required
                          style={{ color: "#000000", backgroundColor: "#ffffff" }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" style={{ color: "#000000" }}>
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          required
                          style={{ color: "#000000", backgroundColor: "#ffffff" }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber" style={{ color: "#000000" }}>
                          Registration Number
                        </Label>
                        <Input
                          id="registrationNumber"
                          value={newUser.registrationNumber}
                          onChange={(e) => setNewUser({ ...newUser, registrationNumber: e.target.value })}
                          style={{ color: "#000000", backgroundColor: "#ffffff" }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" style={{ color: "#000000" }}>
                          Role
                        </Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value: "student" | "staff" | "admin" | "superadmin") =>
                            setNewUser({ ...newUser, role: value })
                          }
                        >
                          <SelectTrigger id="role" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superadmin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department" style={{ color: "#000000" }}>
                          Department
                        </Label>
                        <Select
                          value={newUser.department}
                          onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                        >
                          <SelectTrigger id="department" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                            <SelectItem value="IT Support">IT Support</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Library">Library</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Business Administration">Business Administration</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Health Sciences">Health Sciences</SelectItem>
                            <SelectItem value="Academics">Academics</SelectItem>
                            <SelectItem value="Admissions">Admissions</SelectItem>
                            <SelectItem value="Facilities">Facilities</SelectItem>
                            <SelectItem value="Student Affairs">Student Affairs</SelectItem>
                            <SelectItem value="Administration">Administration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" style={{ color: "#000000" }}>
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          required
                          style={{ color: "#000000", backgroundColor: "#ffffff" }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" style={{ color: "#000000" }}>
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={newUser.confirmPassword}
                          onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                          required
                          style={{ color: "#000000", backgroundColor: "#ffffff" }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        style={{ backgroundColor: "#4a5568", color: "#ffffff" }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create User"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ color: "#000000" }}>Name</TableHead>
                  <TableHead style={{ color: "#000000" }}>Email</TableHead>
                  <TableHead style={{ color: "#000000" }}>Registration No.</TableHead>
                  <TableHead style={{ color: "#000000" }}>Role</TableHead>
                  <TableHead style={{ color: "#000000" }}>Department</TableHead>
                  <TableHead style={{ color: "#000000" }}>Status</TableHead>
                  <TableHead style={{ color: "#000000" }}>Date Created</TableHead>
                  <TableHead className="text-right" style={{ color: "#000000" }}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium" style={{ color: "#000000" }}>
                      {user.name}
                    </TableCell>
                    <TableCell style={{ color: "#000000" }}>{user.email}</TableCell>
                    <TableCell style={{ color: "#000000" }}>{user.registrationNumber || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "superadmin"
                            ? "destructive"
                            : user.role === "admin"
                              ? "default"
                              : user.role === "staff"
                                ? "secondary"
                                : "outline"
                        }
                        style={{
                          backgroundColor:
                            user.role === "superadmin"
                              ? "#e11d48"
                              : user.role === "admin"
                                ? "#4a5568"
                                : user.role === "staff"
                                  ? "#1e3a8a"
                                  : "transparent",
                          color: user.role === "student" ? "#000000" : "#ffffff",
                        }}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ color: "#000000" }}>{user.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.active}
                          onCheckedChange={() => toggleUserStatus(user.id)}
                          disabled={user.role === "superadmin" && superAdminCount <= 1}
                        />
                        <span style={{ color: user.active ? "#10b981" : "#ef4444" }}>
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell style={{ color: "#000000" }}>{user.dateCreated}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={user.role === "superadmin" && superAdminCount <= 1}
                        onClick={() => {
                          if (user.role === "superadmin" && superAdminCount <= 1) {
                            toast({
                              title: "Error",
                              description: "Cannot delete the only Super Admin account",
                              variant: "destructive",
                            })
                            return
                          }

                          // Confirm before deleting
                          if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                            try {
                              userService.deleteUser(user.id)
                              setUsers(userService.getUsers())
                              toast({
                                title: "Success",
                                description: "User has been deleted",
                              })
                            } catch (error) {
                              console.error("Error deleting user:", error)
                              toast({
                                title: "Error",
                                description: error instanceof Error ? error.message : "Failed to delete user",
                                variant: "destructive",
                              })
                            }
                          }
                        }}
                      >
                        <Trash className="h-4 w-4" style={{ color: "#ef4444" }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

