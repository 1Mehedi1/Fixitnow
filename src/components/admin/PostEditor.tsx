"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Save, Trash2, Star, Eye, EyeOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useStore } from "@/store/useStore"
import { useSiteSettings } from "@/components/site-settings-context"
import { defaultSiteConfig } from "@/lib/site"
import { ImageUploader, type UploadedImage } from "./ImageUploader"
import type { Post, PostImage } from "@prisma/client"

interface FormState {
  title: string
  excerpt: string
  content: string
  type: "portfolio" | "blog"
  category: string
  tags: string
  featured: boolean
  published: boolean
  coverImage: string
  images: UploadedImage[]
}

export function PostEditor() {
  const { editingPostId, editorOpen, closeEditor } = useStore()
  const settings = useSiteSettings() ?? defaultSiteConfig
  const CATEGORIES = settings.services.map((s) => s.label)

  const EMPTY: FormState = {
    title: "",
    excerpt: "",
    content: "",
    type: "portfolio",
    category: CATEGORIES[0] || "General",
    tags: "",
    featured: false,
    published: true,
    coverImage: "",
    images: [],
  }
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editorOpen) return
    if (editingPostId === "new" || !editingPostId) {
      setForm(EMPTY)
      return
    }
    setLoading(true)
    fetch(`/api/posts/${editingPostId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.post) {
          const p = d.post as Post & { images: PostImage[] }
          setForm({
            title: p.title,
            excerpt: p.excerpt || "",
            content: p.content || "",
            type: (p.type as "portfolio" | "blog") || "portfolio",
            category: p.category || CATEGORIES[0],
            tags: p.tags || "",
            featured: p.featured,
            published: p.published,
            coverImage: p.coverImage || "",
            images: p.images
              .sort((a, b) => a.position - b.position)
              .map((i) => ({ url: i.url, kind: i.kind as UploadedImage["kind"] })),
          })
        }
      })
      .finally(() => setLoading(false))
  }, [editorOpen, editingPostId])

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title required")
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        // First image is also the cover if not set explicitly
        coverImage: form.coverImage || form.images[0]?.url || null,
      }
      const url = editingPostId === "new" || !editingPostId
        ? "/api/posts"
        : `/api/posts/${editingPostId}`
      const method = editingPostId === "new" || !editingPostId ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Save failed")
      const { post } = await res.json()
      toast.success(editingPostId === "new" || !editingPostId ? "Post created" : "Post updated")
      // Reload page so the new post appears in lists
      window.location.reload()
    } catch (e: any) {
      toast.error("Save failed", { description: e.message })
    } finally {
      setSaving(false)
    }
  }

  const del = async () => {
    if (!editingPostId || editingPostId === "new") return
    if (!confirm("Delete this post? This cannot be undone.")) return
    setSaving(true)
    try {
      await fetch(`/api/posts/${editingPostId}`, { method: "DELETE" })
      toast.success("Post deleted")
      window.location.reload()
    } catch {
      toast.error("Delete failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={editorOpen} onOpenChange={(o) => !o && closeEditor()}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="font-display text-xl">
              {editingPostId === "new" || !editingPostId ? "New post" : "Edit post"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {form.type === "portfolio" ? "Portfolio Job" : "Blog Post"} · saved automatically on submit
            </p>
          </div>
          <div className="flex gap-2">
            {editingPostId && editingPostId !== "new" && (
              <Button variant="ghost" size="sm" onClick={del} disabled={saving} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={closeEditor}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(95vh-64px)] scroll-area-thin">
          {loading ? (
            <div className="py-24 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading post…
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs uppercase tracking-wider">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. HDB Toilet Re-piping in Bedok"
                  className="text-base"
                />
              </div>

              {/* Type + category */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portfolio">Portfolio Job</SelectItem>
                      <SelectItem value="blog">Blog Post</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tags" className="text-xs uppercase tracking-wider">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="HDB, Toilet, Leak"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <Label htmlFor="excerpt" className="text-xs uppercase tracking-wider">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="One-line summary shown on cards. Optional."
                  rows={2}
                />
              </div>

              {/* Content (Markdown) */}
              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Content (Markdown)</span>
                  <span className="text-muted-foreground normal-case tracking-normal text-[11px]">
                    Supports # ## ### · **bold** · lists · quotes
                  </span>
                </Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder={"## The Job\n\nDescribe what the client needed...\n\n## What We Did\n\n- Bullet 1\n- Bullet 2"}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              {/* Images */}
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Images</Label>
                <ImageUploader
                  images={form.images}
                  onChange={(imgs) => setForm({ ...form, images: imgs })}
                />
              </div>

              {/* Cover image override */}
              <div className="space-y-1.5">
                <Label htmlFor="cover" className="text-xs uppercase tracking-wider">Cover image URL (optional override)</Label>
                <Input
                  id="cover"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="Leave blank to use first uploaded image"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2 border-t border-border">
                <div className="flex items-center gap-3">
                  <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                  <div>
                    <div className="text-sm font-medium flex items-center gap-1.5">
                      <Star className={`h-3.5 w-3.5 ${form.featured ? "fill-primary text-primary" : ""}`} />
                      Featured
                    </div>
                    <div className="text-xs text-muted-foreground">Show on homepage</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
                  <div>
                    <div className="text-sm font-medium flex items-center gap-1.5">
                      {form.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      Published
                    </div>
                    <div className="text-xs text-muted-foreground">Visible to public</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer actions */}
        <div className="border-t border-border p-4 flex items-center justify-between gap-2 bg-card">
          <div className="flex flex-wrap gap-1.5">
            {form.featured && <Badge className="bg-primary/10 text-primary border-0">Featured</Badge>}
            {form.published ? (
              <Badge variant="secondary">Published</Badge>
            ) : (
              <Badge variant="outline">Draft</Badge>
            )}
            <Badge variant="outline">{form.type}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={closeEditor}>Cancel</Button>
            <Button onClick={save} disabled={saving || loading}>
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
