import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight } from "lucide-react"

export default function ProfilesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">User Profiles</h1>
          <p className="text-gray-600">Looking for a specific profile? Make sure you have the correct username.</p>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/auth">
            <Button className="w-full">
              Create Your Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full bg-transparent">
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600">
            Profile URLs follow the format: <br />
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">linkinbio.com/u/username</code>
          </p>
        </div>
      </div>
    </div>
  )
}
