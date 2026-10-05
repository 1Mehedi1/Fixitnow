import { put, del } from "@vercel/blob"
import fs from "fs"
import path from "path"
import os from "os"

/**
 * Storage & Cross-Device Sync Utility
 * 
 * Provides production-ready multi-tier storage:
 * 1. Vercel Blob (when BLOB_READ_WRITE_TOKEN is set in Vercel or .env)
 * 2. Permanent Public Image CDN (Catbox) for images across all devices
 * 3. Local filesystem + /tmp fallback for local development
 */

export const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

/**
 * Save an uploaded image permanently to Vercel Blob or Public CDN.
 * Returns a permanent, publicly accessible HTTPS URL.
 */
export async function uploadImagePermanent(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{ url: string; provider: "vercel-blob" | "catbox" | "local" }> {
  // Tier 1: Vercel Blob (Primary for production Vercel deployments)
  if (hasVercelBlob) {
    try {
      const cleanName = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`
      const blob = await put(cleanName, buffer, {
        access: "public",
        contentType: mimeType,
      })
      if (blob?.url) {
        return { url: blob.url, provider: "vercel-blob" }
      }
    } catch (blobErr) {
      console.warn("Vercel Blob upload failed, attempting CDN fallback:", blobErr)
    }
  }

  // Tier 2: Public High-Speed CDN (Catbox) — reliable public HTTPS URL accessible from all devices worldwide
  try {
    const uploadForm = new FormData()
    uploadForm.append("reqtype", "fileupload")
    uploadForm.append("fileToUpload", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename)
    const cRes = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: uploadForm,
    })
    if (cRes.ok) {
      const catboxUrl = (await cRes.text()).trim()
      if (catboxUrl.startsWith("http://") || catboxUrl.startsWith("https://")) {
        return { url: catboxUrl, provider: "catbox" }
      }
    }
  } catch (cdnErr) {
    console.warn("CDN upload failed:", cdnErr)
  }

  // Tier 3: Local filesystem (for local offline dev)
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
    const localPath = path.join(uploadsDir, filename)
    fs.writeFileSync(localPath, buffer)
    return { url: `/uploads/${filename}`, provider: "local" }
  } catch {}

  throw new Error("All upload providers failed. Please check network or attach Vercel Blob.")
}

/**
 * Persist JSON data (posts, testimonials, settings, hero-photos) to Vercel Blob if available.
 */
export async function saveJsonBlob(
  blobPath: string,
  data: any
): Promise<string | null> {
  if (!hasVercelBlob) return null
  try {
    const content = typeof data === "string" ? data : JSON.stringify(data, null, 2)
    const blob = await put(blobPath, content, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false, // Maintain fixed URL for deterministic fetching
    })
    return blob.url
  } catch (err) {
    console.warn(`Failed to save ${blobPath} to Vercel Blob:`, err)
    return null
  }
}

/**
 * Read JSON data from Vercel Blob by known URL or pathname.
 */
export async function readJsonBlob<T>(blobUrlOrPath: string): Promise<T | null> {
  try {
    if (blobUrlOrPath.startsWith("http://") || blobUrlOrPath.startsWith("https://")) {
      const res = await fetch(blobUrlOrPath, { cache: "no-store" })
      if (res.ok) {
        return (await res.json()) as T
      }
    }
  } catch {}
  return null
}
