import fs from "fs/promises"
import path from "path"

export interface ParsedVisitorMeta {
  device: "Mobile" | "Desktop" | "Tablet"
  browser: string
  os: string
  country: string
  countryCode: string
  countryFlag: string
  city: string
  referrerSource: string
}

export interface AnalyticsEventRecord {
  id: string
  eventType: string
  postId?: string | null
  session?: string | null
  duration?: number | null
  path?: string | null
  device?: string
  browser?: string
  os?: string
  country?: string
  countryCode?: string
  countryFlag?: string
  city?: string
  referrer?: string
  createdAt: string
}

const COUNTRY_FLAGS: Record<string, { name: string; flag: string }> = {
  SG: { name: "Singapore", flag: "🇸🇬" },
  MY: { name: "Malaysia", flag: "🇲🇾" },
  ID: { name: "Indonesia", flag: "🇮🇩" },
  US: { name: "United States", flag: "🇺🇸" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  AU: { name: "Australia", flag: "🇦🇺" },
  IN: { name: "India", flag: "🇮🇳" },
  CN: { name: "China", flag: "🇨🇳" },
  TH: { name: "Thailand", flag: "🇹🇭" },
  PH: { name: "Philippines", flag: "🇵🇭" },
  VN: { name: "Vietnam", flag: "🇻🇳" },
  HK: { name: "Hong Kong", flag: "🇭🇰" },
  TW: { name: "Taiwan", flag: "🇹🇼" },
  JP: { name: "Japan", flag: "🇯🇵" },
  KR: { name: "South Korea", flag: "🇰🇷" },
  DE: { name: "Germany", flag: "🇩🇪" },
  FR: { name: "France", flag: "🇫🇷" },
  CA: { name: "Canada", flag: "🇨🇦" },
  NL: { name: "Netherlands", flag: "🇳🇱" },
  AE: { name: "United Arab Emirates", flag: "🇦🇪" },
}

export function parseUserAgent(ua: string | null): { device: "Mobile" | "Desktop" | "Tablet"; browser: string; os: string } {
  if (!ua) {
    return { device: "Mobile", browser: "Mobile Browser", os: "Mobile OS" }
  }

  // Device detection
  let device: "Mobile" | "Desktop" | "Tablet" = "Desktop"
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    device = "Tablet"
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    device = "Mobile"
  }

  // OS detection
  let os = "Other"
  if (/windows/i.test(ua)) os = "Windows"
  else if (/macintosh|mac os x/i.test(ua) && !/iphone|ipad/i.test(ua)) os = "macOS"
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS"
  else if (/android/i.test(ua)) os = "Android"
  else if (/linux/i.test(ua)) os = "Linux"

  // Browser detection
  let browser = "Other"
  if (/edg\//i.test(ua)) browser = "Edge"
  else if (/samsungbrowser/i.test(ua)) browser = "Samsung Internet"
  else if (/chrome|crios/i.test(ua) && !/edg\//i.test(ua) && !/opr\//i.test(ua)) browser = "Chrome"
  else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) browser = "Safari"
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox"
  else if (/opr\/|opera/i.test(ua)) browser = "Opera"

  return { device, browser, os }
}

export function parseReferrer(ref: string | null): string {
  if (!ref) return "Direct / Bookmark"
  try {
    const url = new URL(ref)
    const host = url.hostname.toLowerCase()
    if (host.includes("google")) return "Google Search"
    if (host.includes("whatsapp") || host.includes("wa.me")) return "WhatsApp"
    if (host.includes("facebook") || host.includes("fb.me")) return "Facebook"
    if (host.includes("instagram")) return "Instagram"
    if (host.includes("tiktok")) return "TikTok"
    if (host.includes("linkedin")) return "LinkedIn"
    if (host.includes("twitter") || host.includes("t.co") || host.includes("x.com")) return "X (Twitter)"
    if (host.includes("youtube")) return "YouTube"
    if (host.includes("bing")) return "Bing Search"
    if (host.includes("yahoo")) return "Yahoo"
    return host.replace(/^www\./, "")
  } catch {
    return "Direct / Bookmark"
  }
}

export function parseGeoLocation(headers: Headers, clientMeta?: any): { country: string; countryCode: string; countryFlag: string; city: string } {
  // Check standard CDN & edge headers
  let code = (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    clientMeta?.countryCode ||
    ""
  ).toUpperCase()

  let city = (
    headers.get("x-vercel-ip-city") ||
    headers.get("cf-ipcity") ||
    clientMeta?.city ||
    ""
  )

  // Default to Singapore for local/unresolved Singapore home-services traffic
  if (!code || code === "XX" || code === "T1" || code === "LOCAL") {
    code = "SG"
    city = city || "Singapore"
  }

  const lookup = COUNTRY_FLAGS[code] || { name: code || "Singapore", flag: "🌐" }
  return {
    country: lookup.name,
    countryCode: code,
    countryFlag: lookup.flag,
    city: city || lookup.name,
  }
}

const EVENTS_FILE = path.join(process.cwd(), "data", "analytics-events.json")

export async function saveLocalAnalyticsEvent(record: AnalyticsEventRecord) {
  try {
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    let existing: AnalyticsEventRecord[] = []
    try {
      const raw = await fs.readFile(EVENTS_FILE, "utf-8")
      existing = JSON.parse(raw)
      if (!Array.isArray(existing)) existing = []
    } catch {
      existing = []
    }

    // Keep last 5,000 events
    existing.unshift(record)
    if (existing.length > 5000) {
      existing = existing.slice(0, 5000)
    }

    await fs.writeFile(EVENTS_FILE, JSON.stringify(existing, null, 2), "utf-8")
  } catch (err) {
    console.warn("Failed to persist local analytics event:", err)
  }
}

export async function loadLocalAnalyticsEvents(): Promise<AnalyticsEventRecord[]> {
  try {
    const raw = await fs.readFile(EVENTS_FILE, "utf-8")
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export async function clearLocalAnalyticsEvents(): Promise<boolean> {
  try {
    await fs.writeFile(EVENTS_FILE, "[]", "utf-8")
    return true
  } catch {
    return false
  }
}
