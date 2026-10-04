"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Eye, EyeOff, Layers, Sparkles, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { CustomSection } from "@/lib/sections-store"

interface Props {
  postsCountBySection?: Record<string, number>
}

export function CustomSectionsManager({ postsCountBySection = {} }: Props) {
  const [sections, setSections] = useState<CustomSection[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<Partial<CustomSection> | null>(null)

  const loadSections = async () => {
    try {
      const res = await fetch("/api/sections")
      const data = await res.json()
      if (Array.isArray(data.sections)) {
        setSections(data.sections)
      }
    } catch {
      toast.error("Failed to load sections")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSections()
  }, [])

  const openNew = () => {
    setEditingSection({
      title: "",
      subtitle: "",
      badge: "Updates",
      enabled: true,
    })
    setDialogOpen(true)
  }

  const openEdit = (sec: CustomSection) => {
    setEditingSection({ ...sec })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingSection?.title?.trim()) {
      toast.error("Section title required")
      return
    }

    setSaving(true)
    try {
      const isNew = !editingSection.id
      const url = isNew ? "/api/sections" : `/api/sections/${editingSection.id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSection),
      })
      if (!res.ok) throw new Error("Save failed")
      toast.success(isNew ? "Section created" : "Section updated")
      setDialogOpen(false)
      loadSections()
    } catch {
      toast.error("Failed to save section")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete section "${title}"? Any posts in this section will become standard portfolio posts.`)) return

    try {
      const res = await fetch(`/api/sections/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Section removed")
      loadSections()
    } catch {
      toast.error("Failed to delete section")
    }
  }

  const toggleEnabled = async (sec: CustomSection) => {
    try {
      const next = !sec.enabled
      await fetch(`/api/sections/${sec.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      })
      setSections((prev) =>
        prev.map((s) => (s.id === sec.id ? { ...s, enabled: next } : s))
      )
      toast.success(next ? "Section enabled on homepage" : "Section hidden from homepage")
    } catch {
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Custom Sections</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create custom homepage sections (e.g. <strong className="text-foreground">"Helpful Guides"</strong>, <strong className="text-foreground">"Our Blog"</strong>, or <strong className="text-foreground">"Seasonal Tips"</strong>). Assign posts to them and they will display dynamically.
          </p>
        </div>
        <Button onClick={openNew} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0 cursor-pointer">
          <Plus className="h-4 w-4 mr-1.5" /> Add New Section
        </Button>
      </div>

      {loading ? (
        <Card className="border-border/60">
          <CardContent className="py-16 text-center text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading sections…
          </CardContent>
        </Card>
      ) : sections.length === 0 ? (
        <Card className="border-border/60 bg-card/60">
          <CardContent className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">No Custom Sections Yet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                You can add a section like "Our Blog" or "Handyman Tips & Guides". When enabled, it will appear on the live homepage with your assigned posts!
              </p>
            </div>
            <Button onClick={openNew} variant="outline" className="mt-2 cursor-pointer">
              <Plus className="h-4 w-4 mr-1.5" /> Create Your First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {sections.map((sec) => (
            <Card key={sec.id} className="border-border/70 hover:border-primary/40 transition-all">
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                      {sec.badge || "Section"}
                    </Badge>
                    <h3 className="font-display font-bold text-base sm:text-lg text-foreground truncate">
                      {sec.title}
                    </h3>
                    {sec.enabled ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                        Live on Homepage
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Hidden
                      </Badge>
                    )}
                  </div>
                  {sec.subtitle && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {sec.subtitle}
                    </p>
                  )}
                  <div className="text-[11px] text-muted-foreground/80">
                    ID: <code className="font-mono">{sec.id}</code> · {postsCountBySection[sec.id] || 0} posts assigned
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEnabled(sec)}
                    className="h-8 text-xs font-medium cursor-pointer"
                  >
                    {sec.enabled ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 mr-1 text-emerald-500" /> Show
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(sec)}
                    className="h-8 text-xs cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(sec.id, sec.title)}
                    className="h-8 text-xs text-destructive hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / Create Section Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-[95vw] p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              {editingSection?.id ? "Edit Section" : "Add New Section"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="sec-title" className="text-xs uppercase tracking-wider font-bold">
                Section Title *
              </Label>
              <Input
                id="sec-title"
                value={editingSection?.title || ""}
                onChange={(e) => setEditingSection((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Our Blog, or Useful Handyman Guides"
                className="text-base"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sec-subtitle" className="text-xs uppercase tracking-wider font-bold">
                Subtitle / Description
              </Label>
              <Textarea
                id="sec-subtitle"
                value={editingSection?.subtitle || ""}
                onChange={(e) => setEditingSection((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g. Expert tips and renovation advice directly from Singapore's master craftsmen."
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sec-badge" className="text-xs uppercase tracking-wider font-bold">
                Badge Tag (Optional)
              </Label>
              <Input
                id="sec-badge"
                value={editingSection?.badge || ""}
                onChange={(e) => setEditingSection((prev) => ({ ...prev, badge: e.target.value }))}
                placeholder="e.g. Articles, Tips, News"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/30">
              <div>
                <div className="text-sm font-semibold">Show on Homepage</div>
                <div className="text-xs text-muted-foreground">Make this section visible to visitors</div>
              </div>
              <Switch
                checked={editingSection?.enabled !== false}
                onCheckedChange={(v) => setEditingSection((prev) => ({ ...prev, enabled: v }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="cursor-pointer font-semibold">
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Check className="h-4 w-4 mr-1.5" />}
              {saving ? "Saving…" : "Save Section"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
