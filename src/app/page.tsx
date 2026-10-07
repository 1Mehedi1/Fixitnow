import { db } from "@/lib/db"
import { defaultSiteConfig } from "@/lib/site"
import { HomeView } from "@/components/HomeView"
import { FALLBACK_POSTS, FALLBACK_TESTIMONIALS } from "@/lib/fallback-data"
import type { Post, PostImage, Testimonial } from "@prisma/client"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

import { getStoredPosts } from "@/lib/posts-store"
import { getStoredTestimonials } from "@/lib/testimonials-store"
import { getStoredSiteSettings as loadSiteSettings } from "@/lib/settings-store"

async function fetchHomePageData() {
  const rawDb = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || ""
  const hasValidPostgres = rawDb.startsWith("postgresql://") || rawDb.startsWith("postgres://")

  const settings = await loadSiteSettings().catch(() => defaultSiteConfig)
  const storedPosts = await getStoredPosts().catch(() => FALLBACK_POSTS)
  const storedTestimonials = await getStoredTestimonials().catch(() => FALLBACK_TESTIMONIALS)

  // Stored posts and testimonials in Vercel Blob / persistent storage are primary
  if (storedPosts && storedPosts.length > 0 && storedTestimonials && storedTestimonials.length > 0) {
    return {
      settings: settings || defaultSiteConfig,
      posts: storedPosts,
      testimonials: storedTestimonials,
    }
  }

  if (!hasValidPostgres) {
    return {
      settings: settings || defaultSiteConfig,
      posts: storedPosts.length > 0 ? storedPosts : FALLBACK_POSTS,
      testimonials: storedTestimonials.length > 0 ? storedTestimonials : FALLBACK_TESTIMONIALS,
    }
  }

  const timeoutMs = 1200
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("DB_TIMEOUT")), timeoutMs)
  )

  const queryPromise = Promise.all([
    db.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { position: "asc" } } },
    }).catch(() => [] as (Post & { images: PostImage[] })[]),
    db.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => [] as Testimonial[]),
  ])

  try {
    const [dbPosts, testimonials] = await Promise.race([queryPromise, timeoutPromise])
    return {
      settings: settings || defaultSiteConfig,
      posts: storedPosts.length > 0 ? storedPosts : (dbPosts && dbPosts.length > 0 ? dbPosts : FALLBACK_POSTS),
      testimonials: storedTestimonials.length > 0 ? storedTestimonials : (testimonials && testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS),
    }
  } catch (err) {
    return {
      settings: settings || defaultSiteConfig,
      posts: storedPosts.length > 0 ? storedPosts : FALLBACK_POSTS,
      testimonials: storedTestimonials.length > 0 ? storedTestimonials : FALLBACK_TESTIMONIALS,
    }
  }
}

export default async function Page() {
  const { settings, posts, testimonials } = await fetchHomePageData()

  const portfolioPosts = posts.filter((p) => p.type === "portfolio")
  // Before/After gallery includes all published PORTFOLIO posts that have at least one image
  // (posts with both before + after render as sliders; others as single photos).
  const beforeAfterPosts = posts.filter(
    (p) => p.type === "portfolio" && (p.images.length > 0 || p.coverImage)
  )

  return (
    <HomeView
      settings={settings}
      posts={posts}
      portfolioPosts={portfolioPosts}
      beforeAfterPosts={beforeAfterPosts}
      testimonials={testimonials}
      allPosts={posts}
      allTestimonials={testimonials}
    />
  )
}

