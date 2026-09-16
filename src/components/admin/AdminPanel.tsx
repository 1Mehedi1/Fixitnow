"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import {
  LayoutDashboard, FileText, MessageSquare, BarChart3,
  LogOut, ExternalLink, Loader2, Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore, type AdminTab } from "@/store/useStore"
import { AdminLogin } from "./AdminLogin"
import { PostList } from "./PostList"
import { PostEditor } from "./PostEditor"
import { TestimonialManager } from "./TestimonialManager"
import { AnalyticsDashboard } from "./AnalyticsDashboard"
import type { Post, PostImage, Testimonial } from "@prisma/client"

interface Props {
  posts: (Post & { images: PostImage[] })[]
  testimonials: Testimonial[]
}

const NAV: { key: AdminTab; label: string; icon: any }[] = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "posts", label: "Posts", icon: FileText },
  { key: "testimonials", label: "Testimonials", icon: MessageSquare },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
]

export function AdminPanel({ posts, testimonials }: Props) {
  const { data: session, status } = useSession()
  const { adminTab, setAdminTab, setView, openEditor } = useStore()

  // Show login screen if unauthenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }
  if (!session) {
    return <AdminLogin />
  }

  const counts = {
    posts: posts.length,
    portfolio: posts.filter((p) => p.type === "portfolio").length,
    blog: posts.filter((p) => p.type === "blog").length,
    testimonials: testimonials.length,
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-4 sticky top-0 h-screen">
        <div className="mb-6 px-2">
          <div className="font-display font-bold text-lg">Admin Panel</div>
          <p className="text-xs text-muted-foreground">Signed in as {session.user?.email}</p>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setAdminTab(n.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                adminTab === n.key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground/80"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
              {n.key === "posts" && <Badge variant="secondary" className="ml-auto">{counts.posts}</Badge>}
              {n.key === "testimonials" && <Badge variant="secondary" className="ml-auto">{counts.testimonials}</Badge>}
            </button>
          ))}
        </nav>

        <div className="pt-4 mt-auto border-t border-border space-y-1">
          <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => setView("home")}>
            <ExternalLink className="h-4 w-4 mr-2" /> View public site
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-card border-b border-border">
        <div className="flex items-center justify-between p-3">
          <div>
            <div className="font-display font-bold text-sm">Admin Panel</div>
            <div className="text-[10px] text-muted-foreground">{session.user?.email}</div>
          </div>
          <div className="flex gap-1">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => setAdminTab(n.key)}
                className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                  adminTab === n.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
                title={n.label}
              >
                <n.icon className="h-4 w-4" />
              </button>
            ))}
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pt-20 md:pt-8">
        <motion.div
          key={adminTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {adminTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight">
                  Welcome back, {session.user?.name || "Worker"} 👋
                </h1>
                <p className="text-muted-foreground mt-1">Here's your site at a glance.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Portfolio jobs", val: counts.portfolio, color: "bg-primary/10 text-primary" },
                  { label: "Blog posts", val: counts.blog, color: "bg-blue-500/10 text-blue-500" },
                  { label: "Testimonials", val: counts.testimonials, color: "bg-green-500/10 text-green-500" },
                  { label: "Total views", val: posts.reduce((s, p) => s + p.views, 0), color: "bg-amber-500/10 text-amber-500" },
                ].map((s) => (
                  <Card key={s.label}>
                    <CardContent className="p-5">
                      <div className={`inline-flex items-center justify-center h-9 w-9 rounded-lg ${s.color} mb-3`}>
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div className="font-display text-2xl font-bold">{s.val.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick actions */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-3">Quick actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => openEditor("new")}>
                      <Plus className="h-4 w-4 mr-1.5" /> New post
                    </Button>
                    <Button variant="outline" onClick={() => setAdminTab("posts")}>
                      <FileText className="h-4 w-4 mr-1.5" /> Manage posts
                    </Button>
                    <Button variant="outline" onClick={() => setAdminTab("testimonials")}>
                      <MessageSquare className="h-4 w-4 mr-1.5" /> Manage testimonials
                    </Button>
                    <Button variant="outline" onClick={() => setAdminTab("analytics")}>
                      <BarChart3 className="h-4 w-4 mr-1.5" /> View analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent posts */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-3">Recent posts</h3>
                  <div className="space-y-2">
                    {posts.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => openEditor(p.id)}
                        className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{p.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.type} · {new Date(p.createdAt).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })} · {p.views} views
                          </div>
                        </div>
                        {p.featured && <Badge className="bg-primary/10 text-primary border-0">Featured</Badge>}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {adminTab === "posts" && <PostList posts={posts} />}
          {adminTab === "testimonials" && <TestimonialManager testimonials={testimonials} />}
          {adminTab === "analytics" && <AnalyticsDashboard />}
        </motion.div>
      </main>

      <PostEditor />
    </div>
  )
}
