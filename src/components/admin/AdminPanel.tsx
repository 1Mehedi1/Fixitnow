"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import {
  LayoutDashboard, FileText, MessageSquare, BarChart3, Settings,
  LogOut, ExternalLink, Loader2, Plus, Sun, Moon,
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
import { SettingsManager } from "./SettingsManager"
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
  { key: "settings", label: "Site Settings", icon: Settings },
]

export function AdminPanel({ posts, testimonials }: Props) {
  const { data: session, status } = useSession()
  const { adminTab, setAdminTab, setView, openEditor } = useStore()
  const [adminTheme, setAdminTheme] = useState<"dark" | "light">("dark")

  // Load dedicated admin theme (completely independent of public website)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fixitnow_admin_theme") as "dark" | "light" | null
      if (saved === "dark" || saved === "light") {
        setAdminTheme(saved)
      }
    } catch {}
  }, [])

  const toggleAdminTheme = () => {
    const next = adminTheme === "dark" ? "light" : "dark"
    setAdminTheme(next)
    try {
      localStorage.setItem("fixitnow_admin_theme", next)
    } catch {}
  }

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
    <div
      className={
        adminTheme === "dark"
          ? "dark bg-[#0b0912] text-slate-100 min-h-screen flex flex-col md:flex-row transition-colors"
          : "light bg-[#f8fafc] text-slate-900 min-h-screen flex flex-col md:flex-row transition-colors"
      }
      style={{ colorScheme: adminTheme }}
    >
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/80 dark:border-white/10 bg-card p-4 sticky top-0 h-screen shadow-sm">
        <div className="mb-6 px-2 flex items-center justify-between">
          <div>
            <div className="font-display font-black text-lg tracking-tight">Admin Console</div>
            <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">{session.user?.email}</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setAdminTab(n.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                adminTab === n.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted text-foreground/80 hover:text-foreground"
              }`}
            >
              <n.icon className="h-4 w-4 shrink-0" />
              <span>{n.label}</span>
              {n.key === "posts" && <Badge variant="secondary" className="ml-auto text-[10px]">{counts.posts}</Badge>}
              {n.key === "testimonials" && <Badge variant="secondary" className="ml-auto text-[10px]">{counts.testimonials}</Badge>}
            </button>
          ))}
        </nav>

        {/* Dedicated Admin Day/Night Toggle & Bottom Actions */}
        <div className="pt-4 mt-auto border-t border-border/70 dark:border-white/10 space-y-2">
          {/* Admin Independent Day/Night Mode Switch */}
          <button
            onClick={toggleAdminTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-muted/60 dark:bg-muted/40 hover:bg-muted border border-border/60 dark:border-white/10 text-foreground transition-all cursor-pointer"
            title="Toggle Admin Day/Night Mode (Does not affect main website)"
          >
            <span className="flex items-center gap-2">
              {adminTheme === "dark" ? (
                <Moon className="h-3.5 w-3.5 text-cyan-400" />
              ) : (
                <Sun className="h-3.5 w-3.5 text-amber-500" />
              )}
              <span>Admin Theme</span>
            </span>
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5">
              {adminTheme === "dark" ? "Night" : "Day"}
            </Badge>
          </button>

          <Button variant="ghost" className="w-full justify-start text-xs font-medium cursor-pointer" onClick={() => setView("home")}>
            <ExternalLink className="h-3.5 w-3.5 mr-2" /> View public site
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xs font-medium text-destructive hover:text-destructive cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="h-3.5 w-3.5 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-card border-b border-border/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div>
            <div className="font-display font-black text-sm">Admin Console</div>
            <div className="text-[10px] text-muted-foreground truncate max-w-[130px]">{session.user?.email}</div>
          </div>
          <div className="flex items-center gap-1">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleAdminTheme}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted border border-border/60 dark:border-white/10 text-foreground transition-colors cursor-pointer"
              title="Toggle Day/Night Mode"
            >
              {adminTheme === "dark" ? (
                <Moon className="h-3.5 w-3.5 text-cyan-400" />
              ) : (
                <Sun className="h-3.5 w-3.5 text-amber-500" />
              )}
            </button>

            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => setAdminTab(n.key)}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  adminTab === n.key ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground/80"
                }`}
                title={n.label}
              >
                <n.icon className="h-3.5 w-3.5" />
              </button>
            ))}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-3.5 w-3.5" />
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
          {adminTab === "settings" && <SettingsManager />}
        </motion.div>
      </main>

      <PostEditor />
    </div>
  )
}
