import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, LinkIcon } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const demoProfile = {
    username: "demo",
    full_name: "Demo User",
    bio: "This is a demo profile showing how your LinkInBio page will look. Sign up to create your own personalized page with your links, bio, and custom styling!",
    avatar_url: null,
  }

  const demoLinks = [
    {
      id: "1",
      title: "My Portfolio Website",
      url: "https://example.com",
    },
    {
      id: "2",
      title: "Follow me on Twitter",
      url: "https://twitter.com/username",
    },
    {
      id: "3",
      title: "Instagram Photos",
      url: "https://instagram.com/username",
    },
    {
      id: "4",
      title: "LinkedIn Profile",
      url: "https://linkedin.com/in/username",
    },
    {
      id: "5",
      title: "YouTube Channel",
      url: "https://youtube.com/@username",
    },
    {
      id: "6",
      title: "GitHub Projects",
      url: "https://github.com/username",
    },
  ]

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

      {/* Demo Banner */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium text-blue-800">Demo Mode</p>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              This is how your LinkInBio page will look. Create your own to customize everything!
            </p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-md mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {demoProfile.full_name?.charAt(0) || demoProfile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{demoProfile.full_name}</h1>
                <p className="text-gray-600 mb-4">@{demoProfile.username}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{demoProfile.bio}</p>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <div className="space-y-4">
            {demoLinks.map((link) => (
              <Button
                key={link.id}
                variant="outline"
                className="w-full h-14 text-left justify-between bg-white hover:bg-gray-50 border-2 transition-all duration-200 hover:border-purple-300 hover:shadow-md"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className="font-medium">{link.title}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">Ready to create your own?</h3>
                <p className="text-purple-100 text-sm mb-4">
                  Get your personalized LinkInBio page in minutes. Add your links, customize your profile, and share
                  with the world!
                </p>
                <Link href="/auth">
                  <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">What you can customize:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-gray-900">✨ Profile</div>
                <div className="text-gray-600">Photo, name, bio</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-gray-900">🔗 Links</div>
                <div className="text-gray-600">Unlimited links</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-gray-900">🎨 Design</div>
                <div className="text-gray-600">Colors & themes</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-gray-900">📱 Mobile</div>
                <div className="text-gray-600">Mobile optimized</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-sm text-gray-500 mb-4">Powered by LinkInBio</p>
            <div className="flex justify-center space-x-4">
              <Link href="/auth" className="text-sm text-purple-600 hover:text-purple-700">
                Sign Up
              </Link>
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-700">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
