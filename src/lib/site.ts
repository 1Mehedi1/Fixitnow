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
  subcategories?: string[]
}

export const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  roofing: "https://files.catbox.moe/g2969p.jpg",
  painting: "https://files.catbox.moe/6pj5rs.jpg",
  plumbing: "https://files.catbox.moe/dmagw6.png",
  renovation: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  interior: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  repair: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80",
}

export const DEFAULT_SERVICE_RATES: Record<string, RateItem[]> = {
  roofing: [
    { name: "Water proofing", price: "$450 – $1,200", unit: "per area", details: "Multi-layer polyurethane / cementitious membrane coating with water flood test" },
    { name: "Roof leaking repair", price: "$180 – $480", unit: "per leak point", details: "Targeted leak detection, flashing sealing, tile crack patching & seal check" },
    { name: "Canopy repairing", price: "$220 – $550", unit: "per canopy", details: "Polycarbonate/glass panel resealing, frame joint restoration & anti-rust" },
    { name: "Roof tiles installation", price: "$280 – $650", unit: "per section", details: "Ridge capping, replacement of cracked clay/concrete tiles & mortar realignment" },
  ],
  painting: [
    { name: "Painting", price: "$180 – $350", unit: "per room", details: "Surface prep, sealer and 2 coats premium Nippon/Dulux low-VOC paint" },
    { name: "Epoxy painting", price: "$350 – $750", unit: "per area", details: "Heavy-duty epoxy floor & wall coating for kitchens, toilets & carparks" },
    { name: "House painting", price: "$850 – $1,450", unit: "full flat", details: "Complete interior overhaul for 3/4/5-room HDB and condominiums" },
    { name: "Office painting", price: "$650 – $1,800", unit: "per unit", details: "Commercial grade fast-drying coatings, after-office hours execution" },
    { name: "Indoors and outdoors painting", price: "$300 – $850", unit: "per zone", details: "Weather-resistant exterior acrylic paint & interior mold-resistant finishes" },
  ],
  plumbing: [
    { name: "Toilet leaking repair", price: "$80 – $150", unit: "per point", details: "Concealed or exposed toilet pipe, valve, inlet siphon & pan collar leak sealing" },
  ],
}

export const DEFAULT_TYPEWRITER_SENTENCES: string[] = [
  "Your home, expertly handled.",
  "Roofing & waterproofing, guaranteed leak-free.",
  "Interior & exterior painting, dust-free prep guaranteed.",
  "Fast plumbing & toilet leak repairs across Singapore.",
  "Trusted craftsmanship, islandwide across Singapore.",
]

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
  typewriterSentences?: string[]
  aboutTitle: string
  aboutBody: string
  services: ServiceItem[]
  heroImages: string[]
  companyName: string
  companyUen: string
  licenseInfo: string
  portfolioTitle?: string
  portfolioSubtitle?: string
  beforeAfterTitle?: string
  beforeAfterSubtitle?: string
}

export const DEFAULT_HERO_IMAGES = [
  "/hero/hero-1.webp",
  "/hero/hero-2.webp",
  "/hero/hero-3.webp",
  "/hero/hero-4.webp",
]

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    key: "roofing",
    label: "Roofing & Waterproofing",
    icon: "Home",
    desc: "Waterproofing, roof leak repairs, canopy restoration and roof tiles installation.",
    bgImage: DEFAULT_SERVICE_IMAGES.roofing,
    rates: DEFAULT_SERVICE_RATES.roofing,
    subcategories: ["Water proofing", "Roof leaking repair", "Canopy repairing", "Roof tiles installation"],
  },
  {
    key: "painting",
    label: "Painting Services",
    icon: "PaintRoller",
    desc: "Epoxy painting, house painting, office painting, and indoors & outdoors painting.",
    bgImage: DEFAULT_SERVICE_IMAGES.painting,
    rates: DEFAULT_SERVICE_RATES.painting,
    subcategories: ["Painting", "Epoxy painting", "House painting", "Office painting", "Indoors and outdoors painting"],
  },
  {
    key: "plumbing",
    label: "Plumbing Services",
    icon: "Wrench",
    desc: "Toilet leaking repairs, concealed pipe leak fixes, valves and tap replacements.",
    bgImage: DEFAULT_SERVICE_IMAGES.plumbing,
    rates: DEFAULT_SERVICE_RATES.plumbing,
    subcategories: ["Toilet leaking repair"],
  },
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
    "Singapore's trusted specialist for roofing & waterproofing, painting services, and plumbing repair.",
  typewriterSentences: DEFAULT_TYPEWRITER_SENTENCES,
  aboutTitle: "Built on trust. Delivered with care.",
  aboutBody:
    "We are a Singapore-based home-services company with over a decade of hands-on experience across HDB flats, condominiums and landed homes. Our commitment is simple: show up when we say, do the job properly, and stand behind our work.",
  services: DEFAULT_SERVICES,
  heroImages: DEFAULT_HERO_IMAGES,
  companyName: "4R ENGINEERING PTE. LTD.",
  companyUen: "202143324G",
  licenseInfo: "ACRA Registered Entity · Company: 4R ENGINEERING PTE. LTD.",
  portfolioTitle: "Portfolio Selected work",
  portfolioSubtitle:
    "Recent roofing & waterproofing, painting services, and plumbing jobs completed across Singapore. Tap any card for the full story.",
  beforeAfterTitle: "See the difference.",
  beforeAfterSubtitle:
    "Drag any slider to compare before and after. Real jobs, real transformations.",
}

/**
 * Legacy static export — used by client components that don't yet receive
 * dynamic settings as props. We keep it for backwards-compat with code that
 * imports `siteConfig` directly.
 */
export const siteConfig = defaultSiteConfig

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
