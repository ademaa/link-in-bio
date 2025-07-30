"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function SetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Setup Required</CardTitle>
          <CardDescription className="text-lg">Let's get your LinkInBio platform connected to Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Step 1: Create Supabase Project */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                1
              </div>
              <h3 className="text-xl font-semibold">Create a Supabase Project</h3>
            </div>
            <p className="text-gray-600 mb-4">If you don't have a Supabase project yet, create one first.</p>
            <Button asChild>
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Supabase Dashboard
              </a>
            </Button>
          </div>

          {/* Step 2: Get API Keys */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                2
              </div>
              <h3 className="text-xl font-semibold">Get Your API Keys</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <p>1. Go to your Supabase project dashboard</p>
              <p>2. Click on "Settings" in the sidebar</p>
              <p>3. Click on "API" in the settings menu</p>
              <p>4. Copy your "Project URL" and "anon public" key</p>
            </div>
          </div>

          {/* Step 3: Set Environment Variables */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                3
              </div>
              <h3 className="text-xl font-semibold">Set Environment Variables</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project root and
              add:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
              <pre className="text-sm overflow-x-auto">{envTemplate}</pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
                onClick={() => copyToClipboard(envTemplate, 3)}
              >
                {copiedStep === 3 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Replace <code>your_supabase_project_url</code> and <code>your_supabase_anon_key</code> with your actual
              values.
            </p>
          </div>

          {/* Step 4: Run Database Scripts */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                4
              </div>
              <h3 className="text-xl font-semibold">Set Up Database</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Run the provided SQL scripts in your Supabase SQL Editor to create the necessary tables and policies.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">01-create-tables.sql</code>
                <span className="text-gray-500">- Creates profiles and links tables</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">02-create-storage.sql</code>
                <span className="text-gray-500">- Sets up avatar storage</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">03-create-demo-profile.sql</code>
                <span className="text-gray-500">- Creates demo profile</span>
              </div>
            </div>
          </div>

          {/* Step 5: Restart Development Server */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                5
              </div>
              <h3 className="text-xl font-semibold">Restart Your Development Server</h3>
            </div>
            <p className="text-gray-600 mb-4">
              After setting up the environment variables, restart your development server:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
              <pre className="text-sm">npm run dev</pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
                onClick={() => copyToClipboard("npm run dev", 5)}
              >
                {copiedStep === 5 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Need Help?</strong> Check the Supabase documentation for detailed setup instructions, or visit
              the project repository for more information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
