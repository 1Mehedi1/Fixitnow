import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { getStoredPostById, saveStoredPost, deleteStoredPost, incrementPostViews } from "@/lib/posts-store"

/** Public: fetch single post by id, also increments views. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  try {
    const post = await getStoredPostById(id)
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    // Background view increment
    incrementPostViews(id).catch(() => {})
    return NextResponse.json({ post })
  } catch (err: any) {
    console.error("Error fetching post by id:", err)
    return NextResponse.json({ error: err?.message || "Failed to load post" }, { status: 500 })
  }
}

/** Admin: update post. */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  const body = await req.json().catch(() => ({}))

  try {
    const post = await saveStoredPost({
      ...body,
      id,
    })

    try {
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ post, ok: true })
  } catch (err: any) {
    console.error("Post update error:", err)
    return NextResponse.json({ error: err?.message || "Failed to update post" }, { status: 500 })
  }
}

/** Admin: delete post. */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await ctx.params
    await deleteStoredPost(id)

    try {
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Post delete error:", err)
    return NextResponse.json({ error: err?.message || "Failed to delete post" }, { status: 500 })
  }
}
