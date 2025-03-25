import { emailService } from "./email-service"
// Import the AI learning service
import { aiLearningService } from "./ai-learning-service"

// Add this at the top of the file
const isBrowser = typeof window !== "undefined"

export interface Ticket {
  id: string
  title: string
  description: string
  department: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "assigned" | "in-progress" | "on-hold" | "resolved" | "closed"
  createdBy: string
  createdAt: string
  assignedTo?: string
  assignedAt?: string
  dueDate?: string
  lastUpdated: string
  responses: TicketResponse[]
  tags: string[]
  sla?: {
    responseTime: number // in hours
    resolutionTime: number // in hours
    breached: boolean
  }
  attachments: TicketAttachment[]
  internalNotes: InternalNote[]
  category?: string
  source: "web" | "email" | "phone" | "walk-in"
}

export interface TicketResponse {
  id: number
  from: string
  date: string
  message: string
  isInternal: boolean
  attachments: TicketAttachment[]
}

export interface TicketAttachment {
  id: string
  filename: string
  size: number
  contentType: string
  url: string
}

export interface InternalNote {
  id: number
  author: string
  date: string
  message: string
}

export interface StaffMember {
  id: number
  name: string
  email: string
  department: string
  role: string
  specialties: string[]
  active: boolean
  currentLoad: number // Number of active tickets assigned
}

export interface Department {
  id: string
  name: string
  email: string
  description: string
  autoAssignEnabled: boolean
  defaultAssignee?: string
  managers: string[]
  members: string[]
}

export interface CannedResponse {
  id: string
  title: string
  content: string
  department: string
  createdBy: string
  isGlobal: boolean
}

export interface TicketReminder {
  id: string
  ticketId: string
  assigneeEmail: string
  message: string
  dueDate: string
  sent: boolean
  createdAt: string
}

export interface TicketMonitor {
  checkOverdueTickets(): Promise<void>
  sendReminders(): Promise<void>
  createReminder(ticketId: string, assigneeEmail: string, message: string, dueDate: string): Promise<TicketReminder>
}

// Mock data for staff members
const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@staff.kemu.ac.ke",
    department: "IT Support",
    role: "staff",
    specialties: ["hardware", "software", "network"],
    active: true,
    currentLoad: 2,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@staff.kemu.ac.ke",
    department: "Library",
    role: "staff",
    specialties: ["books", "resources", "loans"],
    active: true,
    currentLoad: 1,
  },
  {
    id: 3,
    name: "David Wilson",
    email: "david.wilson@staff.kemu.ac.ke",
    department: "Finance",
    role: "staff",
    specialties: ["fees", "payments", "scholarships"],
    active: true,
    currentLoad: 3,
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah.johnson@staff.kemu.ac.ke",
    department: "Academics",
    role: "staff",
    specialties: ["courses", "grades", "registration"],
    active: true,
    currentLoad: 0,
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael.brown@staff.kemu.ac.ke",
    department: "Admissions",
    role: "staff",
    specialties: ["applications", "enrollment", "documents"],
    active: true,
    currentLoad: 1,
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.davis@staff.kemu.ac.ke",
    department: "Facilities",
    role: "staff",
    specialties: ["maintenance", "housing", "security"],
    active: true,
    currentLoad: 2,
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert.taylor@staff.kemu.ac.ke",
    department: "Student Affairs",
    role: "staff",
    specialties: ["counseling", "activities", "welfare"],
    active: true,
    currentLoad: 1,
  },
]

// Mock data for departments
const departments: Department[] = [
  {
    id: "it-support",
    name: "IT Support",
    email: "it.support@kemu.ac.ke",
    description: "Technical support for computer and network issues",
    autoAssignEnabled: true,
    managers: ["john.doe@staff.kemu.ac.ke"],
    members: ["john.doe@staff.kemu.ac.ke"],
  },
  {
    id: "library",
    name: "Library",
    email: "library@kemu.ac.ke",
    description: "Support for library resources and services",
    autoAssignEnabled: true,
    managers: ["jane.smith@staff.kemu.ac.ke"],
    members: ["jane.smith@staff.kemu.ac.ke"],
  },
  {
    id: "finance",
    name: "Finance",
    email: "finance@kemu.ac.ke",
    description: "Support for financial matters including fees and payments",
    autoAssignEnabled: true,
    managers: ["david.wilson@staff.kemu.ac.ke"],
    members: ["david.wilson@staff.kemu.ac.ke"],
  },
  {
    id: "academics",
    name: "Academics",
    email: "academics@kemu.ac.ke",
    description: "Support for academic matters including courses and grades",
    autoAssignEnabled: true,
    managers: ["sarah.johnson@staff.kemu.ac.ke"],
    members: ["sarah.johnson@staff.kemu.ac.ke"],
  },
  {
    id: "admissions",
    name: "Admissions",
    email: "admissions@kemu.ac.ke",
    description: "Support for admission and enrollment processes",
    autoAssignEnabled: true,
    managers: ["michael.brown@staff.kemu.ac.ke"],
    members: ["michael.brown@staff.kemu.ac.ke"],
  },
  {
    id: "facilities",
    name: "Facilities",
    email: "facilities@kemu.ac.ke",
    description: "Support for campus facilities and maintenance",
    autoAssignEnabled: true,
    managers: ["emily.davis@staff.kemu.ac.ke"],
    members: ["emily.davis@staff.kemu.ac.ke"],
  },
  {
    id: "student-affairs",
    name: "Student Affairs",
    email: "student.affairs@kemu.ac.ke",
    description: "Support for student welfare and activities",
    autoAssignEnabled: true,
    managers: ["robert.taylor@staff.kemu.ac.ke"],
    members: ["robert.taylor@staff.kemu.ac.ke"],
  },
]

// Mock data for canned responses
const cannedResponses: CannedResponse[] = [
  {
    id: "cr1",
    title: "Password Reset Instructions",
    content:
      "To reset your password, please follow these steps:\n1. Go to the login page\n2. Click on 'Forgot Password'\n3. Enter your email address\n4. Follow the instructions sent to your email",
    department: "IT Support",
    createdBy: "john.doe@staff.kemu.ac.ke",
    isGlobal: true,
  },
  {
    id: "cr2",
    title: "Library Book Renewal",
    content:
      "You can renew your library books in the following ways:\n1. Online through the student portal\n2. In person at the library desk\n3. By calling the library at extension 1234",
    department: "Library",
    createdBy: "jane.smith@staff.kemu.ac.ke",
    isGlobal: true,
  },
  {
    id: "cr3",
    title: "Fee Payment Confirmation",
    content:
      "Your payment has been received and processed. Please allow 24-48 hours for it to reflect in your student account. If you have any questions, please contact the finance office.",
    department: "Finance",
    createdBy: "david.wilson@staff.kemu.ac.ke",
    isGlobal: true,
  },
]

// Keywords for automatic department assignment
const departmentKeywords: Record<string, string[]> = {
  "IT Support": [
    "password",
    "reset",
    "computer",
    "laptop",
    "wifi",
    "internet",
    "network",
    "software",
    "hardware",
    "login",
    "account",
    "email",
    "portal",
    "access",
    "system",
    "printer",
    "printing",
    "scan",
    "virus",
    "malware",
    "browser",
    "website",
    "download",
    "upload",
  ],
  Library: [
    "book",
    "borrow",
    "return",
    "library",
    "resource",
    "journal",
    "article",
    "database",
    "research",
    "reserve",
    "renew",
    "fine",
    "overdue",
    "catalog",
    "collection",
    "shelf",
    "librarian",
    "study room",
    "reference",
  ],
  Finance: [
    "fee",
    "payment",
    "invoice",
    "receipt",
    "scholarship",
    "bursary",
    "loan",
    "mpesa",
    "bank",
    "transaction",
    "deposit",
    "refund",
    "balance",
    "statement",
    "financial aid",
    "billing",
    "account",
    "credit",
    "debit",
    "charge",
  ],
  Academics: [
    "course",
    "class",
    "lecture",
    "professor",
    "instructor",
    "grade",
    "exam",
    "test",
    "assignment",
    "syllabus",
    "curriculum",
    "credit",
    "semester",
    "registration",
    "withdraw",
    "transcript",
    "academic",
    "faculty",
    "dean",
    "department",
  ],
  Admissions: [
    "application",
    "admit",
    "admission",
    "enroll",
    "enrollment",
    "document",
    "certificate",
    "diploma",
    "transcript",
    "recommendation",
    "reference",
    "deadline",
    "requirement",
    "transfer",
    "freshman",
    "undergraduate",
    "graduate",
    "international",
  ],
  Facilities: [
    "room",
    "building",
    "hall",
    "dormitory",
    "hostel",
    "maintenance",
    "repair",
    "cleaning",
    "security",
    "key",
    "lock",
    "light",
    "electricity",
    "water",
    "plumbing",
    "heating",
    "cooling",
    "air conditioning",
    "furniture",
    "parking",
  ],
  "Student Affairs": [
    "club",
    "organization",
    "activity",
    "event",
    "counseling",
    "health",
    "wellness",
    "disability",
    "accommodation",
    "housing",
    "residence",
    "meal",
    "food",
    "dining",
    "recreation",
    "sport",
    "gym",
    "id card",
    "student life",
  ],
}

// Keywords for priority assignment
const priorityKeywords: Record<string, string[]> = {
  urgent: [
    "urgent",
    "emergency",
    "immediately",
    "critical",
    "severe",
    "asap",
    "right now",
    "deadline today",
    "locked out",
    "cannot access",
    "broken",
    "not working",
    "down",
    "error",
    "failed",
    "serious",
    "important",
    "crucial",
    "vital",
  ],
  high: [
    "important",
    "soon",
    "quickly",
    "priority",
    "significant",
    "major",
    "pressing",
    "needed",
    "required",
    "essential",
    "necessary",
    "key",
    "vital",
    "crucial",
  ],
  medium: [
    "moderate",
    "average",
    "standard",
    "normal",
    "regular",
    "routine",
    "common",
    "usual",
    "typical",
    "general",
    "ordinary",
  ],
  low: [
    "minor",
    "trivial",
    "small",
    "insignificant",
    "whenever",
    "low priority",
    "not urgent",
    "when possible",
    "at your convenience",
    "no rush",
    "take your time",
    "eventually",
  ],
}

class TicketService {
  private static instance: TicketService
  private tickets: Ticket[] = []
  private reminders: TicketReminder[] = []
  private reminderInterval: NodeJS.Timeout | null = null
  private ticketCounter = 1000

  // Then in the constructor method:
  private constructor() {
    // Initialize with tickets from localStorage if available
    try {
      if (isBrowser) {
        const savedTickets = localStorage.getItem("kemuTickets")
        if (savedTickets) {
          this.tickets = JSON.parse(savedTickets)

          // Update the ticket counter to be higher than any existing ticket ID
          const ticketNumbers = this.tickets
            .map((t) => {
              const match = t.id.match(/TICKET-(\d+)/)
              return match ? Number.parseInt(match[1], 10) : 0
            })
            .filter((n) => !isNaN(n))

          if (ticketNumbers.length > 0) {
            this.ticketCounter = Math.max(...ticketNumbers)
          }
        }
      }
    } catch (error) {
      console.error("Error loading tickets from localStorage:", error)
      this.tickets = []
    }

    // Start the reminder monitoring system
    if (isBrowser) {
      this.startReminderSystem()
    }
  }

  public static getInstance(): TicketService {
    if (!TicketService.instance) {
      TicketService.instance = new TicketService()
    }
    return TicketService.instance
  }

  // Update the createTicket method:
  public async createTicket(
    title: string,
    description: string,
    department: string,
    priority: "low" | "medium" | "high" | "urgent",
    createdBy: string,
    attachments: TicketAttachment[] = [],
    source: "web" | "email" | "phone" | "walk-in" = "web",
  ): Promise<Ticket> {
    // Generate ticket ID
    const ticketId = `TICKET-${++this.ticketCounter}`

    // Auto-detect department if not specified
    if (!department) {
      department = this.detectDepartment(title + " " + description)
    }

    // Auto-detect priority if not specified
    if (!priority) {
      priority = this.detectPriority(title + " " + description)
    }

    // Create the ticket
    const newTicket: Ticket = {
      id: ticketId,
      title,
      description,
      department,
      priority,
      status: "open",
      createdBy,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      responses: [],
      tags: this.generateTags(title + " " + description),
      attachments,
      internalNotes: [],
      source,
      sla: this.calculateSLA(priority),
    }

    // Auto-assign the ticket
    const assignedTicket = await this.autoAssignTicket(newTicket)

    // Add to tickets array
    this.tickets.push(assignedTicket)

    // Save to localStorage
    if (isBrowser) {
      try {
        localStorage.setItem("kemuTickets", JSON.stringify(this.tickets))
      } catch (error) {
        console.error("Error saving ticket to localStorage:", error)
      }
    }

    // Learn from the new ticket using the AI learning service
    try {
      aiLearningService.learnFromTicket(assignedTicket)
    } catch (error) {
      console.error("Error learning from ticket:", error)
    }

    return assignedTicket
  }

  /**
   * Get all tickets
   */
  public getTickets(): Ticket[] {
    return this.tickets
  }

  /**
   * Get a ticket by ID
   */
  public getTicketById(id: string): Ticket | undefined {
    return this.tickets.find((ticket) => ticket.id === id)
  }

  /**
   * Get tickets by user
   */
  public getTicketsByUser(email: string): Ticket[] {
    return this.tickets.filter((ticket) => ticket.createdBy === email)
  }

  /**
   * Get tickets assigned to staff
   */
  public getTicketsByAssignee(email: string): Ticket[] {
    return this.tickets.filter((ticket) => ticket.assignedTo === email)
  }

  /**
   * Get tickets by department
   */
  public getTicketsByDepartment(department: string): Ticket[] {
    return this.tickets.filter((ticket) => ticket.department === department)
  }

  /**
   * Get tickets by status
   */
  public getTicketsByStatus(status: string): Ticket[] {
    return this.tickets.filter((ticket) => ticket.status === status)
  }

  /**
   * Update a ticket
   */
  public updateTicket(id: string, updates: Partial<Ticket>): Ticket | undefined {
    const index = this.tickets.findIndex((ticket) => ticket.id === id)
    if (index === -1) return undefined

    // Update the ticket
    this.tickets[index] = {
      ...this.tickets[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
    }

    // Save to localStorage
    if (isBrowser) {
      localStorage.setItem("kemuTickets", JSON.stringify(this.tickets))
    }

    return this.tickets[index]
  }

  /**
   * Add a response to a ticket
   */
  public async addResponse(
    ticketId: string,
    from: string,
    message: string,
    isInternal = false,
    attachments: TicketAttachment[] = [],
  ): Promise<Ticket | undefined> {
    const ticket = this.getTicketById(ticketId)
    if (!ticket) return undefined

    // Create the response
    const response: TicketResponse = {
      id: ticket.responses.length + 1,
      from,
      date: new Date().toISOString(),
      message,
      isInternal,
      attachments,
    }

    // Add the response to the ticket
    ticket.responses.push(response)
    ticket.lastUpdated = new Date().toISOString()

    // Update ticket status if needed
    if (ticket.status === "open" || ticket.status === "assigned") {
      ticket.status = "in-progress"
    }

    // Send notification to the user if the response is from staff
    if (!isInternal && from !== ticket.createdBy) {
      await emailService.sendTicketUpdateNotification(
        ticket.createdBy,
        ticket.id,
        `New response from ${from}: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`,
      )
    }

    // Save to localStorage
    if (isBrowser) {
      localStorage.setItem("kemuTickets", JSON.stringify(this.tickets))
    }

    // Learn from the response using the AI learning service
    try {
      if (!isInternal && from !== ticket.createdBy) {
        // This is a staff response to a user
        aiLearningService.learnFromUserBehavior(from, "respond_to_ticket", {
          ticketId: ticket.id,
          messageLength: message.length,
          responseTime: new Date().getTime() - new Date(ticket.lastUpdated).getTime(),
        })
      }
    } catch (error) {
      console.error("Error learning from response:", error)
    }

    return ticket
  }

  /**
   * Add an internal note to a ticket
   */
  public addInternalNote(ticketId: string, author: string, message: string): Ticket | undefined {
    const ticket = this.getTicketById(ticketId)
    if (!ticket) return undefined

    // Create the note
    const note: InternalNote = {
      id: ticket.internalNotes.length + 1,
      author,
      date: new Date().toISOString(),
      message,
    }

    // Add the note to the ticket
    ticket.internalNotes.push(note)

    // Save to localStorage
    if (isBrowser) {
      localStorage.setItem("kemuTickets", JSON.stringify(this.tickets))
    }

    return ticket
  }

  /**
   * Change ticket status
   */
  public async changeTicketStatus(
    ticketId: string,
    status: "open" | "assigned" | "in-progress" | "on-hold" | "resolved" | "closed",
    updatedBy: string,
  ): Promise<Ticket | undefined> {
    const ticket = this.getTicketById(ticketId)
    if (!ticket) return undefined

    const previousStatus = ticket.status

    // Update the status
    ticket.status = status
    ticket.lastUpdated = new Date().toISOString()

    // Add an internal note
    this.addInternalNote(ticketId, updatedBy, `Status changed to ${status}`)

    // Send notification to the user
    await emailService.sendTicketUpdateNotification(
      ticket.createdBy,
      ticket.id,
      `Your ticket status has been updated to: ${status}`,
    )

    // Save to localStorage
    if (isBrowser) {
      localStorage.setItem("kemuTickets", JSON.stringify(this.tickets))
    }

    // Learn from the status change using the AI learning service
    try {
      if (status === "resolved" || status === "closed") {
        // Learn from resolution
        const createdDate = new Date(ticket.createdAt).getTime()
        const resolvedDate = new Date().getTime()
        const responseTimeHours = (resolvedDate - createdDate) / (1000 * 60 * 60)

        aiLearningService.learnFromResolution(
          ticket,
          responseTimeHours,
          true, // Assuming it was effective since it was resolved
        )
      }

      // Learn from the status change behavior
      aiLearningService.learnFromUserBehavior(updatedBy, "change_ticket_status", {
        ticketId: ticket.id,
        previousStatus,
        newStatus: status,
      })
    } catch (error) {
      console.error("Error learning from status change:", error)
    }

    return ticket
  }

  /**
   * Assign a ticket to a staff member
   */
  public async assignTicket(ticketId: string, assigneeEmail: string, assignedBy: string): Promise<Ticket | undefined> {
    const ticket = this.getTicketById(ticketId)
    if (!ticket) return undefined

    // Find the staff member
    const assignee = staffMembers.find((staff) => staff.email === assigneeEmail)
    if (!assignee) return undefined

    // Update the ticket
    ticket.assignedTo = assigneeEmail
    ticket.assignedAt = new Date().toISOString()
    ticket.status = "assigned"
    ticket.lastUpdated = new Date().toISOString()

    // Add an internal note
    this.addInternalNote(ticketId, assignedBy, `Ticket assigned to ${assignee.name} (${assigneeEmail})`)

    // Send notification to the assignee
    await emailService.sendEmail({
      to: assigneeEmail,
      subject: `[KEMU Helpdesk] Ticket Assigned: ${ticket.id}`,
      text: `
        Dear ${assignee.name},
        
        A new ticket has been assigned to you:
        
        Ticket ID: ${ticket.id}
        Title: ${ticket.title}
        Priority: ${ticket.priority}
        
        Please log in to the helpdesk system to view and respond to this ticket.
        
        Best regards,
        KEMU Helpdesk System
      `,
    })

    // Save to localStorage
    if (isBrowser) {
      localStorage.setItem("kemuTickets", JSON.stringify(this.tickets))
    }

    return ticket
  }

  /**
   * Auto-assign a ticket based on content and department
   */
  private async autoAssignTicket(ticket: Ticket): Promise<Ticket> {
    // Find the department
    const department = departments.find((dept) => dept.name === ticket.department)
    if (!department || !department.autoAssignEnabled) {
      return ticket
    }

    // Find available staff in the department
    const departmentStaff = staffMembers.filter((staff) => staff.department === ticket.department && staff.active)

    if (departmentStaff.length === 0) {
      return ticket
    }

    // Find the best match based on specialties and current load
    let bestMatch = departmentStaff[0]
    let bestMatchScore = 0

    for (const staff of departmentStaff) {
      // Calculate specialty match score
      let specialtyScore = 0
      const content = ticket.title + " " + ticket.description

      for (const specialty of staff.specialties) {
        if (content.toLowerCase().includes(specialty.toLowerCase())) {
          specialtyScore += 2
        }
      }

      // Calculate load score (inverse of current load)
      const loadScore = 5 - Math.min(staff.currentLoad, 5)

      // Calculate total score
      const totalScore = specialtyScore + loadScore

      // Update best match if this staff has a higher score
      if (totalScore > bestMatchScore) {
        bestMatchScore = totalScore
        bestMatch = staff
      }
    }

    // Assign the ticket to the best match
    ticket.assignedTo = bestMatch.email
    ticket.assignedAt = new Date().toISOString()
    ticket.status = "assigned"

    // Update the staff member's current load
    const staffIndex = staffMembers.findIndex((staff) => staff.id === bestMatch.id)
    if (staffIndex !== -1) {
      staffMembers[staffIndex].currentLoad++
    }

    // Add an internal note
    this.addInternalNote(ticket.id, "System", `Ticket automatically assigned to ${bestMatch.name} (${bestMatch.email})`)

    return ticket
  }

  /**
   * Detect the appropriate department based on ticket content
   */
  private detectDepartment(content: string): string {
    const contentLower = content.toLowerCase()
    let bestMatch = "IT Support" // Default department
    let bestMatchScore = 0

    for (const [department, keywords] of Object.entries(departmentKeywords)) {
      let score = 0

      for (const keyword of keywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          score++
        }
      }

      if (score > bestMatchScore) {
        bestMatchScore = score
        bestMatch = department
      }
    }

    return bestMatch
  }

  /**
   * Detect the appropriate priority based on ticket content
   */
  private detectPriority(content: string): "low" | "medium" | "high" | "urgent" {
    const contentLower = content.toLowerCase()
    let bestMatch: "low" | "medium" | "high" | "urgent" = "medium" // Default priority
    let bestMatchScore = 0

    for (const [priority, keywords] of Object.entries(priorityKeywords)) {
      let score = 0

      for (const keyword of keywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          score++
        }
      }

      if (score > bestMatchScore) {
        bestMatchScore = score
        bestMatch = priority as "low" | "medium" | "high" | "urgent"
      }
    }

    return bestMatch
  }

  /**
   * Generate tags based on ticket content
   */
  private generateTags(content: string): string[] {
    const contentLower = content.toLowerCase()
    const tags: string[] = []

    // Check all department keywords
    for (const [department, keywords] of Object.entries(departmentKeywords)) {
      for (const keyword of keywords) {
        if (contentLower.includes(keyword.toLowerCase()) && !tags.includes(keyword)) {
          tags.push(keyword)

          // Limit to 5 tags
          if (tags.length >= 5) {
            return tags
          }
        }
      }
    }

    return tags
  }

  /**
   * Calculate SLA based on priority
   */
  private calculateSLA(priority: "low" | "medium" | "high" | "urgent"): {
    responseTime: number
    resolutionTime: number
    breached: boolean
  } {
    let responseTime = 24 // Default: 24 hours
    let resolutionTime = 72 // Default: 72 hours

    switch (priority) {
      case "urgent":
        responseTime = 1 // 1 hour
        resolutionTime = 4 // 4 hours
        break
      case "high":
        responseTime = 4 // 4 hours
        resolutionTime = 24 // 24 hours
        break
      case "medium":
        responseTime = 8 // 8 hours
        resolutionTime = 48 // 48 hours
        break
      case "low":
        responseTime = 24 // 24 hours
        resolutionTime = 72 // 72 hours
        break
    }

    return {
      responseTime,
      resolutionTime,
      breached: false,
    }
  }

  /**
   * Send notifications for a new ticket
   */
  private async sendTicketNotifications(ticket: Ticket): Promise<void> {
    // Send confirmation to the user
    await emailService.sendTicketCreationConfirmation(ticket.createdBy, ticket.id, ticket.title)

    // Send notification to the assignee if assigned
    if (ticket.assignedTo) {
      const assignee = staffMembers.find((staff) => staff.email === ticket.assignedTo)
      if (assignee) {
        await emailService.sendEmail({
          to: ticket.assignedTo,
          subject: `[KEMU Helpdesk] New Ticket Assigned: ${ticket.id}`,
          text: `
            Dear ${assignee.name},
            
            A new ticket has been assigned to you:
            
            Ticket ID: ${ticket.id}
            Title: ${ticket.title}
            Priority: ${ticket.priority}
            
            Please log in to the helpdesk system to view and respond to this ticket.
            
            Best regards,
            KEMU Helpdesk System
          `,
        })
      }
    }

    // Send notification to the department if not assigned
    if (!ticket.assignedTo) {
      const department = departments.find((dept) => dept.name === ticket.department)
      if (department) {
        await emailService.sendEmail({
          to: department.email,
          subject: `[KEMU Helpdesk] New Ticket: ${ticket.id}`,
          text: `
            A new ticket has been created in your department:
            
            Ticket ID: ${ticket.id}
            Title: ${ticket.title}
            Priority: ${ticket.priority}
            
            Please log in to the helpdesk system to view and respond to this ticket.
            
            Best regards,
            KEMU Helpdesk System
          `,
        })
      }
    }
  }

  /**
   * Get canned responses
   */
  public getCannedResponses(department?: string): CannedResponse[] {
    if (department) {
      return cannedResponses.filter((response) => response.department === department || response.isGlobal)
    }
    return cannedResponses
  }

  /**
   * Get staff members
   */
  public getStaffMembers(department?: string): StaffMember[] {
    if (department) {
      return staffMembers.filter((staff) => staff.department === department && staff.active)
    }
    return staffMembers.filter((staff) => staff.active)
  }

  /**
   * Get departments
   */
  public getDepartments(): Department[] {
    return departments
  }

  /**
   * Start the reminder monitoring system
   */
  private startReminderSystem(): void {
    if (typeof window === "undefined") return

    // Check for overdue tickets every hour
    this.reminderInterval = setInterval(
      () => {
        this.checkOverdueTickets()
        this.sendReminders()
      },
      60 * 60 * 1000,
    ) // 1 hour
  }

  /**
   * Check for overdue tickets
   */
  public async checkOverdueTickets(): Promise<void> {
    const now = new Date()

    for (const ticket of this.tickets) {
      if (ticket.status === "open" || ticket.status === "assigned" || ticket.status === "in-progress") {
        // Check if the ticket has been open for too long based on priority
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

        // If the ticket has exceeded its threshold and has an assignee
        if (diffHours > thresholdHours && ticket.assignedTo) {
          // Check if a reminder already exists for this ticket
          const existingReminder = this.reminders.find(
            (r) => r.ticketId === ticket.id && !r.sent && new Date(r.dueDate).getTime() > now.getTime(),
          )

          if (!existingReminder) {
            // Create a new reminder
            await this.createReminder(
              ticket.id,
              ticket.assignedTo,
              `Ticket ${ticket.id} has been open for ${Math.floor(diffHours)} hours and requires attention.`,
              new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Due in 24 hours
            )
          }
        }

        // Check if SLA is breached
        if (ticket.sla && !ticket.sla.breached) {
          const responseTime = ticket.sla.responseTime
          const resolutionTime = ticket.sla.resolutionTime

          // Check if response time SLA is breached
          if (ticket.status === "open" && diffHours > responseTime) {
            ticket.sla.breached = true

            // Create an internal note
            this.addInternalNote(
              ticket.id,
              "System",
              `Response time SLA breached. Ticket has been open for ${Math.floor(diffHours)} hours.`,
            )

            // If there's a department manager, notify them
            const department = departments.find((d) => d.name === ticket.department)
            if (department && department.managers.length > 0) {
              for (const managerEmail of department.managers) {
                await emailService.sendEmail({
                  to: managerEmail,
                  subject: `[URGENT] SLA Breached for Ticket ${ticket.id}`,
                  text: `
                    Dear Manager,
                    
                    The response time SLA has been breached for ticket ${ticket.id}.
                    
                    Ticket Title: ${ticket.title}
                    Priority: ${ticket.priority}
                    Created: ${ticket.createdAt}
                    
                    Please take immediate action.
                    
                    Best regards,
                    KEMU Helpdesk System
                  `,
                })
              }
            }
          }

          // Check if resolution time SLA is breached
          if (
            (ticket.status === "open" || ticket.status === "assigned" || ticket.status === "in-progress") &&
            diffHours > resolutionTime
          ) {
            ticket.sla.breached = true

            // Create an internal note
            this.addInternalNote(
              ticket.id,
              "System",
              `Resolution time SLA breached. Ticket has been open for ${Math.floor(diffHours)} hours.`,
            )

            // If there's a department manager, notify them
            const department = departments.find((d) => d.name === ticket.department)
            if (department && department.managers.length > 0) {
              for (const managerEmail of department.managers) {
                await emailService.sendEmail({
                  to: managerEmail,
                  subject: `[URGENT] SLA Breached for Ticket ${ticket.id}`,
                  text: `
                    Dear Manager,
                    
                    The resolution time SLA has been breached for ticket ${ticket.id}.
                    
                    Ticket Title: ${ticket.title}
                    Priority: ${ticket.priority}
                    Created: ${ticket.createdAt}
                    
                    Please take immediate action.
                    
                    Best regards,
                    KEMU Helpdesk System
                  `,
                })
              }
            }
          }
        }
      }
    }
  }

  /**
   * Send pending reminders
   */
  public async sendReminders(): Promise<void> {
    const now = new Date()

    for (const reminder of this.reminders) {
      if (!reminder.sent) {
        const ticket = this.getTicketById(reminder.ticketId)
        if (!ticket) continue

        // Only send the reminder if the ticket is still open
        if (ticket.status === "open" || ticket.status === "assigned" || ticket.status === "in-progress") {
          try {
            await emailService.sendEmail({
              to: reminder.assigneeEmail,
              subject: `[Reminder] Action Required for Ticket ${reminder.ticketId}`,
              text: `
                Dear Staff Member,
                
                ${reminder.message}
                
                Please log in to the helpdesk system to view and respond to this ticket.
                
                Best regards,
                KEMU Helpdesk System
              `,
            })

            // Mark the reminder as sent
            reminder.sent = true

            // Add an internal note to the ticket
            this.addInternalNote(
              reminder.ticketId,
              "System",
              `Reminder sent to ${reminder.assigneeEmail}: ${reminder.message}`,
            )
          } catch (error) {
            console.error(`Failed to send reminder for ticket ${reminder.ticketId}:`, error)
          }
        }
      }
    }
  }

  /**
   * Create a new reminder
   */
  public async createReminder(
    ticketId: string,
    assigneeEmail: string,
    message: string,
    dueDate: string,
  ): Promise<TicketReminder> {
    const reminder: TicketReminder = {
      id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ticketId,
      assigneeEmail,
      message,
      dueDate,
      sent: false,
      createdAt: new Date().toISOString(),
    }

    this.reminders.push(reminder)
    return reminder
  }

  /**
   * Get all reminders
   */
  public getReminders(): TicketReminder[] {
    return this.reminders
  }

  /**
   * Get reminders for a specific ticket
   */
  public getRemindersForTicket(ticketId: string): TicketReminder[] {
    return this.reminders.filter((reminder) => reminder.ticketId === ticketId)
  }
}

// Export a singleton instance
export const ticketService = TicketService.getInstance()

