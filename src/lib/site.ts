/**
 * Site configuration.
 *
 * Two layers:
 *   1. `defaultSiteConfig` — hardcoded fallback (used if no DB / no settings row).
 *   2. DB-driven `SiteSettings` row (editable from admin panel) — overrides defaults.
 *
 * `getSiteSettings()` runs server-side, fetches the DB row, and merges.
 * The merged result is passed down through HomeView props.
 */

export interface ServiceItem {
  key: string
  label: string
  icon: string
  desc: string
}

export interface SiteSettingsT {
  brand: string
  tagline: string
  workerName: string
  phone: string
  whatsapp: string
  email: string
  location: string
  yearsExperience: number
  jobsCompleted: number
  happyClients: number
  rating: number
  heroHeadline: string
  heroSubtext: string
  aboutTitle: string
  aboutBody: string
  services: ServiceItem[]
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { key: "plumbing", label: "Plumbing", icon: "Wrench", desc: "Leaks, taps, pipes, water heaters, toilets — fixed fast and guaranteed." },
  { key: "painting", label: "Painting", icon: "PaintRoller", desc: "HDB, condo, landed. Premium paints, neat edges, dust-free prep." },
  { key: "renovation", label: "Renovation", icon: "Hammer", desc: "Kitchen, toilet, full-home. Design-build with trusted sub-contractors." },
  { key: "electrical", label: "Electrical", icon: "Zap", desc: "Licensed (LEW) wiring, sockets, lighting, DB upgrades, EMA compliance." },
  { key: "interior", label: "Interior Works", icon: "Sofa", desc: "Carpentry, built-ins, feature walls, false ceilings, lighting design." },
  { key: "repair", label: "General Repair", icon: "Settings", desc: "Doors, locks, cabinets, tiles, grout, caulking. No job too small." },
]

export const defaultSiteConfig: SiteSettingsT = {
  brand: process.env.NEXT_PUBLIC_BRAND || "Ahmad HomeWorks",
  tagline: "Singapore's Trusted Handyman",
  workerName: process.env.NEXT_PUBLIC_WORKER_NAME || "Ahmad Rahman",
  phone: process.env.NEXT_PUBLIC_PHONE || "+65 9123 4567",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "6591234567",
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@ahmadhomeworks.sg",
  location: process.env.NEXT_PUBLIC_LOCATION || "Singapore · Islandwide",
  yearsExperience: 12,
  jobsCompleted: 540,
  happyClients: 320,
  rating: 4.9,
  heroHeadline: "Your home, expertly handled.",
  heroSubtext:
    "Singapore's trusted handyman for plumbing, painting, renovation, electrical and interior works.",
  aboutTitle: "Built on trust. Delivered with care.",
  aboutBody:
    "We are a Singapore-based home-services company with over a decade of hands-on experience across HDB flats, condominiums and landed homes. Our commitment is simple: show up when we say, do the job properly, and stand behind our work.",
  services: DEFAULT_SERVICES,
}

/**
 * Legacy static export — used by client components that don't yet receive
 * dynamic settings as props. We keep it for backwards-compat with code that
 * imports `siteConfig` directly.
 */
export const siteConfig = defaultSiteConfig

/** Server-side helper: load DB settings and merge with defaults. */
export async function loadSiteSettings(): Promise<SiteSettingsT> {
  // Lazy import — server-side only
  const { db } = await import("@/lib/db")
  let row = null
  try {
    row = await db.siteSettings.findUnique({ where: { id: "singleton" } })
    if (!row) {
      row = await db.siteSettings.create({ data: { id: "singleton" } })
    }
  } catch {
    // DB not available — fall through to defaults
    return defaultSiteConfig
  }

  let services: ServiceItem[] = DEFAULT_SERVICES
  try {
    const parsed = JSON.parse(row.servicesJson || "[]")
    if (Array.isArray(parsed) && parsed.length > 0) {
      services = parsed
    }
  } catch {
    // keep defaults
  }

  return {
    brand: row.brand || defaultSiteConfig.brand,
    tagline: row.tagline || defaultSiteConfig.tagline,
    workerName: row.workerName || defaultSiteConfig.workerName,
    phone: row.phone || defaultSiteConfig.phone,
    whatsapp: row.whatsapp || defaultSiteConfig.whatsapp,
    email: row.email || defaultSiteConfig.email,
    location: row.location || defaultSiteConfig.location,
    yearsExperience: row.yearsExperience ?? defaultSiteConfig.yearsExperience,
    jobsCompleted: row.jobsCompleted ?? defaultSiteConfig.jobsCompleted,
    happyClients: row.happyClients ?? defaultSiteConfig.happyClients,
    rating: row.rating ?? defaultSiteConfig.rating,
    heroHeadline: row.heroHeadline || defaultSiteConfig.heroHeadline,
    heroSubtext: row.heroSubtext || defaultSiteConfig.heroSubtext,
    aboutTitle: row.aboutTitle || defaultSiteConfig.aboutTitle,
    aboutBody: row.aboutBody || defaultSiteConfig.aboutBody,
    services,
  }
}

/** Build a wa.me URL with a pre-filled message. */
export function whatsappLink(settings: SiteSettingsT, message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${settings.whatsapp}${text}`
}

/** Build a context-aware WhatsApp message for a specific post. */
export function whatsappForPost(settings: SiteSettingsT, title: string, type: "portfolio" | "blog" | "showcase"): string {
  if (type === "blog") {
    return `Hi ${settings.workerName}, I read your blog post "${title}" and I'd like to chat about a job.`
  }
  return `Hi ${settings.workerName}, I saw your "${title}" work on your website. Can you give me a quote for a similar job?`
}
