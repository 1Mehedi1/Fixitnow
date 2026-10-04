"use client"

import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import {
  LayoutDashboard, FileText, Layers, MessageSquare, BarChart3, Settings,
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
  const { adminTab, setAdminTab, setView, openEditor, customPosts } = useStore()
  const activePosts = customPosts || posts

  // Show login screen if unauthenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }
  if (!session) {
    return <AdminLogin />
  }

  const counts = {
    posts: activePosts.length,
    portfolio: activePosts.filter((p) => p.type === "portfolio").length,
    testimonials: testimonials.length,
  }

  return (
    <div className="dark bg-slate-950 text-slate-100 min-h-screen flex flex-col md:flex-row [&_.text-muted-foreground]:text-slate-300 [&_label]:text-slate-200">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/60 p-4 sticky top-0 h-screen shadow-lg">
        <div className="mb-6 px-2 flex items-center justify-between">
          <div>
            <div className="font-display font-black text-lg tracking-tight text-white">Admin Panel</div>
            <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{session.user?.email}</p>
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
                  : "hover:bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <n.icon className="h-4 w-4 shrink-0" />
              <span>{n.label}</span>
              {n.key === "posts" && <Badge variant="secondary" className="ml-auto text-[10px] bg-slate-800 text-slate-300">{counts.posts}</Badge>}
              {n.key === "testimonials" && <Badge variant="secondary" className="ml-auto text-[10px] bg-slate-800 text-slate-300">{counts.testimonials}</Badge>}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 mt-auto border-t border-slate-800 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("home")}
            className="w-full justify-start text-xs text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-2" /> View live site
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-start text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900 border-b border-slate-800 shadow-md">
        <div className="flex items-center justify-between p-3">
          <div>
            <div className="font-display font-black text-sm text-white">Admin Panel</div>
            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{session.user?.email}</div>
          </div>
          <div className="flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => setAdminTab(n.key)}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  adminTab === n.key ? "bg-primary text-primary-foreground" : "hover:bg-slate-800 text-slate-300"
                }`}
                title={n.label}
              >
                <n.icon className="h-3.5 w-3.5" />
              </button>
            ))}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full pt-16 md:pt-8 overflow-y-auto">
        <motion.div
          key={adminTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {adminTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white">Overview</h2>
                <p className="text-sm text-slate-400">Welcome back, {session.user?.name || "Admin"}.</p>
              </div>

              {/* Stats cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Portfolio jobs", val: counts.portfolio, color: "bg-emerald-500/10 text-emerald-400" },
                  { label: "Total posts", val: counts.posts, color: "bg-blue-500/10 text-blue-400" },
                  { label: "Testimonials", val: counts.testimonials, color: "bg-amber-500/10 text-amber-400" },
                ].map((s) => (
                  <Card key={s.label} className="border-slate-800 bg-slate-900/50">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-400">{s.label}</div>
                        <div className="font-display text-2xl font-bold mt-1 text-white">{s.val}</div>
                      </div>
                      <span className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${s.color}`}>
                        {s.val}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick actions */}
              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-3 text-white">Quick actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => openEditor("new")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer">
                      <Plus className="h-4 w-4 mr-1.5" /> New post
                    </Button>
                    <Button variant="outline" onClick={() => setAdminTab("posts")} className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white cursor-pointer">
                      <FileText className="h-4 w-4 mr-1.5" /> Manage posts
                    </Button>
                    <Button variant="outline" onClick={() => setAdminTab("testimonials")} className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white cursor-pointer">
                      <MessageSquare className="h-4 w-4 mr-1.5" /> Testimonials
                    </Button>
                    <Button variant="outline" onClick={() => setAdminTab("analytics")} className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white cursor-pointer">
                      <BarChart3 className="h-4 w-4 mr-1.5" /> Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent posts */}
              <Card className="border-slate-800 bg-slate-900/50">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-3 text-white">Recent posts</h3>
                  <div className="space-y-2">
                    {activePosts.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => openEditor(p.id)}
                        className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-200 truncate">{p.title}</div>
                          <div className="text-xs text-slate-400">
                            {p.category || "General"} · {new Date(p.createdAt).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" })} · {p.views || 0} views
                          </div>
                        </div>
                        {p.featured && <Badge className="bg-primary/20 text-primary border-0 text-[10px]">Featured</Badge>}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {adminTab === "posts" && <PostList posts={activePosts} />}
          {adminTab === "testimonials" && <TestimonialManager testimonials={testimonials} />}
          {adminTab === "analytics" && <AnalyticsDashboard />}
          {adminTab === "settings" && <SettingsManager />}
        </motion.div>
      </main>

      <PostEditor />
    </div>
  )
}
