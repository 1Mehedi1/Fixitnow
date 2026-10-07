import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { saveStoredTestimonial, deleteStoredTestimonial } from "@/lib/testimonials-store"
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

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS })
  }
  try {
    const { id } = await ctx.params
    const body = await req.json().catch(() => ({}))

    if (
      body.avatar &&
      typeof body.avatar === "string" &&
      body.avatar.startsWith("http") &&
      !body.avatar.includes(".public.blob.vercel-storage.com") &&
      !body.avatar.endsWith(".webp") &&
      !body.avatar.includes("/uploads/")
    ) {
      try {
        const proc = await processImageUrlToPermanentWebp(body.avatar)
        if (proc.ok && proc.url) {
          body.avatar = proc.url
        }
      } catch (e) {
        console.warn("Avatar WebP conversion warning:", e)
      }
    }

    const t = await saveStoredTestimonial({
      ...body,
      id,
    })

    try {
      revalidatePath("/", "layout")
      revalidatePath("/admin", "layout")
    } catch {}

    return NextResponse.json({ testimonial: t, ok: true }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Testimonial update error:", err)
    return NextResponse.json({ error: err?.message || "Failed to update testimonial" }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS })
  }
  try {
    const { id } = await ctx.params
    await deleteStoredTestimonial(id)

    try {
      revalidatePath("/", "layout")
      revalidatePath("/admin", "layout")
    } catch {}

    return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Testimonial delete error:", err)
    return NextResponse.json({ error: err?.message || "Failed to delete testimonial" }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}

