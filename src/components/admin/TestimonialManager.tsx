"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus, Trash2, Star, Loader2, Edit3, Upload,
  ImageIcon, Check, X, ExternalLink, MessageSquare, Sparkles, Link as LinkIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useStore } from "@/store/useStore"
import type { Testimonial } from "@prisma/client"

interface Props {
  testimonials: Testimonial[]
}

interface FormState {
  id?: string
  name: string
  role: string
  rating: number
  content: string
  avatar: string
  published: boolean
}

const EMPTY_FORM: FormState = {
  name: "",
  role: "",
  rating: 5,
  content: "",
  avatar: "",
  published: true,
}

export function TestimonialManager({ testimonials: initialTestimonials }: Props) {
  const { customTestimonials, setCustomTestimonials, upsertCustomTestimonial, deleteCustomTestimonial } = useStore()
  const activeTestimonials = (customTestimonials && customTestimonials.length > 0)
    ? customTestimonials
    : initialTestimonials

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [processingUrl, setProcessingUrl] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [showFilePicker, setShowFilePicker] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  // Always fetch latest authoritative testimonials from server on mount
  useEffect(() => {
    fetch(`/api/testimonials?all=1&_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.testimonials)) {
          setCustomTestimonials(d.testimonials)
        }
      })
      .catch(() => {})
  }, [setCustomTestimonials])

  const openNew = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setUrlInput("")
    setShowFilePicker(false)
    setOpen(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id)
    setForm({
      id: t.id,
      name: t.name || "",
      role: t.role || "",
      rating: t.rating || 5,
      content: t.content || "",
      avatar: t.avatar || "",
      published: t.published !== false,
    })
    setUrlInput("")
    setShowFilePicker(false)
    setOpen(true)
  }

  // Handle URL paste -> Download -> WebP convert -> Permanent storage
  const handleConvertUrlToWebp = async () => {
    const raw = urlInput.trim()
    if (!raw) {
      toast.error("Please paste an image URL first")
      return
    }

    setProcessingUrl(true)
    const tId = toast.loading("Downloading & converting screenshot to WebP...")
    try {
      const res = await fetch("/api/process-image-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: raw }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to process screenshot URL")
      }

      setForm((prev) => ({
        ...prev,
        avatar: data.url,
        name: prev.name || "Homeowner (Verified Client)",
        role: prev.role || "Direct WhatsApp Chat Review",
        content: prev.content || "Client sent photo appreciation and positive review via WhatsApp.",
      }))
      setUrlInput("")

      const sizeSaved = data.originalSize && data.optimizedSize
        ? ` (${Math.round(data.optimizedSize / 1024)} KB WebP)`
        : " (Optimized WebP)"

      toast.success(`WhatsApp screenshot converted to WebP & attached!${sizeSaved}`, { id: tId })
    } catch (e: any) {
      toast.error("Screenshot processing failed", {
        description: e.message || "Please check the URL and ensure it is publicly accessible.",
        id: tId,
      })
    } finally {
      setProcessingUrl(false)
    }
  }

  // Handle proof media / WhatsApp screenshot direct file upload
  const handleProofUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    setUploadingMedia(true)
    const tId = toast.loading("Converting file to WebP & uploading...")
    try {
      const formData = new FormData()
      formData.append("file", file, file.name)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed")

      setForm((prev) => ({
        ...prev,
        avatar: data.url,
        // Auto-fill friendly WhatsApp text if content was empty
        name: prev.name || "Homeowner (Verified Client)",
        role: prev.role || "Direct WhatsApp Chat Review",
        content: prev.content || "Client sent photo appreciation and positive review via WhatsApp.",
      }))
      toast.success("WhatsApp screenshot converted to WebP & attached!", { id: tId })
    } catch (e: any) {
      toast.error("Upload failed", { description: e.message, id: tId })
    } finally {
      setUploadingMedia(false)
    }
  }

  const submit = async () => {
    if (!form.name.trim() && !form.avatar) {
      toast.error("Please provide client name or upload a WhatsApp screenshot")
      return
    }

    setSaving(true)
    try {
      let finalAvatar = form.avatar || null

      // If user typed/pasted an external URL directly without converting, auto-convert it now
      if (
        finalAvatar &&
        finalAvatar.startsWith("http") &&
        !finalAvatar.includes(".public.blob.vercel-storage.com") &&
        !finalAvatar.endsWith(".webp") &&
        !finalAvatar.includes("/uploads/")
      ) {
        try {
          const proc = await fetch("/api/process-image-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: finalAvatar }),
          }).then((r) => r.json())
          if (proc.ok && proc.url) {
            finalAvatar = proc.url
          }
        } catch {}
      }

      const payload = {
        name: form.name.trim() || "Verified WhatsApp Client",
        role: form.role.trim() || "WhatsApp Chat Review",
        rating: form.rating,
        content: form.content.trim() || "Verified client review and photo feedback received via WhatsApp.",
        avatar: finalAvatar,
        published: form.published,
      }

      const isEdit = Boolean(editingId)
      const url = isEdit ? `/api/testimonials/${editingId}` : "/api/testimonials"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || "Failed to save testimonial to server")
      }

      const savedItem = data.testimonial || {
        ...payload,
        id: editingId || `test_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }

      // Reactively update store and localStorage immediately
      upsertCustomTestimonial(savedItem)

      // Refresh from server to ensure 100% cloud sync
      fetch(`/api/testimonials?all=1&_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      })
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.testimonials)) {
            setCustomTestimonials(d.testimonials)
          }
        })
        .catch(() => {})

      toast.success(isEdit ? "Testimonial updated!" : "Testimonial added! It is live on all devices.")
      setOpen(false)
      setForm(EMPTY_FORM)
    } catch (e: any) {
      toast.error("Save failed", { description: e.message })
    } finally {
      setSaving(false)
    }
  }

  const del = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" }).catch(() => {})
      deleteCustomTestimonial(id)

      // Refresh from server
      fetch(`/api/testimonials?all=1&_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      })
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.testimonials)) {
            setCustomTestimonials(d.testimonials)
          }
        })
        .catch(() => {})

      toast.success("Testimonial deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  const togglePublish = async (t: Testimonial) => {
    const updated = { ...t, published: !t.published }
    upsertCustomTestimonial(updated)
    await fetch(`/api/testimonials/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !t.published }),
    }).catch(() => {})

    // Refresh from server
    fetch(`/api/testimonials?all=1&_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.testimonials)) {
          setCustomTestimonials(d.testimonials)
        }
      })
      .catch(() => {})

    toast.success(updated.published ? "Marked as Live" : "Marked as Hidden")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
            Testimonials & Client Proof
          </h2>
          <p className="text-sm text-slate-300 font-medium mt-1">
            {activeTestimonials.length} total · {activeTestimonials.filter((t) => t.published).length} live on site · Supports WhatsApp chat screenshots & photo proof
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-4 shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add Review / WhatsApp Proof
        </Button>
      </div>

      {activeTestimonials.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="py-16 text-center text-slate-300 font-semibold space-y-3">
            <MessageSquare className="h-10 w-10 text-slate-500 mx-auto" />
            <p>No testimonials yet.</p>
            <Button onClick={openNew} variant="outline" className="text-white border-slate-700">
              Create your first testimonial or upload WhatsApp screenshot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3.5">
          {activeTestimonials.map((t, i) => {
            const hasProof = Boolean(t.avatar && t.avatar.length > 5)
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className={t.published !== false ? "bg-slate-900/90 border-slate-700/80 shadow-xs" : "bg-slate-900/50 border-slate-800 opacity-60"}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar or Proof media thumbnail */}
                      {hasProof ? (
                        <div
                          className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 shrink-0 cursor-pointer group"
                          onClick={() => setPreviewImage(t.avatar!)}
                          title="Click to zoom proof"
                        >
                          <img
                            src={t.avatar!}
                            alt={t.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            loading="lazy"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-[8px] font-bold text-white text-center py-0.5 uppercase tracking-wider">
                            Proof
                          </span>
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-display font-black text-lg shrink-0">
                          {t.name?.charAt(0) || "C"}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-sm sm:text-base text-white">{t.name}</span>
                          {t.role && <span className="text-xs text-slate-400 font-medium">· {t.role}</span>}
                          {hasProof && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              📸 WhatsApp Proof Attached
                            </Badge>
                          )}
                          <div className="flex ml-auto sm:ml-0">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-3 w-3 ${idx < t.rating ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700"}`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
                          "{t.content}"
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                          <span>{t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-SG") : "Recently"}</span>
                          {hasProof && (
                            <button
                              onClick={() => setPreviewImage(t.avatar!)}
                              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" /> View Screenshot
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Switch
                            checked={t.published !== false}
                            onCheckedChange={() => togglePublish(t)}
                          />
                          <span className="text-[11px] font-semibold text-slate-300">
                            {t.published !== false ? "Live" : "Hidden"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(t)}
                            className="h-8 px-2.5 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 mr-1 text-primary" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => del(t.id)}
                            className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Edit / New Testimonial Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dark bg-slate-900 border-slate-800 text-slate-100 max-w-lg w-[95vw] max-h-[90vh] p-0 gap-0 flex flex-col rounded-2xl shadow-2xl overflow-hidden [&_.text-muted-foreground]:text-slate-300 [&_label]:text-slate-200">
          <DialogHeader className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              {editingId ? "Edit Testimonial" : "New Testimonial / WhatsApp Review"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Upload genuine WhatsApp screenshots or edit client review details. Updates apply live immediately.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 max-h-[calc(90vh-130px)]">
            {/* Proof Media: Paste Image URL -> Auto WebP Converter */}
            <div className="space-y-2.5 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-2 overflow-hidden">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Label className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4" /> Proof Document / WhatsApp Screenshot
                </Label>
                <span className="text-[10px] text-slate-400">
                  Google Drive, Imgur, Catbox, Cloudinary...
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Paste an image link or upload a screenshot of the client&apos;s WhatsApp chat feedback.
              </p>

              {form.avatar ? (
                <div className="flex items-center gap-3 pt-2 w-full overflow-hidden bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-emerald-500/50 bg-slate-900 shrink-0">
                    <img src={form.avatar} alt="Proof" className="h-full w-full object-cover" />
                    {(form.avatar.endsWith(".webp") || form.avatar.includes(".webp?") || form.avatar.includes("opt-")) && (
                      <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[8px] font-bold text-white text-center py-0.5 uppercase tracking-wider">
                        WebP
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 shrink-0" /> Screenshot Attached (WebP Optimized)
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium truncate font-mono text-[10px] mt-0.5">
                      {form.avatar}
                    </p>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, avatar: "" })}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold mt-1 cursor-pointer block"
                    >
                      Remove screenshot
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  {/* URL Paste Input + Convert Button */}
                  <div className="flex items-center gap-2">
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleConvertUrlToWebp()
                        }
                      }}
                      placeholder="https://drive.google.com/... or https://..."
                      disabled={processingUrl}
                      className="text-xs h-9 font-mono bg-slate-950/80 border-slate-700 text-slate-200 focus:border-emerald-500 flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleConvertUrlToWebp}
                      disabled={processingUrl || !urlInput.trim()}
                      className="h-9 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 shadow-sm cursor-pointer"
                    >
                      {processingUrl ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          <span>Converting…</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 mr-1 text-emerald-200" />
                          <span>Convert to WebP</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Automatically converts to WebP &amp; saves permanently</span>
                    <button
                      type="button"
                      onClick={() => setShowFilePicker(!showFilePicker)}
                      className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
                    >
                      {showFilePicker ? "Hide file uploader" : "Or upload local file"}
                    </button>
                  </div>

                  {/* Secondary File Upload Fallback */}
                  {showFilePicker && (
                    <div className="pt-1">
                      <label className="flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer transition-colors text-xs font-semibold text-emerald-300">
                        {uploadingMedia ? (
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                        ) : (
                          <Upload className="h-4 w-4 text-emerald-400" />
                        )}
                        <span>{uploadingMedia ? "Converting to WebP & uploading…" : "Choose WhatsApp Screenshot / Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleProofUpload(e.target.files[0])
                            e.target.value = ""
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">Client Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Mrs Tan / Mr David Lim"
                  className="bg-slate-950/60 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">Role / Location</Label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="HDB Owner · Bedok"
                  className="bg-slate-950/60 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">Star Rating</Label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm({ ...form, rating: n })}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star className={`h-6 w-6 ${n <= form.rating ? "fill-amber-400 text-amber-400" : "fill-slate-800 text-slate-700"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">Review Content / Quotes *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={3}
                placeholder="What did the client say about the craftsmanship, speed, or pricing?"
                className="bg-slate-950/60 border-slate-700 text-white text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <span className="text-xs font-semibold text-slate-200">Publish immediately to live website</span>
            </div>
          </div>

          {/* Sticky Dialog Footer — Always visible and clickable */}
          <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-950/90 shrink-0 flex items-center justify-end gap-2.5">
            <Button variant="ghost" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={saving || uploadingMedia}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 shadow-md cursor-pointer"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
              {editingId ? "Save Changes" : "Save Testimonial"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox Preview for Screenshot Proof */}
      {previewImage && (
        <Dialog open={Boolean(previewImage)} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="dark bg-slate-950 border-slate-800 max-w-2xl p-3 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Genuine WhatsApp Client Review Proof
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center cursor-pointer hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto rounded-xl mt-3 flex items-center justify-center bg-black/80 p-2">
              <img src={previewImage} alt="WhatsApp Proof" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
