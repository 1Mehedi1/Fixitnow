"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Filter, Clock, ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import type { Post } from "@prisma/client"

interface Props {
  posts: Post[]
}

export function BlogSection({ posts }: Props) {
  const [cat, setCat] = useState<string>("All")
  const { openPost } = useStore()
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.category && set.add(p.category))
    return ["All", ...Array.from(set)]
  }, [posts])

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
          Blog
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-balance">
          Notes from the toolbox.
        </h1>
        <p className="text-lg text-muted-foreground mt-4 text-pretty">
          What I've learned fixing things for Singapore homeowners — pricing guides, signs to
          watch for, and the honest truth about what's worth doing yourself.
        </p>
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

      {/* Featured post */}
      {cat === "All" && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 cursor-pointer group"
          onClick={() => openPost(filtered[0])}
        >
          <Card className="overflow-hidden border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              {filtered[0].coverImage && (
                <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
                  <img
                    src={filtered[0].coverImage}
                    alt={filtered[0].title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              <CardContent className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  {filtered[0].category && (
                    <Badge className="bg-primary/10 text-primary border-0">{filtered[0].category}</Badge>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(filtered[0].createdAt).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-balance mb-3 group-hover:text-primary transition-colors">
                  {filtered[0].title}
                </h2>
                {filtered[0].excerpt && (
                  <p className="text-muted-foreground leading-relaxed mb-5">{filtered[0].excerpt}</p>
                )}
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  Read article
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {(cat === "All" ? filtered.slice(1) : filtered).map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="cursor-pointer group"
            onClick={() => openPost(post)}
          >
            <Card className="overflow-hidden border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                {post.category && (
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0">
                    {post.category}
                  </Badge>
                )}
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{new Date(post.createdAt).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}</span>
                  {post.content && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {estimateReadTime(post.content)} min
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-display font-bold text-xl leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Newsletter-ish CTA */}
      <div className="mt-16 rounded-3xl bg-gradient-to-br from-accent to-accent/30 p-8 lg:p-12 text-center">
        <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-balance mb-3">
          Got a job these articles made you think about?
        </h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Skip the research — message me directly and I'll tell you if it's worth doing, how
          much it'll cost, and how soon I can start.
        </p>
        <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-12 px-7">
          <a
            href={whatsappLink(s, `Hi ${s.workerName}, I read your blog and want to chat.`)}
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

export function BlogSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <Skeleton className="h-12 w-80 mb-4" />
      <Skeleton className="h-6 w-96 mb-10" />
      <Skeleton className="aspect-[16/10] w-full rounded-2xl mb-10" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[16/9] w-full rounded-xl" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

function estimateReadTime(content: string): number {
  return Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200))
}
