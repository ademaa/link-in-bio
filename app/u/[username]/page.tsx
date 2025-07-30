import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import ProfileCard from "@/components/public/profile-card"
import DatabaseSetupMessage from "@/components/database-setup-message"

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Check if tables exist by trying to fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", params.username)
      .maybeSingle()

    // Handle database not set up error
    if (profileError && profileError.message.includes('relation "public.profiles" does not exist')) {
      return <DatabaseSetupMessage />
    }

    if (profileError) {
      console.error("Database error fetching profile:", profileError)
      notFound()
    }

    if (!profile) {
      console.log(`Profile not found for username: ${params.username}`)
      notFound()
    }

    // Fetch links data
    const { data: links, error: linksError } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", profile.id)
      .order("position")

    if (linksError) {
      console.error("Error fetching links:", linksError)
      // Continue without links rather than failing completely
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <ProfileCard profile={profile} links={links || []} />
      </div>
    )
  } catch (error: any) {
    console.error("Unexpected error in PublicProfile:", error)

    // Check if it's a database setup issue
    if (error.message && error.message.includes('relation "public.profiles" does not exist')) {
      return <DatabaseSetupMessage />
    }

    notFound()
  }
}

export async function generateMetadata({ params }: { params: { username: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, bio")
      .eq("username", params.username)
      .maybeSingle()

    if (!profile) {
      return {
        title: "Profile Not Found - LinkInBio",
        description: "The profile you're looking for doesn't exist.",
      }
    }

    return {
      title: `${profile.display_name || params.username} - LinkInBio`,
      description: profile.bio || `Check out ${profile.display_name || params.username}'s links`,
    }
  } catch (error) {
    return {
      title: "LinkInBio - Your Links, One Page",
      description: "Create your personalized link-in-bio page",
    }
  }
}
