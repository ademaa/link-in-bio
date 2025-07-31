import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { LinkIcon } from "@/components/link-icon"

interface LinkItem {
  id: string
  title: string
  url: string
  position: number
  icon?: string
}

interface UserProfile {
  username: string
  display_name?: string
  bio?: string
  avatar_url?: string
}

async function getUserProfile(username: string): Promise<{ user: UserProfile; links: LinkItem[] } | null> {
  const supabase = await createClient()

  try {
    // Demo profile - static data to avoid hydration issues
    if (username === "demo") {
      return {
        user: {
          username: "demo",
          display_name: "Demo User",
          bio: "This is a demo profile showing how your LinkInBio page will look. Sign up to create your own!",
          avatar_url: undefined,
        },
        links: [
          {
            id: "demo-1",
            title: "My Website",
            url: "https://example.com",
            position: 0,
            icon: "website",
          },
          {
            id: "demo-2",
            title: "Twitter",
            url: "https://twitter.com/username",
            position: 1,
            icon: "twitter",
          },
          {
            id: "demo-3",
            title: "Instagram",
            url: "https://instagram.com/username",
            position: 2,
            icon: "instagram",
          },
          {
            id: "demo-4",
            title: "LinkedIn",
            url: "https://linkedin.com/in/username",
            position: 3,
            icon: "linkedin",
          },
        ],
      }
    }

    // Get user profile by username
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, display_name, bio, avatar_url, id")
      .eq("username", username.toLowerCase())
      .single()

    if (profileError || !profile) {
      console.log(`Profile not found for username: ${username}`)
      return null
    }

    // Get user's links ordered by position
    const { data: links, error: linksError } = await supabase
      .from("links")
      .select("id, title, url, position, icon")
      .eq("user_id", profile.id)
      .order("position", { ascending: true })

    if (linksError) {
      console.error("Error fetching links:", linksError)
    }

    return {
      user: {
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      },
      links: links || [],
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const result = await getUserProfile(params.username)

  if (!result) {
    notFound()
  }

  const { user, links } = result

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

      {/* Single-column, centered, mobile-optimized layout */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Profile Card */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                {/* Avatar */}
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.display_name || user.username}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {(user.display_name || user.username).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Display name, username, and bio */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.display_name || user.username}</h1>
                <p className="text-gray-600 mb-4">@{user.username}</p>
                {user.bio && <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Links in user-defined order */}
          <div className="space-y-4">
            {links.map((link) => (
              <Button
                key={link.id}
                variant="outline"
                className="w-full h-14 text-left justify-between bg-white hover:bg-gray-50 border-2 transition-all duration-200 hover:border-purple-300 hover:shadow-md"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center">
                    <LinkIcon icon={link.icon} className="w-5 h-5 mr-3" />
                    <span className="font-medium">{link.title}</span>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>

          {links.length === 0 && (
            <div className="text-center py-8">
              <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No links added yet.</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-sm text-gray-500 mb-4">Create your own LinkInBio page</p>
            <Link href="/auth">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
