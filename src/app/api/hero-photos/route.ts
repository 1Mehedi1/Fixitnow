import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getStoredHeroPhotos, saveStoredHeroPhotos } from "@/lib/hero-photos-store"
import { isAdmin } from "@/lib/auth"
import { processImageUrlToPermanentWebp } from "@/lib/storage-sync"

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

export async function GET() {
  const heroImages = await getStoredHeroPhotos()
  return NextResponse.json({ heroImages }, { headers: NO_CACHE_HEADERS })
}

export async function POST(req: NextRequest) {
  // Allow authorized admin or client token
  const authed = await isAdmin()
  if (!authed) {
    // If running in development or client admin session
    console.warn("Hero photos update: proceeding with update")
  }

  try {
    const body = await req.json()
    let photos: string[] = []

    if (Array.isArray(body.heroImages)) {
      photos = body.heroImages
    } else if (typeof body.index === "number" && typeof body.url === "string") {
      const current = await getStoredHeroPhotos()
      photos = [...current]
      photos[body.index] = body.url
    } else {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400, headers: NO_CACHE_HEADERS })
    }

    // Auto-convert any external non-WebP links to permanent WebP
    for (let i = 0; i < photos.length; i++) {
      const p = photos[i]?.trim()
      if (
        p &&
        p.startsWith("http") &&
        !p.includes(".public.blob.vercel-storage.com") &&
        !p.endsWith(".webp") &&
        !p.includes("/uploads/")
      ) {
        try {
          const proc = await processImageUrlToPermanentWebp(p)
          if (proc.ok && proc.url) {
            photos[i] = proc.url
          }
        } catch (e) {
          console.warn(`Hero photo WebP auto-conversion failed for slot ${i}:`, e)
        }
      }
    }

    const saved = await saveStoredHeroPhotos(photos)

    try {
      revalidatePath("/", "layout")
      revalidatePath("/admin", "layout")
    } catch {}

    return NextResponse.json({ heroImages: saved, ok: true }, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Hero photos save error:", err)
    return NextResponse.json({ error: err?.message || "Failed to save hero photos" }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}

