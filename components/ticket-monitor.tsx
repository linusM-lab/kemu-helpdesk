"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Bell, Clock, Loader2, RefreshCw } from "lucide-react"
import { ticketService, type Ticket } from "@/lib/ticket-service"

export function TicketMonitor() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [overdueTickets, setOverdueTickets] = useState<Ticket[]>([])
  const [slaBreachedTickets, setSlaBreachedTickets] = useState<Ticket[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const allTickets = ticketService.getTickets()

      // Find overdue tickets
      const now = new Date()
      const overdue = allTickets.filter((ticket) => {
        if (ticket.status === "open" || ticket.status === "assigned" || ticket.status === "in-progress") {
          const createdDate = new Date(ticket.createdAt)
          const diffHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60)

          let thresholdHours = 48 // Default threshold for medium priority

          if (ticket.priority === "urgent") {
            thresholdHours = 4
          } else if (ticket.priority === "high") {
            thresholdHours = 24
          } else if (ticket.priority === "low") {
            thresholdHours = 72
          }

          return diffHours > thresholdHours
        }
        return false
      })

      // Find SLA breached tickets
      const breached = allTickets.filter(
        (ticket) =>
          ticket.sla &&
          ticket.sla.breached &&
          (ticket.status === "open" || ticket.status === "assigned" || ticket.status === "in-progress"),
      )

      setOverdueTickets(overdue)
      setSlaBreachedTickets(breached)
    } catch (error) {
      console.error("Error loading tickets:", error)
      toast({
        title: "Error",
        description: "Failed to load ticket monitoring data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      // Check for overdue tickets
      await ticketService.checkOverdueTickets()
      // Send reminders
      await ticketService.sendReminders()
      // Reload tickets
      await loadTickets()

      toast({
        title: "Success",
        description: "Ticket monitoring data refreshed",
      })
    } catch (error) {
      console.error("Error refreshing ticket monitoring:", error)
      toast({
        title: "Error",
        description: "Failed to refresh ticket monitoring data",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getTimeElapsed = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} days, ${diffHours % 24} hours`
    } else {
      return `${diffHours} hours`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ticket Monitoring</CardTitle>
          <CardDescription>Loading monitoring data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#7b0046" }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Ticket Monitoring</CardTitle>
          <CardDescription>Monitor overdue tickets and SLA breaches</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Overdue Tickets ({overdueTickets.length})
            </h3>

            {overdueTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overdue tickets found.</p>
            ) : (
              <div className="space-y-3">
                {overdueTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {ticket.id} • {ticket.department}
                        </p>
                      </div>
                      <Badge
                        variant={
                          ticket.priority === "urgent"
                            ? "destructive"
                            : ticket.priority === "high"
                              ? "default"
                              : ticket.priority === "medium"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Open for {getTimeElapsed(ticket.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Bell className="h-4 w-4 mr-1" />
                      <span>Assigned to: {ticket.assignedTo || "Unassigned"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              SLA Breached Tickets ({slaBreachedTickets.length})
            </h3>

            {slaBreachedTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No SLA breaches found.</p>
            ) : (
              <div className="space-y-3">
                {slaBreachedTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-md p-3 border-amber-200 bg-amber-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {ticket.id} • {ticket.department}
                        </p>
                      </div>
                      <Badge
                        variant={
                          ticket.priority === "urgent"
                            ? "destructive"
                            : ticket.priority === "high"
                              ? "default"
                              : ticket.priority === "medium"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Open for {getTimeElapsed(ticket.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Bell className="h-4 w-4 mr-1" />
                      <span>Assigned to: {ticket.assignedTo || "Unassigned"}</span>
                    </div>
                    {ticket.sla && (
                      <div className="mt-2 text-sm">
                        <p>Response SLA: {ticket.sla.responseTime} hours</p>
                        <p>Resolution SLA: {ticket.sla.resolutionTime} hours</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

