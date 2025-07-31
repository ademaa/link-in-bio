"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Check, X, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface UsernameFormProps {
  user: User
  currentUsername?: string
  onUsernameUpdate: (username: string) => void
  onError: (error: string) => void
  onSuccess: (message: string) => void
}

export function UsernameForm({ user, currentUsername, onUsernameUpdate, onError, onSuccess }: UsernameFormProps) {
  const [username, setUsername] = useState(currentUsername || "")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (username && username !== currentUsername) {
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(username)
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setIsAvailable(null)
    }
  }, [username, currentUsername])

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (usernameToCheck.length < 3) {
      setIsAvailable(false)
      return
    }

    setIsChecking(true)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", usernameToCheck.toLowerCase())
        .single()

      if (error && error.code === "PGRST116") {
        // No rows returned, username is available
        setIsAvailable(true)
      } else if (data) {
        // Username exists
        setIsAvailable(false)
      }
    } catch (error) {
      console.error("Error checking username:", error)
      setIsAvailable(false)
    } finally {
      setIsChecking(false)
    }
  }

  const updateUsername = async () => {
    if (!username || !isAvailable) return

    setIsSaving(true)
    try {
      const { error } = await supabase.from("profiles").update({ username: username.toLowerCase() }).eq("id", user.id)

      if (error) throw error

      onUsernameUpdate(username.toLowerCase())
      onSuccess("Username updated successfully!")
    } catch (error: any) {
      onError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const isValidUsername = (username: string) => {
    return /^[a-zA-Z0-9_-]+$/.test(username) && username.length >= 3 && username.length <= 30
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              linkinbio.com/
            </span>
            <Input
              id="username"
              placeholder="your-username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              className="rounded-l-none"
            />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isChecking && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
            {!isChecking && isAvailable === true && <Check className="h-4 w-4 text-green-500" />}
            {!isChecking && isAvailable === false && <X className="h-4 w-4 text-red-500" />}
          </div>
        </div>
        <div className="text-xs text-gray-500 space-y-1">
          <p>3-30 characters, letters, numbers, hyphens and underscores only</p>
          {username && !isValidUsername(username) && (
            <p className="text-red-500">Username must be 3-30 characters and contain only letters, numbers, - and _</p>
          )}
          {username && isAvailable === false && <p className="text-red-500">Username is already taken</p>}
          {username && isAvailable === true && <p className="text-green-500">Username is available!</p>}
        </div>
      </div>

      {username !== currentUsername && isAvailable && (
        <Button onClick={updateUsername} disabled={isSaving || !isValidUsername(username)} className="w-full">
          {isSaving ? "Updating..." : "Update Username"}
        </Button>
      )}
    </div>
  )
}
