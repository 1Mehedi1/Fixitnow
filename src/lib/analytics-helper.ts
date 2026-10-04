import fs from "fs/promises"
import path from "path"
import os from "os"

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
  visitorId?: string | null
  isNewVisitor?: boolean
  loadTime?: number | null
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
  referrerCategory?: "Organic Search" | "Direct" | "Referral" | "Social" | "Paid / Ads" | "Other"
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

export function parseReferrerCategory(ref: string | null): "Organic Search" | "Direct" | "Referral" | "Social" | "Paid / Ads" | "Other" {
  if (!ref || ref === "Direct / Bookmark") return "Direct"
  try {
    const url = new URL(ref)
    const host = url.hostname.toLowerCase()
    const search = url.search.toLowerCase()
    if (search.includes("utm_medium=cpc") || search.includes("utm_medium=paid") || search.includes("gclid=") || search.includes("fbclid=")) {
      return "Paid / Ads"
    }
    if (host.includes("google") || host.includes("bing") || host.includes("yahoo") || host.includes("duckduckgo")) {
      return "Organic Search"
    }
    if (
      host.includes("facebook") ||
      host.includes("fb.me") ||
      host.includes("instagram") ||
      host.includes("tiktok") ||
      host.includes("whatsapp") ||
      host.includes("wa.me") ||
      host.includes("twitter") ||
      host.includes("x.com") ||
      host.includes("linkedin")
    ) {
      return "Social"
    }
    return "Referral"
  } catch {
    return "Direct"
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

// Multi-tier storage paths:
// Tier 1: In-memory global array
// Tier 2: /tmp/fixitnow-analytics.json (100% writable on Vercel and Linux/macOS/Windows)
// Tier 3: data/analytics-events.json (when cwd is writable)

declare global {
  // eslint-disable-next-line no-var
  var __fixitnow_analytics_events: AnalyticsEventRecord[] | undefined
}

const TMP_FILE = path.join(os.tmpdir(), "fixitnow-analytics.json")
const DATA_FILE = path.join(process.cwd(), "data", "analytics-events.json")

export async function saveLocalAnalyticsEvent(record: AnalyticsEventRecord) {
  // 1. In-memory
  if (!globalThis.__fixitnow_analytics_events) {
    globalThis.__fixitnow_analytics_events = []
  }
  globalThis.__fixitnow_analytics_events.unshift(record)
  if (globalThis.__fixitnow_analytics_events.length > 5000) {
    globalThis.__fixitnow_analytics_events = globalThis.__fixitnow_analytics_events.slice(0, 5000)
  }

  // 2. Writable temp file
  try {
    let existing: AnalyticsEventRecord[] = []
    try {
      const raw = await fs.readFile(TMP_FILE, "utf-8")
      existing = JSON.parse(raw)
      if (!Array.isArray(existing)) existing = []
    } catch {
      existing = []
    }
    existing.unshift(record)
    if (existing.length > 5000) existing = existing.slice(0, 5000)
    await fs.writeFile(TMP_FILE, JSON.stringify(existing, null, 2), "utf-8")
  } catch (tmpErr) {
    console.warn("Failed to write to tmp analytics file:", tmpErr)
  }

  // 3. Project data file if writable
  try {
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })
    let existingData: AnalyticsEventRecord[] = []
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8")
      existingData = JSON.parse(raw)
      if (!Array.isArray(existingData)) existingData = []
    } catch {
      existingData = []
    }
    existingData.unshift(record)
    if (existingData.length > 5000) existingData = existingData.slice(0, 5000)
    await fs.writeFile(DATA_FILE, JSON.stringify(existingData, null, 2), "utf-8")
  } catch {
    // Expected on read-only serverless filesystems
  }
}

export async function loadLocalAnalyticsEvents(): Promise<AnalyticsEventRecord[]> {
  const map = new Map<string, AnalyticsEventRecord>()

  // 1. From global in-memory
  if (globalThis.__fixitnow_analytics_events && Array.isArray(globalThis.__fixitnow_analytics_events)) {
    for (const e of globalThis.__fixitnow_analytics_events) {
      if (e && e.id) map.set(e.id, e)
    }
  }

  // 2. From tmp file
  try {
    const raw = await fs.readFile(TMP_FILE, "utf-8")
    const list = JSON.parse(raw)
    if (Array.isArray(list)) {
      for (const e of list) {
        if (e && e.id && !map.has(e.id)) map.set(e.id, e)
      }
    }
  } catch {}

  // 3. From project data file
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    const list = JSON.parse(raw)
    if (Array.isArray(list)) {
      for (const e of list) {
        if (e && e.id && !map.has(e.id)) map.set(e.id, e)
      }
    }
  } catch {}

  const merged = Array.from(map.values())
  merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return merged
}

export async function clearLocalAnalyticsEvents(): Promise<boolean> {
  globalThis.__fixitnow_analytics_events = []
  try {
    await fs.writeFile(TMP_FILE, "[]", "utf-8")
  } catch {}
  try {
    await fs.writeFile(DATA_FILE, "[]", "utf-8")
  } catch {}
  return true
}
