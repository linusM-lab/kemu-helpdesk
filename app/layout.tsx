import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kenya Methodist University Helpdesk",
  description: "Submit and track your inquiries, complaints, and support requests",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ color: "#000000", backgroundColor: "#f8f9fa" }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>

        {/* Botpress Chatbot Scripts */}
        <Script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js" strategy="afterInteractive" />
        <Script
          src="https://files.bpcontent.cloud/2025/03/13/14/20250313140412-9V1G9V8B.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}



import './globals.css'