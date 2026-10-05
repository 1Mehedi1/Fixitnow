import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import path from "path"
import { uploadImagePermanent } from "@/lib/storage-sync"

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

  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    // Only allow image MIME types
    const mimeType = file.type || "image/jpeg"
    if (!mimeType.startsWith("image/") && !mimeType.startsWith("application/octet-stream")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    const buf = Buffer.from(await file.arrayBuffer())

    // File size check: 10MB limit
    if (buf.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    const cleanBaseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40)
    const ext = path.extname(file.name) || (mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : ".jpg")
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${cleanBaseName}${ext}`

    // Upload to permanent storage (Vercel Blob -> FreeImage CDN -> TmpFiles CDN -> Catbox CDN -> Local filesystem)
    const result = await uploadImagePermanent(buf, filename, mimeType)

    return NextResponse.json({
      url: result.url,
      storage: result.provider,
      filename,
    }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: err?.message || "Internal upload error" }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}