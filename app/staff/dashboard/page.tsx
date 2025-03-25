"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, ArrowLeft, MessageSquare, TicketIcon, Users } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { TicketList } from "@/components/ticket-list"
import { TicketDetail } from "@/components/ticket-detail"
import { ticketService } from "@/lib/ticket-service"

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("tickets")
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const { toast } = useToast()

  // In a real app, you would get this from the session/auth
  const userEmail = "david.wilson@staff.kemu.ac.ke"
  const userRole = "staff"

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId)
  }

  const handleBackToList = () => {
    setSelectedTicketId(null)
  }

  // Get ticket stats
  const allTickets = ticketService.getTickets()
  const assignedToMe = ticketService.getTicketsByAssignee(userEmail)
  const unassignedTickets = allTickets.filter((t) => !t.assignedTo)
  const urgentTickets = allTickets.filter((t) => t.priority === "urgent" || t.priority === "high")

  // Get department tickets
  const staffMember = ticketService.getStaffMembers().find((s) => s.email === userEmail)
  const departmentTickets = staffMember ? ticketService.getTicketsByDepartment(staffMember.department) : []

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#000000" }}>
              Staff Helpdesk
            </h1>
            <p style={{ color: "#666666" }}>Manage and respond to support requests</p>
          </div>

          {selectedTicketId && (
            <Button variant="outline" onClick={handleBackToList} style={{ color: "#000000", borderColor: "#cccccc" }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          )}
        </div>

        {!selectedTicketId && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card style={{ backgroundColor: "#ffffff" }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: "#000000" }}>
                    Total Tickets
                  </CardTitle>
                  <TicketIcon className="h-4 w-4" style={{ color: "#7b0046" }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: "#000000" }}>
                    {allTickets.length}
                  </div>
                  <p className="text-xs" style={{ color: "#666666" }}>
                    All support requests
                  </p>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: "#ffffff" }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: "#000000" }}>
                    Assigned to Me
                  </CardTitle>
                  <MessageSquare className="h-4 w-4" style={{ color: "#3b82f6" }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: "#000000" }}>
                    {assignedToMe.length}
                  </div>
                  <p className="text-xs" style={{ color: "#666666" }}>
                    Your assigned tickets
                  </p>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: "#ffffff" }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: "#000000" }}>
                    Unassigned
                  </CardTitle>
                  <Users className="h-4 w-4" style={{ color: "#f97316" }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: "#000000" }}>
                    {unassignedTickets.length}
                  </div>
                  <p className="text-xs" style={{ color: "#666666" }}>
                    Tickets needing assignment
                  </p>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: "#ffffff" }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: "#000000" }}>
                    Urgent
                  </CardTitle>
                  <AlertCircle className="h-4 w-4" style={{ color: "#ef4444" }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: "#000000" }}>
                    {urgentTickets.length}
                  </div>
                  <p className="text-xs" style={{ color: "#666666" }}>
                    High priority issues
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card style={{ backgroundColor: "#ffffff" }}>
              <CardHeader>
                <CardTitle style={{ color: "#000000" }}>Ticket Management</CardTitle>
                <CardDescription style={{ color: "#666666" }}>
                  View, assign, and respond to support tickets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TicketList userEmail={userEmail} userRole={userRole} onSelectTicket={handleSelectTicket} />
              </CardContent>
            </Card>
          </>
        )}

        {selectedTicketId && <TicketDetail ticketId={selectedTicketId} userEmail={userEmail} userRole={userRole} />}
      </div>
    </DashboardLayout>
  )
}

