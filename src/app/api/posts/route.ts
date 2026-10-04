import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

/** Public list — supports ?type=&category=&featured=&limit= */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const type = url.searchParams.get("type") || undefined
  const category = url.searchParams.get("category") || undefined
  const featured = url.searchParams.get("featured")
  const limit = parseInt(url.searchParams.get("limit") || "100")
  const q = url.searchParams.get("q") || undefined

  const where: any = { published: true }
  if (type) where.type = type
  if (category) where.category = category
  if (featured === "true") where.featured = true
  if (q) where.title = { contains: q }

  try {
    const posts = await db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.max(1, Math.min(limit, 200)),
      include: { images: { orderBy: { position: "asc" } } },
    })
    return NextResponse.json({ posts })
  } catch {
    const { FALLBACK_POSTS } = await import("@/lib/fallback-data")
    let filtered = FALLBACK_POSTS
    if (type) filtered = filtered.filter((p) => p.type === type)
    if (category) filtered = filtered.filter((p) => p.category === category)
    if (featured === "true") filtered = filtered.filter((p) => p.featured)
    return NextResponse.json({ posts: filtered })
  }
}

/** Admin only — create a new post. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json().catch(() => ({}))
  const {
    title,
    excerpt,
    content,
    type = "portfolio",
    category,
    tags,
    featured = false,
    published = true,
    coverImage,
    images = [],
  } = body

  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })

  try {
    const admin = await (await import("@/lib/auth")).getAdmin()
    const slug = slugify(title) + "-" + Math.random().toString(36).slice(2, 6)

    const post = await db.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        type,
        category,
        tags,
        featured: !!featured,
        published: !!published,
        coverImage,
        authorId: admin?.id,
        images: images.length
          ? {
              create: images.map((img: any, i: number) => ({
                url: img.url,
                kind: img.kind || "gallery",
                position: i,
              })),
            }
          : undefined,
      },
      include: { images: true },
    })

    try {
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ post, ok: true })
  } catch (err: any) {
    console.error("Post creation error:", err)
    return NextResponse.json({ error: err?.message || "Failed to create post" }, { status: 500 })
  }
}
