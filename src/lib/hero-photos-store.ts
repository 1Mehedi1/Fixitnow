import fs from "fs"
import path from "path"
import os from "os"
import { DEFAULT_HERO_IMAGES, normalizeImageUrl } from "./site"

declare global {
  // eslint-disable-next-line no-var
  var __heroPhotos: string[] | undefined
}

const HERO_FILE = path.join(process.cwd(), "data", "hero-photos.json")
const TMP_HERO_FILE = path.join(os.tmpdir(), "fixitnow-hero-photos.json")

function readJson(filePath: string): string[] | null {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((img: any) => normalizeImageUrl(String(img || "")))
      }
    }
  } catch {}
  return null
}

function writeJson(photos: string[]) {
  globalThis.__heroPhotos = photos

  try {
    const dir = path.dirname(HERO_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(HERO_FILE, JSON.stringify(photos, null, 2), "utf-8")
  } catch {}

  try {
    const tmpDir = path.dirname(TMP_HERO_FILE)
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    fs.writeFileSync(TMP_HERO_FILE, JSON.stringify(photos, null, 2), "utf-8")
  } catch {}
}

export async function getStoredHeroPhotos(): Promise<string[]> {
  if (globalThis.__heroPhotos && globalThis.__heroPhotos.length >= 4) {
    return globalThis.__heroPhotos
  }

  const fromTmp = readJson(TMP_HERO_FILE)
  if (fromTmp && fromTmp.length >= 4) {
    globalThis.__heroPhotos = fromTmp
    return fromTmp
  }

  const fromData = readJson(HERO_FILE)
  if (fromData && fromData.length >= 4) {
    globalThis.__heroPhotos = fromData
    return fromData
  }

  const fallback = [
    "https://files.catbox.moe/xx0tqh.jpg",
    "https://files.catbox.moe/fcb1g7.jpg",
    "https://files.catbox.moe/6pj5rs.jpg",
    "https://files.catbox.moe/g2969p.jpg",
  ]
  globalThis.__heroPhotos = fallback
  writeJson(fallback)
  return fallback
}

export async function saveStoredHeroPhotos(photos: string[]): Promise<string[]> {
  const current = await getStoredHeroPhotos()
  const cleaned: string[] = [0, 1, 2, 3].map((i) => {
    const p = photos[i]
    if (p && typeof p === "string" && p.trim()) {
      return normalizeImageUrl(p.trim())
    }
    return current[i] || DEFAULT_HERO_IMAGES[i]
  })

  writeJson(cleaned)

  // Sync to settings-store in background
  try {
    const { saveStoredSiteSettings } = await import("./settings-store")
    await saveStoredSiteSettings({ heroImages: cleaned })
  } catch {}

  return cleaned
}
