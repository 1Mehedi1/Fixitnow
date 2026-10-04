import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import fs from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  try {
    return createClient(url, key)
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Only allow image MIME types
    const mimeType = file.type || "image/jpeg"
    if (!mimeType.startsWith("image/") && !mimeType.startsWith("application/octet-stream")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    const buf = Buffer.from(await file.arrayBuffer())

    // File size check: 10MB limit
    if (buf.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 })
    }

    const cleanBaseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40)
    const ext = path.extname(file.name) || (mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : ".jpg")
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${cleanBaseName}${ext}`

    // Tier 1: If Supabase is configured, try Supabase storage
    const supabase = getSupabase()
    if (supabase) {
      try {
        const { error } = await supabase.storage
          .from("uploads")
          .upload(filename, buf, { contentType: mimeType, upsert: true })

        if (!error) {
          const { data } = supabase.storage.from("uploads").getPublicUrl(filename)
          if (data?.publicUrl) {
            return NextResponse.json({ url: data.publicUrl, storage: "supabase" })
          }
        }
      } catch (sbErr) {
        console.warn("Supabase upload failed, falling back to local storage:", sbErr)
      }
    }

    // Tier 2: Local filesystem storage (served statically at /uploads/...)
    try {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads")
      await fs.mkdir(publicUploadsDir, { recursive: true })
      const filePath = path.join(publicUploadsDir, filename)
      await fs.writeFile(filePath, buf)

      const publicUrl = `/uploads/${filename}`
      return NextResponse.json({ url: publicUrl, storage: "local" })
    } catch (fsErr) {
      console.warn("Local filesystem write failed, falling back to Base64 data URL:", fsErr)
    }

    // Tier 3: Direct CDN permanent image upload (lightweight HTTPS URL for serverless/Vercel)
    try {
      const uploadForm = new FormData()
      uploadForm.append("reqtype", "fileupload")
      uploadForm.append("fileToUpload", new Blob([buf], { type: mimeType }), filename)
      const cRes = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: uploadForm,
      })
      if (cRes.ok) {
        const catboxUrl = (await cRes.text()).trim()
        if (catboxUrl.startsWith("http://") || catboxUrl.startsWith("https://")) {
          return NextResponse.json({ url: catboxUrl, storage: "cdn" })
        }
      }
    } catch (cdnErr) {
      console.warn("CDN upload failed, falling back to base64:", cdnErr)
    }

    // Tier 4: Base64 data URL fallback
    const base64Url = `data:${mimeType};base64,${buf.toString("base64")}`
    return NextResponse.json({ url: base64Url, storage: "data-uri" })
  } catch (err: any) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: err?.message || "Internal upload error" }, { status: 500 })
  }
}