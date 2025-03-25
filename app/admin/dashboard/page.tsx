"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { BarChart3, Download, Loader2, PieChart, Plus, Search, Trash, UserPlus, Users } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TicketMonitor } from "@/components/ticket-monitor"
// Import the AI Insights component
import { AIInsights } from "@/components/ai-insights"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Mock data for tickets
  const [tickets, setTickets] = useState([
    {
      id: "TICKET-1001",
      title: "Cannot access student portal",
      department: "IT Support",
      status: "open",
      priority: "high",
      date: "2025-03-15",
      student: "Alice Johnson (CS/2022/001)",
    },
    {
      id: "TICKET-1002",
      title: "Library book return extension",
      department: "Library",
      status: "closed",
      priority: "medium",
      date: "2025-03-10",
      student: "Bob Smith (BUS/2021/045)",
    },
    {
      id: "TICKET-1003",
      title: "Fee payment confirmation",
      department: "Finance",
      status: "in-progress",
      priority: "medium",
      date: "2025-03-14",
      student: "Carol Davis (EDU/2023/078)",
    },
    {
      id: "TICKET-1004",
      title: "Missing grades for COM301",
      department: "Academics",
      status: "open",
      priority: "high",
      date: "2025-03-16",
      student: "Daniel Brown (CS/2022/015)",
    },
    {
      id: "TICKET-1005",
      title: "Hostel maintenance request",
      department: "Facilities",
      status: "in-progress",
      priority: "low",
      date: "2025-03-12",
      student: "Eve White (BUS/2023/032)",
    },
  ])

  // Update the users array to include the superadmin user
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Linus Muriuki",
      email: "linus.muriuki@kemu.ac.ke",
      role: "superadmin",
      department: "Administration",
      active: true,
      dateCreated: "2023-08-01",
    },
  ])

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "staff",
    department: "",
    password: "",
    confirmPassword: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddUser = (e: React.FormEvent) => {
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

    // Simulate API call
    setTimeout(() => {
      const newUserObj = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        active: true,
        dateCreated: new Date().toISOString().split("T")[0],
      }

      setUsers([...users, newUserObj])

      // Reset form
      setNewUser({
        name: "",
        email: "",
        role: "staff",
        department: "",
        password: "",
        confirmPassword: "",
      })

      toast({
        title: "Success",
        description: "User has been added successfully",
      })

      setIsSubmitting(false)
      setIsDialogOpen(false)
    }, 1500)
  }

  const toggleUserStatus = (userId: number) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          active: !user.active,
        }
      }
      return user
    })

    setUsers(updatedUsers)

    toast({
      title: "Success",
      description: `User status has been ${updatedUsers.find((u) => u.id === userId)?.active ? "activated" : "deactivated"}`,
    })
  }

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  })

  // Stats for overview
  const openTicketsCount = tickets.filter((t) => t.status === "open").length
  const inProgressTicketsCount = tickets.filter((t) => t.status === "in-progress").length
  const closedTicketsCount = tickets.filter((t) => t.status === "closed").length

  const staffCount = users.filter((u) => u.role === "staff").length
  const adminCount = users.filter((u) => u.role === "admin").length
  const superAdminCount = users.filter((u) => u.role === "superadmin").length

  // Department distribution
  const departmentCounts: Record<string, number> = {}
  tickets.forEach((ticket) => {
    departmentCounts[ticket.department] = (departmentCounts[ticket.department] || 0) + 1
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage the helpdesk system, users, and view analytics</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new staff or admin account for the helpdesk system.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={newUser.department}
                        onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT Support">IT Support</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Library">Library</SelectItem>
                          <SelectItem value="Academics">Academics</SelectItem>
                          <SelectItem value="Admissions">Admissions</SelectItem>
                          <SelectItem value="Facilities">Facilities</SelectItem>
                          <SelectItem value="Student Affairs">Student Affairs</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
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

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Total Open Tickets</CardTitle>
                  <Badge variant="destructive">{openTicketsCount}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{openTicketsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {openTicketsCount > 5 ? "Requires immediate attention" : "Within normal range"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">In Progress Tickets</CardTitle>
                  <Badge variant="secondary">{inProgressTicketsCount}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{inProgressTicketsCount}</div>
                  <p className="text-xs text-muted-foreground">Being handled by staff members</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Resolved Tickets</CardTitle>
                  <Badge variant="outline">{closedTicketsCount}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{closedTicketsCount}</div>
                  <p className="text-xs text-muted-foreground">Successfully resolved this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Staff Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{staffCount}</div>
                  <p className="text-xs text-muted-foreground">Active support staff</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Administrators</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{adminCount + superAdminCount}</div>
                  <p className="text-xs text-muted-foreground">System administrators</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Response Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">87%</div>
                  <p className="text-xs text-muted-foreground">Average response time: 4.2 hours</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <TicketMonitor />
            </div>

            <div className="mt-6">
              <AIInsights />
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Distribution by Department</CardTitle>
                  <CardDescription>Number of tickets per department</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-muted-foreground" />
                    <div className="ml-4 space-y-2">
                      {Object.entries(departmentCounts).map(([dept, count]) => (
                        <div key={dept} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 bg-primary`}></div>
                          <span className="text-sm">
                            {dept}: {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">New ticket created</p>
                        <p className="text-xs text-muted-foreground">TICKET-1004: Missing grades for COM301</p>
                      </div>
                      <p className="text-xs text-muted-foreground">10 minutes ago</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Ticket assigned</p>
                        <p className="text-xs text-muted-foreground">TICKET-1003 assigned to David Wilson</p>
                      </div>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Ticket resolved</p>
                        <p className="text-xs text-muted-foreground">TICKET-1002: Library book return extension</p>
                      </div>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">New user created</p>
                        <p className="text-xs text-muted-foreground">Robert Taylor (Staff - Academics)</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">System backup</p>
                        <p className="text-xs text-muted-foreground">Automatic system backup completed</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-black">User Management</CardTitle>
                    <CardDescription>Manage staff and admin accounts</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new staff or admin account for the helpdesk system.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddUser}>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              value={newUser.role}
                              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                            >
                              <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="superadmin">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select
                              value={newUser.department}
                              onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                            >
                              <SelectTrigger id="department">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="IT Support">IT Support</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="Library">Library</SelectItem>
                                <SelectItem value="Academics">Academics</SelectItem>
                                <SelectItem value="Admissions">Admissions</SelectItem>
                                <SelectItem value="Facilities">Facilities</SelectItem>
                                <SelectItem value="Student Affairs">Student Affairs</SelectItem>
                                <SelectItem value="Administration">Administration</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              value={newUser.password}
                              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={newUser.confirmPassword}
                              onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmitting}>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "superadmin" ? "destructive" : user.role === "admin" ? "default" : "outline"
                            }
                          >
                            {user.role === "superadmin"
                              ? "Super Admin"
                              : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={user.active}
                              onCheckedChange={() => toggleUserStatus(user.id)}
                              disabled={user.role === "superadmin" && superAdminCount <= 1}
                            />
                            <span className={user.active ? "text-green-600" : "text-red-600"}>
                              {user.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{user.dateCreated}</TableCell>
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
                                setUsers(users.filter((u) => u.id !== user.id))
                                toast({
                                  title: "Success",
                                  description: "User has been deleted",
                                })
                              }
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Reports & Analytics</CardTitle>
                    <CardDescription>Generate and download system reports</CardDescription>
                  </div>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ticket Resolution Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <div className="text-center text-sm text-muted-foreground mt-4">
                        Average resolution time: 1.5 days
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ticket Volume by Department</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center">
                        <PieChart className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <div className="text-center text-sm text-muted-foreground mt-4">
                        Highest volume: IT Support (42%)
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Available Reports</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Monthly Ticket Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          Overview of tickets created, resolved, and pending
                        </p>
                      </div>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Staff Performance Report</h4>
                        <p className="text-sm text-muted-foreground">
                          Response times and resolution rates by staff member
                        </p>
                      </div>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Department Workload Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Ticket distribution and resolution by department
                        </p>
                      </div>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">User Activity Log</h4>
                        <p className="text-sm text-muted-foreground">Detailed log of all user actions in the system</p>
                      </div>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

