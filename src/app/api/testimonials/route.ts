import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { getStoredTestimonials, saveStoredTestimonial } from "@/lib/testimonials-store"
import { processImageUrlToPermanentWebp } from "@/lib/storage-sync"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
}

/** Public & Admin list of testimonials. */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const includeDrafts = url.searchParams.get("includeDrafts") === "true" || url.searchParams.get("all") === "1"
    const items = await getStoredTestimonials()
    const result = includeDrafts ? items : items.filter((t) => t.published !== false)
    return NextResponse.json({ testimonials: result }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    const { FALLBACK_TESTIMONIALS } = await import("@/lib/fallback-data")
    return NextResponse.json({ testimonials: FALLBACK_TESTIMONIALS }, { headers: NO_CACHE_HEADERS })
  }
}

/** Admin create. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS })
  }
  try {
    const body = await req.json().catch(() => ({}))
    const { name, role, rating, content, avatar, published } = body
    if (!name || !content) {
      return NextResponse.json({ error: "Name and content required" }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    let finalAvatar = avatar || null
    if (
      finalAvatar &&
      typeof finalAvatar === "string" &&
      finalAvatar.startsWith("http") &&
      !finalAvatar.includes(".public.blob.vercel-storage.com") &&
      !finalAvatar.endsWith(".webp") &&
      !finalAvatar.includes("/uploads/")
    ) {
      try {
        const proc = await processImageUrlToPermanentWebp(finalAvatar)
        if (proc.ok && proc.url) {
          finalAvatar = proc.url
        }
      } catch (e) {
        console.warn("Avatar WebP conversion warning:", e)
      }
    }

    const t = await saveStoredTestimonial({
      name,
      role,
      rating: typeof rating === "number" ? Math.max(1, Math.min(5, rating)) : 5,
      content,
      avatar: finalAvatar,
      published: published !== false,
    })

    try {
      revalidatePath("/", "layout")
      revalidatePath("/admin", "layout")
      revalidatePath("/")
      revalidatePath("/admin")
    } catch {}

    return NextResponse.json({ testimonial: t, ok: true }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Testimonial create error:", err)
    return NextResponse.json({ error: err?.message || "Failed to create testimonial" }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}

