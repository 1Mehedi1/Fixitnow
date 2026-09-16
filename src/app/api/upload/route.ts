import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { isAdmin } from "@/lib/auth"
import crypto from "crypto"

/**
 * Image upload endpoint — saves to /public/uploads.
 * The client side already compressed the image via browser-image-compression
 * before sending it here. We keep the bytes as-is on disk.
 */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const form = await req.formData()
  const file = form.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  // 8 MB safety cap (client should already be much smaller)
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 413 })
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  await mkdir(uploadsDir, { recursive: true })

  const buf = Buffer.from(await file.arrayBuffer())
  const hash = crypto.createHash("md5").update(buf).digest("hex").slice(0, 10)
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
  const filename = `${Date.now()}-${hash}.${ext}`
  await writeFile(path.join(uploadsDir, filename), buf)

  // Always serve as WebP if uploaded as webp; otherwise keep original ext for <img>.
  return NextResponse.json({ url: `/uploads/${filename}` })
}
