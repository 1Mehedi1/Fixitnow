import fs from "fs"
import path from "path"
import { FALLBACK_POSTS } from "./fallback-data"
import type { Post, PostImage } from "@prisma/client"

export type StoredPost = Post & {
  images: PostImage[]
  customSectionId?: string | null
}

const POSTS_FILE = path.join(process.cwd(), "data", "posts.json")

function ensureDirectoryExists() {
  const dir = path.dirname(POSTS_FILE)
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true })
    } catch {}
  }
}

export async function getStoredPosts(): Promise<StoredPost[]> {
  ensureDirectoryExists()
  try {
    if (fs.existsSync(POSTS_FILE)) {
      const raw = fs.readFileSync(POSTS_FILE, "utf-8")
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error("Error reading stored posts:", err)
  }

  // Initialize with fallback posts
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(FALLBACK_POSTS, null, 2), "utf-8")
  } catch {}

  return FALLBACK_POSTS as StoredPost[]
}

export async function getStoredPostById(id: string): Promise<StoredPost | null> {
  const posts = await getStoredPosts()
  const found = posts.find((p) => p.id === id)
  if (found) return found

  const fallback = (FALLBACK_POSTS as StoredPost[]).find((p) => p.id === id)
  return fallback || null
}

export async function saveStoredPost(data: any): Promise<StoredPost> {
  ensureDirectoryExists()
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
    data.coverImage ||
    formattedImages.find((img) => img.kind === "after")?.url ||
    formattedImages[0]?.url ||
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
    customSectionId: data.customSectionId || null,
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

  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8")
  } catch (err) {
    console.error("Failed writing posts to file:", err)
  }

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
  ensureDirectoryExists()
  const posts = await getStoredPosts()
  const filtered = posts.filter((p) => p.id !== id)

  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(filtered, null, 2), "utf-8")
  } catch {}

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
    try {
      fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8")
    } catch {}
  }
}
