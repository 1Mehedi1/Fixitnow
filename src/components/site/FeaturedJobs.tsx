"use client"

import { motion } from "framer-motion"
import { ArrowRight, MapPin, Eye } from "lucide-react"
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
  const cover = post.coverImage || post.images[0]?.url
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
      <Card className="overflow-hidden border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {cover ? (
            <img
              src={cover}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-3 left-3 flex gap-2">
            {post.featured && (
              <Badge className="bg-primary text-primary-foreground border-0">Featured</Badge>
            )}
            {category && (
              <Badge variant="secondary" className="bg-white/90 text-stone-900 border-0 backdrop-blur">
                {category}
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

export function FeaturedJobs({ posts, title = "Recent work", subtitle, showAll = false, emptyMessage }: Props) {
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
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-3 sm:mb-4 uppercase tracking-wider">
              Portfolio
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              {title}
            </h2>
            {subtitle && <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2 sm:mt-3 text-pretty">{subtitle}</p>}
          </div>
          {!showAll && posts.length > 6 && (
            <Button variant="ghost" className="self-start sm:self-auto" onClick={() => setView("portfolio")}>
              See all work
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
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
