import fs from "fs"
import path from "path"

export interface CustomSection {
  id: string
  title: string
  subtitle?: string
  slug: string
  enabled: boolean
  badge?: string
  order: number
  createdAt: string
  updatedAt: string
}

const SECTIONS_FILE = path.join(process.cwd(), "data", "custom-sections.json")

function ensureDirectoryExists() {
  const dir = path.dirname(SECTIONS_FILE)
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true })
    } catch {}
  }
}

export async function getCustomSections(): Promise<CustomSection[]> {
  ensureDirectoryExists()
  try {
    if (fs.existsSync(SECTIONS_FILE)) {
      const raw = fs.readFileSync(SECTIONS_FILE, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (err) {
    console.error("Error reading custom sections:", err)
  }
  return []
}

export async function saveCustomSection(data: Partial<CustomSection>): Promise<CustomSection> {
  ensureDirectoryExists()
  const sections = await getCustomSections()
  const now = new Date().toISOString()

  let id = data.id
  const isNew = !id || id === "new"

  if (isNew) {
    id = `section_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
  }

  const slug =
    data.slug ||
    (data.title || "section")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const sectionRecord: CustomSection = {
    id: id!,
    title: data.title || "Custom Section",
    subtitle: data.subtitle || "",
    badge: data.badge || "Updates",
    slug,
    enabled: data.enabled !== false,
    order: typeof data.order === "number" ? data.order : sections.length,
    createdAt: isNew ? now : data.createdAt || now,
    updatedAt: now,
  }

  const existingIndex = sections.findIndex((s) => s.id === id)
  if (existingIndex >= 0) {
    sections[existingIndex] = {
      ...sections[existingIndex],
      ...sectionRecord,
    }
  } else {
    sections.push(sectionRecord)
  }

  try {
    fs.writeFileSync(SECTIONS_FILE, JSON.stringify(sections, null, 2), "utf-8")
  } catch (err) {
    console.error("Failed writing custom sections to file:", err)
  }

  return sectionRecord
}

export async function deleteCustomSection(id: string): Promise<boolean> {
  ensureDirectoryExists()
  const sections = await getCustomSections()
  const filtered = sections.filter((s) => s.id !== id)

  try {
    fs.writeFileSync(SECTIONS_FILE, JSON.stringify(filtered, null, 2), "utf-8")
  } catch {}

  return true
}
