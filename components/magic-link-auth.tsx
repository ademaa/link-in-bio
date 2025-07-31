"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Mail, ArrowRight } from "lucide-react"

interface MagicLinkAuthProps {
  onSuccess: (message: string) => void
  onError: (error: string) => void
}

export function MagicLinkAuth({ onSuccess, onError }: MagicLinkAuthProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      onSuccess("Check your email for the magic link!")
      setEmail("")
    } catch (error: any) {
      onError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleMagicLink} className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Magic Link Sign In</h3>
        <p className="text-sm text-gray-600">We'll send you a secure link to sign in instantly</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="magic-email">Email Address</Label>
        <Input
          id="magic-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || !email}>
        {loading ? (
          "Sending Magic Link..."
        ) : (
          <>
            Send Magic Link
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          No password required. Just click the link in your email to sign in securely.
        </p>
      </div>
    </form>
  )
}
