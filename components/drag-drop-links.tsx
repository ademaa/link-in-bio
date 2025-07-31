"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { GripVertical, ExternalLink, Trash2, Edit } from "lucide-react"
import { LinkIcon } from "@/components/link-icon"
import { EditLinkModal } from "@/components/edit-link-modal"
import type { User } from "@supabase/supabase-js"

interface LinkItem {
  id: string
  title: string
  url: string
  position: number
  icon?: string
}

interface DragDropLinksProps {
  user: User
  links: LinkItem[]
  onLinksUpdate: () => void
  onError: (error: string) => void
  onSuccess: (message: string) => void
}

export function DragDropLinks({ user, links, onLinksUpdate, onError, onSuccess }: DragDropLinksProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const supabase = createClient()

  const handleDragStart = (e: React.DragEvent, linkId: string) => {
    setDraggedItem(linkId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, linkId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDraggedOver(linkId)
  }

  const handleDragLeave = () => {
    setDraggedOver(null)
  }

  const handleDrop = async (e: React.DragEvent, targetLinkId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetLinkId) {
      setDraggedItem(null)
      setDraggedOver(null)
      return
    }

    setIsReordering(true)
    try {
      const draggedIndex = links.findIndex((link) => link.id === draggedItem)
      const targetIndex = links.findIndex((link) => link.id === targetLinkId)

      if (draggedIndex === -1 || targetIndex === -1) return

      // Create new order
      const newLinks = [...links]
      const [draggedLink] = newLinks.splice(draggedIndex, 1)
      newLinks.splice(targetIndex, 0, draggedLink)

      // Update positions in database
      const updates = newLinks.map((link, index) => ({
        id: link.id,
        position: index,
      }))

      for (const update of updates) {
        const { error } = await supabase.from("links").update({ position: update.position }).eq("id", update.id)
        if (error) throw error
      }

      onLinksUpdate()
      onSuccess("Links reordered successfully!")
    } catch (error: any) {
      onError(error.message)
    } finally {
      setIsReordering(false)
      setDraggedItem(null)
      setDraggedOver(null)
    }
  }

  const deleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase.from("links").delete().eq("id", linkId)
      if (error) throw error

      onLinksUpdate()
      onSuccess("Link deleted successfully!")
    } catch (error: any) {
      onError(error.message)
    }
  }

  const openEditModal = (link: LinkItem) => {
    setEditingLink(link)
  }

  const closeEditModal = () => {
    setEditingLink(null)
  }

  if (links.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>No links yet. Add your first link above!</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>Drag and drop to reorder your links. Click edit to modify them.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {links
              .sort((a, b) => a.position - b.position)
              .map((link) => (
                <div
                  key={link.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, link.id)}
                  onDragOver={(e) => handleDragOver(e, link.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, link.id)}
                  className={`
                    flex items-center p-4 border rounded-lg cursor-move transition-all
                    ${draggedItem === link.id ? "opacity-50 scale-95" : ""}
                    ${draggedOver === link.id ? "border-purple-300 bg-purple-50" : ""}
                    ${isReordering ? "pointer-events-none" : ""}
                    hover:border-gray-300 hover:shadow-sm
                  `}
                >
                  <div className="flex items-center text-gray-400 mr-3">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="flex items-center flex-1 min-w-0">
                    <LinkIcon icon={link.icon} className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{link.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{link.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(link)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLink(link.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          {isReordering && (
            <div className="text-center py-4">
              <div className="inline-flex items-center text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                Reordering links...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Link Modal */}
      {editingLink && (
        <EditLinkModal
          link={editingLink}
          isOpen={!!editingLink}
          onClose={closeEditModal}
          onSuccess={onSuccess}
          onError={onError}
          onLinkUpdated={onLinksUpdate}
        />
      )}
    </>
  )
}
