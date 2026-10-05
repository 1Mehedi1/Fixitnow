"use client"

import { useState, useEffect } from "react"
import { Loader2, Save, Trash2, Star, Eye, EyeOff, X, Layers, Check } from "lucide-react"
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
  type: "portfolio" | "showcase"
  category: string
  tags: string
  featured: boolean
  published: boolean
  coverImage: string
  images: UploadedImage[]
}

export function PostEditor() {
  const { editingPostId, editorOpen, closeEditor, upsertCustomPost, deleteCustomPost } = useStore()
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
  const [isCustomCat, setIsCustomCat] = useState(false)

  const currentService = settings.services.find(
    (s) => s.label.toLowerCase() === form.category.toLowerCase()
  )
  const currentSubcats = currentService?.subcategories && currentService.subcategories.length > 0
    ? currentService.subcategories
    : (currentService?.rates || []).map((r) => r.name)

  useEffect(() => {
    if (!editorOpen) return
    if (editingPostId === "new" || !editingPostId) {
      setForm(EMPTY)
      return
    }

    // Check store first for instant zero-lag hydration and preserve local edits
    const localPost = useStore.getState().customPosts?.find((p) => p.id === editingPostId)
    if (localPost) {
      setForm({
        title: localPost.title || "",
        excerpt: localPost.excerpt || "",
        content: localPost.content || "",
        type: (localPost.type as any) || "portfolio",
        category: localPost.category || CATEGORIES[0] || "General",
        tags: localPost.tags || "",
        featured: Boolean(localPost.featured),
        published: localPost.published !== false,
        coverImage: localPost.coverImage || "",
        images: Array.isArray(localPost.images)
          ? localPost.images.map((i: any) => ({
              url: typeof i === "string" ? i : i.url,
              kind: (typeof i === "object" && i.kind) || "gallery",
            }))
          : [],
      })
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/posts/${editingPostId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.post) {
          const p = d.post as Post & { images: PostImage[] }
          setForm({
            title: p.title || "",
            excerpt: p.excerpt || "",
            content: p.content || "",
            type: (p.type as any) || "portfolio",
            category: p.category || CATEGORIES[0] || "General",
            tags: p.tags || "",
            featured: Boolean(p.featured),
            published: p.published !== false,
            coverImage: p.coverImage || "",
            images: Array.isArray(p.images)
              ? p.images
                  .sort((a, b) => a.position - b.position)
                  .map((i) => ({ url: i.url, kind: i.kind as UploadedImage["kind"] }))
              : [],
          })
        }
      })
      .catch(() => {
        toast.error("Could not load post details")
      })
      .finally(() => setLoading(false))
  }, [editorOpen, editingPostId])

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }
    setSaving(true)
    try {
      const computedCover =
        form.images.length > 0
          ? (form.images.find((img) => img.kind === "after")?.url || form.images[0]?.url || "")
          : (form.coverImage || "")

      const payload = {
        ...form,
        coverImage: computedCover,
      }
      const isNew = editingPostId === "new" || !editingPostId
      const postId = isNew ? `post_${Date.now()}` : editingPostId
      const url = isNew ? "/api/posts" : `/api/posts/${editingPostId}`
      const method = isNew ? "POST" : "PUT"

      const savedPost = {
        ...payload,
        id: postId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: form.images.map((img, i) => ({
          id: `img_${postId}_${i}`,
          postId: postId,
          url: img.url,
          kind: img.kind,
          position: i,
        })),
      }

      // Send to server first and await persistence confirmation
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || "Server failed to save post")
      }

      const finalPost = data.post || savedPost
      upsertCustomPost(finalPost)

      toast.success(isNew ? "Post created! It is live on all devices." : "Post saved! Updates are live on all devices.")
      closeEditor()
    } catch (e: any) {
      toast.error("Save failed", { description: e.message })
    } finally {
      setSaving(false)
    }
  }

  const del = async () => {
    if (!editingPostId || editingPostId === "new") return
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return
    setSaving(true)
    try {
      const res = await fetch(`/api/posts/${editingPostId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      deleteCustomPost(editingPostId)
      toast.success("Post deleted")
      closeEditor()
    } catch {
      toast.error("Delete failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={editorOpen} onOpenChange={(o) => !o && closeEditor()}>
      <DialogContent className="dark max-w-4xl w-[95vw] h-[92vh] max-h-[92vh] p-0 gap-0 flex flex-col bg-slate-900 border-slate-800 text-slate-100 rounded-2xl overflow-hidden shadow-2xl [&_.text-muted-foreground]:text-slate-300 [&_label]:text-slate-200">
        {/* Fixed Header with Top Save Button */}
        <DialogHeader className="px-6 py-3.5 border-b border-slate-800 flex-row items-center justify-between space-y-0 bg-slate-950/80 shrink-0">
          <div>
            <DialogTitle className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              {editingPostId === "new" || !editingPostId ? "Create New Post" : "Edit Post"}
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Updates apply live to the website immediately upon saving
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Top Primary Save Button */}
            <Button
              onClick={save}
              disabled={saving || loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 px-4 shadow-sm cursor-pointer"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
              {saving ? "Saving…" : "Save Changes"}
            </Button>

            {editingPostId && editingPostId !== "new" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={del}
                disabled={saving}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 h-9 w-9 p-0 cursor-pointer"
                title="Delete Post"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={closeEditor}
              className="h-9 w-9 p-0 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Form Body in ScrollArea */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading ? (
            <div className="py-24 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading post…
            </div>
          ) : (
            <div className="space-y-5 max-w-3xl mx-auto">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="post-title" className="text-xs uppercase tracking-wider font-bold text-slate-300">
                  Post Title *
                </Label>
                <Input
                  id="post-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Master Toilet Re-piping in Bedok"
                  className="text-base bg-slate-950/60 border-slate-700 text-white"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wider font-bold text-slate-200">
                    Trade Category *
                  </Label>
                  <span className="text-[11px] text-slate-400">
                    Determines showcase & portfolio tab filtering
                  </span>
                </div>
                <Select
                  value={isCustomCat ? "__custom__" : form.category}
                  onValueChange={(v) => {
                    if (v === "__custom__") {
                      setIsCustomCat(true)
                    } else {
                      setIsCustomCat(false)
                      setForm({ ...form, category: v })
                    }
                  }}
                >
                  <SelectTrigger className="bg-slate-950/60 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom__" className="text-amber-400 font-semibold">
                      + Enter Custom Category…
                    </SelectItem>
                  </SelectContent>
                </Select>

                {isCustomCat && (
                  <Input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Type new trade category name..."
                    className="mt-2 text-sm bg-slate-950/80 border-amber-500/50 text-white"
                    autoFocus
                  />
                )}
              </div>

              {/* Subcategories & Tags */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-tags" className="text-xs uppercase tracking-wider font-bold text-slate-200">
                    Subcategories & Tags
                  </Label>
                  <span className="text-[11px] text-slate-400">
                    Tap a subcategory chip to tag this job
                  </span>
                </div>

                {currentSubcats.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-1.5 p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                    {currentSubcats.map((sc) => {
                      const tagsArray = form.tags.split(",").map((t) => t.trim().toLowerCase())
                      const isSelected = tagsArray.includes(sc.toLowerCase())
                      return (
                        <button
                          type="button"
                          key={sc}
                          onClick={() => {
                            if (isSelected) {
                              const remaining = form.tags
                                .split(",")
                                .map((t) => t.trim())
                                .filter((t) => t.toLowerCase() !== sc.toLowerCase())
                              setForm({ ...form, tags: remaining.join(", ") })
                            } else {
                              const existing = form.tags
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                              setForm({ ...form, tags: [sc, ...existing].join(", ") })
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-xs"
                              : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {sc}
                        </button>
                      )
                    })}
                  </div>
                )}

                <Input
                  id="post-tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g. Water proofing, Roof leaking repair, Pasir Ris"
                  className="bg-slate-950/60 border-slate-700 text-white"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <Label htmlFor="post-excerpt" className="text-xs uppercase tracking-wider font-bold text-slate-300">
                  Short Excerpt / Summary
                </Label>
                <Textarea
                  id="post-excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="A one or two line summary of the repair or renovation work..."
                  rows={2}
                  className="bg-slate-950/60 border-slate-700 text-white"
                />
              </div>

              {/* Content Markdown */}
              <div className="space-y-1.5">
                <Label htmlFor="post-content" className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center justify-between">
                  <span>Detailed Story (Markdown supported)</span>
                  <span className="text-slate-400 font-normal text-[11px]">
                    Use ## for subheadings, - for bullet points
                  </span>
                </Label>
                <Textarea
                  id="post-content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder={"## The Issue\n\nClient reported a stubborn water leak...\n\n## Solution\n\n- Replaced corroded piping\n- Pressure tested fittings"}
                  rows={8}
                  className="font-mono text-sm bg-slate-950/60 border-slate-700 text-white"
                />
              </div>

              {/* Photos & Images with Multi-Tier Upload */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">
                    Project Photos & Before/After
                  </Label>
                  <span className="text-[11px] text-slate-400">
                    Upload "Before" & "After" photos to enable the interactive slider!
                  </span>
                </div>
                <ImageUploader
                  images={form.images}
                  onChange={(imgs) => setForm({ ...form, images: imgs })}
                />
              </div>


              {/* Toggles */}
              <div className="flex flex-wrap gap-8 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.featured}
                    onCheckedChange={(v) => setForm({ ...form, featured: v })}
                  />
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-1.5 text-white">
                      <Star className={`h-4 w-4 ${form.featured ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                      Featured Card
                    </div>
                    <div className="text-xs text-slate-400">Highlight prominently in Selected Work</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.published}
                    onCheckedChange={(v) => setForm({ ...form, published: v })}
                  />
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-1.5 text-white">
                      {form.published ? <Eye className="h-4 w-4 text-emerald-400" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
                      Published Status
                    </div>
                    <div className="text-xs text-slate-400">Visible on public live website</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Responsive Sticky Footer — Always fully visible and clickable on all screens */}
        <div className="border-t border-slate-800 px-4 sm:px-6 py-3 bg-slate-950/95 shrink-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-2 overflow-hidden">
            {form.featured && <Badge className="bg-amber-500/20 text-amber-400 border-0 text-xs shrink-0">Featured</Badge>}
            {form.published ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs shrink-0">Published</Badge>
            ) : (
              <Badge variant="outline" className="text-slate-400 text-xs shrink-0">Draft</Badge>
            )}
            <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-xs truncate max-w-[140px]">{form.category}</Badge>
          </div>

          <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto ml-auto shrink-0">
            <Button
              variant="ghost"
              onClick={closeEditor}
              className="text-slate-400 hover:text-white cursor-pointer px-4 h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={saving || loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 shadow-lg shadow-emerald-950/50 cursor-pointer shrink-0 min-w-[130px]"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
