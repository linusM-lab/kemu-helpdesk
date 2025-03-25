"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronLeft, Library, Search, ThumbsUp } from "lucide-react"
import Link from "next/link"

interface ArticleContent {
  id: string
  title: string
  excerpt: string
  content: string
  views: number
  helpful: number
  createdAt: string
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openArticle, setOpenArticle] = useState<string | null>(null)

  // Toggle function for dropdowns
  const toggleArticle = (id: string) => {
    setOpenArticle(openArticle === id ? null : id)
  }

  // Gradient text style
  const gradientTextStyle = {
    backgroundImage: "linear-gradient(to right, rgba(44, 48, 147, 1), rgba(135, 16, 84, 1))",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    display: "inline-block",
  }

  // Mock data specific to Library articles with full content
  const articles: ArticleContent[] = [
    {
      id: "lib-1",
      title: "KeMU Library Information",
      excerpt: "General information about the KeMU library and its services.",
      content: `
      <h3 style="color:#871054;font-weight:bold;">KeMU Library Information</h3>
      <p>The Kenya Methodist University Library provides a wide range of resources and services to support academic research and learning.</p>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Library Website</h4>
        <p>Visit the official library website for comprehensive information about all library services and resources:</p>
        <div class="mt-3 mb-3 text-center">
          <a href="https://library.kemu.ac.ke/" target="_blank" style="background-color:#2c3093;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;display:inline-block">KeMU Library Website</a>
        </div>
      </div>
      
      <p>The library website provides access to:</p>
      <ul class="ml-5 list-disc">
        <li>Online catalog of all library holdings</li>
        <li>Electronic databases and journals</li>
        <li>E-books and digital resources</li>
        <li>Research guides and tutorials</li>
        <li>Library news and announcements</li>
      </ul>
      
      <p class="mt-4">For assistance with library resources, contact the library help desk at <strong>library@kemu.ac.ke</strong> or visit the library information desk during opening hours.</p>
      `,
      views: 654,
      helpful: 89,
      createdAt: "2024-02-10",
    },
    {
      id: "lib-2",
      title: "Library Opening Hours",
      excerpt: "Information about library operating hours for all campuses.",
      content: `
      <h3 style="color:#871054;font-weight:bold;">Library Opening Hours</h3>
      <p>The KeMU Library maintains regular operating hours to serve the university community. Hours may vary by campus and during examination periods, holidays, or breaks.</p>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Main Campus Library Hours</h4>
        <ul class="ml-5 list-disc">
          <li><strong>Monday - Friday:</strong> 8:00 AM - 10:00 PM</li>
          <li><strong>Saturday:</strong> 8:00 AM - 5:00 PM</li>
          <li><strong>Sunday:</strong> 2:00 PM - 6:00 PM</li>
        </ul>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Nairobi Campus Library Hours</h4>
        <ul class="ml-5 list-disc">
          <li><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</li>
          <li><strong>Saturday:</strong> 8:00 AM - 4:00 PM</li>
          <li><strong>Sunday:</strong> Closed</li>
        </ul>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Mombasa Campus Library Hours</h4>
        <ul class="ml-5 list-disc">
          <li><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</li>
          <li><strong>Saturday:</strong> 8:00 AM - 4:00 PM</li>
          <li><strong>Sunday:</strong> Closed</li>
        </ul>
      </div>
      
      <h4 style="color:#871054;font-weight:bold;">Special Hours</h4>
      <p>Library hours may be extended during examination periods and reduced during university holidays and breaks. Always check the library website or notice boards for the most current information about operating hours.</p>
      
      <p class="mt-4">For questions about library hours, contact the library administration at <strong>library@kemu.ac.ke</strong>.</p>
      `,
      views: 345,
      helpful: 90,
      createdAt: "2024-03-01",
    },
    {
      id: "lib-3",
      title: "Accessing Past Papers",
      excerpt: "How to find and access past examination papers through the library portal.",
      content: `
      <h3 style="color:#871054;font-weight:bold;">Accessing Past Examination Papers</h3>
      <p>The KeMU Library maintains a repository of past examination papers that students can access for study and preparation purposes.</p>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Past Papers Portal</h4>
        <p>Access the past papers through the dedicated portal:</p>
        <div class="mt-3 mb-3 text-center">
          <a href="https://library.kemu.ac.ke/kemuwiki/index.php/Welcome_to_past_papers_portal" target="_blank" style="background-color:#2c3093;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;display:inline-block">Past Papers Portal</a>
        </div>
      </div>
      
      <h4 style="color:#871054;font-weight:bold;">How to Access Past Papers</h4>
      <ol class="ml-5 list-decimal">
        <li>Visit the Past Papers Portal using the link above</li>
        <li>Log in using your student credentials (same as student portal)</li>
        <li>Select your faculty/school from the dropdown menu</li>
        <li>Select your department</li>
        <li>Choose the course for which you need past papers</li>
        <li>Select the year and semester/trimester</li>
        <li>Download the PDF file of the past paper</li>
      </ol>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Important Notes</h4>
        <ul class="ml-5 list-disc">
          <li>Past papers are available for the last five academic years</li>
          <li>Not all courses may have past papers available</li>
          <li>Downloading and distribution of past papers is for personal study use only</li>
          <li>Commercial reproduction or distribution is strictly prohibited</li>
        </ul>
      </div>
      
      <p class="mt-4">If you encounter any issues accessing past papers or have questions, please contact the library's electronic resources team at <strong>e-resources@kemu.ac.ke</strong>.</p>
      `,
      views: 789,
      helpful: 95,
      createdAt: "2024-02-15",
    },
    {
      id: "lib-4",
      title: "Library Membership Information",
      excerpt: "Details about library membership categories and how to become a member.",
      content: `
      <h3 style="color:#871054;font-weight:bold;">Library Membership Information</h3>
      <p>The KeMU Library offers membership to various categories of users within the university community.</p>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Membership Categories</h4>
        <ul class="ml-5 list-disc">
          <li><strong>Students:</strong> All registered students automatically receive library membership</li>
          <li><strong>Faculty (Teaching Staff):</strong> All academic staff are eligible for library membership</li>
          <li><strong>Non-Teaching Staff:</strong> Administrative and support staff can apply for library membership</li>
          <li><strong>Alumni:</strong> Graduates of KeMU can apply for special alumni membership</li>
        </ul>
      </div>
      
      <h4 style="color:#871054;font-weight:bold;">How to Activate Your Membership</h4>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h5 style="color:#871054;font-weight:bold;">For Students</h5>
        <ol class="ml-5 list-decimal">
          <li>Visit the library with your student ID card</li>
          <li>Complete the library registration form at the circulation desk</li>
          <li>Take a brief orientation on library services and resources</li>
          <li>Your student ID will be activated as your library card</li>
        </ol>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h5 style="color:#871054;font-weight:bold;">For Faculty and Staff</h5>
        <ol class="ml-5 list-decimal">
          <li>Visit the library with your staff ID card</li>
          <li>Complete the staff library registration form</li>
          <li>Provide a recent passport-sized photograph</li>
          <li>Your library card will be issued within 2-3 working days</li>
        </ol>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h5 style="color:#871054;font-weight:bold;">For Alumni</h5>
        <ol class="ml-5 list-decimal">
          <li>Submit an application letter to the University Librarian</li>
          <li>Provide proof of graduation (certificate or transcript)</li>
          <li>Pay the annual alumni membership fee (KSh 2,000)</li>
          <li>Provide a recent passport-sized photograph</li>
          <li>Your alumni library card will be issued within one week</li>
        </ol>
      </div>
      
      <h4 style="color:#871054;font-weight:bold;">Membership Benefits</h4>
      <ul class="ml-5 list-disc">
        <li>Borrowing privileges (number of items varies by membership category)</li>
        <li>Access to electronic resources and databases</li>
        <li>Use of library facilities including study spaces and computer labs</li>
        <li>Research assistance from professional librarians</li>
        <li>Participation in library workshops and training sessions</li>
      </ul>
      
      <p class="mt-4">For more information about library membership, contact the circulation desk at <strong>circulation@kemu.ac.ke</strong>.</p>
      `,
      views: 432,
      helpful: 92,
      createdAt: "2024-02-25",
    },
  ]

  // Filter articles based on search query
  const filteredArticles = articles.filter((article) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: "#ffffff" }}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/knowledge-base" passHref>
              <Button variant="outline" size="sm" className="p-2 h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle style={{ color: "#000000" }}>
              <div className="flex items-center gap-2">
                <Library className="h-6 w-6" style={{ color: "#7b0046" }} />
                Library
              </div>
            </CardTitle>
          </div>
          <CardDescription style={gradientTextStyle}>Support for library resources and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5" style={{ color: "#666666" }} />
            <Input
              placeholder="Search Library articles..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ color: "#000000", backgroundColor: "#ffffff" }}
            />
          </div>

          <div className="space-y-4">
            {filteredArticles.length > 0 ? (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="border rounded-lg overflow-hidden">
                    {/* Dropdown Header Button */}
                    <button
                      onClick={() => toggleArticle(article.id)}
                      className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                      style={{ color: "#000000" }}
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium">{article.title}</span>
                        </div>
                        <div className="text-sm mt-1" style={gradientTextStyle}>
                          {article.excerpt}
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openArticle === article.id ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Content */}
                    {openArticle === article.id && (
                      <div className="p-4 border-t">
                        <div
                          className="prose prose-sm max-w-none mt-2 pb-2"
                          dangerouslySetInnerHTML={{ __html: article.content }}
                          style={{ color: "#000000" }}
                        />
                        <div className="flex justify-end mt-4">
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">
                              Was this helpful?
                              <ThumbsUp className="h-4 w-4 ml-2" />
                            </Button>
                            <Button size="sm" style={{ backgroundColor: "#7b0046", color: "#ffffff" }}>
                              Print
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4" style={{ color: "#d1d5db" }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: "#000000" }}>
                  No articles found
                </h3>
                <p style={{ color: "#666666" }}>Try adjusting your search query</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

