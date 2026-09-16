import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * Public tracking endpoint — anonymous analytics.
 * Body: { eventType, postId?, duration?, path?, session? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { eventType, postId, duration, path: p, session } = body || {}
    if (!eventType) return NextResponse.json({ ok: false })

    const ev = await db.analyticsEvent.create({
      data: {
        eventType: String(eventType).slice(0, 40),
        postId: postId || null,
        duration: typeof duration === "number" ? duration : null,
        path: p ? String(p).slice(0, 200) : null,
        session: session ? String(session).slice(0, 64) : null,
      },
    })

    // If it's a post view, also bump the post.views counter for convenience.
    if (eventType === "post_view" && postId) {
      db.post.update({ where: { id: postId }, data: { views: { increment: 1 } } }).catch(() => {})
    }
    if (eventType === "whatsapp_click" && postId) {
      db.post.update({ where: { id: postId }, data: { whatsappClicks: { increment: 1 } } }).catch(() => {})
    }
    return NextResponse.json({ ok: true, id: ev.id })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
