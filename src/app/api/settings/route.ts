import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

/** Public — returns current site settings (creates default if missing). */
export async function GET() {
  let settings = await db.siteSettings.findUnique({ where: { id: "singleton" } })
  if (!settings) {
    settings = await db.siteSettings.create({ data: { id: "singleton" } })
  }
  // Parse services JSON for client convenience
  let services: any[] = []
  try {
    services = JSON.parse(settings.servicesJson || "[]")
  } catch {
    services = []
  }
  return NextResponse.json({ settings, services })
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
    "servicesJson",
  ]

  const data: any = {}
  for (const k of allowed) {
    if (k in body) {
      if (["yearsExperience", "jobsCompleted", "happyClients"].includes(k)) {
        data[k] = parseInt(body[k], 10) || 0
      } else if (k === "rating") {
        data[k] = parseFloat(body[k]) || 0
      } else if (k === "servicesJson") {
        // Accept either a string or an array
        data[k] = typeof body[k] === "string" ? body[k] : JSON.stringify(body[k] || [])
      } else {
        data[k] = String(body[k] ?? "")
      }
    }
  }

  // Upsert: create the singleton if it doesn't exist
  const settings = await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  })

  return NextResponse.json({ settings })
}
