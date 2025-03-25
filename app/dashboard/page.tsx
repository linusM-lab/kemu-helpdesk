"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MessageSquare, PlusCircle, TicketIcon, CheckCircle, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { QuickTicketForm } from "@/components/quick-ticket-form"
import { TicketDetail } from "@/components/ticket-detail"
import { ticketService } from "@/lib/ticket-service"

export default function StudentDashboard() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const { toast } = useToast()

  // In a real app, you would get this from the session/auth
  const userEmail = "student@stu.kemu.ac.ke"
  const userRole = "student"

  const handleBackToList = () => {
    setSelectedTicketId(null)
  }

  const handleTicketCreated = (ticketId: string) => {
    toast({
      title: "Success",
      description: `Ticket ${ticketId} has been created successfully`,
    })
    setSelectedTicketId(ticketId)
  }

  // Get ticket stats
  const allTickets = ticketService.getTicketsByUser(userEmail)
  const openTickets = allTickets.filter(
    (t) => t.status === "open" || t.status === "assigned" || t.status === "in-progress",
  )
  const resolvedTickets = allTickets.filter((t) => t.status === "resolved" || t.status === "closed")
  const urgentTickets = allTickets.filter((t) => t.priority === "urgent" || t.priority === "high")

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#000000" }}>
              Student Helpdesk
            </h1>
            <p style={{ color: "#666666" }}>Submit and track your support requests</p>
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
                    Open Tickets
                  </CardTitle>
                  <MessageSquare className="h-4 w-4" style={{ color: "#3b82f6" }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: "#000000" }}>
                    {openTickets.length}
                  </div>
                  <p className="text-xs" style={{ color: "#666666" }}>
                    Active support requests
                  </p>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: "#ffffff" }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: "#000000" }}>
                    Resolved
                  </CardTitle>
                  <CheckCircle className="h-4 w-4" style={{ color: "#10b981" }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: "#000000" }}>
                    {resolvedTickets.length}
                  </div>
                  <p className="text-xs" style={{ color: "#666666" }}>
                    Completed requests
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

            <div className="mt-6">
              <QuickTicketForm userEmail={userEmail} onSuccess={handleTicketCreated} />
            </div>
          </>
        )}

        {selectedTicketId && <TicketDetail ticketId={selectedTicketId} userEmail={userEmail} userRole={userRole} />}
      </div>
    </DashboardLayout>
  )
}