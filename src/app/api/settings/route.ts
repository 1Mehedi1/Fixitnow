import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/auth"
import { defaultSiteConfig } from "@/lib/site"
import fs from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

const SETTINGS_FILE = path.join(process.cwd(), "data", "site-settings.json")

async function readLocalSettings() {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function writeLocalSettings(data: any) {
  try {
    const dir = path.join(process.cwd(), "data")
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed to write local site settings:", err)
  }
}

/** Public — returns current site settings (creates default if missing). */
export async function GET() {
  let settings: any = null

  try {
    settings = await db.siteSettings.findUnique({ where: { id: "singleton" } })
    if (!settings) {
      settings = await db.siteSettings.create({ data: { id: "singleton" } })
    }
  } catch {
    // Database offline — check local file or default config
    settings = (await readLocalSettings()) || {
      id: "singleton",
      ...defaultSiteConfig,
      servicesJson: JSON.stringify(defaultSiteConfig.services),
      heroImagesJson: JSON.stringify(defaultSiteConfig.heroImages),
      typewriterSentencesJson: JSON.stringify(defaultSiteConfig.typewriterSentences || []),
    }
  }

  // Parse services JSON and typewriter sentences for client convenience
  let services: any[] = []
  try {
    services = JSON.parse(settings.servicesJson || "[]")
  } catch {
    services = defaultSiteConfig.services
  }
  let typewriterSentences: string[] = []
  try {
    typewriterSentences = JSON.parse(settings.typewriterSentencesJson || "[]")
  } catch {
    typewriterSentences = defaultSiteConfig.typewriterSentences || []
  }

  return NextResponse.json({ settings, services, typewriterSentences })
}

/** Admin only — update site settings. */
export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const allowed = [
    "brand", "tagline", "workerName", "phone", "whatsapp", "email", "location",
    "yearsExperience", "jobsCompleted", "happyClients", "rating",
    "heroHeadline", "heroSubtext", "aboutTitle", "aboutBody",
    "servicesJson", "heroImagesJson", "typewriterSentencesJson", "companyName", "companyUen", "licenseInfo",
  ]

  const data: any = {}
  for (const k of allowed) {
    if (k in body) {
      if (["yearsExperience", "jobsCompleted", "happyClients"].includes(k)) {
        data[k] = parseInt(body[k], 10) || 0
      } else if (k === "rating") {
        data[k] = parseFloat(body[k]) || 0
      } else if (k === "servicesJson" || k === "heroImagesJson" || k === "typewriterSentencesJson") {
        data[k] = typeof body[k] === "string" ? body[k] : JSON.stringify(body[k] || [])
      } else {
        data[k] = String(body[k] ?? "")
      }
    }
  }

  // Persist to local JSON file for bulletproof reliability
  await writeLocalSettings({ id: "singleton", ...data })

  let settings: any = { id: "singleton", ...data }
  try {
    settings = await db.siteSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    })
  } catch {
    // Database offline — local file has preserved settings
  }

  try {
    revalidatePath("/")
  } catch {}

  return NextResponse.json({ settings, ok: true })
}
