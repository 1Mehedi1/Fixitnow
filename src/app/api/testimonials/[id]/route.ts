import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { saveStoredTestimonial, deleteStoredTestimonial } from "@/lib/testimonials-store"

export const dynamic = "force-dynamic"

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await ctx.params
    const body = await req.json().catch(() => ({}))
    const t = await saveStoredTestimonial({
      ...body,
      id,
    })

    try {
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ testimonial: t, ok: true })
  } catch (err: any) {
    console.error("Testimonial update error:", err)
    return NextResponse.json({ error: err?.message || "Failed to update testimonial" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await ctx.params
    await deleteStoredTestimonial(id)

    try {
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Testimonial delete error:", err)
    return NextResponse.json({ error: err?.message || "Failed to delete testimonial" }, { status: 500 })
  }
}
