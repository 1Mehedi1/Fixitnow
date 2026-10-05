"use client"

import { motion } from "framer-motion"
import { ArrowRight, MapPin, Eye, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import type { Post, PostImage } from "@prisma/client"

interface Props {
  posts: (Post & { images: PostImage[] })[]
  title?: string
  subtitle?: string
  showAll?: boolean
  emptyMessage?: string
}

function PostCard({ post, index }: { post: (Post & { images: PostImage[] }); index: number }) {
  const { openPost } = useStore()
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const before = post.images.find((x) => x.kind === "before")
  const after = post.images.find((x) => x.kind === "after")
  const hasBeforeAfter = Boolean(before && after)
  const cover = post.coverImage || after?.url || before?.url || post.images[0]?.url
  const category = post.category || post.type
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -8 }}
      className="cursor-pointer group"
      onClick={() => openPost(post)}
    >
      <Card className="overflow-hidden p-0 py-0 gap-0 border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted rounded-t-xl shrink-0">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="absolute top-3 left-3 flex gap-1.5 z-10 flex-wrap">
            {post.featured && (
              <Badge className="bg-primary text-primary-foreground border-0 text-[10px]">Featured</Badge>
            )}
            {category && (
              <Badge variant="secondary" className="bg-white/95 text-stone-900 border-0 backdrop-blur font-bold text-[10px]">
                {category}
              </Badge>
            )}
            {post.tags && post.tags.split(",")[0] && (
              <Badge variant="outline" className="bg-black/60 text-white border-white/20 backdrop-blur text-[10px]">
                {post.tags.split(",")[0].trim()}
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs text-white bg-black/50 backdrop-blur px-2.5 py-1 rounded-full">
            <Eye className="h-3 w-3" /> View
          </div>
        </div>

        <CardContent className="p-5">
          <h3 className="font-display font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {s.location}
            </span>
            <span>{new Date(post.createdAt).toLocaleDateString("en-SG", { month: "short", year: "numeric" })}</span>
          </div>

          {/* Outside Home View WhatsApp Button at bottom middle */}
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
}

export function FeaturedJobs({ posts, title = "Portfolio Selected work", subtitle, showAll = false, emptyMessage }: Props) {
  const { setView } = useStore()
  const display = showAll ? posts : posts.slice(0, 6)

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                Portfolio
              </div>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                Portfolio Selected work
              </h2>
            </div>
            {!showAll && posts.length > 6 && (
              <Button variant="ghost" className="self-start sm:self-auto hover:bg-primary/10" onClick={() => setView("portfolio")}>
                See all work
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Highlighted responsive subtitle card with cool hover effect in one straight line */}
          <div className="w-full">
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 dark:border-emerald-400/30 bg-gradient-to-r from-emerald-500/10 via-card to-emerald-500/5 dark:from-[#0d281a]/70 dark:via-[#112318]/60 dark:to-[#0b1f13]/70 p-3.5 sm:p-4.5 px-4 sm:px-6 shadow-xs hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-foreground/90 dark:text-emerald-100 tracking-tight leading-relaxed group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  Recent roofing & waterproofing, painting services, and plumbing jobs completed across Singapore. Tap any card for the full story.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-emerald-500 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden md:block" />
            </div>
          </div>
        </motion.div>

        {display.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {emptyMessage || "No jobs yet — check back soon."}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {display.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
