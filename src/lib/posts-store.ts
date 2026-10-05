import fs from "fs"
import path from "path"
import os from "os"
import { FALLBACK_POSTS } from "./fallback-data"
import type { Post, PostImage } from "@prisma/client"

export type StoredPost = Post & {
  images: PostImage[]
}

declare global {
  // eslint-disable-next-line no-var
  var __memoryPosts: StoredPost[] | undefined
}

const DATA_FILE = path.join(process.cwd(), "data", "posts.json")
const TMP_FILE = path.join(os.tmpdir(), "fixitnow-posts.json")

function readJsonFile(filePath: string): StoredPost[] | null {
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

import { saveJsonBlob, readJsonBlob, hasVercelBlob } from "./storage-sync"

function writeJsonFile(posts: StoredPost[]) {
  // Update memory cache first
  globalThis.__memoryPosts = posts

  // Sync to Vercel Blob if available
  if (hasVercelBlob) {
    saveJsonBlob("store/posts.json", posts).catch(() => {})
  }

  // Try writing to DATA_FILE (local dev / persistent storage)
  let wrote = false
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8")
    wrote = true
  } catch {}

  // If DATA_FILE failed (e.g. read-only filesystem on Vercel lambda), write to TMP_FILE
  try {
    const tmpDir = path.dirname(TMP_FILE)
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    fs.writeFileSync(TMP_FILE, JSON.stringify(posts, null, 2), "utf-8")
    wrote = true
  } catch {}

  return wrote
}

export async function getStoredPosts(): Promise<StoredPost[]> {
  // 1. In-memory cache
  if (globalThis.__memoryPosts && globalThis.__memoryPosts.length > 0) {
    return globalThis.__memoryPosts
  }

  // 2. Try Vercel Blob
  if (hasVercelBlob) {
    const fromBlob = await readJsonBlob<StoredPost[]>("store/posts.json")
    if (fromBlob && Array.isArray(fromBlob) && fromBlob.length > 0) {
      globalThis.__memoryPosts = fromBlob
      return fromBlob
    }
  }

  // 3. Try /tmp/fixitnow-posts.json (serverless writable)
  const fromTmp = readJsonFile(TMP_FILE)
  if (fromTmp) {
    globalThis.__memoryPosts = fromTmp
    return fromTmp
  }

  // 4. Try data/posts.json
  const fromData = readJsonFile(DATA_FILE)
  if (fromData) {
    globalThis.__memoryPosts = fromData
    return fromData
  }

  // 5. Fallback default
  globalThis.__memoryPosts = FALLBACK_POSTS as StoredPost[]
  writeJsonFile(globalThis.__memoryPosts)
  return globalThis.__memoryPosts
}

export async function getStoredPostById(id: string): Promise<StoredPost | null> {
  const posts = await getStoredPosts()
  const found = posts.find((p) => p.id === id)
  if (found) return found

  const fallback = (FALLBACK_POSTS as StoredPost[]).find((p) => p.id === id)
  return fallback || null
}

export async function saveStoredPost(data: any): Promise<StoredPost> {
  const posts = await getStoredPosts()
  const now = new Date()

  let id = data.id
  const isNew = !id || id === "new"

  if (isNew) {
    id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
  }

  const slug =
    data.slug ||
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    id

  const rawImages = Array.isArray(data.images) ? data.images : []
  const formattedImages: PostImage[] = rawImages.map((img: any, i: number) => ({
    id: img.id || `img_${id}_${i}`,
    postId: id,
    url: typeof img === "string" ? img : img.url,
    kind: (typeof img === "object" && img.kind) || "gallery",
    position: i,
    createdAt: now,
  }))

  const coverImage =
    (formattedImages.length > 0
      ? (formattedImages.find((img) => img.kind === "after")?.url || formattedImages[0]?.url)
      : null) ||
    data.coverImage ||
    null

  const postRecord: StoredPost = {
    id,
    title: data.title || "Untitled Job",
    slug,
    excerpt: data.excerpt || "",
    content: data.content || "",
    type: data.type || "portfolio",
    category: data.category || "General",
    tags: data.tags || "",
    featured: Boolean(data.featured),
    published: data.published !== false,
    coverImage,
    views: typeof data.views === "number" ? data.views : 0,
    whatsappClicks: typeof data.whatsappClicks === "number" ? data.whatsappClicks : 0,
    authorId: data.authorId || null,
    createdAt: isNew ? now : data.createdAt ? new Date(data.createdAt) : now,
    updatedAt: now,
    images: formattedImages,
  }

  const existingIndex = posts.findIndex((p) => p.id === id)
  if (existingIndex >= 0) {
    posts[existingIndex] = {
      ...posts[existingIndex],
      ...postRecord,
      views: posts[existingIndex].views,
      whatsappClicks: posts[existingIndex].whatsappClicks,
      createdAt: posts[existingIndex].createdAt,
    }
  } else {
    posts.unshift(postRecord)
  }

  writeJsonFile(posts)

  // Background sync to Prisma if configured
  try {
    const hasValidPostgres =
      Boolean(process.env.DATABASE_URL) &&
      (process.env.DATABASE_URL!.startsWith("postgresql://") ||
        process.env.DATABASE_URL!.startsWith("postgres://"))

    if (hasValidPostgres) {
      const { db } = await import("@/lib/db")
      await db.post.upsert({
        where: { id },
        create: {
          id,
          title: postRecord.title,
          slug: postRecord.slug,
          excerpt: postRecord.excerpt,
          content: postRecord.content,
          type: postRecord.type,
          category: postRecord.category,
          tags: postRecord.tags,
          featured: postRecord.featured,
          published: postRecord.published,
          coverImage: postRecord.coverImage,
          views: postRecord.views,
          whatsappClicks: postRecord.whatsappClicks,
        },
        update: {
          title: postRecord.title,
          slug: postRecord.slug,
          excerpt: postRecord.excerpt,
          content: postRecord.content,
          type: postRecord.type,
          category: postRecord.category,
          tags: postRecord.tags,
          featured: postRecord.featured,
          published: postRecord.published,
          coverImage: postRecord.coverImage,
        },
      })
    }
  } catch {}

  return postRecord
}

export async function deleteStoredPost(id: string): Promise<boolean> {
  const posts = await getStoredPosts()
  const filtered = posts.filter((p) => p.id !== id)
  writeJsonFile(filtered)

  try {
    const hasValidPostgres =
      Boolean(process.env.DATABASE_URL) &&
      (process.env.DATABASE_URL!.startsWith("postgresql://") ||
        process.env.DATABASE_URL!.startsWith("postgres://"))

    if (hasValidPostgres) {
      const { db } = await import("@/lib/db")
      await db.postImage.deleteMany({ where: { postId: id } })
      await db.post.delete({ where: { id } })
    }
  } catch {}

  return true
}

export async function incrementPostViews(id: string): Promise<void> {
  const posts = await getStoredPosts()
  const post = posts.find((p) => p.id === id)
  if (post) {
    post.views = (post.views || 0) + 1
    writeJsonFile(posts)
  }
}

export async function incrementPostWhatsApp(id: string): Promise<void> {
  const posts = await getStoredPosts()
  const post = posts.find((p) => p.id === id)
  if (post) {
    post.whatsappClicks = (post.whatsappClicks || 0) + 1
    writeJsonFile(posts)
  }
}
