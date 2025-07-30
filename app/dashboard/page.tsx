"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { LinkIcon, Plus, ExternalLink, Trash2, LogOut, Eye } from "lucide-react"
import Link from "next/link"

interface Profile {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
}

interface LinkItem {
  id: string
  title: string
  url: string
  order_index?: number
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  // Form states
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [newLinkTitle, setNewLinkTitle] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth")
        return
      }

      setUser(user)
      await loadProfile(user.id)
      await loadLinks(user.id)
    } catch (error: any) {
      setError("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setProfile(data)
        setFullName(data.full_name || "")
        setBio(data.bio || "")
      }
    } catch (error: any) {
      console.error("Error loading profile:", error)
    }
  }

  const loadLinks = async (userId: string) => {
    try {
      // Try to load with order_index first, fallback to created_at
      let { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .order("order_index", { ascending: true })

      if (error && error.message.includes("order_index")) {
        // Fallback to created_at ordering if order_index doesn't exist
        const fallbackResult = await supabase
          .from("links")
          .select("id, title, url, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: true })

        data = fallbackResult.data
        error = fallbackResult.error
      }

      if (error) throw error
      setLinks(data || [])
    } catch (error: any) {
      console.error("Error loading links:", error)
      setError("Failed to load links. Please refresh the page.")
    }
  }

  const saveProfile = async () => {
    if (!user) return

    setSaving(true)
    setError("")
    setMessage("")

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: profile?.username || user.email?.split("@")[0],
        full_name: fullName,
        bio: bio,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      setMessage("Profile updated successfully!")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const addLink = async () => {
    if (!user || !newLinkTitle || !newLinkUrl) return

    try {
      const linkData: any = {
        user_id: user.id,
        title: newLinkTitle,
        url: newLinkUrl.startsWith("http") ? newLinkUrl : `https://${newLinkUrl}`,
      }

      // Only add order_index if we know the column exists
      try {
        linkData.order_index = links.length
      } catch (e) {
        // If order_index fails, just don't include it
      }

      const { error } = await supabase.from("links").insert(linkData)

      if (error) throw error

      setNewLinkTitle("")
      setNewLinkUrl("")
      await loadLinks(user.id)
      setMessage("Link added successfully!")
    } catch (error: any) {
      setError(error.message)
      console.error("Error adding link:", error)
    }
  }

  const deleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase.from("links").delete().eq("id", linkId)

      if (error) throw error

      await loadLinks(user!.id)
      setMessage("Link deleted successfully!")
    } catch (error: any) {
      setError(error.message)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">LinkInBio</span>
            </div>
            <div className="flex items-center space-x-4">
              {profile?.username && (
                <Button variant="outline" asChild>
                  <Link href={`/u/${profile.username}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </Link>
                </Button>
              )}
              <Button variant="ghost" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your profile and links</p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{message}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={profile?.username || ""} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500">Your profile: /u/{profile?.username || "username"}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell people about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={saveProfile} disabled={saving} className="w-full">
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>

            {/* Add New Link */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Link</CardTitle>
                <CardDescription>Add a new link to your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkTitle">Link Title</Label>
                  <Input
                    id="linkTitle"
                    placeholder="e.g., My Website"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    placeholder="e.g., https://example.com"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                </div>
                <Button onClick={addLink} disabled={!newLinkTitle || !newLinkUrl} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Links List */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Links</CardTitle>
              <CardDescription>Manage your existing links</CardDescription>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <div className="text-center py-8">
                  <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No links yet. Add your first link above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {links.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{link.title}</h3>
                        <p className="text-sm text-gray-600">{link.url}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLink(link.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
