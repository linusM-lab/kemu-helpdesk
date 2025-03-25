"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronLeft, Laptop, Search, ThumbsUp } from "lucide-react"
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

export default function ITSupportPage() {
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

  // Mock data specific to IT Support articles with full content
  const articles: ArticleContent[] = [
    {
      id: "kb-1",
      title: "How to access your student portal",
      excerpt: "Learn how to access your student portal account and register for courses.",
      content: `
      <div class="mb-4">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-P2sDkC4vA0QLeJFcn2O0IkAIKeGqs9.png" alt="KeMU Student Portal Login Page" class="rounded-lg shadow-md w-full max-w-3xl mx-auto" />
      </div>
      
      <h3 style="color:#871054;font-weight:bold;">Student Portal Access Guide</h3>
      <p>You can access your student portal account on your browser by following these steps:</p>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Portal Login Instructions</h4>
        <ol class="ml-5 list-decimal">
          <li>Visit this URL: <a href="https://portal2.kemu.ac.ke" target="_blank" style="color:#2c3093;font-weight:bold;">https://portal2.kemu.ac.ke</a></li>
          <li>Use your registration number as your username</li>
          <li>Enter the password provided during registration</li>
          <li>Click the "Sign In" button to access your portal</li>
        </ol>
      </div>
      
      <h4 style="color:#871054;font-weight:bold;">Course Registration</h4>
      <p>Course registration is automatically done for new students upon registration. However, for subsequent trimesters you will be required to register courses through your student portal account.</p>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h5 style="color:#871054;font-weight:bold;">Steps to Register Courses:</h5>
        <ol class="ml-5 list-decimal">
          <li>Log in to your student portal at <a href="https://portal2.kemu.ac.ke" target="_blank" style="color:#2c3093;font-weight:bold;">https://portal2.kemu.ac.ke</a></li>
          <li>Report for the current trimester</li>
          <li>Pay at least 60% of the invoiced amount</li>
          <li>Select and submit your courses</li>
        </ol>
      </div>
      
      <h4 style="color:#871054;font-weight:bold;">Portal Features</h4>
      <p>The student portal provides access to various services including:</p>
      <ul class="ml-5 list-disc">
        <li>Course registration and academic records</li>
        <li>Fee statements and payment history</li>
        <li>Examination results and transcripts</li>
        <li>Class timetables and academic calendar</li>
        <li>Important announcements and notifications</li>
      </ul>
      
      <p class="mt-4">If you encounter any issues accessing your student portal, please contact the IT Help Desk at <strong>helpdesk@kemu.ac.ke</strong> or visit the IT Support office for assistance.</p>
    `,
      views: 1245,
      helpful: 98,
      createdAt: "2024-01-15",
    },
    {
      id: "kb-2",
      title: "How to Access the school Email",
      excerpt: "A guide to accessing your school email and setting it up on mobile devices.",
      content: `
      <h3 style="color:#871054;font-weight:bold;">School Email Access Guide</h3>
      <p style="color:#871054;font-weight:bold;font-size:18px">To get your official student email address, log in to your <a href="http://portal2.kemu.ac.ke" target="_blank" style="color:#2c3093;text-decoration:none;font-weight:bold">Student Portal</a> and go to your student profile to locate your email under the Contacts menu.</p>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Setting Up Email on Android Devices</h4>
        <ol class="ml-5 list-decimal">
          <li><strong style="color:#871054;">Open Settings:</strong>
            <ul class="ml-5 list-disc">
              <li>Go to the <strong>Settings</strong> app on your Android/IOS device.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Navigate to Accounts:</strong>
            <ul class="ml-5 list-disc">
              <li>Scroll down and tap on <strong>"Accounts"</strong> or <strong>"Users &amp; Accounts"</strong>.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Add Account:</strong>
            <ul class="ml-5 list-disc">
              <li>Tap on <strong>"Add Account"</strong>.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Choose Google:</strong>
            <ul class="ml-5 list-disc">
              <li>Select <strong>"Google"</strong> from the list of account types.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Enter Your Email:</strong>
            <ul class="ml-5 list-disc">
              <li>Enter your Gmail address and tap <strong>"Next"</strong>.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Enter Your Password:</strong>
            <ul class="ml-5 list-disc">
              <li>Enter your password and tap <strong>"Next"</strong>.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Accept Terms:</strong>
            <ul class="ml-5 list-disc">
              <li>Review the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>, then tap <strong>"I agree"</strong>.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Set Up Account:</strong>
            <ul class="ml-5 list-disc">
              <li>Follow the prompts to complete the setup.</li>
            </ul>
          </li>
        </ol>
        <p><strong style="color:#871054;">✓ Your Gmail account is now added! Access it via the Gmail app.</strong></p>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Setting Up Email on iOS Devices (iPhone/iPad)</h4>
        <ol class="ml-5 list-decimal">
          <li><strong style="color:#871054;">Open Settings:</strong>
            <ul class="ml-5 list-disc">
              <li>Go to the <strong>Settings</strong> app on your iPhone.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Navigate to Mail:</strong>
            <ul class="ml-5 list-disc">
              <li>Scroll down and tap on <strong>"Mail"</strong>.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Add Account:</strong>
            <ul class="ml-5 list-disc">
              <li>Tap on <strong>"Accounts"</strong>, then select <strong>"Add Account"</strong>.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Choose Google:</strong>
            <ul class="ml-5 list-disc">
              <li>Select <strong>"Google"</strong> from the list of account types.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Enter Your Gmail Credentials:</strong>
            <ul class="ml-5 list-disc">
              <li>Enter your Gmail email address and tap <strong>"Next"</strong>.</li>
              <li>Enter your password and tap <strong>"Next"</strong> again.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Grant Permissions:</strong>
            <ul class="ml-5 list-disc">
              <li>Tap <strong>"Allow"</strong> when prompted to grant access.</li>
            </ul>
          </li>
          <li><strong style="color:#871054;">Choose What to Sync:</strong>
            <ul class="ml-5 list-disc">
              <li>Select the items you want to sync (Mail, Contacts, etc.) and tap <strong>"Save"</strong>.</li>
            </ul>
          </li>
        </ol>
        <p><strong style="color:#871054;">✓ Your Gmail account is now added and accessible via the Mail app!</strong></p>
      </div>
      
      <h4 style="color:#871054;font-weight:bold;">Email Features and Benefits</h4>
      <ul class="ml-5 list-disc">
        <li>Official university communications</li>
        <li>Access to Google Workspace applications</li>
        <li>Cloud storage for documents and assignments</li>
        <li>Calendar integration for class schedules</li>
        <li>Collaboration tools for group projects</li>
      </ul>
      
      <div class="mt-6 text-center">
        <a href="http://portal2.kemu.ac.ke" target="_blank" style="background-color:#2c3093;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;display:inline-block">Go to Student Portal</a>
      </div>
      `,
      views: 987,
      helpful: 92,
      createdAt: "2024-01-20",
    },
    {
      id: "kb-3",
      title: "Accessing the school timetable",
      excerpt: "How to find and view your lecture and examination timetables for the current trimester.",
      content: `
      <div class="mb-4">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jlOsirUYxB6xDVtFhmEs9MleurzAtr.png" alt="KeMU Timetables Page" class="rounded-lg shadow-md w-full max-w-3xl mx-auto" />
      </div>
      
      <h3 style="color:#871054;font-weight:bold;">School Timetable Access Guide</h3>
      <p>The lecture and examination timetables are essential resources for planning your academic schedule. Here's how to access them:</p>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h4 style="color:#871054;font-weight:bold;">Accessing Timetables Online</h4>
        <p>You can access the timetables through the official KeMU website:</p>
        <ol class="ml-5 list-decimal">
          <li>Visit the <a href="https://www.kemu.ac.ke" target="_blank" style="color:#2c3093;font-weight:bold;">KeMU website</a></li>
          <li>Navigate to the <a href="https://www.kemu.ac.ke/timetables" target="_blank" style="color:#2c3093;font-weight:bold;">Timetables section</a></li>
          <li>Select the appropriate campus tab (Main Campus, Nairobi Campus, or Mombasa Campus)</li>
          <li>Click on the "View Timetable" link for your specific trimester</li>
        </ol>
      </div>
      
      <h4 style="color:#871054;font-weight:bold;">Types of Timetables Available</h4>
      <p>The university provides two main types of timetables:</p>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h5 style="color:#871054;font-weight:bold;">1. Teaching Timetables</h5>
        <ul class="ml-5 list-disc">
          <li>Regular lecture schedules organized by trimester</li>
          <li>Available for all campuses (Main Campus, Nairobi, Mombasa)</li>
          <li>Updated at the beginning of each trimester</li>
          <li>Includes course codes, venues, and lecturer information</li>
        </ul>
      </div>
      
      <div class="bg-gray-50 p-4 rounded-lg my-4 border-l-4" style="border-color:#871054;">
        <h5 style="color:#871054;font-weight:bold;">2. Examination Timetables</h5>
        <ul class="ml-5 list-disc">
          <li>End-of-trimester examination schedules</li>
          <li>Organized by program level and type:</li>
          <ul class="ml-5 list-disc">
            <li>Bachelors, Diploma, Certificate (Day and Evening)</li>
            <li>PhD, Masters (Day and Evening)</li>
            <li>Special programs (e.g., MBChB)</li>
            <li>TVET programs</li>
          </ul>
          <li>Includes examination dates, times, venues, and invigilators</li>
        </ul>
      </div>
      
      <h4 style="color:#871054;font-weight:bold;">Important Timetable Information</h4>
      <ul class="ml-5 list-disc">
        <li>Always check for the most recent timetable updates before classes begin</li>
        <li>Pay attention to any campus-specific information</li>
        <li>Note that timetables may be subject to change - check regularly</li>
        <li>Examination timetables are typically published 2-3 weeks before exam period</li>
        <li>Special announcements about timetable changes may be posted on the student portal</li>
      </ul>
      
      <div class="mt-6 text-center">
        <a href="https://www.kemu.ac.ke/timetables" target="_blank" style="background-color:#2c3093;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;display:inline-block">View KeMU Timetables</a>
      </div>
      
      <p class="mt-4">If you encounter any issues accessing the timetables or have questions about your schedule, please contact your department's administrative office or the Academic Registrar's office.</p>
      `,
      views: 567,
      helpful: 87,
      createdAt: "2024-02-20",
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
                <Laptop className="h-6 w-6" style={{ color: "#871054" }} />
                IT Support
              </div>
            </CardTitle>
          </div>
          <CardDescription style={gradientTextStyle}>Technical support for computer and network issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5" style={{ color: "#666666" }} />
            <Input
              placeholder="Search IT Support articles..."
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
                            <Button size="sm" style={{ backgroundColor: "#871054", color: "#ffffff" }}>
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

