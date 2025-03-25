"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { BarChart3, Download, PieChart } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { ticketService } from "@/lib/ticket-service"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("ticket-volume")
  const [timeFrame, setTimeFrame] = useState("month")
  const [department, setDepartment] = useState("all")
  const { toast } = useToast()

  const departments = ticketService.getDepartments().map((dept) => dept.name)
  const tickets = ticketService.getTickets()

  // Calculate ticket statistics
  const openTickets = tickets.filter(
    (t) => t.status === "open" || t.status === "assigned" || t.status === "in-progress",
  ).length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length
  const urgentTickets = tickets.filter((t) => t.priority === "urgent" || t.priority === "high").length

  // Calculate department distribution
  const departmentCounts = {}
  tickets.forEach((ticket) => {
    departmentCounts[ticket.department] = (departmentCounts[ticket.department] || 0) + 1
  })

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your report has been generated and is ready to download.",
    })
  }

  const handleDownloadReport = () => {
    toast({
      title: "Download Started",
      description: "Your report is being downloaded.",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#000000" }}>
              Reports & Analytics
            </h1>
            <p style={{ color: "#666666" }}>Generate and view reports on helpdesk performance</p>
          </div>
          <Button onClick={handleDownloadReport} style={{ backgroundColor: "#4a5568", color: "#ffffff" }}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardHeader>
            <CardTitle style={{ color: "#000000" }}>Generate Report</CardTitle>
            <CardDescription style={{ color: "#666666" }}>
              Select parameters to generate a custom report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "#000000" }}>
                  Report Type
                </label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                    <SelectItem value="ticket-volume">Ticket Volume</SelectItem>
                    <SelectItem value="response-time">Response Time</SelectItem>
                    <SelectItem value="resolution-time">Resolution Time</SelectItem>
                    <SelectItem value="department-performance">Department Performance</SelectItem>
                    <SelectItem value="staff-performance">Staff Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "#000000" }}>
                  Time Frame
                </label>
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                  <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                    <SelectValue placeholder="Select time frame" />
                  </SelectTrigger>
                  <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: "#000000" }}>
                  Department
                </label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                    <SelectValue placeholder="Select department" />
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
            </div>

            <Button
              onClick={handleGenerateReport}
              className="w-full"
              style={{ backgroundColor: "#4a5568", color: "#ffffff" }}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card style={{ backgroundColor: "#ffffff" }}>
            <CardHeader>
              <CardTitle style={{ color: "#000000" }}>Ticket Resolution Time</CardTitle>
              <CardDescription style={{ color: "#666666" }}>
                Average time to resolve tickets by priority
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="text-center text-sm text-muted-foreground mt-4">Average resolution time: 1.5 days</div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#ffffff" }}>
            <CardHeader>
              <CardTitle style={{ color: "#000000" }}>Ticket Volume by Department</CardTitle>
              <CardDescription style={{ color: "#666666" }}>Distribution of tickets across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <PieChart className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="text-center text-sm text-muted-foreground mt-4">
                Highest volume: IT Support (
                {Math.round(((departmentCounts["IT Support"] || 0) / Math.max(tickets.length, 1)) * 100) || 0}%)
              </div>
            </CardContent>
          </Card>
        </div>

        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardHeader>
            <CardTitle style={{ color: "#000000" }}>Available Reports</CardTitle>
            <CardDescription style={{ color: "#666666" }}>Download pre-generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium" style={{ color: "#000000" }}>
                    Monthly Ticket Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">Overview of tickets created, resolved, and pending</p>
                </div>
                <Button variant="outline" style={{ color: "#000000", borderColor: "#cccccc" }}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium" style={{ color: "#000000" }}>
                    Staff Performance Report
                  </h4>
                  <p className="text-sm text-muted-foreground">Response times and resolution rates by staff member</p>
                </div>
                <Button variant="outline" style={{ color: "#000000", borderColor: "#cccccc" }}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium" style={{ color: "#000000" }}>
                    Department Workload Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">Ticket distribution and resolution by department</p>
                </div>
                <Button variant="outline" style={{ color: "#000000", borderColor: "#cccccc" }}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

