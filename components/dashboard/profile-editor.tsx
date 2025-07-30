"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Camera, Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProfileEditorProps {
  user: any
  profile: any
  onProfileUpdate: (profile: any) => void
}

export default function ProfileEditor({ user, profile, onProfileUpdate }: ProfileEditorProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear username error when user starts typing
    if (name === "username") {
      setUsernameError("")
    }
  }

  const validateUsername = (username: string) => {
    if (!username) return "Username is required"
    if (username.length < 3) return "Username must be at least 3 characters"
    if (username.length > 30) return "Username must be less than 30 characters"
    if (!/^[a-zA-Z0-9_-]+$/.test(username))
      return "Username can only contain letters, numbers, hyphens, and underscores"
    return ""
  }

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === profile?.username) return true

    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .neq("id", user.id)
      .maybeSingle()

    return !data
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      setFormData({
        ...formData,
        avatar_url: publicUrl,
      })

      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUsernameError("")

    try {
      // Validate username
      const usernameValidationError = validateUsername(formData.username)
      if (usernameValidationError) {
        setUsernameError(usernameValidationError)
        setLoading(false)
        return
      }

      // Check username availability
      const isUsernameAvailable = await checkUsernameAvailability(formData.username)
      if (!isUsernameAvailable) {
        setUsernameError("This username is already taken")
        setLoading(false)
        return
      }

      // Create or update profile
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      onProfileUpdate(data)
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      })
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Customize your public profile information</CardDescription>
      </CardHeader>
      <CardContent>
        {!profile && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete your profile setup to start sharing your links. Your profile will be created automatically.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{formData.display_name?.charAt(0) || formData.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Change Avatar"}
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              placeholder="your-username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className={usernameError ? "border-red-500" : ""}
            />
            {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
            <p className="text-sm text-gray-500">
              Your profile will be available at: linkinbio.com/u/{formData.username || "your-username"}
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              placeholder="Your Name"
              value={formData.display_name}
              onChange={handleInputChange}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell people about yourself..."
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading || !!usernameError} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
