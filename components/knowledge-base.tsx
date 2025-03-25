"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Book, ChevronRight, FileText, Laptop, Library, Search, Server, ThumbsUp, Wallet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface KnowledgeBaseArticle {
  id: string
  title: string
  excerpt: string
  category: string
  views: number
  helpful: number
  createdAt: string
}

interface KnowledgeBaseCategory {
  id: string
  name: string
  icon: React.ElementType
  description: string
  articleCount: number
  slug: string
}

export function KnowledgeBase() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("popular")

  // Mock data for knowledge base categories with added slug for navigation
  const categories: KnowledgeBaseCategory[] = [
    {
      id: "it-support",
      name: "IT Support",
      icon: Laptop,
      description: "Technical support for computer and network issues",
      articleCount: 24,
      slug: "/knowledge-base/it-support"
    },
    {
      id: "library",
      name: "Library",
      icon: Library,
      description: "Support for library resources and services",
      articleCount: 18,
      slug: "/knowledge-base/library"
    },
    {
      id: "finance",
      name: "Finance",
      icon: Wallet,
      description: "Support for financial matters including fees and payments",
      articleCount: 15,
      slug: "/knowledge-base/finance"
    },
    {
      id: "academics",
      name: "Academics",
      icon: Book,
      description: "Support for academic matters including courses and grades",
      articleCount: 22,
      slug: "/knowledge-base/academics"
    },
    {
      id: "admissions",
      name: "Admissions",
      icon: FileText,
      description: "Support for admission and enrollment processes",
      articleCount: 12,
      slug: "/knowledge-base/admissions"
    },
    {
      id: "facilities",
      name: "Facilities",
      icon: Server,
      description: "Support for campus facilities and maintenance",
      articleCount: 9,
      slug: "/knowledge-base/facilities"
    },
  ]

  // Mock data for knowledge base articles
  const articles: KnowledgeBaseArticle[] = [
    {
      id: "kb-1",
      title: "How to reset your password",
      excerpt: "Learn how to reset your password if you've forgotten it or need to change it for security reasons.",
      category: "IT Support",
      views: 1245,
      helpful: 98,
      createdAt: "2024-01-15",
    },
    {
      id: "kb-2",
      title: "Accessing the student portal",
      excerpt:
        "A guide to logging in and navigating the student portal to access your courses, grades, and other resources.",
      category: "IT Support",
      views: 987,
      helpful: 92,
      createdAt: "2024-01-20",
    },
    {
      id: "kb-3",
      title: "How to pay fees online",
      excerpt: "Step-by-step instructions for making fee payments through the online payment system.",
      category: "Finance",
      views: 876,
      helpful: 95,
      createdAt: "2024-02-05",
    },
    {
      id: "kb-4",
      title: "Borrowing books from the library",
      excerpt: "Learn about the library's borrowing policies, loan periods, and how to check out books.",
      category: "Library",
      views: 654,
      helpful: 89,
      createdAt: "2024-02-10",
    },
    {
      id: "kb-5",
      title: "Course registration process",
      excerpt: "A comprehensive guide to registering for courses each semester.",
      category: "Academics",
      views: 789,
      helpful: 91,
      createdAt: "2024-02-15",
    },
    {
      id: "kb-6",
      title: "Connecting to campus Wi-Fi",
      excerpt: "Instructions for connecting your devices to the campus wireless network.",
      category: "IT Support",
      views: 567,
      helpful: 87,
      createdAt: "2024-02-20",
    },
    {
      id: "kb-7",
      title: "Applying for a scholarship",
      excerpt: "Information about available scholarships and how to apply for financial assistance.",
      category: "Finance",
      views: 432,
      helpful: 94,
      createdAt: "2024-02-25",
    },
    {
      id: "kb-8",
      title: "Accessing online journals and databases",
      excerpt: "How to access the university's subscription-based academic journals and research databases.",
      category: "Library",
      views: 345,
      helpful: 90,
      createdAt: "2024-03-01",
    },
  ]

  // Filter articles based on search query
  const filteredArticles = articles.filter((article) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    )
  })

  // Sort articles based on active tab
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (activeTab === "popular") {
      return b.views - a.views
    } else if (activeTab === "helpful") {
      return b.helpful - a.helpful
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // Function to handle category card click
  const handleCategoryClick = (slug: string) => {
    router.push(slug)
  }

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: "#ffffff" }}>
        <CardHeader>
          <CardTitle style={{ color: "#000000" }}>Knowledge Base</CardTitle>
          <CardDescription style={{ color: "#666666" }}>
            Find answers to common questions and learn how to use university services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5" style={{ color: "#666666" }} />
            <Input
              placeholder="Search for articles, guides, and FAQs..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          {!searchQuery && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {categories.map((category) => (
                <Link href={category.slug} key={category.id} passHref>
                  <Card
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <category.icon className="h-5 w-5" style={{ color: "#7b0046" }} />
                        <CardTitle className="text-lg" style={{ color: "#000000" }}>
                          {category.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription style={{ color: "#666666" }}>{category.description}</CardDescription>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm" style={{ color: "#666666" }}>
                          {category.articleCount} articles
                        </span>
                        <ChevronRight className="h-4 w-4" style={{ color: "#7b0046" }} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium" style={{ color: "#000000" }}>
                {searchQuery ? "Search Results" : "Featured Articles"}
              </h3>
              <TabsList>
                <TabsTrigger value="popular" style={{ color: activeTab === "popular" ? "#7b0046" : "#666666" }}>
                  Most Popular
                </TabsTrigger>
                <TabsTrigger value="helpful" style={{ color: activeTab === "helpful" ? "#7b0046" : "#666666" }}>
                  Most Helpful
                </TabsTrigger>
                <TabsTrigger value="recent" style={{ color: activeTab === "recent" ? "#7b0046" : "#666666" }}>
                  Recent
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="popular" className="space-y-4 mt-0">
              {sortedArticles.length > 0 ? (
                sortedArticles.map((article) => (
                  <Link 
                    href={`/knowledge-base/article/${article.id}`} 
                    key={article.id}
                    passHref
                  >
                    <Card
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle style={{ color: "#000000" }}>{article.title}</CardTitle>
                            <Badge className="mt-2" style={{ backgroundColor: "#f3f4f6", color: "#7b0046" }}>
                              {article.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{ color: "#666666" }}>
                            <span>{article.views} views</span>
                            <span>•</span>
                            <ThumbsUp className="h-4 w-4" />
                            <span>{article.helpful}%</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm" style={{ color: "#666666" }}>
                          {article.excerpt}
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-2" style={{ color: "#7b0046" }}>
                          Read more
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4" style={{ color: "#d1d5db" }} />
                  <h3 className="text-lg font-medium mb-2" style={{ color: "#000000" }}>
                    No articles found
                  </h3>
                  <p style={{ color: "#666666" }}>Try adjusting your search query or browse categories</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="helpful" className="space-y-4 mt-0">
              {sortedArticles.length > 0 ? (
                sortedArticles.map((article) => (
                  <Link 
                    href={`/knowledge-base/article/${article.id}`} 
                    key={article.id}
                    passHref
                  >
                    <Card
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle style={{ color: "#000000" }}>{article.title}</CardTitle>
                            <Badge className="mt-2" style={{ backgroundColor: "#f3f4f6", color: "#7b0046" }}>
                              {article.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{ color: "#666666" }}>
                            <span>{article.views} views</span>
                            <span>•</span>
                            <ThumbsUp className="h-4 w-4" />
                            <span>{article.helpful}%</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm" style={{ color: "#666666" }}>
                          {article.excerpt}
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-2" style={{ color: "#7b0046" }}>
                          Read more
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4" style={{ color: "#d1d5db" }} />
                  <h3 className="text-lg font-medium mb-2" style={{ color: "#000000" }}>
                    No articles found
                  </h3>
                  <p style={{ color: "#666666" }}>Try adjusting your search query or browse categories</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4 mt-0">
              {sortedArticles.length > 0 ? (
                sortedArticles.map((article) => (
                  <Link 
                    href={`/knowledge-base/article/${article.id}`} 
                    key={article.id}
                    passHref
                  >
                    <Card
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle style={{ color: "#000000" }}>{article.title}</CardTitle>
                            <Badge className="mt-2" style={{ backgroundColor: "#f3f4f6", color: "#7b0046" }}>
                              {article.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{ color: "#666666" }}>
                            <span>{article.views} views</span>
                            <span>•</span>
                            <ThumbsUp className="h-4 w-4" />
                            <span>{article.helpful}%</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm" style={{ color: "#666666" }}>
                          {article.excerpt}
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-2" style={{ color: "#7b0046" }}>
                          Read more
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4" style={{ color: "#d1d5db" }} />
                  <h3 className="text-lg font-medium mb-2" style={{ color: "#000000" }}>
                    No articles found
                  </h3>
                  <p style={{ color: "#666666" }}>Try adjusting your search query or browse categories</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}