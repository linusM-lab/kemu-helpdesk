// This service provides AI learning capabilities for the helpdesk system
// It analyzes user interactions and ticket patterns to provide smart suggestions

interface LearningData {
  ticketPatterns: Record<string, number>
  userBehaviors: Record<string, any[]>
  commonIssues: Record<string, number>
  responseEffectiveness: Record<string, number>
  lastUpdated: string
}

interface Suggestion {
  id: string
  type: "assignment" | "response" | "category" | "priority"
  content: string
  confidence: number
  context: string
}

export class AILearningService {
  private static instance: AILearningService
  private learningData: LearningData
  private readonly storageKey = "kemuAILearningData"
  private readonly isBrowser = typeof window !== "undefined"

  private constructor() {
    // Initialize learning data
    this.learningData = this.loadLearningData()
  }

  public static getInstance(): AILearningService {
    if (!AILearningService.instance) {
      AILearningService.instance = new AILearningService()
    }
    return AILearningService.instance
  }

  private loadLearningData(): LearningData {
    if (!this.isBrowser) {
      return this.getInitialLearningData()
    }

    try {
      const savedData = localStorage.getItem(this.storageKey)
      if (savedData) {
        return JSON.parse(savedData)
      }
    } catch (error) {
      console.error("Error loading AI learning data:", error)
    }

    // Initialize with default data if nothing is found
    const initialData = this.getInitialLearningData()
    this.saveLearningData(initialData)
    return initialData
  }

  private getInitialLearningData(): LearningData {
    return {
      ticketPatterns: {},
      userBehaviors: {},
      commonIssues: {},
      responseEffectiveness: {},
      lastUpdated: new Date().toISOString(),
    }
  }

  private saveLearningData(data: LearningData): void {
    if (!this.isBrowser) return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving AI learning data:", error)
    }
  }

  // Learn from a new ticket
  public learnFromTicket(ticket: any): void {
    // Extract keywords from ticket title and description
    const keywords = this.extractKeywords(ticket.title + " " + ticket.description)

    // Update ticket patterns
    keywords.forEach((keyword) => {
      this.learningData.ticketPatterns[keyword] = (this.learningData.ticketPatterns[keyword] || 0) + 1
    })

    // Update common issues based on department and category
    const issueKey = `${ticket.department}:${ticket.category || "general"}`
    this.learningData.commonIssues[issueKey] = (this.learningData.commonIssues[issueKey] || 0) + 1

    // Update last updated timestamp
    this.learningData.lastUpdated = new Date().toISOString()

    // Save updated learning data
    this.saveLearningData(this.learningData)
  }

  // Learn from ticket resolution
  public learnFromResolution(ticket: any, responseTime: number, wasEffective: boolean): void {
    // Update response effectiveness
    const responseKey = `${ticket.department}:${ticket.priority}`
    const currentEffectiveness = this.learningData.responseEffectiveness[responseKey] || 0
    const newCount = (this.learningData.commonIssues[responseKey] || 0) + 1

    this.learningData.responseEffectiveness[responseKey] =
      (currentEffectiveness * (newCount - 1) + (wasEffective ? 1 : 0)) / newCount

    // Update last updated timestamp
    this.learningData.lastUpdated = new Date().toISOString()

    // Save updated learning data
    this.saveLearningData(this.learningData)
  }

  // Learn from user behavior
  public learnFromUserBehavior(userId: string, action: string, context: any): void {
    if (!this.learningData.userBehaviors[userId]) {
      this.learningData.userBehaviors[userId] = []
    }

    // Add behavior to user's history
    this.learningData.userBehaviors[userId].push({
      action,
      context,
      timestamp: new Date().toISOString(),
    })

    // Limit history to last 100 actions to prevent excessive storage
    if (this.learningData.userBehaviors[userId].length > 100) {
      this.learningData.userBehaviors[userId] = this.learningData.userBehaviors[userId].slice(-100)
    }

    // Update last updated timestamp
    this.learningData.lastUpdated = new Date().toISOString()

    // Save updated learning data
    this.saveLearningData(this.learningData)
  }

  // Get suggestions for ticket assignment
  public getAssignmentSuggestions(ticket: any): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Analyze ticket content and patterns to suggest best staff member
    const keywords = this.extractKeywords(ticket.title + " " + ticket.description)

    // This is a simplified example - in a real system, this would use more sophisticated algorithms
    // to match staff expertise with ticket content

    suggestions.push({
      id: `suggestion-${Date.now()}`,
      type: "assignment",
      content: "Based on ticket content and past performance, John Doe would be the best match for this ticket.",
      confidence: 0.85,
      context: "IT Support, Password Reset",
    })

    return suggestions
  }

  // Get suggestions for ticket categorization
  public getCategorySuggestions(ticketContent: string): Suggestion[] {
    const suggestions: Suggestion[] = []
    const keywords = this.extractKeywords(ticketContent)

    // Match keywords with common issues to suggest categories
    // This is a simplified implementation

    if (keywords.some((k) => ["password", "login", "access", "account"].includes(k))) {
      suggestions.push({
        id: `suggestion-${Date.now()}-1`,
        type: "category",
        content: "Account Access",
        confidence: 0.9,
        context: "Based on keywords: password, login, access",
      })
    }

    if (keywords.some((k) => ["slow", "performance", "crash", "error"].includes(k))) {
      suggestions.push({
        id: `suggestion-${Date.now()}-2`,
        type: "category",
        content: "System Performance",
        confidence: 0.75,
        context: "Based on keywords: slow, performance, error",
      })
    }

    return suggestions
  }

  // Get suggested responses based on ticket content
  public getResponseSuggestions(ticket: any): Suggestion[] {
    const suggestions: Suggestion[] = []

    // Analyze ticket content to suggest responses
    const keywords = this.extractKeywords(ticket.title + " " + ticket.description)

    if (keywords.some((k) => ["password", "reset", "forgot"].includes(k))) {
      suggestions.push({
        id: `suggestion-${Date.now()}-1`,
        type: "response",
        content:
          'I can help you reset your password. Please follow these steps: 1) Go to the login page, 2) Click on "Forgot Password", 3) Enter your email address, 4) Follow the instructions sent to your email.',
        confidence: 0.95,
        context: "Password Reset",
      })
    }

    return suggestions
  }

  // Extract keywords from text
  private extractKeywords(text: string): string[] {
    // This is a simplified keyword extraction
    // In a real system, you would use NLP techniques for better extraction
    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3)
    const stopWords = ["this", "that", "with", "from", "have", "there", "they", "their", "would", "about", "which"]

    return words.filter((word) => !stopWords.includes(word))
  }

  // Get learning statistics
  public getLearningStats(): any {
    return {
      totalPatterns: Object.keys(this.learningData.ticketPatterns).length,
      topIssues: this.getTopItems(this.learningData.commonIssues, 5),
      userCount: Object.keys(this.learningData.userBehaviors).length,
      lastUpdated: this.learningData.lastUpdated,
    }
  }

  // Get top items from a record
  private getTopItems(record: Record<string, number>, count: number): Array<{ key: string; value: number }> {
    return Object.entries(record)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, count)
  }

  // Reset learning data (for admin use)
  public resetLearningData(): void {
    this.learningData = this.getInitialLearningData()
    this.saveLearningData(this.learningData)
  }
}

// Export a singleton instance
export const aiLearningService = AILearningService.getInstance()

