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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
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
                className="cursor-pointer group h-full"
                onClick={() => openPost(post)}
              >
                <Card className="overflow-hidden border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col justify-between">
                  {/* Image / slider */}
                  {hasSlider ? (
                    <div onClick={(e) => e.stopPropagation()} className="relative">
                      <BeforeAfterSlider
                        before={before!.url}
                        after={after!.url}
                        alt={post.title}
                      />
                      <Badge className="absolute top-3 right-3 z-30 bg-black/70 text-white border-0 backdrop-blur pointer-events-none text-[10px]">
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
                  <CardContent className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {post.category && (
                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5">{post.category}</Badge>
                        )}
                        {post.featured && (
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-2 py-0.5">Featured</Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {new Date(post.createdAt).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm sm:text-base leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">{post.excerpt}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.views} views</span>
                      <span className="font-semibold text-primary flex items-center gap-1 group-hover:gap-1.5 transition-all">
                        View details
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>

                    {/* Outside View WhatsApp Button */}
                    <div className="pt-2.5 mt-2.5 border-t border-border/50 flex justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          const text = `Hi, I saw your work "${post.title}" on Fixitnow. Can I get a quote for a similar job?`
                          window.open(whatsappLink(s, text), "_blank", "noopener,noreferrer")
                          fetch("/api/analytics", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ eventType: "whatsapp_click", postId: post.id }),
                          }).catch(() => {})
                        }}
                        className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-[#25D366] text-emerald-700 dark:text-emerald-400 hover:text-white font-bold text-xs transition-all hover:scale-[1.02] border border-emerald-500/30 hover:border-[#25D366] shadow-xs cursor-pointer"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>WhatsApp for Quote</span>
                      </button>
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
