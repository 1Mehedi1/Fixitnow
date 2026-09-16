"use client"

import { motion } from "framer-motion"
import { ArrowRight, MapPin, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"
import { siteConfig, whatsappLink } from "@/lib/site"
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
              {siteConfig.location}
            </span>
            <span>{new Date(post.createdAt).toLocaleDateString("en-SG", { month: "short", year: "numeric" })}</span>
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
    <section className="py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4 uppercase tracking-wider">
              Portfolio
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
              {title}
            </h2>
            {subtitle && <p className="text-lg text-muted-foreground mt-3 text-pretty">{subtitle}</p>}
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
