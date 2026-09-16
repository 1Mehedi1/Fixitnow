"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/store/useStore"
import { siteConfig, whatsappLink } from "@/lib/site"
import { FeaturedJobs } from "./FeaturedJobs"
import type { Post, PostImage } from "@prisma/client"

interface Props {
  posts: (Post & { images: PostImage[] })[]
}

const CATEGORIES = siteConfig.services.map((s) => s.label)

export function PortfolioSection({ posts }: Props) {
  const [cat, setCat] = useState<string>("All")
  const { openPost } = useStore()

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
          className="rounded-full h-8"
        >
          All ({posts.length})
        </Button>
        {CATEGORIES.map((c) => {
          const count = posts.filter((p) => p.category === c).length
          if (count === 0) return null
          return (
            <Button
              key={c}
              size="sm"
              variant={cat === c ? "default" : "outline"}
              onClick={() => setCat(c)}
              className="rounded-full h-8"
            >
              {c} ({count})
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
              href={whatsappLink(`Hi ${siteConfig.name}, I have a job in this category — can you help?`)}
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
            const cover = post.coverImage || post.images[0]?.url
            const hasBeforeAfter = post.images.some((x) => x.kind === "before") && post.images.some((x) => x.kind === "after")
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
                    {cover && (
                      <img
                        src={cover}
                        alt={post.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {post.featured && (
                        <Badge className="bg-primary text-primary-foreground border-0">Featured</Badge>
                      )}
                      {post.category && (
                        <Badge variant="secondary" className="bg-white/90 text-stone-900 border-0 backdrop-blur">
                          {post.category}
                        </Badge>
                      )}
                    </div>
                    {hasBeforeAfter && (
                      <Badge className="absolute top-3 right-3 bg-black/70 text-white border-0 backdrop-blur">
                        Before / After
                      </Badge>
                    )}
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
