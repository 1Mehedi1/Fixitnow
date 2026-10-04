import fs from "fs"
import path from "path"
import os from "os"
import {
  defaultSiteConfig,
  type SiteSettingsT,
  type ServiceItem,
  DEFAULT_HERO_IMAGES,
  DEFAULT_TYPEWRITER_SENTENCES,
  DEFAULT_SERVICE_IMAGES,
  DEFAULT_SERVICE_RATES,
} from "./site"

declare global {
  // eslint-disable-next-line no-var
  var __memorySettings: SiteSettingsT | undefined
}

const DATA_FILE = path.join(process.cwd(), "data", "site-settings.json")
const TMP_FILE = path.join(os.tmpdir(), "fixitnow-site-settings.json")

/** Converts Google Drive sharing links or raw URLs into direct embeddable links. */
export function normalizeImageUrl(url: string): string {
  if (!url) return url
  const trimmed = url.trim()
  const gdMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/)
  if (gdMatch && gdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gdMatch[1]}`
  }
  return trimmed
}

function readJsonFile(filePath: string): any | null {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8")
      return JSON.parse(raw)
    }
  } catch {}
  return null
}

function writeJsonFile(settings: SiteSettingsT) {
  globalThis.__memorySettings = settings

  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(settings, null, 2), "utf-8")
  } catch {}

  try {
    const tmpDir = path.dirname(TMP_FILE)
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    fs.writeFileSync(TMP_FILE, JSON.stringify(settings, null, 2), "utf-8")
  } catch {}
}

export function parseRawSettings(raw: any): SiteSettingsT {
  if (!raw) return defaultSiteConfig

  let services: ServiceItem[] = defaultSiteConfig.services
  try {
    const parsed = typeof raw.servicesJson === "string" ? JSON.parse(raw.servicesJson) : raw.services
    if (Array.isArray(parsed) && parsed.length > 0) {
      services = parsed.map((svc: any) => ({
        ...svc,
        bgImage: normalizeImageUrl(svc.bgImage || DEFAULT_SERVICE_IMAGES[svc.key] || DEFAULT_SERVICE_IMAGES["repair"]),
        rates: Array.isArray(svc.rates) && svc.rates.length > 0 ? svc.rates : (DEFAULT_SERVICE_RATES[svc.key] || []),
      }))
    }
  } catch {}

  let heroImages: string[] = defaultSiteConfig.heroImages
  try {
    const parsedImgs = typeof raw.heroImagesJson === "string" ? JSON.parse(raw.heroImagesJson) : raw.heroImages
    if (Array.isArray(parsedImgs) && parsedImgs.length > 0) {
      heroImages = parsedImgs.map((img: any) => normalizeImageUrl(typeof img === "string" ? img : String(img || "")))
    }
  } catch {}

  let typewriterSentences: string[] = defaultSiteConfig.typewriterSentences || DEFAULT_TYPEWRITER_SENTENCES
  try {
    const parsedSentences = typeof raw.typewriterSentencesJson === "string"
      ? JSON.parse(raw.typewriterSentencesJson)
      : raw.typewriterSentences
    if (Array.isArray(parsedSentences) && parsedSentences.length > 0) {
      typewriterSentences = parsedSentences
    }
  } catch {}

  return {
    brand: raw.brand || defaultSiteConfig.brand,
    tagline: raw.tagline || defaultSiteConfig.tagline,
    workerName: raw.workerName || defaultSiteConfig.workerName,
    phone: raw.phone || defaultSiteConfig.phone,
    whatsapp: raw.whatsapp || defaultSiteConfig.whatsapp,
    email: raw.email || defaultSiteConfig.email,
    location: raw.location || defaultSiteConfig.location,
    yearsExperience: raw.yearsExperience ?? defaultSiteConfig.yearsExperience,
    jobsCompleted: raw.jobsCompleted ?? defaultSiteConfig.jobsCompleted,
    happyClients: raw.happyClients ?? defaultSiteConfig.happyClients,
    rating: raw.rating ?? defaultSiteConfig.rating,
    heroHeadline: raw.heroHeadline || defaultSiteConfig.heroHeadline,
    heroSubtext: raw.heroSubtext || defaultSiteConfig.heroSubtext,
    typewriterSentences,
    aboutTitle: raw.aboutTitle || defaultSiteConfig.aboutTitle,
    aboutBody: raw.aboutBody || defaultSiteConfig.aboutBody,
    services,
    heroImages,
    companyName: raw.companyName || defaultSiteConfig.companyName,
    companyUen: raw.companyUen || defaultSiteConfig.companyUen,
    licenseInfo: raw.licenseInfo || defaultSiteConfig.licenseInfo,
  }
}

export async function getStoredSiteSettings(): Promise<SiteSettingsT> {
  // 1. In-memory cache
  if (globalThis.__memorySettings) {
    return globalThis.__memorySettings
  }

  // 2. /tmp file (serverless lambda writable)
  const fromTmp = readJsonFile(TMP_FILE)
  if (fromTmp) {
    const parsed = parseRawSettings(fromTmp)
    globalThis.__memorySettings = parsed
    return parsed
  }

  // 3. data/site-settings.json
  const fromData = readJsonFile(DATA_FILE)
  if (fromData) {
    const parsed = parseRawSettings(fromData)
    globalThis.__memorySettings = parsed
    return parsed
  }

  // 4. Prisma if configured
  try {
    const hasValidPostgres =
      Boolean(process.env.DATABASE_URL) &&
      (process.env.DATABASE_URL!.startsWith("postgresql://") ||
        process.env.DATABASE_URL!.startsWith("postgres://"))

    if (hasValidPostgres) {
      const { db } = await import("@/lib/db")
      const row = await db.siteSettings.findUnique({ where: { id: "singleton" } })
      if (row) {
        const parsed = parseRawSettings(row)
        writeJsonFile(parsed)
        return parsed
      }
    }
  } catch {}

  // 5. Default
  globalThis.__memorySettings = defaultSiteConfig
  writeJsonFile(defaultSiteConfig)
  return defaultSiteConfig
}

export async function saveStoredSiteSettings(data: any): Promise<SiteSettingsT> {
  const current = await getStoredSiteSettings()

  let heroImages = current.heroImages
  if (Array.isArray(data.heroImages)) {
    heroImages = data.heroImages.map((img: any) => normalizeImageUrl(String(img || "")))
  } else if (typeof data.heroImagesJson === "string") {
    try {
      const parsed = JSON.parse(data.heroImagesJson)
      if (Array.isArray(parsed)) {
        heroImages = parsed.map((img: any) => normalizeImageUrl(String(img || "")))
      }
    } catch {}
  }

  let services = current.services
  if (Array.isArray(data.services)) {
    services = data.services
  } else if (typeof data.servicesJson === "string") {
    try {
      const parsed = JSON.parse(data.servicesJson)
      if (Array.isArray(parsed)) services = parsed
    } catch {}
  }

  let typewriterSentences = current.typewriterSentences
  if (Array.isArray(data.typewriterSentences)) {
    typewriterSentences = data.typewriterSentences
  } else if (typeof data.typewriterSentencesJson === "string") {
    try {
      const parsed = JSON.parse(data.typewriterSentencesJson)
      if (Array.isArray(parsed)) typewriterSentences = parsed
    } catch {}
  }

  const mergedRaw = {
    ...current,
    ...data,
    heroImages,
    heroImagesJson: JSON.stringify(heroImages),
    services,
    servicesJson: JSON.stringify(services),
    typewriterSentences,
    typewriterSentencesJson: JSON.stringify(typewriterSentences),
  }
  const settings = parseRawSettings(mergedRaw)
  writeJsonFile(settings)

  // Background sync to Prisma if configured
  try {
    const hasValidPostgres =
      Boolean(process.env.DATABASE_URL) &&
      (process.env.DATABASE_URL!.startsWith("postgresql://") ||
        process.env.DATABASE_URL!.startsWith("postgres://"))

    if (hasValidPostgres) {
      const { db } = await import("@/lib/db")
      const prismaPayload = {
        brand: settings.brand,
        tagline: settings.tagline,
        workerName: settings.workerName,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        location: settings.location,
        yearsExperience: settings.yearsExperience,
        jobsCompleted: settings.jobsCompleted,
        happyClients: settings.happyClients,
        rating: settings.rating,
        heroHeadline: settings.heroHeadline,
        heroSubtext: settings.heroSubtext,
        aboutTitle: settings.aboutTitle,
        aboutBody: settings.aboutBody,
        servicesJson: JSON.stringify(settings.services),
        heroImagesJson: JSON.stringify(settings.heroImages),
        typewriterSentencesJson: JSON.stringify(settings.typewriterSentences),
        companyName: settings.companyName,
        companyUen: settings.companyUen,
        licenseInfo: settings.licenseInfo,
      }
      await db.siteSettings.upsert({
        where: { id: "singleton" },
        update: prismaPayload,
        create: { id: "singleton", ...prismaPayload },
      })
    }
  } catch {}

  return settings
}
