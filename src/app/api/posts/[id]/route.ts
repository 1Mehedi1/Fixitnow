import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

/** Public: fetch single post by id, also increments views. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const post = await db.post.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  })
  if (!post || !post.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  // fire-and-forget view increment
  db.post.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {})
  return NextResponse.json({ post })
}

/** Admin: update post. */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  const body = await req.json()
  const { title, excerpt, content, type, category, tags, featured, published, coverImage, images } = body

  // Replace images atomically if provided.
  const data: any = {
    title,
    excerpt,
    content,
    type,
    category,
    tags,
    featured,
    published,
    coverImage,
  }
  if (Array.isArray(images)) {
    await db.postImage.deleteMany({ where: { postId: id } })
    data.images = {
      create: images.map((img: any, i: number) => ({
        url: img.url,
        kind: img.kind || "gallery",
        position: i,
      })),
    }
  }

  const post = await db.post.update({ where: { id }, data, include: { images: true } })
  return NextResponse.json({ post })
}

/** Admin: delete post. */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  await db.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
