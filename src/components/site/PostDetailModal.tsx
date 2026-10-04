"use client"

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MapPin, Calendar, X, Phone, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { useStore } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { BeforeAfterSlider } from "./BeforeAfterSlider"
import type { Post, PostImage } from "@prisma/client"

interface DetailedPost extends Post {
  images: PostImage[]
}

export function PostDetailModal() {
  const { detailOpen, selectedPost, closePost } = useStore()
  const [full, setFull] = useState<DetailedPost | null>(null)
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  useEffect(() => {
    if (!detailOpen || !selectedPost) {
      setFull(null)
      return
    }

    // Instantly hydrate modal with the active clicked post data (100% synchronized with card)
    const initialDetailed: DetailedPost = {
      ...(selectedPost as Post),
      images: ((selectedPost as any).images as PostImage[]) || [],
    }
    setFull(initialDetailed)

    // Track view count in analytics without overwriting active edited post data
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "post_view", postId: selectedPost.id }),
    }).catch(() => {})
  }, [detailOpen, selectedPost])

  if (!full) return null

  const before = full?.images?.find((i) => i.kind === "before")
  const after = full?.images?.find((i) => i.kind === "after")
  const gallery = full?.images?.filter((i) => i.kind === "gallery") || []
  const hasSlider = Boolean(before && after)
  const cover = full?.coverImage || full?.images?.[0]?.url

  const waQuoteText = full
    ? `Hi, I saw your work "${full.title}" on Fixitnow. Can I get a quote for a similar job at my place?`
    : `Hi, I would like to get an instant quote for a repair or renovation job.`

  return (
    <Dialog open={detailOpen} onOpenChange={(o) => !o && closePost()}>
      <DialogContent
        showCloseButton={false}
        className="w-[94vw] max-w-[94vw] sm:max-w-xl md:max-w-2xl max-h-[90vh] p-2.5 sm:p-5 overflow-hidden gap-0 rounded-3xl border border-border/80 bg-background/98 shadow-2xl"
      >
        <DialogTitle className="sr-only">{full.title || "Project Details"}</DialogTitle>
        <DialogDescription className="sr-only">Detailed case study view</DialogDescription>

        {/* Native hardware-accelerated touch scroll for 60fps mobile smoothness */}
        <div className="overflow-y-auto overscroll-contain max-h-[85vh] [-webkit-overflow-scrolling:touch] pr-1">
          <div className="rounded-2xl border-2 border-border/70 bg-card/95 p-4 sm:p-6 space-y-5 shadow-sm">
            {/* Top Bar with Title & Close Button */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex gap-2 items-center flex-wrap">
                  {full.featured && (
                    <Badge className="bg-amber-500/20 text-amber-500 dark:text-amber-400 font-bold border border-amber-500/30 text-[11px]">
                      ⭐ Featured Work
                    </Badge>
                  )}
                  {full.category && (
                    <Badge variant="secondary" className="text-[11px] font-semibold">
                      {full.category}
                    </Badge>
                  )}
                </div>
                <h2 className="font-display text-lg sm:text-xl md:text-2xl font-black text-foreground leading-snug break-words">
                  {full.title}
                </h2>
              </div>

              {/* Close Button */}
              <button
                onClick={closePost}
                className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-colors shrink-0 cursor-pointer border border-border/60"
                aria-label="Close modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Cover Area — Automatically Before/After slider if both exist, otherwise single photo alone */}
            {hasSlider && before && after ? (
              <div className="space-y-1.5">
                <div className="w-full rounded-xl overflow-hidden shadow-md border border-border/70 relative">
                  <BeforeAfterSlider before={before.url} after={after.url} alt={full.title} />
                </div>
                <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1">
                  <span className="font-semibold text-primary">◀ Before / After Transformation ▶</span>
                  <span>Drag slider to compare</span>
                </div>
              </div>
            ) : cover ? (
              <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden relative shadow-md border border-border/60 bg-muted">
                <img
                  src={cover}
                  alt={full.title}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            {/* Meta Details Strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground py-2 border-y border-border/50">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {new Date(full.createdAt).toLocaleDateString("en-SG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                {s.location || "Singapore · Islandwide"}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Eye className="h-3.5 w-3.5 text-blue-500" />
                {(full.views || 0) + 1} views
              </span>
            </div>

            {/* Excerpt / Summary */}
            {full.excerpt && (
              <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed bg-muted/40 p-3.5 rounded-xl border border-border/40">
                {full.excerpt}
              </p>
            )}

            {/* Detailed Story Markdown */}
            {full.content && (
              <div className="prose prose-stone dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed py-1 break-words">
                <ReactMarkdown>{full.content}</ReactMarkdown>
              </div>
            )}

            {/* Additional Gallery images */}
            {gallery.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <h3 className="font-display font-bold text-sm sm:text-base text-foreground">Project Photos</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {gallery.map((img) => (
                    <div key={img.id} className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border/40 shadow-xs">
                      <img src={img.url} alt={full.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Short Compact Card-Sized WhatsApp & Direct Call Quote CTA */}
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10 border-2 border-emerald-500/30 p-3.5 sm:p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Instant Quote · 0% Middleman Markup
                </span>
              </div>
              <p className="text-xs text-foreground/80 leading-snug">
                Send photo on WhatsApp to get an immediate, transparent estimate.
              </p>

              <div className="flex flex-wrap gap-2 pt-0.5">
                <Button
                  asChild
                  size="sm"
                  className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs h-9 px-4 shadow-sm transition-all hover:scale-[1.02] cursor-pointer flex-1 sm:flex-initial"
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
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    WhatsApp for Quote
                  </a>
                </Button>

                {s.phone && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9 px-3.5 text-xs font-semibold hover:border-emerald-500/50 cursor-pointer"
                  >
                    <a
                      href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}
                      onClick={() => {
                        fetch("/api/analytics", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ eventType: "phone_call", postId: full.id }),
                        }).catch(() => {})
                      }}
                    >
                      <Phone className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                      Direct Call
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
