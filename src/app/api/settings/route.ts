import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdmin } from "@/lib/auth"
import { getStoredSiteSettings, saveStoredSiteSettings } from "@/lib/settings-store"

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

/** Public — returns current site settings. */
export async function GET() {
  const settings = await getStoredSiteSettings()

  return NextResponse.json({
    settings: {
      ...settings,
      id: "singleton",
      servicesJson: JSON.stringify(settings.services),
      heroImagesJson: JSON.stringify(settings.heroImages),
      typewriterSentencesJson: JSON.stringify(settings.typewriterSentences || []),
    },
    services: settings.services,
    heroImages: settings.heroImages,
    typewriterSentences: settings.typewriterSentences || [],
  }, { headers: NO_CACHE_HEADERS })
}

/** Admin only — update site settings. */
export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE_HEADERS })
  }
  const body = await req.json()
  const allowed = [
    "brand", "tagline", "workerName", "phone", "whatsapp", "email", "location",
    "yearsExperience", "jobsCompleted", "happyClients", "rating",
    "heroHeadline", "heroSubtext", "aboutTitle", "aboutBody",
    "services", "servicesJson", "heroImages", "heroImagesJson",
    "typewriterSentences", "typewriterSentencesJson",
    "companyName", "companyUen", "licenseInfo",
  ]

  const data: any = {}
  for (const k of allowed) {
    if (k in body) {
      if (["yearsExperience", "jobsCompleted", "happyClients"].includes(k)) {
        data[k] = parseInt(body[k], 10) || 0
      } else if (k === "rating") {
        data[k] = parseFloat(body[k]) || 0
      } else if (k === "services" || k === "heroImages" || k === "typewriterSentences") {
        data[k] = body[k]
      } else if (k === "servicesJson" || k === "heroImagesJson" || k === "typewriterSentencesJson") {
        data[k] = typeof body[k] === "string" ? body[k] : JSON.stringify(body[k] || [])
      } else {
        data[k] = String(body[k] ?? "")
      }
    }
  }

  const saved = await saveStoredSiteSettings(data)

  try {
    revalidatePath("/", "layout")
    revalidatePath("/admin", "layout")
  } catch {}

  return NextResponse.json({
    settings: {
      ...saved,
      id: "singleton",
      servicesJson: JSON.stringify(saved.services),
      heroImagesJson: JSON.stringify(saved.heroImages),
      typewriterSentencesJson: JSON.stringify(saved.typewriterSentences || []),
    },
    ok: true,
  }, { headers: NO_CACHE_HEADERS })
}

