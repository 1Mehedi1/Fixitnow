import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

/** Public list of published testimonials. */
export async function GET() {
  const items = await db.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ testimonials: items })
}

/** Admin create. */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const { name, role, rating, content, avatar, published } = body
  if (!name || !content) {
    return NextResponse.json({ error: "Name and content required" }, { status: 400 })
  }
  const t = await db.testimonial.create({
    data: {
      name,
      role,
      rating: typeof rating === "number" ? Math.max(1, Math.min(5, rating)) : 5,
      content,
      avatar,
      published: published !== false,
    },
  })
  return NextResponse.json({ testimonial: t })
}
