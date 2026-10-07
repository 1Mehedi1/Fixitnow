import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import path from "path"
import sharp from "sharp"
import { uploadImagePermanent, processImageUrlToPermanentWebp } from "@/lib/storage-sync"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS })
  }

  const contentType = req.headers.get("content-type") || ""

  // 1. JSON Request: Paste Image URL -> Auto convert to WebP -> Store permanently
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json().catch(() => ({}))
      const url = body?.url
      if (!url || typeof url !== "string" || !url.trim()) {
        return NextResponse.json({ error: "No image URL provided" }, { status: 400, headers: NO_CACHE_HEADERS })
      }

      const result = await processImageUrlToPermanentWebp(url.trim())
      if (!result.ok) {
        return NextResponse.json({ error: result.error || "Failed to process image" }, { status: 400, headers: NO_CACHE_HEADERS })
      }

      try {
        revalidatePath("/", "layout")
        revalidatePath("/admin", "layout")
      } catch {}

      return NextResponse.json(result, { headers: NO_CACHE_HEADERS })
    } catch (err: any) {
      console.error("Upload JSON URL processing error:", err)
      return NextResponse.json({ error: err?.message || "Internal processing error" }, { status: 500, headers: NO_CACHE_HEADERS })
    }
  }

  // 2. FormData Request: File upload with automatic WebP conversion
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    const mimeType = file.type || "image/jpeg"
    if (!mimeType.startsWith("image/") && !mimeType.startsWith("application/octet-stream")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    const rawBuf = Buffer.from(await file.arrayBuffer())
    if (rawBuf.length > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 25MB limit" }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    // Convert file to WebP and auto-orient
    let webpBuf: Buffer
    try {
      webpBuf = await sharp(rawBuf)
        .rotate()
        .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 84, effort: 4 })
        .toBuffer()
    } catch {
      webpBuf = rawBuf
    }

    const cleanBaseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 35)
    const filename = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${cleanBaseName}.webp`

    const result = await uploadImagePermanent(webpBuf, filename, "image/webp")

    try {
      revalidatePath("/", "layout")
      revalidatePath("/admin", "layout")
    } catch {}

    return NextResponse.json({
      ok: true,
      url: result.url,
      storage: result.provider,
      format: "webp",
      originalSize: rawBuf.length,
      optimizedSize: webpBuf.length,
      filename,
    }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: err?.message || "Internal upload error" }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}