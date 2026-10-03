"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Clock, MapPin, Calendar, X, Phone, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { useStore } from "@/store/useStore"
import { whatsappLink, whatsappForPost, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { BeforeAfterSlider } from "./BeforeAfterSlider"
import type { Post, PostImage } from "@prisma/client"

interface DetailedPost extends Post {
  images: PostImage[]
}

export function PostDetailModal() {
  const { detailOpen, selectedPost, closePost } = useStore()
  const [full, setFull] = useState<DetailedPost | null>(null)
  const [loading, setLoading] = useState(false)
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  useEffect(() => {
    if (!detailOpen || !selectedPost) {
      setFull(null)
      return
    }

    // Instantly hydrate modal with available post data (0ms delay)
    const initialDetailed: DetailedPost = {
      ...(selectedPost as Post),
      images: ((selectedPost as any).images as PostImage[]) || [],
    }
    setFull(initialDetailed)

    // Background fetch to update view count and fetch full details
    setLoading(false)
    fetch(`/api/posts/${selectedPost.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.post) {
          setFull(d.post)
          fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventType: "post_view", postId: selectedPost.id }),
          }).catch(() => {})
        }
      })
      .catch(() => {})
  }, [detailOpen, selectedPost])

  if (!full && !loading) return null

  const before = full?.images?.find((i) => i.kind === "before")
  const after = full?.images?.find((i) => i.kind === "after")
  const gallery = full?.images?.filter((i) => i.kind === "gallery") || []
  const hasSlider = Boolean(before && after)
  const cover = full?.coverImage || full?.images?.[0]?.url

  const waQuoteText = full
    ? `Hi ${s.workerName}, I saw your work "${full.title}" on Fixitnow. Can I get a quote for a similar job at my place?`
    : `Hi ${s.workerName}, I'd like to get a quote.`

  return (
    <Dialog open={detailOpen} onOpenChange={(o) => !o && closePost()}>
      <DialogContent showCloseButton={false} className="w-[95vw] max-w-[95vw] sm:max-w-3xl md:max-w-4xl max-h-[92vh] p-0 overflow-hidden gap-0 rounded-2xl border-border/80 shadow-2xl">
        <DialogTitle className="sr-only">{full?.title || "Project Details"}</DialogTitle>
        <ScrollArea className="h-[92vh] overflow-x-hidden scroll-area-thin">
          {full && (
            <article className="pb-8 max-w-full overflow-x-hidden">
              {/* Hero image header */}
              {cover && (
                <div className="relative aspect-[16/9] max-h-[420px] bg-muted overflow-hidden">
                  <img src={cover} alt={full.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                  <button
                    onClick={closePost}
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors z-20 cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white z-10">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {full.featured && (
                        <Badge className="bg-amber-500 text-stone-950 font-bold border-0 text-xs">
                          ⭐ Featured Work
                        </Badge>
                      )}
                      {full.category && (
                        <Badge variant="secondary" className="bg-white/95 text-stone-900 font-semibold border-0 text-xs">
                          {full.category}
                        </Badge>
                      )}
                    </div>
                    <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white text-balance drop-shadow-md">
                      {full.title}
                    </h1>
                  </div>
                </div>
              )}

              <div className="p-5 sm:p-7 space-y-6 max-w-full overflow-x-hidden">
                {/* Meta strip */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground pb-2 border-b border-border/50">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    {new Date(full.createdAt).toLocaleDateString("en-SG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    {s.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye className="h-4 w-4 text-blue-500" />
                    {(full.views || 0) + 1} views
                  </span>
                </div>

                {/* Excerpt */}
                {full.excerpt && (
                  <p className="text-sm sm:text-base text-foreground/90 font-medium leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/40">
                    {full.excerpt}
                  </p>
                )}

                {/* Before/After slider if available */}
                {hasSlider && before && after && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-base sm:text-lg text-foreground">Before & After Transformation</h3>
                      <span className="text-xs text-muted-foreground">Drag slider to compare</span>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-border/70 shadow-md">
                      <BeforeAfterSlider before={before.url} after={after.url} alt={full.title} />
                    </div>
                  </div>
                )}

                {/* Body content */}
                {full.content && (
                  <div className="prose prose-stone dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed py-2 break-words">
                    <ReactMarkdown>{full.content}</ReactMarkdown>
                  </div>
                )}

                {/* Gallery images */}
                {gallery.length > 0 && !hasSlider && (
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-base sm:text-lg text-foreground">Project Photos</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {gallery.map((img) => (
                        <div key={img.id} className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border/40 shadow-sm">
                          <img src={img.url} alt={full.title} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-5" />

                {/* Compact, Short Card Sized Direct WhatsApp & Call Action Card */}
                <div className="rounded-2xl bg-gradient-to-br from-emerald-950/20 via-background to-emerald-900/10 border-2 border-emerald-500/30 p-4 sm:p-5 space-y-3.5 shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Direct Handyman Quote · Transparent Pricing
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-foreground">
                      Need a similar repair or renovation?
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Send a photo of your job directly on WhatsApp. Get an honest, transparent itemized estimate.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                    <Button
                      asChild
                      size="default"
                      className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold h-11 px-5 shadow-sm transition-all cursor-pointer flex-1 justify-center"
                    >
                      <a
                        href={whatsappLink(s, waQuoteText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          fetch("/api/analytics", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ eventType: "whatsapp_click", postId: full.id }),
                          }).catch(() => {})
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                        WhatsApp for Quote
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="default"
                      className="h-11 px-4 border-emerald-500/40 hover:bg-emerald-500/10 text-foreground font-semibold sm:w-auto justify-center"
                    >
                      <a href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}>
                        <Phone className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        Direct Call
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
