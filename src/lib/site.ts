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

export interface RateItem {
  id?: string
  name: string
  price: string
  unit: string
  details: string
}

export interface ServiceItem {
  key: string
  label: string
  icon: string
  desc: string
  bgImage?: string
  rates?: RateItem[]
}

export const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  plumbing: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
  painting: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
  renovation: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  interior: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  repair: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80",
}

export const DEFAULT_SERVICE_RATES: Record<string, RateItem[]> = {
  plumbing: [
    { name: "Leaking Tap or Valve Replacement", price: "$60 – $110", unit: "per set", details: "Includes new washer/valves, thread sealing and testing" },
    { name: "Toilet Bowl Flush Mechanism Repair", price: "$80 – $140", unit: "per set", details: "Syphon replacement, inlet valve and water level tune" },
    { name: "Kitchen or Basin Bottle Trap Clear / Replace", price: "$70 – $130", unit: "per point", details: "Clearing stubborn chokes, replacing PVC/chrome traps" },
    { name: "Storage or Instant Water Heater Install", price: "$120 – $220", unit: "per unit", details: "Secure mounting, pipe connection and leak inspection" },
  ],
  electrical: [
    { name: "Lighting Fixture / Ceiling Fan Replacement", price: "$50 – $100", unit: "per point", details: "Safe mounting, wiring termination and switch test" },
    { name: "Power Socket Replacement (Single/Double)", price: "$45 – $85", unit: "per point", details: "Safety standard compliant, earthing verification" },
    { name: "Circuit Breaker / DB Box Trip Troubleshooting", price: "$90 – $160", unit: "per job", details: "Isolating faulty appliances or shorted cables" },
    { name: "Switch & Dimmer Replacement", price: "$45 – $75", unit: "per gang", details: "Standard or designer switch installation" },
  ],
  painting: [
    { name: "Single Room Refresh / Water Mark Patch", price: "$180 – $320", unit: "per room", details: "Surface prep, sealer and 2 coats premium Nippon/Dulux" },
    { name: "HDB 3-Room Full Unit Painting", price: "$750 – $950", unit: "full flat", details: "Walls, ceilings, door frames with dust protection" },
    { name: "HDB 4-Room Full Unit Painting", price: "$950 – $1,250", unit: "full flat", details: "Full masking, cracks filling, premium low-VOC paint" },
    { name: "HDB 5-Room / Executive Painting", price: "$1,200 – $1,600", unit: "full flat", details: "Complete interior makeover with 1-year paint warranty" },
  ],
  repair: [
    { name: "Door Lock & Handle Replacement", price: "$75 – $140", unit: "per set", details: "Mortise locks, lever handles, cylinder replacement" },
    { name: "Cabinet Soft-Close Hinges Replacement", price: "$60 – $120", unit: "per set (4 pcs)", details: "Aligning sagging cabinet doors and smooth operation" },
    { name: "Bathroom Silicone Mould Removal & Resealing", price: "$70 – $130", unit: "per perimeter", details: "Anti-fungal sanitary grade silicone, clean straight beads" },
    { name: "Wall Drilling & Heavy Mounting", price: "$50 – $90", unit: "first 2 items", details: "Mirrors, TV brackets, shelves with wall plug anchors" },
  ],
  renovation: [
    { name: "Full Toilet / Bathroom Overhaul", price: "$2,800 – $4,500", unit: "per bathroom", details: "Waterproofing, tiling, sanitary ware installation, debris disposal" },
    { name: "Kitchen Cabinet Carpentry & Countertop", price: "$150 – $280", unit: "per foot run", details: "High-pressure laminate, soft-close hinges, quartz top options" },
    { name: "Vinyl Flooring Supply & Lay", price: "$4.50 – $7.50", unit: "per sqft", details: "Heavy duty 5mm click vinyl with EVA underlay" },
    { name: "Feature Wall & False Ceiling Installation", price: "$120 – $240", unit: "per foot", details: "Concealed LED lighting trough, plaster finish" },
  ],
  interior: [
    { name: "Custom Built-in Wardrobe / Cabinetry", price: "$240 – $360", unit: "per foot run", details: "Internal color PVC, soft-close Blum hinges, aluminum trim" },
    { name: "False Ceiling & L-Box Plastering", price: "$4.50 – $8.00", unit: "per sqft / foot run", details: "Seamless gypsum board jointing with LED strip recesses" },
    { name: "Door Frame & Timber Architrave Repair", price: "$90 – $180", unit: "per door", details: "Planed edges, re-hinged alignment, touch-up painting" },
    { name: "Curtain Track & Blind Installation", price: "$40 – $75", unit: "per window", details: "Precision laser alignment and heavy duty wall plugs" },
  ],
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
  heroImages: string[]
  companyName: string
  companyUen: string
  licenseInfo: string
}

export const DEFAULT_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=70",
]

const DEFAULT_SERVICES: ServiceItem[] = [
  { key: "plumbing", label: "Plumbing", icon: "Wrench", desc: "Leaks, taps, pipes, water heaters, toilets — fixed fast and guaranteed.", bgImage: DEFAULT_SERVICE_IMAGES.plumbing, rates: DEFAULT_SERVICE_RATES.plumbing },
  { key: "painting", label: "Painting", icon: "PaintRoller", desc: "HDB, condo, landed. Premium paints, neat edges, dust-free prep.", bgImage: DEFAULT_SERVICE_IMAGES.painting, rates: DEFAULT_SERVICE_RATES.painting },
  { key: "renovation", label: "Renovation", icon: "Hammer", desc: "Kitchen, toilet, full-home. Design-build with trusted sub-contractors.", bgImage: DEFAULT_SERVICE_IMAGES.renovation, rates: DEFAULT_SERVICE_RATES.renovation },
  { key: "electrical", label: "Electrical", icon: "Zap", desc: "Licensed (LEW) wiring, sockets, lighting, DB upgrades, EMA compliance.", bgImage: DEFAULT_SERVICE_IMAGES.electrical, rates: DEFAULT_SERVICE_RATES.electrical },
  { key: "interior", label: "Interior Works", icon: "Sofa", desc: "Carpentry, built-ins, feature walls, false ceilings, lighting design.", bgImage: DEFAULT_SERVICE_IMAGES.interior, rates: DEFAULT_SERVICE_RATES.interior },
  { key: "repair", label: "General Repair", icon: "Settings", desc: "Doors, locks, cabinets, tiles, grout, caulking. No job too small.", bgImage: DEFAULT_SERVICE_IMAGES.repair, rates: DEFAULT_SERVICE_RATES.repair },
]

export const defaultSiteConfig: SiteSettingsT = {
  brand: process.env.NEXT_PUBLIC_BRAND || "Fixitnow",
  tagline: "Singapore's Trusted Handyman",
  workerName: process.env.NEXT_PUBLIC_WORKER_NAME || "Ahmad Rahman",
  phone: process.env.NEXT_PUBLIC_PHONE || "+65 9123 4567",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "6591234567",
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@ahmadhomeworks.sg",
  location: process.env.NEXT_PUBLIC_LOCATION || "Singapore · Islandwide",
  yearsExperience: 12,
  jobsCompleted: 540,
  happyClients: 320,
  rating: 4.5,
  heroHeadline: "Your home, expertly handled.",
  heroSubtext:
    "Singapore's trusted handyman for plumbing, painting, renovation, electrical and interior works.",
  aboutTitle: "Built on trust. Delivered with care.",
  aboutBody:
    "We are a Singapore-based home-services company with over a decade of hands-on experience across HDB flats, condominiums and landed homes. Our commitment is simple: show up when we say, do the job properly, and stand behind our work.",
  services: DEFAULT_SERVICES,
  heroImages: DEFAULT_HERO_IMAGES,
  companyName: "4R ENGINEERING PTE. LTD.",
  companyUen: "202143324G",
  licenseInfo: "MOM Registered Construction Work Permit · Employment of Foreign Manpower Act",
}

/**
 * Legacy static export — used by client components that don't yet receive
 * dynamic settings as props. We keep it for backwards-compat with code that
 * imports `siteConfig` directly.
 */
export const siteConfig = defaultSiteConfig

/** Server-side helper: load DB settings and merge with defaults. */
export async function loadSiteSettings(): Promise<SiteSettingsT> {
  const hasValidPostgres =
    Boolean(process.env.DATABASE_URL) &&
    (process.env.DATABASE_URL!.startsWith("postgresql://") ||
      process.env.DATABASE_URL!.startsWith("postgres://"))

  if (!hasValidPostgres) {
    return defaultSiteConfig
  }

  // Lazy import — server-side only
  const { db } = await import("@/lib/db")
  let row: import("@prisma/client").SiteSettings | null = null
  try {
    row = await db.siteSettings.findUnique({ where: { id: "singleton" } })
    if (!row) {
      row = await db.siteSettings.create({ data: { id: "singleton" } })
    }
  } catch {
    // DB not available — fall through to defaults
    return defaultSiteConfig
  }

  if (!row) {
    return defaultSiteConfig
  }

  let services: ServiceItem[] = DEFAULT_SERVICES
  try {
    const parsed = JSON.parse(row.servicesJson || "[]")
    if (Array.isArray(parsed) && parsed.length > 0) {
      services = parsed.map((svc) => ({
        ...svc,
        bgImage: svc.bgImage || DEFAULT_SERVICE_IMAGES[svc.key] || DEFAULT_SERVICE_IMAGES["repair"],
        rates: Array.isArray(svc.rates) && svc.rates.length > 0 ? svc.rates : (DEFAULT_SERVICE_RATES[svc.key] || []),
      }))
    }
  } catch {
    // keep defaults
  }

  let heroImages: string[] = DEFAULT_HERO_IMAGES
  try {
    const parsedImgs = JSON.parse(row.heroImagesJson || "[]")
    if (Array.isArray(parsedImgs) && parsedImgs.length > 0) {
      heroImages = parsedImgs
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
    heroImages,
    companyName: row.companyName || defaultSiteConfig.companyName,
    companyUen: row.companyUen || defaultSiteConfig.companyUen,
    licenseInfo: row.licenseInfo || defaultSiteConfig.licenseInfo,
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
