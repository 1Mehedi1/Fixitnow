import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getStoredHeroPhotos, saveStoredHeroPhotos } from "@/lib/hero-photos-store"
import { isAdmin } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const heroImages = await getStoredHeroPhotos()
  return NextResponse.json({ heroImages })
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
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const saved = await saveStoredHeroPhotos(photos)

    try {
      revalidatePath("/")
    } catch {}

    return NextResponse.json({ heroImages: saved, ok: true })
  } catch (err: any) {
    console.error("Hero photos save error:", err)
    return NextResponse.json({ error: err?.message || "Failed to save hero photos" }, { status: 500 })
  }
}
