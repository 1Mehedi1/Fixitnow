"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { FeaturedJobs } from "./FeaturedJobs"
import type { Post, PostImage } from "@prisma/client"

interface Props {
  posts: (Post & { images: PostImage[] })[]
}

export function PortfolioSection({ posts }: Props) {
  const [cat, setCat] = useState<string>("All")
  const { openPost } = useStore()
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const CATEGORIES = useMemo(() => {
    const list: string[] = []
    s.services.forEach((svc) => {
      if (svc.label && !list.includes(svc.label)) list.push(svc.label)
    })
    posts.forEach((p) => {
      if (p.category && !list.includes(p.category)) list.push(p.category)
    })
    return list
  }, [s.services, posts])

  const filtered = useMemo(() => {
    if (cat === "All") return posts
    return posts.filter((p) => p.category === cat)
  }, [cat, posts])

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4 uppercase tracking-wider">
          Portfolio
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-balance">
          Every job, finished.
        </h1>
        <p className="text-lg text-muted-foreground mt-4 text-pretty">
          A selection of work I've completed across Singapore. Tap any job for the full
          story, before/after photos, and what I learned on it.
        </p>
      </motion.div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        <Button
          size="sm"
          variant={cat === "All" ? "default" : "outline"}
          onClick={() => setCat("All")}
          className="rounded-full h-8 cursor-pointer"
        >
          All ({posts.length})
        </Button>
        {CATEGORIES.map((c) => {
          const count = posts.filter((p) => p.category === c).length
          return (
            <Button
              key={c}
              size="sm"
              variant={cat === c ? "default" : "outline"}
              onClick={() => setCat(c)}
              className="rounded-full h-8 cursor-pointer"
            >
              {c} {count > 0 ? `(${count})` : ""}
            </Button>
          )
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="mb-4">No jobs in this category yet.</p>
          <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white">
            <a
              href={whatsappLink(s, `Hi ${s.workerName}, I have a job in this category — can you help?`)}
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
              Ask me directly
            </a>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filtered.map((post, i) => {
            const before = post.images.find((x) => x.kind === "before")
            const after = post.images.find((x) => x.kind === "after")
            const hasBeforeAfter = Boolean(before && after)
            const cover = post.coverImage || after?.url || before?.url || post.images[0]?.url
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4) }}
                whileHover={{ y: -6 }}
                className="cursor-pointer group"
                onClick={() => openPost(post)}
              >
                <Card className="overflow-hidden border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {hasBeforeAfter && before && after ? (
                      <div className="absolute inset-0 flex">
                        <div className="relative w-1/2 h-full overflow-hidden border-r border-white/40">
                          <img
                            src={before.url}
                            alt={`${post.title} Before`}
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute bottom-2 left-2 z-10 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                            Before
                          </span>
                        </div>
                        <div className="relative w-1/2 h-full overflow-hidden">
                          <img
                            src={after.url}
                            alt={`${post.title} After`}
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute bottom-2 right-2 z-10 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                            After
                          </span>
                        </div>
                      </div>
                    ) : cover ? (
                      <img
                        src={cover}
                        alt={post.title}
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                        No image
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-1.5 z-10 flex-wrap">
                      {post.featured && (
                        <Badge className="bg-primary text-primary-foreground border-0 text-[10px]">Featured</Badge>
                      )}
                      {post.category && (
                        <Badge variant="secondary" className="bg-white/95 text-stone-900 border-0 backdrop-blur font-bold text-[10px]">
                          {post.category}
                        </Badge>
                      )}
                      {post.tags && post.tags.split(",")[0] && (
                        <Badge variant="outline" className="bg-black/60 text-white border-white/20 backdrop-blur text-[10px]">
                          {post.tags.split(",")[0].trim()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-display font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(post.createdAt).toLocaleDateString("en-SG", { month: "short", year: "numeric" })}</span>
                      <span>{post.views} views</span>
                    </div>

                    {/* Outside View WhatsApp Button */}
                    <div className="pt-3 mt-3 border-t border-border/50 flex justify-center">
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
    </div>
  )
}

export function PortfolioSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <Skeleton className="h-12 w-80 mb-4" />
      <Skeleton className="h-6 w-96 mb-10" />
      <div className="flex gap-2 mb-8">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Re-export for convenience
export { FeaturedJobs }
