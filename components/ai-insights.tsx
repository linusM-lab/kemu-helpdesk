"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Lightbulb, RefreshCw, Sparkles } from "lucide-react"
import { aiLearningService } from "@/lib/ai-learning-service"

export function AIInsights() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<any[]>([])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    setLoading(true)
    try {
      const learningStats = aiLearningService.getLearningStats()
      setStats(learningStats)

      // Generate some sample suggestions
      const sampleSuggestions = [
        {
          id: "suggestion-1",
          title: "Ticket Assignment",
          description: "Based on past performance, John Doe resolves IT Support tickets 30% faster than average.",
          type: "efficiency",
        },
        {
          id: "suggestion-2",
          title: "Common Issue Detected",
          description: "There has been a 40% increase in network connectivity issues this week.",
          type: "trend",
        },
        {
          id: "suggestion-3",
          title: "Response Template",
          description: "Password reset instructions have been used 28 times this month with high satisfaction.",
          type: "template",
        },
      ]

      setSuggestions(sampleSuggestions)
    } catch (error) {
      console.error("Error loading AI insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Insights
          </CardTitle>
          <CardDescription>Smart insights and suggestions based on helpdesk activity</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={loadStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <Brain className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-400">Loading insights...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Patterns Identified</p>
                <p className="text-2xl font-bold">{stats?.totalPatterns || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Users Analyzed</p>
                <p className="text-2xl font-bold">{stats?.userCount || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Top Department</p>
                <p className="text-2xl font-bold">IT Support</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">{formatDate(stats?.lastUpdated)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Smart Suggestions
              </h3>

              <div className="space-y-3">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border rounded-md p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                          <h4 className="font-medium">{suggestion.title}</h4>
                        </div>
                        <Badge
                          variant={
                            suggestion.type === "efficiency"
                              ? "default"
                              : suggestion.type === "trend"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {suggestion.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No suggestions available yet. The AI needs more data to learn from.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Top Issues</h3>
              {stats?.topIssues && stats.topIssues.length > 0 ? (
                <div className="space-y-2">
                  {stats.topIssues.map((issue: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{issue.key}</span>
                      <span className="font-medium">{issue.value} tickets</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-2">No issue data available yet</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

