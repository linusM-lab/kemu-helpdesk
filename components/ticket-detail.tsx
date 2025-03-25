"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  MessageSquare,
  PaperclipIcon,
  Tag,
  User,
  UserPlus,
  Sparkles,
} from "lucide-react"
import { type Ticket, ticketService } from "@/lib/ticket-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Import the AI learning service
import { aiLearningService } from "@/lib/ai-learning-service"

interface TicketDetailProps {
  ticketId: string
  userEmail: string
  userRole: "student" | "staff" | "admin" | "superadmin"
}

export function TicketDetail({ ticketId, userEmail, userRole }: TicketDetailProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [internalNote, setInternalNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedAssignee, setSelectedAssignee] = useState<string>("")
  const [activeTab, setActiveTab] = useState("conversation")
  const [cannedResponses, setCannedResponses] = useState<{ id: string; title: string; content: string }[]>([])
  const [selectedCannedResponse, setSelectedCannedResponse] = useState<string>("")
  const { toast } = useToast()

  const isStaff = userRole === "staff" || userRole === "admin" || userRole === "superadmin"
  const staffMembers = ticketService.getStaffMembers(ticket?.department)

  // Add state for AI suggestions
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])

  // Add a function to load AI suggestions
  const loadAiSuggestions = () => {
    if (!ticket) return

    try {
      // Get assignment suggestions
      const assignmentSuggestions = aiLearningService.getAssignmentSuggestions(ticket)

      // Get response suggestions
      const responseSuggestions = aiLearningService.getResponseSuggestions(ticket)

      // Combine suggestions
      setAiSuggestions([...assignmentSuggestions, ...responseSuggestions])
    } catch (error) {
      console.error("Error loading AI suggestions:", error)
    }
  }

  useEffect(() => {
    loadTicket()
    // Load canned responses if user is staff
    if (isStaff) {
      const responses = ticketService.getCannedResponses(ticket?.department)
      setCannedResponses(responses)
    }
  }, [ticketId])

  // Call loadAiSuggestions when the ticket is loaded
  useEffect(() => {
    if (ticket && isStaff) {
      loadAiSuggestions()
    }
  }, [ticket, isStaff])

  // Add a function to apply a suggestion
  const applySuggestion = (suggestion: any) => {
    if (suggestion.type === "response") {
      setReplyText(suggestion.content)
    } else if (suggestion.type === "assignment" && staffMembers.length > 0) {
      // Find a staff member to assign to based on the suggestion
      const staffMember = staffMembers[0] // This is simplified
      setSelectedAssignee(staffMember.email)
    }
  }

  const loadTicket = () => {
    setLoading(true)
    try {
      const ticketData = ticketService.getTicketById(ticketId)
      if (ticketData) {
        setTicket(ticketData)
        setSelectedStatus(ticketData.status)
        setSelectedAssignee(ticketData.assignedTo || "")
      } else {
        toast({
          title: "Error",
          description: "Ticket not found",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading ticket:", error)
      toast({
        title: "Error",
        description: "Failed to load ticket details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const updatedTicket = await ticketService.addResponse(ticketId, userEmail, replyText, false, [])

      if (updatedTicket) {
        setTicket(updatedTicket)
        setReplyText("")
        toast({
          title: "Success",
          description: "Your reply has been sent",
        })
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddInternalNote = async () => {
    if (!internalNote.trim() || !isStaff) {
      toast({
        title: "Error",
        description: "Please enter a note message",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const updatedTicket = ticketService.addInternalNote(ticketId, userEmail, internalNote)

      if (updatedTicket) {
        setTicket(updatedTicket)
        setInternalNote("")
        toast({
          title: "Success",
          description: "Internal note added",
        })
      }
    } catch (error) {
      console.error("Error adding note:", error)
      toast({
        title: "Error",
        description: "Failed to add internal note",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async () => {
    if (!ticket || selectedStatus === ticket.status || !isStaff) return

    setIsSubmitting(true)
    try {
      const updatedTicket = await ticketService.changeTicketStatus(ticketId, selectedStatus as any, userEmail)

      if (updatedTicket) {
        setTicket(updatedTicket)
        toast({
          title: "Success",
          description: `Ticket status updated to ${selectedStatus}`,
        })
      }
    } catch (error) {
      console.error("Error changing status:", error)
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssignTicket = async () => {
    if (!ticket || !selectedAssignee || !isStaff) return

    setIsSubmitting(true)
    try {
      const updatedTicket = await ticketService.assignTicket(ticketId, selectedAssignee, userEmail)

      if (updatedTicket) {
        setTicket(updatedTicket)
        toast({
          title: "Success",
          description: `Ticket assigned to ${selectedAssignee}`,
        })
      }
    } catch (error) {
      console.error("Error assigning ticket:", error)
      toast({
        title: "Error",
        description: "Failed to assign ticket",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectCannedResponse = () => {
    if (!selectedCannedResponse) return

    const response = cannedResponses.find((r) => r.id === selectedCannedResponse)
    if (response) {
      setReplyText(response.content)
      setSelectedCannedResponse("")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#7b0046" }} />
      </div>
    )
  }

  if (!ticket) {
    return (
      <Card style={{ backgroundColor: "#ffffff" }}>
        <CardHeader>
          <CardTitle style={{ color: "#000000" }}>Ticket Not Found</CardTitle>
          <CardDescription style={{ color: "#666666" }}>
            The requested ticket could not be found or you don't have permission to view it.
          </CardDescription>
        </CardHeader>
      </Card>
    )
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
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
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
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
              </Badge>
            </div>
            <CardTitle style={{ color: "#000000" }}>{ticket.title}</CardTitle>
            <CardDescription style={{ color: "#666666" }}>
              {ticket.id} • {ticket.department} • Created {formatDate(ticket.createdAt)}
            </CardDescription>
          </div>

          {isStaff && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" style={{ color: "#000000", borderColor: "#cccccc" }}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ backgroundColor: "#ffffff" }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: "#000000" }}>Assign Ticket</DialogTitle>
                    <DialogDescription style={{ color: "#666666" }}>
                      Assign this ticket to a staff member in the {ticket.department} department.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                      <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={staff.email}>
                            {staff.name} ({staff.currentLoad} tickets)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAssignTicket}
                      disabled={isSubmitting}
                      style={{ backgroundColor: "#7b0046", color: "#ffffff" }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        "Assign Ticket"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" style={{ color: "#000000", borderColor: "#cccccc" }}>
                    <Clock className="mr-2 h-4 w-4" />
                    Status
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ backgroundColor: "#ffffff" }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: "#000000" }}>Change Status</DialogTitle>
                    <DialogDescription style={{ color: "#666666" }}>
                      Update the status of this ticket.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleStatusChange}
                      disabled={isSubmitting}
                      style={{ backgroundColor: "#7b0046", color: "#ffffff" }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Status"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start gap-3 mb-2">
                <User className="h-5 w-5 mt-1" style={{ color: "#666666" }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: "#000000" }}>
                      {ticket.createdBy}
                    </span>
                    <span className="text-xs" style={{ color: "#666666" }}>
                      {timeElapsed(ticket.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: "#000000" }}>
                    {ticket.description}
                  </p>

                  {ticket.attachments.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium" style={{ color: "#666666" }}>
                        Attachments:
                      </p>
                      {ticket.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2">
                          <PaperclipIcon className="h-3 w-3" style={{ color: "#666666" }} />
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs hover:underline"
                            style={{ color: "#7b0046" }}
                          >
                            {attachment.filename}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-3" style={{ color: "#000000" }}>
                Ticket Information
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#666666" }}>Department:</span>
                  <span style={{ color: "#000000" }}>{ticket.department}</span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "#666666" }}>Created:</span>
                  <span style={{ color: "#000000" }}>{formatDate(ticket.createdAt)}</span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "#666666" }}>Last Updated:</span>
                  <span style={{ color: "#000000" }}>{formatDate(ticket.lastUpdated)}</span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "#666666" }}>Assigned To:</span>
                  <span style={{ color: "#000000" }}>{ticket.assignedTo || "Unassigned"}</span>
                </div>

                {ticket.assignedAt && (
                  <div className="flex justify-between">
                    <span style={{ color: "#666666" }}>Assigned At:</span>
                    <span style={{ color: "#000000" }}>{formatDate(ticket.assignedAt)}</span>
                  </div>
                )}

                {ticket.sla && (
                  <>
                    <div className="flex justify-between">
                      <span style={{ color: "#666666" }}>Response SLA:</span>
                      <span style={{ color: "#000000" }}>{ticket.sla.responseTime} hours</span>
                    </div>

                    <div className="flex justify-between">
                      <span style={{ color: "#666666" }}>Resolution SLA:</span>
                      <span style={{ color: "#000000" }}>{ticket.sla.resolutionTime} hours</span>
                    </div>

                    <div className="flex justify-between">
                      <span style={{ color: "#666666" }}>SLA Status:</span>
                      <span style={{ color: ticket.sla.breached ? "#ef4444" : "#10b981" }}>
                        {ticket.sla.breached ? "Breached" : "Within SLA"}
                      </span>
                    </div>
                  </>
                )}

                {ticket.tags.length > 0 && (
                  <div className="pt-2">
                    <span style={{ color: "#666666" }}>Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ticket.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isStaff && aiSuggestions.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-md mb-4">
            <h3 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#4a5568" }}>
              <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
              AI Suggestions
            </h3>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-white p-2 rounded border flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#4a5568" }}>
                      {suggestion.type === "assignment"
                        ? "Suggested Assignment"
                        : suggestion.type === "response"
                          ? "Suggested Response"
                          : suggestion.type}
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      {suggestion.content.length > 100
                        ? `${suggestion.content.substring(0, 100)}...`
                        : suggestion.content}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    style={{ color: "#4a5568", borderColor: "#cccccc" }}
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversation" style={{ color: activeTab === "conversation" ? "#7b0046" : "#666666" }}>
              Conversation
            </TabsTrigger>
            {isStaff && (
              <TabsTrigger value="internal" style={{ color: activeTab === "internal" ? "#7b0046" : "#666666" }}>
                Internal Notes
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="conversation" className="space-y-4 mt-4">
            {ticket.responses.filter((r) => !r.isInternal).length > 0 ? (
              <div className="space-y-4">
                {ticket.responses
                  .filter((r) => !r.isInternal)
                  .map((response) => (
                    <div key={response.id} className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 mt-1" style={{ color: "#666666" }} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium" style={{ color: "#000000" }}>
                              {response.from}
                            </span>
                            <span className="text-xs" style={{ color: "#666666" }}>
                              {timeElapsed(response.date)}
                            </span>
                          </div>
                          <p className="text-sm mt-1" style={{ color: "#000000" }}>
                            {response.message}
                          </p>

                          {response.attachments.length > 0 && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs font-medium" style={{ color: "#666666" }}>
                                Attachments:
                              </p>
                              {response.attachments.map((attachment) => (
                                <div key={attachment.id} className="flex items-center gap-2">
                                  <PaperclipIcon className="h-3 w-3" style={{ color: "#666666" }} />
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs hover:underline"
                                    style={{ color: "#7b0046" }}
                                  >
                                    {attachment.filename}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: "#d1d5db" }} />
                <p style={{ color: "#666666" }}>No responses yet</p>
              </div>
            )}

            {ticket.status !== "closed" && (
              <div className="space-y-3 mt-6">
                {isStaff && cannedResponses.length > 0 && (
                  <div className="flex gap-2">
                    <Select value={selectedCannedResponse} onValueChange={setSelectedCannedResponse}>
                      <SelectTrigger style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        <SelectValue placeholder="Insert canned response" />
                      </SelectTrigger>
                      <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                        {cannedResponses.map((response) => (
                          <SelectItem key={response.id} value={response.id}>
                            {response.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={handleSelectCannedResponse}
                      style={{ color: "#000000", borderColor: "#cccccc" }}
                    >
                      Insert
                    </Button>
                  </div>
                )}

                <Textarea
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  style={{ color: "#000000", backgroundColor: "#ffffff" }}
                />

                <div className="flex justify-end">
                  <Button
                    onClick={handleReply}
                    disabled={isSubmitting}
                    style={{ backgroundColor: "#7b0046", color: "#ffffff" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reply"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {ticket.status === "closed" && (
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2" style={{ color: "#10b981" }} />
                <p style={{ color: "#000000" }}>This ticket has been closed</p>
                <p className="text-sm" style={{ color: "#666666" }}>
                  If you need further assistance, please create a new ticket
                </p>
              </div>
            )}
          </TabsContent>

          {isStaff && (
            <TabsContent value="internal" className="space-y-4 mt-4">
              {ticket.internalNotes.length > 0 ? (
                <div className="space-y-4">
                  {ticket.internalNotes.map((note) => (
                    <div key={note.id} className="bg-yellow-50 p-4 rounded-md">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 mt-1" style={{ color: "#f59e0b" }} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium" style={{ color: "#000000" }}>
                              {note.author}
                            </span>
                            <span className="text-xs" style={{ color: "#666666" }}>
                              {timeElapsed(note.date)}
                            </span>
                          </div>
                          <p className="text-sm mt-1" style={{ color: "#000000" }}>
                            {note.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: "#d1d5db" }} />
                  <p style={{ color: "#666666" }}>No internal notes yet</p>
                </div>
              )}

              <div className="space-y-3 mt-6">
                <Textarea
                  placeholder="Add an internal note (only visible to staff)..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows={4}
                  style={{ color: "#000000", backgroundColor: "#ffffff" }}
                />

                <div className="flex justify-end">
                  <Button
                    onClick={handleAddInternalNote}
                    disabled={isSubmitting}
                    variant="outline"
                    style={{ color: "#000000", borderColor: "#cccccc" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Internal Note"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

