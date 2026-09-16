import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

/** Admin-only aggregate analytics dashboard. */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [pageViews, postViews, whatsappClicks, dwellEvents] = await Promise.all([
    db.analyticsEvent.count({ where: { eventType: "page_view" } }),
    db.analyticsEvent.count({ where: { eventType: "post_view" } }),
    db.analyticsEvent.count({ where: { eventType: "whatsapp_click" } }),
    db.analyticsEvent.findMany({ where: { eventType: "dwell", duration: { not: null } } }),
  ])

  const avgDwellSeconds = dwellEvents.length
    ? Math.round(dwellEvents.reduce((s, e) => s + (e.duration || 0), 0) / dwellEvents.length)
    : 0

  // Top 6 posts by views
  const topPosts = await db.post.findMany({
    orderBy: { views: "desc" },
    take: 6,
    select: { id: true, title: true, type: true, views: true, whatsappClicks: true },
  })

  // Last 14 days daily breakdown
  const since = new Date(Date.now() - 14 * 86400000)
  const recent = await db.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { eventType: true, createdAt: true },
  })

  const byDay: Record<string, { page_view: number; post_view: number; whatsapp_click: number }> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toISOString().slice(0, 10)
    byDay[key] = { page_view: 0, post_view: 0, whatsapp_click: 0 }
  }
  for (const e of recent) {
    const key = e.createdAt.toISOString().slice(0, 10)
    if (!byDay[key]) continue
    if (e.eventType in byDay[key]) byDay[key][e.eventType as "page_view" | "post_view" | "whatsapp_click"]++
  }

  return NextResponse.json({
    totals: { pageViews, postViews, whatsappClicks, avgDwellSeconds },
    topPosts,
    byDay: Object.entries(byDay).map(([date, v]) => ({ date, ...v })),
  })
}
