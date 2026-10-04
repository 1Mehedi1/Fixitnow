import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { saveCustomSection, deleteCustomSection } from "@/lib/sections-store"

/** Admin: update custom section */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  const body = await req.json().catch(() => ({}))

  try {
    const section = await saveCustomSection({ ...body, id })
    try {
      revalidatePath("/")
    } catch {}
    return NextResponse.json({ section, ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update section" }, { status: 500 })
  }
}

/** Admin: delete custom section */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  try {
    await deleteCustomSection(id)
    try {
      revalidatePath("/")
    } catch {}
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to delete section" }, { status: 500 })
  }
}
