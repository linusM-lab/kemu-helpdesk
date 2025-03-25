import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#4a5568" }}>
      <div className="container mx-auto px-4 py-12 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="text-white max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Kenya Methodist University Helpdesk</h1>
            <p className="text-xl mb-8">
              Submit and track your inquiries, complaints, and support requests in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="bg-white text-[#4a5568] px-6 py-3 rounded-md font-medium text-center hover:bg-gray-100 transition-colors"
              >
                Login to Helpdesk
              </Link>
              <Link
                href="/register"
                className="bg-transparent text-white border border-white px-6 py-3 rounded-md font-medium text-center hover:bg-white/10 transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/submit-ticket"
                className="bg-transparent text-white border border-white px-6 py-3 rounded-md font-medium text-center hover:bg-white/10 transition-colors"
              >
                Submit a Ticket
              </Link>
            </div>
          </div>
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ke-MU-Brand-Logo-1.jpg-Uxw8eB1OlYPQCH09ldbKc122s2LpzS.jpeg"
              alt="Kenya Methodist University Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <footer className="bg-[#2d3748] text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Kenya Methodist University. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

