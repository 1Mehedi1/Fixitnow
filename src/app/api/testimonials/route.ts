import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { getStoredTestimonials, saveStoredTestimonial } from "@/lib/testimonials-store"

export const dynamic = "force-dynamic"

/** Public list of published testimonials. */
export async function GET() {
  try {
    const items = await getStoredTestimonials()
    const published = items.filter((t) => t.published !== false)
    return NextResponse.json({ testimonials: published })
  } catch (err: any) {
    const { FALLBACK_TESTIMONIALS } = await import("@/lib/fallback-data")
    return NextResponse.json({ testimonials: FALLBACK_TESTIMONIALS })
  }
}

/** Admin create. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json().catch(() => ({}))
    const { name, role, rating, content, avatar, published } = body
    if (!name || !content) {
      return NextResponse.json({ error: "Name and content required" }, { status: 400 })
    }

    const t = await saveStoredTestimonial({
      name,
      role,
      rating: typeof rating === "number" ? Math.max(1, Math.min(5, rating)) : 5,
      content,
      avatar,
      published: published !== false,
    })

    try {
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ testimonial: t, ok: true })
  } catch (err: any) {
    console.error("Testimonial create error:", err)
    return NextResponse.json({ error: err?.message || "Failed to create testimonial" }, { status: 500 })
  }
}
