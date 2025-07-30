"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, GripVertical, Edit, Save, X } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface LinkEditorProps {
  user: any
  links: any[]
  onLinksUpdate: (links: any[]) => void
}

interface SortableLinkItemProps {
  link: any
  onEdit: (link: any) => void
  onDelete: (id: string) => void
}

function SortableLinkItem({ link, onEdit, onDelete }: SortableLinkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center space-x-2 p-3 bg-white border rounded-lg">
      <div {...attributes} {...listeners} className="cursor-grab hover:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{link.title}</p>
        <p className="text-sm text-gray-500 truncate">{link.url}</p>
      </div>
      <div className="flex space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onEdit(link)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(link.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function LinkEditor({ user, links, onLinksUpdate }: LinkEditorProps) {
  const [loading, setLoading] = useState(false)
  const [editingLink, setEditingLink] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
  })
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from("links")
        .insert({
          user_id: user.id,
          title: formData.title,
          url: formData.url,
          position: links.length,
        })
        .select()
        .single()

      if (error) throw error

      onLinksUpdate([...links, data])
      setFormData({ title: "", url: "" })
      setShowAddForm(false)
      toast({
        title: "Link added",
        description: "Your new link has been added successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from("links")
        .update({
          title: formData.title,
          url: formData.url,
        })
        .eq("id", editingLink.id)
        .select()
        .single()

      if (error) throw error

      const updatedLinks = links.map((link) => (link.id === editingLink.id ? data : link))
      onLinksUpdate(updatedLinks)
      setEditingLink(null)
      setFormData({ title: "", url: "" })
      toast({
        title: "Link updated",
        description: "Your link has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    try {
      const { error } = await supabase.from("links").delete().eq("id", id)

      if (error) throw error

      const updatedLinks = links.filter((link) => link.id !== id)
      onLinksUpdate(updatedLinks)
      toast({
        title: "Link deleted",
        description: "Your link has been deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id)
      const newIndex = links.findIndex((link) => link.id === over.id)

      const newLinks = arrayMove(links, oldIndex, newIndex)
      onLinksUpdate(newLinks)

      // Update positions in database
      try {
        const updates = newLinks.map((link, index) => ({
          id: link.id,
          position: index,
        }))

        for (const update of updates) {
          await supabase.from("links").update({ position: update.position }).eq("id", update.id)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to update link order",
          variant: "destructive",
        })
      }
    }
  }

  const startEdit = (link: any) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
    })
  }

  const cancelEdit = () => {
    setEditingLink(null)
    setFormData({ title: "", url: "" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Management</CardTitle>
        <CardDescription>Add, edit, and reorder your links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Link Form */}
        {showAddForm && (
          <form onSubmit={handleAddLink} className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="title">Link Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="My Website"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Adding..." : "Add Link"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setFormData({ title: "", url: "" })
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Edit Link Form */}
        {editingLink && (
          <form onSubmit={handleEditLink} className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Link Title</Label>
              <Input id="edit-title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input id="edit-url" name="url" type="url" value={formData.url} onChange={handleInputChange} required />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Add Link Button */}
        {!showAddForm && !editingLink && (
          <Button onClick={() => setShowAddForm(true)} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Link
          </Button>
        )}

        {/* Links List */}
        {links.length > 0 && (
          <div className="space-y-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links} strategy={verticalListSortingStrategy}>
                {links.map((link) => (
                  <SortableLinkItem key={link.id} link={link} onEdit={startEdit} onDelete={handleDeleteLink} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}

        {links.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-gray-500">
            <p>No links yet. Add your first link to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
