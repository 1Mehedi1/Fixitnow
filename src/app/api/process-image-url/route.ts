import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { processImageUrlToPermanentWebp } from "@/lib/storage-sync"
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
    return NextResponse.json(
      { error: "Unauthorized: Admin privileges required" },
      { status: 401, headers: NO_CACHE_HEADERS }
    )
  }

  try {
    const body = await req.json().catch(() => ({}))
    const url = body?.url
    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "Please enter an image URL to convert and store." },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    const result = await processImageUrlToPermanentWebp(url.trim())
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || "Failed to process image" },
        { status: 400, headers: NO_CACHE_HEADERS }
      )
    }

    try {
      revalidatePath("/", "layout")
      revalidatePath("/admin", "layout")
    } catch {}

    return NextResponse.json(result, { headers: NO_CACHE_HEADERS })
  } catch (err: any) {
    console.error("Process image URL route error:", err)
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500, headers: NO_CACHE_HEADERS }
    )
  }
}
