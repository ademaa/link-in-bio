import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DatabaseSetupMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Database Setup Required</CardTitle>
          <CardDescription className="text-lg">
            The database tables haven't been created yet. Please run the setup scripts to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Setup Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Open your Supabase project dashboard</li>
              <li>Go to the SQL Editor</li>
              <li>
                Run the provided SQL scripts in order:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">01-create-tables.sql</code>
                  </li>
                  <li>
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">02-create-storage.sql</code>
                  </li>
                  <li>
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">03-create-demo-profile.sql</code>
                  </li>
                </ul>
              </li>
              <li>Refresh this page to see the demo profile</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Supabase Dashboard
              </a>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/">
                Go to Home Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> After running the scripts, you'll have a working demo profile at{" "}
              <code className="bg-blue-100 px-2 py-1 rounded">/u/demo</code> and can start creating your own profiles!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
