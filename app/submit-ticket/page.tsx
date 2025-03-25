import { GuestTicketForm } from "@/components/guest-ticket-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function SubmitTicketPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to home</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ke-MU-Brand-Logo-1.jpg-Uxw8eB1OlYPQCH09ldbKc122s2LpzS.jpeg"
                  alt="Kenya Methodist University Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold" style={{ color: "#7b0046" }}>
                KEMU Helpdesk
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm" style={{ backgroundColor: "#7b0046", color: "#ffffff" }}>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold" style={{ color: "#7b0046" }}>
              Submit a Support Request
            </h1>
            <p className="mt-2 text-gray-600">No account needed. Fill out the form below to submit your request.</p>
          </div>
          <GuestTicketForm />
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Want to track all your tickets and get faster support?{" "}
              <Link href="/register" className="font-medium hover:underline" style={{ color: "#7b0046" }}>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

