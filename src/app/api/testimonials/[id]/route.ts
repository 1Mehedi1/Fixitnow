import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  const body = await req.json()
  const t = await db.testimonial.update({ where: { id }, data: body })
  return NextResponse.json({ testimonial: t })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await ctx.params
  await db.testimonial.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
