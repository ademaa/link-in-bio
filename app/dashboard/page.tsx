"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/auth-helpers-nextjs"
import ProfileEditor from "@/components/dashboard/profile-editor"
import LinkEditor from "@/components/dashboard/link-editor"
import Preview from "@/components/dashboard/preview"
import DatabaseSetupMessage from "@/components/database-setup-message"
import { Button } from "@/components/ui/button"
import { LogOut, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [databaseError, setDatabaseError] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth")
        return
      }
      setUser(user)
      await fetchProfile(user.id)
      await fetchLinks(user.id)
      setLoading(false)
    }

    getUser()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()

      if (error && error.message.includes('relation "public.profiles" does not exist')) {
        setDatabaseError(true)
        return
      }

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      // Profile might be null if it hasn't been created yet (which is fine)
      setProfile(data)
    } catch (error: any) {
      if (error.message && error.message.includes('relation "public.profiles" does not exist')) {
        setDatabaseError(true)
      } else {
        console.error("Unexpected error fetching profile:", error)
      }
    }
  }

  const fetchLinks = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("links").select("*").eq("user_id", userId).order("position")

      if (error && error.message.includes('relation "public.links" does not exist')) {
        setDatabaseError(true)
        return
      }

      if (error) {
        console.error("Error fetching links:", error)
        return
      }

      if (data) {
        setLinks(data)
      }
    } catch (error: any) {
      if (error.message && error.message.includes('relation "public.links" does not exist')) {
        setDatabaseError(true)
      } else {
        console.error("Unexpected error fetching links:", error)
      }
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleProfileUpdate = (updatedProfile: any) => {
    setProfile(updatedProfile)
  }

  const handleLinksUpdate = (updatedLinks: any[]) => {
    setLinks(updatedLinks)
  }

  if (databaseError) {
    return <DatabaseSetupMessage />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              {profile?.username && (
                <Button variant="outline" size="sm" onClick={() => window.open(`/u/${profile.username}`, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Editors */}
          <div className="space-y-8">
            <ProfileEditor user={user} profile={profile} onProfileUpdate={handleProfileUpdate} />
            <LinkEditor user={user} links={links} onLinksUpdate={handleLinksUpdate} />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8">
            <Preview profile={profile} links={links} />
          </div>
        </div>
      </div>
    </div>
  )
}
