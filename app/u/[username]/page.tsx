import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, LinkIcon } from "lucide-react"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

interface Profile {
  id: string
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
}

interface LinkItem {
  id: string
  title: string
  url: string
  order_index?: number
}

async function getProfile(username: string): Promise<{ profile: Profile; links: LinkItem[] } | null> {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  try {
    // First, get the profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single()

    if (profileError || !profile) {
      // If no profile found, check if it's the demo profile
      if (username === "demo") {
        return {
          profile: {
            id: "demo",
            username: "demo",
            full_name: "Demo User",
            bio: "This is a demo profile showing how your LinkInBio page will look. Sign up to create your own!",
            avatar_url: null,
          },
          links: [
            {
              id: "1",
              title: "My Website",
              url: "https://example.com",
              order_index: 0,
            },
            {
              id: "2",
              title: "Twitter",
              url: "https://twitter.com/username",
              order_index: 1,
            },
            {
              id: "3",
              title: "Instagram",
              url: "https://instagram.com/username",
              order_index: 2,
            },
            {
              id: "4",
              title: "LinkedIn",
              url: "https://linkedin.com/in/username",
              order_index: 3,
            },
          ],
        }
      }
      return null
    }

    // Get the user's links - try with order_index first, fallback to created_at
    let links: LinkItem[] = []

    try {
      // First try to order by order_index
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", profile.id)
        .order("order_index", { ascending: true })

      if (linksError) {
        throw linksError
      }

      links = linksData || []
    } catch (orderIndexError) {
      console.log("order_index column not found, falling back to created_at ordering")

      // Fallback to ordering by created_at if order_index doesn't exist
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("id, title, url, created_at")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: true })

      if (linksError) {
        console.error("Error fetching links:", linksError)
        return { profile, links: [] }
      }

      links = linksData || []
    }

    return { profile, links }
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const result = await getProfile(params.username)

  if (!result) {
    notFound()
  }

  const { profile, links } = result

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

      {/* Profile */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={profile.full_name || profile.username}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {profile.full_name?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.full_name || profile.username}</h1>
                <p className="text-gray-600 mb-4">@{profile.username}</p>
                {profile.bio && <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <div className="space-y-4">
            {links.map((link) => (
              <Button
                key={link.id}
                variant="outline"
                className="w-full h-14 text-left justify-between bg-white hover:bg-gray-50 border-2"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className="font-medium">{link.title}</span>
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
