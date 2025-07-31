"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { Upload, User, X } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface AvatarUploadProps {
  user: SupabaseUser
  currentAvatarUrl?: string
  onAvatarUpdate: (url: string | null) => void
}

export function AvatarUpload({ user, currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError("")

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      // Update both user metadata AND profiles table
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
        },
      })

      if (updateError) {
        throw updateError
      }

      // Also update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id)

      if (profileError) {
        console.warn("Profile update failed:", profileError)
        // Don't throw error here as user metadata update succeeded
      }

      onAvatarUpdate(publicUrl)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setUploading(false)
    }
  }

  const removeAvatar = async () => {
    try {
      setUploading(true)
      setError("")

      // Update user metadata to remove avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      })

      if (updateError) {
        throw updateError
      }

      // Also update profiles table
      const { error: profileError } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id)

      if (profileError) {
        console.warn("Profile update failed:", profileError)
      }

      onAvatarUpdate(null)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {/* Avatar Preview */}
        <div className="relative">
          {currentAvatarUrl ? (
            <img
              src={currentAvatarUrl || "/placeholder.svg"}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          {currentAvatarUrl && (
            <Button
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={removeAvatar}
              disabled={uploading}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <Label htmlFor="avatar-upload" className="block text-sm font-medium mb-2">
            Profile Photo
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 5MB.</p>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
