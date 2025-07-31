"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { LogOut, Eye, Share2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { AvatarUpload } from "@/components/avatar-upload"
import { LivePreview } from "@/components/live-preview"
import { SocialMediaForm } from "@/components/social-media-form"
import { LinkIcon } from "@/components/link-icon"
import { UsernameForm } from "@/components/username-form"
import { DragDropLinks } from "@/components/drag-drop-links"

interface LinkItem {
  id: string
  title: string
  url: string
  position?: number
  icon?: string
}

interface Profile {
  id: string
  username: string
  display_name?: string
  bio?: string
  avatar_url?: string
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
  const supabase = createClient()

  // Form states
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

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

      // Load profile from database
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error loading profile:", profileError)
      }

      if (profileData) {
        setProfile(profileData)
        setFullName(profileData.display_name || "")
        setBio(profileData.bio || "")
        setAvatarUrl(profileData.avatar_url || null)
      } else {
        // Fallback to user metadata if profile doesn't exist
        setFullName(user.user_metadata?.full_name || "")
        setBio(user.user_metadata?.bio || "")
        setAvatarUrl(user.user_metadata?.avatar_url || null)
      }

      await loadLinks(user.id)
    } catch (error: any) {
      setError("Failed to load user data")
      console.error("Error in checkUser:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadLinks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .order("position", { ascending: true })

      if (error) throw error
      setLinks(data || [])
    } catch (error: any) {
      console.error("Error loading links:", error)
      setError("Failed to load links. Please refresh the page.")
    }
  }

  const updateProfile = async () => {
    if (!user) return

    setSaving(true)
    setError("")
    setMessage("")

    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          display_name: fullName,
          bio: bio,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      // Also update user metadata for consistency
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          bio: bio,
          avatar_url: avatarUrl,
        },
      })

      if (userError) {
        console.warn("User metadata update failed:", userError)
      }

      setMessage("Profile updated successfully!")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleAvatarUpdate = (url: string | null) => {
    setAvatarUrl(url)
  }

  const handleUsernameUpdate = (newUsername: string) => {
    if (profile) {
      setProfile({ ...profile, username: newUsername })
    }
  }

  const copyProfileLink = async () => {
    if (!profile?.username) return

    const profileUrl = `${window.location.origin}/u/${profile.username}`
    try {
      await navigator.clipboard.writeText(profileUrl)
      setMessage("Profile link copied to clipboard!")
    } catch (error) {
      setError("Failed to copy link")
    }
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
                <>
                  <Button variant="outline" asChild>
                    <Link href={`/u/${profile.username}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={copyProfileLink}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Profile
                  </Button>
                </>
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your profile and links</p>
            {profile?.username && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                <span>Your profile:</span>
                <Link
                  href={`/u/${profile.username}`}
                  className="text-purple-600 hover:text-purple-700 flex items-center"
                >
                  linkinbio.com/u/{profile.username}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Add this after the dashboard title section */}
          {profile?.username && (
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Profile is Live! 🎉</h3>
                    <p className="text-gray-600 text-sm mb-2">Share your LinkInBio page with the world</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">Profile URL:</span>
                      <code className="bg-white px-2 py-1 rounded text-purple-600 border">
                        linkinbio.com/u/{profile.username}
                      </code>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" asChild>
                      <Link href={`/u/${profile.username}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </Button>
                    <Button onClick={copyProfileLink} className="bg-purple-600 hover:bg-purple-700">
                      <Share2 className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Links Management */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your profile information and avatar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <AvatarUpload user={user!} currentAvatarUrl={avatarUrl} onAvatarUpdate={handleAvatarUpdate} />

                  {/* Username Form */}
                  <UsernameForm
                    user={user!}
                    currentUsername={profile?.username}
                    onUsernameUpdate={handleUsernameUpdate}
                    onError={setError}
                    onSuccess={setMessage}
                  />

                  {/* Profile Form */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user?.email || ""} disabled className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Display Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Your display name"
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
                    <Button onClick={updateProfile} disabled={saving} className="w-full">
                      {saving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media & Links Form */}
              <SocialMediaForm
                user={user!}
                onLinkAdded={() => loadLinks(user!.id)}
                onError={setError}
                onSuccess={setMessage}
                existingLinksCount={links.length}
              />

              {/* Drag & Drop Links */}
              <DragDropLinks
                user={user!}
                links={links}
                onLinksUpdate={() => loadLinks(user!.id)}
                onError={setError}
                onSuccess={setMessage}
              />
            </div>

            {/* Right Column - Live Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                <LivePreview
                  user={user}
                  fullName={fullName}
                  bio={bio}
                  links={links}
                  avatarUrl={avatarUrl}
                  username={profile?.username}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
