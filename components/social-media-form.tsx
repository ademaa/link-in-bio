"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Github,
  Globe,
  Mail,
  Phone,
  MapPin,
  Music,
  Camera,
  Gamepad2,
  ShoppingBag,
  BookOpen,
  Briefcase,
  Heart,
  Star,
  Zap,
  Plus,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface SocialMediaFormProps {
  user: User
  onLinkAdded: () => void
  onError: (error: string) => void
  onSuccess: (message: string) => void
  existingLinksCount: number
}

const SOCIAL_PLATFORMS = [
  { id: "twitter", name: "Twitter", icon: Twitter, placeholder: "https://twitter.com/username", color: "#1DA1F2" },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/username",
    color: "#E4405F",
  },
  { id: "facebook", name: "Facebook", icon: Facebook, placeholder: "https://facebook.com/username", color: "#1877F2" },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
    color: "#0A66C2",
  },
  { id: "youtube", name: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@username", color: "#FF0000" },
  { id: "github", name: "GitHub", icon: Github, placeholder: "https://github.com/username", color: "#333333" },
  { id: "website", name: "Website", icon: Globe, placeholder: "https://yourwebsite.com", color: "#6366F1" },
  { id: "email", name: "Email", icon: Mail, placeholder: "mailto:your@email.com", color: "#059669" },
  { id: "phone", name: "Phone", icon: Phone, placeholder: "tel:+1234567890", color: "#DC2626" },
  {
    id: "location",
    name: "Location",
    icon: MapPin,
    placeholder: "https://maps.google.com/?q=location",
    color: "#EA580C",
  },
]

const CUSTOM_ICONS = [
  { id: "music", name: "Music", icon: Music },
  { id: "camera", name: "Photography", icon: Camera },
  { id: "gaming", name: "Gaming", icon: Gamepad2 },
  { id: "shopping", name: "Shopping", icon: ShoppingBag },
  { id: "blog", name: "Blog", icon: BookOpen },
  { id: "business", name: "Business", icon: Briefcase },
  { id: "favorite", name: "Favorite", icon: Heart },
  { id: "featured", name: "Featured", icon: Star },
  { id: "trending", name: "Trending", icon: Zap },
  { id: "custom", name: "Custom", icon: Plus },
]

export function SocialMediaForm({ user, onLinkAdded, onError, onSuccess, existingLinksCount }: SocialMediaFormProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [customTitle, setCustomTitle] = useState("")
  const [url, setUrl] = useState("")
  const [selectedIcon, setSelectedIcon] = useState<string>("")
  const [isCustomLink, setIsCustomLink] = useState(false)
  const [adding, setAdding] = useState(false)
  const supabase = createClient()

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId)
    setIsCustomLink(platformId === "custom")

    if (platformId !== "custom") {
      const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId)
      if (platform) {
        setUrl(platform.placeholder)
        setCustomTitle(platform.name)
        setSelectedIcon(platformId)
      }
    } else {
      setUrl("")
      setCustomTitle("")
      setSelectedIcon("")
    }
  }

  const handleIconChange = (iconId: string) => {
    setSelectedIcon(iconId)
  }

  const addSocialLink = async () => {
    if (!user || !url || (!selectedPlatform && !customTitle)) return

    setAdding(true)

    try {
      const title = isCustomLink
        ? customTitle
        : SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatform)?.name || customTitle
      const finalUrl =
        url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:") ? url : `https://${url}`

      const linkData = {
        user_id: user.id,
        title: title,
        url: finalUrl,
        icon: selectedIcon || selectedPlatform,
        position: existingLinksCount,
      }

      const { error } = await supabase.from("links").insert(linkData)

      if (error) throw error

      // Reset form
      setSelectedPlatform("")
      setCustomTitle("")
      setUrl("")
      setSelectedIcon("")
      setIsCustomLink(false)

      onLinkAdded()
      onSuccess(`${title} link added successfully!`)
    } catch (error: any) {
      onError(error.message)
    } finally {
      setAdding(false)
    }
  }

  const getIconComponent = (iconId: string) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.id === iconId)
    if (platform) return platform.icon

    const customIcon = CUSTOM_ICONS.find((i) => i.id === iconId)
    if (customIcon) return customIcon.icon

    return Globe
  }

  const IconComponent = selectedIcon ? getIconComponent(selectedIcon) : Plus

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Social Media & Links</CardTitle>
        <CardDescription>Quickly add social media profiles and custom links with icons</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Platform Selection */}
        <div className="space-y-2">
          <Label>Choose Platform or Custom Link</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SOCIAL_PLATFORMS.map((platform) => {
              const Icon = platform.icon
              return (
                <Button
                  key={platform.id}
                  variant={selectedPlatform === platform.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePlatformChange(platform.id)}
                  className="justify-start h-10"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="truncate">{platform.name}</span>
                </Button>
              )
            })}
            <Button
              variant={isCustomLink ? "default" : "outline"}
              size="sm"
              onClick={() => handlePlatformChange("custom")}
              className="justify-start h-10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Custom
            </Button>
          </div>
        </div>

        {/* Custom Link Fields */}
        {isCustomLink && (
          <>
            <div className="space-y-2">
              <Label htmlFor="customTitle">Link Title</Label>
              <Input
                id="customTitle"
                placeholder="e.g., My Portfolio"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Choose Icon</Label>
              <div className="grid grid-cols-5 gap-2">
                {CUSTOM_ICONS.map((iconOption) => {
                  const Icon = iconOption.icon
                  return (
                    <Button
                      key={iconOption.id}
                      variant={selectedIcon === iconOption.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleIconChange(iconOption.id)}
                      className="h-10 w-full"
                      title={iconOption.name}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* URL Input */}
        {(selectedPlatform || isCustomLink) && (
          <div className="space-y-2">
            <Label htmlFor="socialUrl">
              {isCustomLink ? "URL" : `${SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatform)?.name} URL`}
            </Label>
            <div className="flex space-x-2">
              <div className="flex items-center justify-center w-10 h-10 border rounded-md bg-gray-50">
                <IconComponent className="w-4 h-4" />
              </div>
              <Input
                id="socialUrl"
                placeholder={
                  isCustomLink
                    ? "https://example.com"
                    : SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatform)?.placeholder
                }
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        )}

        {/* Add Button */}
        {(selectedPlatform || (isCustomLink && customTitle)) && url && (
          <Button
            onClick={addSocialLink}
            disabled={adding || !url || (isCustomLink && !customTitle)}
            className="w-full"
          >
            {adding
              ? "Adding..."
              : `Add ${isCustomLink ? customTitle : SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatform)?.name}`}
          </Button>
        )}

        {/* Quick Add Popular Platforms */}
        <div className="pt-4 border-t">
          <Label className="text-sm text-gray-600 mb-2 block">Quick Add Popular Platforms:</Label>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_PLATFORMS.slice(0, 6).map((platform) => {
              const Icon = platform.icon
              return (
                <Button
                  key={`quick-${platform.id}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlatformChange(platform.id)}
                  className="h-8 px-3"
                  style={{ color: platform.color }}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {platform.name}
                </Button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
