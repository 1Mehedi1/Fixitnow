"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Clock, MapPin, Calendar, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFull(null)
      return
    }
    setLoading(true)
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
      .finally(() => setLoading(false))
  }, [detailOpen, selectedPost])

  const before = full?.images.find((i) => i.kind === "before")
  const after = full?.images.find((i) => i.kind === "after")
  const gallery = full?.images.filter((i) => i.kind === "gallery") || []
  const hasSlider = before && after
  const cover = full?.coverImage || full?.images[0]?.url

  return (
    <Dialog open={detailOpen} onOpenChange={(o) => !o && closePost()}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">{full?.title || "Post"}</DialogTitle>
        <ScrollArea className="h-[92vh] scroll-area-thin">
          {loading && (
            <div className="py-24 text-center text-muted-foreground">Loading…</div>
          )}

          {!loading && full && (
            <article>
              {/* Hero image */}
              {cover && (
                <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                  <img src={cover} alt={full.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />
                  <button
                    onClick={closePost}
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                    <div className="flex gap-2 mb-3">
                      {full.featured && <Badge className="bg-primary text-primary-foreground border-0">Featured</Badge>}
                      {full.category && <Badge variant="secondary" className="bg-white/90 text-stone-900 border-0">{full.category}</Badge>}
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                      {full.title}
                    </h1>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8 lg:p-10 space-y-8">
                {/* Meta strip */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(full.createdAt).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {s.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    {full.views} views
                  </span>
                  {full.type === "blog" && full.content && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {estimateReadTime(full.content)} min read
                    </span>
                  )}
                </div>

                {full.excerpt && (
                  <p className="text-xl text-muted-foreground leading-relaxed font-light text-pretty">
                    {full.excerpt}
                  </p>
                )}

                {/* Before/After slider */}
                {hasSlider && (
                  <div>
                    <h3 className="font-display font-bold text-xl mb-3">Before / After</h3>
                    <BeforeAfterSlider
                      before={before.url}
                      after={after.url}
                      alt={full.title}
                    />
                  </div>
                )}

                {/* Body content */}
                {full.content && (
                  <div className="prose-content">
                    <ReactMarkdown>{full.content}</ReactMarkdown>
                  </div>
                )}

                {/* Gallery */}
                {gallery.length > 0 && !hasSlider && (
                  <div>
                    <h3 className="font-display font-bold text-xl mb-4">Gallery</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {gallery.map((img) => (
                        <div key={img.id} className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                          <img src={img.url} alt={full.title} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* WhatsApp CTA */}
                <div className="rounded-2xl bg-accent p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg mb-1">Interested in similar work?</h4>
                    <p className="text-sm text-muted-foreground">WhatsApp {s.workerName} directly. Quote within the hour.</p>
                  </div>
                  <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-12 px-6 shrink-0">
                    <a
                      href={whatsappLink(s, whatsappForPost(s, full.title, full.type as "portfolio" | "blog" | "showcase"))}
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
                      Chat on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function estimateReadTime(content: string): number {
  return Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200))
}
