import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import {
  parseUserAgent,
  parseReferrer,
  parseGeoLocation,
  saveLocalAnalyticsEvent,
  type AnalyticsEventRecord,
} from "@/lib/analytics-helper"

export const dynamic = "force-dynamic"

/**
 * Public tracking endpoint — anonymous, privacy-friendly analytics.
 * Body: { eventType, postId?, duration?, path?, session?, clientMeta? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { eventType, postId, duration, path: p, session, clientMeta } = body || {}
    if (!eventType) return NextResponse.json({ ok: false, error: "Missing eventType" })

    const userAgent = req.headers.get("user-agent")
    const { device, browser, os } = parseUserAgent(userAgent)
    const referrerHeader = req.headers.get("referer") || clientMeta?.referrer
    const referrer = parseReferrer(referrerHeader)
    const { country, countryCode, countryFlag, city } = parseGeoLocation(req.headers, clientMeta)

    const eventId = `ev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
    const record: AnalyticsEventRecord = {
      id: eventId,
      eventType: String(eventType).slice(0, 40),
      postId: postId ? String(postId) : null,
      session: session ? String(session).slice(0, 64) : null,
      duration: typeof duration === "number" ? duration : null,
      path: p ? String(p).slice(0, 200) : "/",
      device: clientMeta?.device || device,
      browser,
      os,
      country,
      countryCode,
      countryFlag,
      city,
      referrer,
      createdAt: new Date().toISOString(),
    }

    // Persist to local JSON analytics store (guarantees 100% uptime & rich metadata)
    await saveLocalAnalyticsEvent(record)

    // Attempt PostgreSQL persistence if DB is connected
    try {
      await db.analyticsEvent.create({
        data: {
          eventType: record.eventType,
          postId: record.postId,
          duration: record.duration,
          path: record.path,
          session: record.session,
        },
      })

      // If it's a post view, bump post counter
      if (record.eventType === "post_view" && record.postId) {
        db.post.update({ where: { id: record.postId }, data: { views: { increment: 1 } } }).catch(() => {})
      }
      if (record.eventType.includes("whatsapp") && record.postId) {
        db.post.update({ where: { id: record.postId }, data: { whatsappClicks: { increment: 1 } } }).catch(() => {})
      }
    } catch {
      // Database offline/unreachable — local store has captured the event safely
    }

    return NextResponse.json({ ok: true, id: record.id })
  } catch (e: any) {
    console.error("Analytics tracking error:", e)
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 })
  }
}
