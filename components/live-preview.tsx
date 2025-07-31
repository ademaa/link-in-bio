"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LinkIcon as LinkIconComponent } from "@/components/link-icon"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface LinkItem {
  id: string
  title: string
  url: string
  icon?: string
}

interface LivePreviewProps {
  user: SupabaseUser | null
  fullName: string
  bio: string
  links: LinkItem[]
  avatarUrl?: string | null
  username?: string
}

export function LivePreview({ user, fullName, bio, links, avatarUrl, username }: LivePreviewProps) {
  const getUsernameFromEmail = (email: string) => email.split("@")[0]
  const displayName =
    fullName ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    (user?.email ? getUsernameFromEmail(user.email) : "User")
  const displayBio = bio || user?.user_metadata?.bio || "Welcome to my LinkInBio page!"
  const displayUsername = username || (user?.email ? getUsernameFromEmail(user.email) : "username")

  return (
    <Card className="w-full max-w-sm mx-auto border-0 shadow-none">
      <CardContent className="pt-6">
        <div className="text-center">
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt={displayName}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{displayName.charAt(0).toUpperCase()}</span>
            </div>
          )}

          {/* Profile Info */}
          <h2 className="text-xl font-bold text-gray-900 mb-1">{displayName}</h2>
          <p className="text-gray-600 text-sm mb-3">@{displayUsername}</p>
          {displayBio && <p className="text-gray-700 text-sm leading-relaxed mb-4">{displayBio}</p>}
        </div>

        {/* Links Preview */}
        <div className="space-y-2">
          {links.length > 0 ? (
            links.slice(0, 4).map((link, index) => (
              <Button
                key={link.id || index}
                variant="outline"
                className="w-full h-12 text-left justify-between bg-white hover:bg-gray-50 border text-sm"
                asChild
              >
                <div className="cursor-default flex items-center">
                  <div className="flex items-center flex-1 min-w-0">
                    <LinkIconComponent icon={link.icon} className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="font-medium truncate">{link.title}</span>
                  </div>
                  <LinkIconComponent className="w-3 h-3 flex-shrink-0 ml-2" fallback={true} />
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">No links added yet</p>
            </div>
          )}

          {links.length > 4 && <p className="text-center text-xs text-gray-500 mt-2">+{links.length - 4} more links</p>}
        </div>

        {/* Preview Label */}
        <div className="mt-4 pt-3 border-t">
          <p className="text-center text-xs text-gray-400">Live Preview</p>
        </div>
      </CardContent>
    </Card>
  )
}
