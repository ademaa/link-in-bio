import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LinkButton from "./link-button"

interface ProfileCardProps {
  profile: any
  links: any[]
}

export default function ProfileCard({ profile, links }: ProfileCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center space-y-6">
          {/* Avatar */}
          <Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url || "/placeholder.svg?height=128&width=128"} />
            <AvatarFallback className="text-4xl bg-gradient-to-br from-purple-100 to-pink-100">
              {profile.display_name?.charAt(0) || profile.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Name and Bio */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.display_name || profile.username}</h1>
            {profile.bio && <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">{profile.bio}</p>}
          </div>

          {/* Links */}
          <div className="space-y-4 pt-4">
            {links && links.length > 0 ? (
              links.map((link) => <LinkButton key={link.id} title={link.title} url={link.url} />)
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">No links available yet</p>
                <p className="text-sm mt-2">Check back later for updates!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-8">
            <p className="text-sm text-gray-400">
              Powered by <span className="font-medium text-purple-600">LinkInBio</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
