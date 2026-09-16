"use client"

import { motion } from "framer-motion"
import { Plus, Pencil, Star, Eye, EyeOff, Search, FileText, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useMemo } from "react"
import { useStore } from "@/store/useStore"
import type { Post, PostImage } from "@prisma/client"

interface Props {
  posts: (Post & { images: PostImage[] })[]
}

export function PostList({ posts }: Props) {
  const { openEditor } = useStore()
  const [tab, setTab] = useState<"all" | "portfolio" | "blog">("all")
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    return posts
      .filter((p) => (tab === "all" ? true : p.type === tab))
      .filter((p) => (q ? p.title.toLowerCase().includes(q.toLowerCase()) : true))
  }, [posts, tab, q])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Posts</h2>
          <p className="text-sm text-muted-foreground">
            {posts.length} total · {posts.filter((p) => p.published).length} published · {posts.filter((p) => p.featured).length} featured
          </p>
        </div>
        <Button onClick={() => openEditor("new")} className="self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-1.5" /> New post
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio ({posts.filter((p) => p.type === "portfolio").length})</TabsTrigger>
            <TabsTrigger value="blog">Blog ({posts.filter((p) => p.type === "blog").length})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No posts match. Try a different filter, or create one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
            >
              <Card className="hover:border-primary/40 hover:shadow-md transition-all cursor-pointer" onClick={() => openEditor(post.id)}>
                <CardContent className="p-4 flex items-center gap-4">
                  {/* Thumb */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {(post.coverImage || post.images[0]?.url) ? (
                      <img src={post.coverImage || post.images[0]?.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        {post.type === "blog" ? <FileText className="h-6 w-6 text-muted-foreground" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="text-[10px] uppercase">{post.type}</Badge>
                      {post.category && <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>}
                      {post.featured && (
                        <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                          <Star className="h-2.5 w-2.5 fill-primary mr-0.5" /> Featured
                        </Badge>
                      )}
                      {!post.published && (
                        <Badge variant="outline" className="text-[10px]">Draft</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{new Date(post.createdAt).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span>· {post.views} views</span>
                      <span>· {post.whatsappClicks} WA clicks</span>
                      <span>· {post.images.length} img</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
