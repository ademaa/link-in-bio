"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { LinkIcon } from "@/components/link-icon"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditLinkModalProps {
  link: {
    id: string
    title: string
    url: string
    icon?: string
  }
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
  onError: (error: string) => void
  onLinkUpdated: () => void
}

const ICON_OPTIONS = [
  { id: "website", name: "Website" },
  { id: "twitter", name: "Twitter" },
  { id: "instagram", name: "Instagram" },
  { id: "facebook", name: "Facebook" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "youtube", name: "YouTube" },
  { id: "github", name: "GitHub" },
  { id: "email", name: "Email" },
  { id: "phone", name: "Phone" },
  { id: "location", name: "Location" },
  { id: "music", name: "Music" },
  { id: "camera", name: "Photography" },
  { id: "gaming", name: "Gaming" },
  { id: "shopping", name: "Shopping" },
  { id: "blog", name: "Blog" },
  { id: "business", name: "Business" },
  { id: "favorite", name: "Favorite" },
  { id: "featured", name: "Featured" },
  { id: "trending", name: "Trending" },
]

export function EditLinkModal({ link, isOpen, onClose, onSuccess, onError, onLinkUpdated }: EditLinkModalProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [icon, setIcon] = useState("website")
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  // Reset form when link changes or modal opens
  useEffect(() => {
    if (isOpen && link) {
      setTitle(link.title)
      setUrl(link.url)
      setIcon(link.icon || "website")
    }
  }, [isOpen, link])

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) {
      onError("Title and URL are required")
      return
    }

    setSaving(true)
    try {
      const finalUrl =
        url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:") ? url : `https://${url}`

      const { error } = await supabase
        .from("links")
        .update({
          title: title.trim(),
          url: finalUrl,
          icon: icon,
        })
        .eq("id", link.id)

      if (error) throw error

      onSuccess("Link updated successfully!")
      onLinkUpdated()
      onClose()
    } catch (error: any) {
      onError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    // Reset form to original values
    if (link) {
      setTitle(link.title)
      setUrl(link.url)
      setIcon(link.icon || "website")
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update your link details. Changes will be reflected immediately on your profile.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" placeholder="Link title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-url">URL</Label>
            <Input
              id="edit-url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center">
                    <LinkIcon icon={icon} className="w-4 h-4 mr-2" />
                    {ICON_OPTIONS.find((opt) => opt.id === icon)?.name || "Website"}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center">
                      <LinkIcon icon={option.id} className="w-4 h-4 mr-2" />
                      {option.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
