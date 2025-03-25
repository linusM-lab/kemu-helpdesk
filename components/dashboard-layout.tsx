"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  Bell,
  ChevronDown,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Palette,
  Settings,
  User,
  Users,
} from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Determine user role based on URL path
  const isAdmin = pathname?.includes("/admin")
  const isStaff = pathname?.includes("/staff")
  const isStudent = !isAdmin && !isStaff

  // Navigation links based on user role
  const navLinks = isAdmin
    ? [
        { href: "/admin/dashboard", label: "Dashboard", icon: Home },
        { href: "/admin/tickets", label: "Tickets", icon: MessageSquare },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/reports", label: "Reports", icon: BarChart3 },
        { href: "/admin/theme", label: "Theme Settings", icon: Palette },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ]
    : isStaff
      ? [
          { href: "/staff/dashboard", label: "Dashboard", icon: Home },
          { href: "/staff/tickets", label: "My Tickets", icon: MessageSquare },
          { href: "/staff/profile", label: "Profile", icon: User },
        ]
      : [
          { href: "/dashboard", label: "Dashboard", icon: Home },
          { href: "/tickets", label: "My Tickets", icon: MessageSquare },
          { href: "/knowledge-base", label: "Knowledge Base", icon: HelpCircle },
          { href: "/profile", label: "Profile", icon: User },
        ]

  const SidebarContent = () => (
    <div className="h-full flex flex-col" style={{ backgroundColor: "#ffffff" }}>
      <div className="p-6 flex items-center justify-center">
        <Link href="/" className="flex flex-col items-center gap-2 font-bold text-xl">
          <div className="relative w-20 h-20">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ke-MU-Brand-Logo-1.jpg-Uxw8eB1OlYPQCH09ldbKc122s2LpzS.jpeg"
              alt="KEMU Logo"
              fill
              className="object-contain"
            />
          </div>
          <span style={{ color: "#7b0046" }} className="font-bold">
            KEMU Helpdesk
          </span>
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link key={link.href} href={link.href} onClick={() => isMobile && setIsSidebarOpen(false)}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-kemu-maroon" : "hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: isActive ? "#7b0046" : "transparent",
                  color: isActive ? "#ffffff" : "#333333",
                }}
              >
                <Icon style={{ color: isActive ? "#ffffff" : "#333333" }} className="h-5 w-5" />
                <span style={{ color: isActive ? "#ffffff" : "#333333" }}>{link.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="p-6 mt-auto">
        <div
          className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 cursor-pointer"
          style={{ color: "#333333" }}
        >
          <LogOut className="h-5 w-5" style={{ color: "#333333" }} />
          <span style={{ color: "#333333" }}>Logout</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 border-r" style={{ backgroundColor: "#ffffff" }}>
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4" style={{ backgroundColor: "#ffffff" }}>
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" style={{ color: "#333333" }} />
              </Button>
            )}
            <div className="md:hidden font-bold" style={{ color: "#333333" }}>
              KEMU Helpdesk
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" style={{ color: "#333333" }} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback style={{ backgroundColor: "#7b0046", color: "#ffffff" }}>
                      {isAdmin ? "LM" : isStaff ? "ST" : "SU"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-sm font-medium text-left" style={{ color: "#333333" }}>
                    {isAdmin ? "Linus Muriuki" : isStaff ? "David Wilson" : "Alice Johnson"}
                    <div className="text-xs font-normal" style={{ color: "#666666" }}>
                      {isAdmin ? "Super Admin" : isStaff ? "Staff - Finance" : "Student"}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" style={{ color: "#333333" }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel style={{ color: "#333333" }}>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{ color: "#333333" }}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem style={{ color: "#333333" }}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem style={{ color: "#333333" }}>
                    <Palette className="mr-2 h-4 w-4" />
                    Theme Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{ color: "#333333" }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto" style={{ backgroundColor: "#f8f9fa" }}>
          {children}
        </main>
      </div>
    </div>
  )
}

