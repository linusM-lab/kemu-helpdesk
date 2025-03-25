"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { FileUp, Loader2, PlusCircle } from "lucide-react"
import { ticketService } from "@/lib/ticket-service"

interface QuickTicketFormProps {
  userEmail: string
  onSuccess?: (ticketId: string) => void
}

export function QuickTicketForm({ userEmail, onSuccess }: QuickTicketFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    files: [] as File[],
  })

  const departments = ticketService.getDepartments().map((dept) => dept.name)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        files: [...formData.files, ...Array.from(e.target.files)],
      })
    }
  }

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please provide both a title and description",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Convert files to attachments
      const attachments = formData.files.map((file) => ({
        id: Math.random().toString(36).substring(2, 15),
        filename: file.name,
        size: file.size,
        contentType: file.type,
        url: URL.createObjectURL(file),
      }))

      // Create the ticket
      const ticket = await ticketService.createTicket(
        formData.title,
        formData.description,
        formData.department,
        formData.priority as "low" | "medium" | "high" | "urgent",
        userEmail,
        attachments,
        "web",
      )

      // Reset form
      setFormData({
        title: "",
        description: "",
        department: "",
        priority: "medium",
        files: [],
      })

      toast({
        title: "Success",
        description: `Ticket ${ticket.id} has been created successfully`,
      })

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(ticket.id)
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full" style={{ backgroundColor: "#ffffff" }}>
      <CardHeader>
        <CardTitle style={{ color: "#000000" }}>Submit a Support Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" style={{ color: "#000000" }}>
              What do you need help with?
            </Label>
            <Input
              id="title"
              placeholder="Brief summary of your issue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" style={{ color: "#000000" }}>
              Details
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about your issue"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              style={{ color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" style={{ color: "#000000" }}>
                Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger id="department" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
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

            <div className="space-y-2">
              <Label htmlFor="priority" style={{ color: "#000000" }}>
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
              >
                <SelectTrigger id="priority" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments" style={{ color: "#000000" }}>
              Attachments (Optional)
            </Label>
            <div className="border rounded-md p-2">
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center justify-center">
                  <FileUp className="w-5 h-5 mr-2" style={{ color: "#666666" }} />
                  <span className="text-sm" style={{ color: "#666666" }}>
                    Click to upload or drag and drop
                  </span>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                />
              </label>

              {formData.files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-1 bg-gray-50 rounded">
                      <span className="truncate" style={{ color: "#000000" }}>
                        {file.name}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
          style={{ backgroundColor: "#4a5568", color: "#ffffff" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit Ticket
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

