"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Filter, ArrowRight, ImageIcon, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { BeforeAfterSlider } from "./BeforeAfterSlider"
import type { Post, PostImage } from "@prisma/client"

interface Props {
  posts: (Post & { images: PostImage[] })[]
}

/**
 * Before & After section — replaces the Blog.
 *
 * Shows every published post that has at least one image. Posts with both a
 * "before" and "after" image render as an inline slider. Posts with only one
 * image (or only before/only after) render as a single photo. Clicking opens
 * the full post detail modal.
 */
export function BeforeAfterSection({ posts }: Props) {
  const [cat, setCat] = useState<string>("All")
  const { openPost } = useStore()
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  // Build categories from the post list (no fixed list — uses whatever the worker has tagged)
  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.category && set.add(p.category))
    return ["All", ...Array.from(set)]
  }, [posts])

  const filtered = useMemo(() => {
    if (cat === "All") return posts
    return posts.filter((p) => p.category === cat)
  }, [cat, posts])

  const sliderCount = filtered.filter((p) => hasBeforeAfter(p)).length
  const singleCount = filtered.length - sliderCount

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4 uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5" /> Before & After
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-balance">
          The difference is in the details.
        </h1>
        <p className="text-lg text-muted-foreground mt-4 text-pretty">
          Real jobs, real transformations. Drag the slider on any card to see the
          before-and-after. Every photo here is from actual work {s.brand} completed
          across Singapore.
        </p>
        <div className="flex gap-4 mt-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> {sliderCount} with slider
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground" /> {singleCount} single photos
          </span>
        </div>
      </motion.div>

      {/* Filter bar */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={cat === c ? "default" : "outline"}
              onClick={() => setCat(c)}
              className="rounded-full h-8"
            >
              {c}
            </Button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-1">No before/after work yet.</p>
            <p className="text-sm text-muted-foreground/80">Check back soon — new jobs are added weekly.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {filtered.map((post, i) => {
            const before = post.images.find((img) => img.kind === "before")
            const after = post.images.find((img) => img.kind === "after")
            const hasSlider = !!(before && after)
            const single = post.coverImage || post.images[0]?.url
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.4) }}
                className="cursor-pointer group"
                onClick={() => openPost(post)}
              >
                <Card className="overflow-hidden border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full">
                  {/* Image / slider */}
                  {hasSlider ? (
                    <div onClick={(e) => e.stopPropagation()} className="relative">
                      <BeforeAfterSlider
                        before={before!.url}
                        after={after!.url}
                        alt={post.title}
                      />
                      <Badge className="absolute top-3 right-3 z-30 bg-black/70 text-white border-0 backdrop-blur pointer-events-none">
                        Drag to compare
                      </Badge>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {single && (
                        <img
                          src={single}
                          alt={post.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  {/* Body */}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {post.category && (
                        <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>
                      )}
                      {post.featured && (
                        <Badge className="bg-primary/10 text-primary border-0 text-[10px]">Featured</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {new Date(post.createdAt).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {post.views} views
                      </span>
                      <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all">
                        View details
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-3xl bg-gradient-to-br from-accent to-accent/30 p-8 lg:p-12 text-center">
        <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-balance mb-3">
          Want results like these in your home?
        </h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Send us a WhatsApp message with what you need. We'll tell you if it's
          doable, how long it'll take, and roughly how much it'll cost.
        </p>
        <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-12 px-7">
          <a
            href={whatsappLink(s, `Hi ${s.workerName}, I saw your before/after work and would like a similar job done.`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventType: "whatsapp_click" }),
              }).catch(() => {})
            }
          >
            Chat on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  )
}

function hasBeforeAfter(post: Post & { images: PostImage[] }): boolean {
  return !!post.images.find((i) => i.kind === "before") && !!post.images.find((i) => i.kind === "after")
}
