"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { Eye, MousePointerClick, Clock, TrendingUp, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts"

interface Stats {
  totals: { pageViews: number; postViews: number; whatsappClicks: number; avgDwellSeconds: number }
  topPosts: { id: string; title: string; type: string; views: number; whatsappClicks: number }[]
  byDay: { date: string; page_view: number; post_view: number; whatsapp_click: number }[]
}

export function AnalyticsDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    fetch("/api/analytics/stats")
      .then(async (r) => {
        if (r.status === 401) {
          setAuthError(true)
          // Clear the stale session and reload to login
          await signOut({ redirect: false })
          setTimeout(() => window.location.reload(), 500)
          return null
        }
        if (!r.ok) return null
        return r.json()
      })
      .then((d) => { if (d) setStats(d) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground">Loading analytics…</div>
  }
  if (authError || !session) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-muted-foreground">Your session has expired. Please sign in again.</p>
        <Button onClick={() => window.location.reload()}>Reload to sign in</Button>
      </div>
    )
  }
  if (!stats) return null

  const chartData = stats.byDay.map((d) => ({
    date: d.date.slice(5), // MM-DD
    "Page views": d.page_view,
    "Post views": d.post_view,
    "WhatsApp clicks": d.whatsapp_click,
  }))

  const cards = [
    { label: "Site views", val: stats.totals.pageViews, icon: Eye, color: "text-blue-500" },
    { label: "Post views", val: stats.totals.postViews, icon: BarChart3, color: "text-amber-500" },
    { label: "WhatsApp clicks", val: stats.totals.whatsappClicks, icon: MousePointerClick, color: "text-green-500" },
    { label: "Avg dwell (sec)", val: stats.totals.avgDwellSeconds || 0, icon: Clock, color: "text-purple-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">Last 14 days · tracked anonymously</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
                  <c.icon className={`h-4 w-4 ${c.color}`} />
                </div>
                <div className="font-display text-3xl font-bold">{c.val.toLocaleString()}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            14-day activity
          </CardTitle>
          <CardDescription>Daily breakdown of key events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 60)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.01 60)" />
                <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.01 60)" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.99 0.005 75)",
                    border: "1px solid oklch(0.9 0.012 65)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="Page views" stroke="oklch(0.5 0.18 230)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Post views" stroke="oklch(0.61 0.18 50)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="WhatsApp clicks" stroke="oklch(0.65 0.18 150)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Most-viewed posts</CardTitle>
          <CardDescription>Sorted by total views · with WhatsApp conversion</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topPosts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No data yet — publish a post to see stats.</div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topPosts.map((p) => ({
                    name: p.title.length > 30 ? p.title.slice(0, 28) + "…" : p.title,
                    Views: p.views,
                    "WA clicks": p.whatsappClicks,
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 20, bottom: 5, left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 60)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.01 60)" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="oklch(0.5 0.01 60)" width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.99 0.005 75)",
                      border: "1px solid oklch(0.9 0.012 65)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="Views" fill="oklch(0.61 0.18 50)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="WA clicks" fill="oklch(0.65 0.18 150)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
