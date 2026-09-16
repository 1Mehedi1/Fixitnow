"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"
import type { Post } from "@prisma/client"

interface Props {
  posts: Post[]
  title?: string
  subtitle?: string
  showAll?: boolean
  emptyMessage?: string
}

export function LatestBlog({ posts, title = "From the blog", subtitle, showAll = false, emptyMessage }: Props) {
  const { setView, openPost } = useStore()
  const display = showAll ? posts : posts.slice(0, 3)

  return (
    <section className="py-20 lg:py-24 bg-background">
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
              Writing
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
              {title}
            </h2>
            {subtitle && <p className="text-lg text-muted-foreground mt-3 text-pretty">{subtitle}</p>}
          </div>
          {!showAll && posts.length > 3 && (
            <Button variant="ghost" className="self-start sm:self-auto" onClick={() => setView("blog")}>
              All posts
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </motion.div>

        {display.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {emptyMessage || "No posts yet — check back soon."}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {display.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="cursor-pointer"
                onClick={() => openPost(post)}
              >
                <Card className="overflow-hidden border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-110"
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
                            <Clock className="h-3 w-3" /> {estimateReadTime(post.content)} min read
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-xl leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
                    )}
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
