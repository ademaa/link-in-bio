"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface PreviewProps {
  profile: any
  links: any[]
}

export default function Preview({ profile, links }: PreviewProps) {
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p>Complete your profile to see the preview</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile Frame */}
        <div className="mx-auto max-w-sm">
          <div className="bg-black rounded-[2.5rem] p-2">
            <div className="bg-white rounded-[2rem] overflow-hidden">
              {/* Status Bar */}
              <div className="bg-gray-900 h-6 flex items-center justify-center">
                <div className="w-16 h-1 bg-white rounded-full"></div>
              </div>

              {/* Content */}
              <div className="p-6 min-h-[600px] bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center space-y-4">
                  {/* Avatar */}
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name and Bio */}
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {profile.display_name || profile.username || "Your Name"}
                    </h1>
                    {profile.bio && <p className="text-sm text-gray-600 mt-2">{profile.bio}</p>}
                  </div>

                  {/* Links */}
                  <div className="space-y-3 pt-4">
                    {links.map((link) => (
                      <Button
                        key={link.id}
                        variant="outline"
                        className="w-full h-12 text-left justify-between bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white/90"
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <span className="truncate">{link.title}</span>
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        </a>
                      </Button>
                    ))}

                    {links.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">Your links will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
