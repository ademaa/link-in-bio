import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkIcon, UserX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">LinkInBio</span>
          </Link>
          <Link href="/auth">
            <Button>Create Your Own</Button>
          </Link>
        </nav>
      </header>

      {/* Not Found Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserX className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-2xl">Page Not Found</CardTitle>
              <CardDescription>The page you're looking for doesn't exist or may have been removed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">This could happen if:</p>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• The URL was typed incorrectly</li>
                  <li>• The page was moved or deleted</li>
                  <li>• The username doesn't exist</li>
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <Button asChild>
                  <Link href="/demo">View Demo Profile</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth">Create Your Own Profile</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/">← Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
