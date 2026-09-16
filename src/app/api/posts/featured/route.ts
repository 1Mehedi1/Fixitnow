import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/** Public — get only featured posts (for homepage). */
export async function GET() {
  const posts = await db.post.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { images: { orderBy: { position: "asc" } } },
  })
  return NextResponse.json({ posts })
}
