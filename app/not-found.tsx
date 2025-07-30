"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, User } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">The profile you're looking for doesn't exist or may have been moved.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-8 p-4 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">Want to create your own LinkInBio page?</p>
          <Link href="/auth">
            <Button size="sm" className="w-full">
              Create Your Profile
            </Button>
          </Link>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 Profile URLs follow the format: <br />
            <code className="bg-blue-100 px-2 py-1 rounded text-xs mt-1 inline-block">linkinbio.com/u/username</code>
          </p>
        </div>
      </div>
    </div>
  )
}
