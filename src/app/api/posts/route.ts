import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { getStoredPosts, saveStoredPost } from "@/lib/posts-store"

/** Public list — supports ?type=&category=&featured=&limit= */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const type = url.searchParams.get("type") || undefined
  const category = url.searchParams.get("category") || undefined
  const featured = url.searchParams.get("featured")
  const limit = parseInt(url.searchParams.get("limit") || "100")
  const q = url.searchParams.get("q") || undefined

  try {
    let posts = await getStoredPosts()
    posts = posts.filter((p) => p.published)
    if (type) posts = posts.filter((p) => p.type === type)
    if (category) posts = posts.filter((p) => p.category === category)
    if (featured === "true") posts = posts.filter((p) => p.featured)
    if (q) posts = posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))

    return NextResponse.json({ posts: posts.slice(0, Math.max(1, Math.min(limit, 200))) })
  } catch (err: any) {
    console.error("Error fetching posts:", err)
    return NextResponse.json({ error: err?.message || "Failed to load posts" }, { status: 500 })
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

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 })
  }

  try {
    const post = await saveStoredPost({
      title: title.trim(),
      excerpt,
      content,
      type,
      category,
      tags,
      featured,
      published,
      coverImage,
      images,
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
