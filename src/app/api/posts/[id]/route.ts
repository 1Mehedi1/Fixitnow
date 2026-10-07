import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { getStoredPostById, saveStoredPost, deleteStoredPost, incrementPostViews } from "@/lib/posts-store"
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

/** Public: fetch single post by id, also increments views. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  try {
    const post = await getStoredPostById(id)
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: NO_CACHE_HEADERS })
    }
    // Background view increment
    incrementPostViews(id).catch(() => {})
    return NextResponse.json({ post }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Error fetching post by id:", err)
    return NextResponse.json({ error: err?.message || "Failed to load post" }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}

/** Admin: update post. */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS })
  }
  const { id } = await ctx.params
  const body = await req.json().catch(() => ({}))

  try {
    if (
      body.coverImage &&
      typeof body.coverImage === "string" &&
      body.coverImage.startsWith("http") &&
      !body.coverImage.includes(".public.blob.vercel-storage.com") &&
      !body.coverImage.endsWith(".webp") &&
      !body.coverImage.includes("/uploads/")
    ) {
      try {
        const proc = await processImageUrlToPermanentWebp(body.coverImage)
        if (proc.ok && proc.url) body.coverImage = proc.url
      } catch {}
    }

    if (Array.isArray(body.images)) {
      for (let i = 0; i < body.images.length; i++) {
        const u = typeof body.images[i] === "string" ? body.images[i] : body.images[i]?.url
        if (
          u &&
          typeof u === "string" &&
          u.startsWith("http") &&
          !u.includes(".public.blob.vercel-storage.com") &&
          !u.endsWith(".webp") &&
          !u.includes("/uploads/")
        ) {
          try {
            const proc = await processImageUrlToPermanentWebp(u)
            if (proc.ok && proc.url) {
              if (typeof body.images[i] === "string") {
                body.images[i] = proc.url
              } else {
                body.images[i] = { ...body.images[i], url: proc.url }
              }
            }
          } catch {}
        }
      }
    }

    const post = await saveStoredPost({
      ...body,
      id,
    })

    try {
      revalidatePath("/", "layout")
      revalidatePath("/admin", "layout")
    } catch {}

    return NextResponse.json({ post, ok: true }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Post update error:", err)
    return NextResponse.json({ error: err?.message || "Failed to update post" }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}

/** Admin: delete post. */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS })
  }
  try {
    const { id } = await ctx.params
    await deleteStoredPost(id)

    try {
      revalidatePath("/", "layout")
      revalidatePath("/admin", "layout")
    } catch {}

    return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Post delete error:", err)
    return NextResponse.json({ error: err?.message || "Failed to delete post" }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}

