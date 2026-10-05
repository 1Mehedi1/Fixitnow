import fs from "fs"
import path from "path"
import os from "os"
import { FALLBACK_TESTIMONIALS } from "./fallback-data"
import type { Testimonial } from "@prisma/client"

export type StoredTestimonial = Testimonial

declare global {
  // eslint-disable-next-line no-var
  var __memoryTestimonials: StoredTestimonial[] | undefined
}

const DATA_FILE = path.join(process.cwd(), "data", "testimonials.json")
const TMP_FILE = path.join(os.tmpdir(), "fixitnow-testimonials.json")

function readJsonFile(filePath: string): StoredTestimonial[] | null {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {}
  return null
}

import { saveJsonBlob, readJsonBlob } from "./storage-sync"

async function writeJsonFile(items: StoredTestimonial[]) {
  globalThis.__memoryTestimonials = items

  // Sync to Vercel Blob if available (awaited to guarantee persistence before Lambda completes)
  try {
    await saveJsonBlob("store/testimonials.json", items)
  } catch (err) {
    console.warn("Error persisting testimonials to Vercel Blob:", err)
  }

  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8")
  } catch {}

  try {
    const tmpDir = path.dirname(TMP_FILE)
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    fs.writeFileSync(TMP_FILE, JSON.stringify(items, null, 2), "utf-8")
  } catch {}
}

export async function getStoredTestimonials(): Promise<StoredTestimonial[]> {
  // 1. Try Vercel Blob first so cross-device sync always gets the latest cloud data!
  try {
    const fromBlob = await readJsonBlob<StoredTestimonial[]>("store/testimonials.json")
    if (fromBlob && Array.isArray(fromBlob) && fromBlob.length > 0) {
      globalThis.__memoryTestimonials = fromBlob
      return fromBlob
    }
  } catch {}

  // 2. In-memory cache
  if (globalThis.__memoryTestimonials && globalThis.__memoryTestimonials.length > 0) {
    return globalThis.__memoryTestimonials
  }

  // 3. Try /tmp
  const fromTmp = readJsonFile(TMP_FILE)
  if (fromTmp) {
    globalThis.__memoryTestimonials = fromTmp
    return fromTmp
  }

  // 4. Try data file
  const fromData = readJsonFile(DATA_FILE)
  if (fromData) {
    globalThis.__memoryTestimonials = fromData
    return fromData
  }

  // 5. Fallback default (Do NOT overwrite Vercel Blob with fallback on read)
  globalThis.__memoryTestimonials = FALLBACK_TESTIMONIALS as StoredTestimonial[]
  return globalThis.__memoryTestimonials
}

export async function saveStoredTestimonial(data: any): Promise<StoredTestimonial> {
  const items = await getStoredTestimonials()
  const now = new Date()
  let id = data.id
  const isNew = !id || id === "new"
  if (isNew) {
    id = `test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
  }

  const record: StoredTestimonial = {
    id,
    name: data.name || "Verified Client",
    role: data.role || "Client Review",
    rating: typeof data.rating === "number" ? Math.max(1, Math.min(5, data.rating)) : 5,
    content: data.content || "",
    avatar: data.avatar || null,
    published: data.published !== false,
    createdAt: isNew ? now : data.createdAt ? new Date(data.createdAt) : now,
  }

  const existingIndex = items.findIndex((t) => t.id === id)
  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      ...record,
      createdAt: items[existingIndex].createdAt,
    }
  } else {
    items.unshift(record)
  }

  await writeJsonFile(items)

  try {
    const hasValidPostgres =
      Boolean(process.env.DATABASE_URL) &&
      (process.env.DATABASE_URL!.startsWith("postgresql://") ||
        process.env.DATABASE_URL!.startsWith("postgres://"))

    if (hasValidPostgres) {
      const { db } = await import("@/lib/db")
      await db.testimonial.upsert({
        where: { id },
        create: {
          id,
          name: record.name,
          role: record.role,
          rating: record.rating,
          content: record.content,
          avatar: record.avatar,
          published: record.published,
        },
        update: {
          name: record.name,
          role: record.role,
          rating: record.rating,
          content: record.content,
          avatar: record.avatar,
          published: record.published,
        },
      })
    }
  } catch {}

  return record
}

export async function deleteStoredTestimonial(id: string): Promise<boolean> {
  const items = await getStoredTestimonials()
  const filtered = items.filter((t) => t.id !== id)
  await writeJsonFile(filtered)

  try {
    const hasValidPostgres =
      Boolean(process.env.DATABASE_URL) &&
      (process.env.DATABASE_URL!.startsWith("postgresql://") ||
        process.env.DATABASE_URL!.startsWith("postgres://"))

    if (hasValidPostgres) {
      const { db } = await import("@/lib/db")
      await db.testimonial.delete({ where: { id } })
    }
  } catch {}

  return true
}
