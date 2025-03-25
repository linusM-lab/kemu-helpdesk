"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Clock, Filter, Loader2, MessageSquare, Search } from "lucide-react"
import { type Ticket, ticketService } from "@/lib/ticket-service"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TicketListProps {
  userEmail: string
  userRole: "student" | "staff" | "admin" | "superadmin"
  onSelectTicket: (ticketId: string) => void
}

export function TicketList({ userEmail, userRole, onSelectTicket }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    department: "",
    priority: "",
    status: "",
    assignedTo: "",
  })
  const { toast } = useToast()

  const isStaff = userRole === "staff" || userRole === "admin" || userRole === "superadmin"
  const departments = ticketService.getDepartments().map((dept) => dept.name)
  const staffMembers = ticketService.getStaffMembers()

  useEffect(() => {
    loadTickets()
  }, [userEmail, userRole])

  // Fix the loadTickets function to properly load tickets from localStorage

  const loadTickets = async () => {
    setLoading(true)
    try {
      let ticketData: Ticket[] = []

      // Load tickets from localStorage
      const savedTickets = localStorage.getItem("kemuTickets")
      if (savedTickets) {
        try {
          const parsedTickets = JSON.parse(savedTickets)
          if (Array.isArray(parsedTickets) && parsedTickets.length > 0) {
            ticketData = parsedTickets
          }
        } catch (error) {
          console.error("Error parsing tickets from localStorage:", error)
        }
      }

      // If there are no tickets, create some sample tickets for demonstration
      if (ticketData.length === 0) {
        // Create sample tickets
        const sampleTickets = [
          {
            title: "Cannot access student portal",
            description:
              "I'm trying to log in to the student portal but keep getting an error message saying 'Invalid credentials' even though I'm sure my password is correct.",
            department: "IT Support",
            priority: "high" as "low" | "medium" | "high" | "urgent",
            createdBy: userEmail || "student@stu.kemu.ac.ke",
          },
          {
            title: "Library book return extension",
            description:
              "I need to extend the return date for a book I borrowed. I'm currently sick and can't come to campus until next week.",
            department: "Library",
            priority: "medium" as "low" | "medium" | "high" | "urgent",
            createdBy: userEmail || "student@stu.kemu.ac.ke",
          },
          {
            title: "Fee payment confirmation",
            description:
              "I made a payment via M-Pesa on Monday but it's not yet reflected in my account. The transaction code is KLM12345678.",
            department: "Finance",
            priority: "medium" as "low" | "medium" | "high" | "urgent",
            createdBy: userEmail || "student@stu.kemu.ac.ke",
          },
        ]

        for (const ticket of sampleTickets) {
          const newTicket = await ticketService.createTicket(
            ticket.title,
            ticket.description,
            ticket.department,
            ticket.priority,
            ticket.createdBy,
            [],
            "web",
          )
          ticketData.push(newTicket)
        }

        // Save the sample tickets to localStorage
        localStorage.setItem("kemuTickets", JSON.stringify(ticketData))
      }

      // Filter tickets based on user role
      if (isStaff) {
        // Staff can see all tickets or tickets assigned to them
        if (activeTab === "all") {
          // No filtering needed, show all tickets
        } else if (activeTab === "assigned") {
          ticketData = ticketData.filter((t) => t.assignedTo === userEmail)
        } else if (activeTab === "unassigned") {
          ticketData = ticketData.filter((t) => !t.assignedTo)
        } else if (activeTab === "department") {
          const userDept = staffMembers.find((s) => s.email === userEmail)?.department
          if (userDept) {
            ticketData = ticketData.filter((t) => t.department === userDept)
          }
        }
      } else {
        // Students can only see their own tickets
        ticketData = ticketData.filter((t) => t.createdBy === userEmail)
      }

      // Apply filters
      ticketData = applyFilters(ticketData)

      // Sort tickets by date (newest first)
      ticketData.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())

      setTickets(ticketData)
    } catch (error) {
      console.error("Error loading tickets:", error)
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (ticketData: Ticket[]) => {
    let filtered = ticketData

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.department.toLowerCase().includes(query),
      )
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter((ticket) => ticket.department === filters.department)
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter((ticket) => ticket.priority === filters.priority)
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((ticket) => ticket.status === filters.status)
    }

    // Apply assignee filter
    if (filters.assignedTo) {
      if (filters.assignedTo === "unassigned") {
        filtered = filtered.filter((ticket) => !ticket.assignedTo)
      } else {
        filtered = filtered.filter((ticket) => ticket.assignedTo === filters.assignedTo)
      }
    }

    return filtered
  }

  const resetFilters = () => {
    setFilters({
      department: "",
      priority: "",
      status: "",
      assignedTo: "",
    })
    setFilterOpen(false)
    loadTickets()
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setTimeout(() => loadTickets(), 0)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return { bg: "#ef4444", text: "#ffffff" }
      case "high":
        return { bg: "#f97316", text: "#ffffff" }
      case "medium":
        return { bg: "#7b0046", text: "#ffffff" }
      case "low":
        return { bg: "#6b7280", text: "#ffffff" }
      default:
        return { bg: "#6b7280", text: "#ffffff" }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return { bg: "#ef4444", text: "#ffffff" }
      case "assigned":
        return { bg: "#f97316", text: "#ffffff" }
      case "in-progress":
        return { bg: "#3b82f6", text: "#ffffff" }
      case "on-hold":
        return { bg: "#a855f7", text: "#ffffff" }
      case "resolved":
        return { bg: "#10b981", text: "#ffffff" }
      case "closed":
        return { bg: "#6b7280", text: "#ffffff" }
      default:
        return { bg: "#6b7280", text: "#ffffff" }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const timeElapsed = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h ago`
    } else {
      return `${diffHours}h ago`
    }
  }

  return (
    <Card style={{ backgroundColor: "#ffffff" }}>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <CardTitle style={{ color: "#000000" }}>Support Tickets</CardTitle>
            <CardDescription style={{ color: "#666666" }}>
              {isStaff ? "Manage and respond to support tickets" : "View and track your support tickets"}
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4" style={{ color: "#666666" }} />
              <Input
                placeholder="Search tickets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ color: "#000000", backgroundColor: "#ffffff" }}
              />
            </div>

            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" style={{ color: "#000000", borderColor: "#cccccc" }}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent style={{ backgroundColor: "#ffffff" }}>
                <DialogHeader>
                  <DialogTitle style={{ color: "#000000" }}>Filter Tickets</DialogTitle>
                  <DialogDescription style={{ color: "#666666" }}>
                    Apply filters to narrow down the ticket list.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: "#000000" }}>
                      Department
                    </label>
                    <Select
                      value={filters.department}
                      onValueChange={(value) => setFilters({ ...filters, department: value })}
                    >
                      <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: "#000000" }}>
                      Priority
                    </label>
                    <Select
                      value={filters.priority}
                      onValueChange={(value) => setFilters({ ...filters, priority: value })}
                    >
                      <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectValue placeholder="All Priorities" />
                      </SelectTrigger>
                      <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectItem value="priority">All Priorities</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: "#000000" }}>
                      Status
                    </label>
                    <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectItem value="status">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isStaff && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "#000000" }}>
                        Assigned To
                      </label>
                      <Select
                        value={filters.assignedTo}
                        onValueChange={(value) => setFilters({ ...filters, assignedTo: value })}
                      >
                        <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                          <SelectValue placeholder="All Staff" />
                        </SelectTrigger>
                        <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                          <SelectItem value="staff">All Staff</SelectItem>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {staffMembers.map((staff) => (
                            <SelectItem key={staff.id} value={staff.email}>
                              {staff.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetFilters} style={{ color: "#000000", borderColor: "#cccccc" }}>
                    Reset
                  </Button>
                  <Button
                    onClick={() => {
                      setFilterOpen(false)
                      loadTickets()
                    }}
                    style={{ backgroundColor: "#7b0046", color: "#ffffff" }}
                  >
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isStaff && (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" style={{ color: activeTab === "all" ? "#7b0046" : "#666666" }}>
                All Tickets
              </TabsTrigger>
              <TabsTrigger value="assigned" style={{ color: activeTab === "assigned" ? "#7b0046" : "#666666" }}>
                Assigned to Me
              </TabsTrigger>
              <TabsTrigger value="unassigned" style={{ color: activeTab === "unassigned" ? "#7b0046" : "#666666" }}>
                Unassigned
              </TabsTrigger>
              <TabsTrigger value="department" style={{ color: activeTab === "department" ? "#7b0046" : "#666666" }}>
                My Department
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#7b0046" }} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: "#d1d5db" }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: "#000000" }}>
              No tickets found
            </h3>
            <p style={{ color: "#666666" }}>
              {searchQuery || Object.values(filters).some(Boolean)
                ? "Try adjusting your search or filters"
                : isStaff
                  ? "There are no tickets in this category"
                  : "You haven't created any support tickets yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectTicket(ticket.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      style={{
                        backgroundColor: getStatusColor(ticket.status).bg,
                        color: getStatusColor(ticket.status).text,
                      }}
                    >
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                    <Badge
                      style={{
                        backgroundColor: getPriorityColor(ticket.priority).bg,
                        color: getPriorityColor(ticket.priority).text,
                      }}
                    >
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs" style={{ color: "#666666" }}>
                    <Clock className="h-3 w-3" />
                    <span>{timeElapsed(ticket.lastUpdated)}</span>
                    {ticket.responses.length > 0 && (
                      <>
                        <span>•</span>
                        <MessageSquare className="h-3 w-3" />
                        <span>{ticket.responses.length}</span>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="font-medium mb-1" style={{ color: "#000000" }}>
                  {ticket.title}
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                  <span style={{ color: "#666666" }}>{ticket.id}</span>
                  <span className="hidden sm:inline" style={{ color: "#666666" }}>
                    •
                  </span>
                  <span style={{ color: "#666666" }}>{ticket.department}</span>

                  {isStaff && (
                    <>
                      <span className="hidden sm:inline" style={{ color: "#666666" }}>
                        •
                      </span>
                      <span style={{ color: "#666666" }}>From: {ticket.createdBy}</span>
                    </>
                  )}

                  {ticket.assignedTo && (
                    <>
                      <span className="hidden sm:inline" style={{ color: "#666666" }}>
                        •
                      </span>
                      <span style={{ color: "#666666" }}>Assigned: {ticket.assignedTo}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

