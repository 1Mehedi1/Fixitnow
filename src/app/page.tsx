import { db } from "@/lib/db"
import { loadSiteSettings, defaultSiteConfig } from "@/lib/site"
import { HomeView } from "@/components/HomeView"
import { FALLBACK_POSTS, FALLBACK_TESTIMONIALS } from "@/lib/fallback-data"
import type { Post, PostImage, Testimonial } from "@prisma/client"

// Cache at Vercel Edge for instant TTFB (<100ms) on mobile across Singapore & worldwide.
// Automatically revalidates in the background every 60 seconds (or immediately on admin saves).
export const revalidate = 60

import { getStoredPosts } from "@/lib/posts-store"

async function fetchHomePageData() {
  const hasValidPostgres =
    Boolean(process.env.DATABASE_URL) &&
    (process.env.DATABASE_URL!.startsWith("postgresql://") ||
      process.env.DATABASE_URL!.startsWith("postgres://"))

  const settings = await loadSiteSettings().catch(() => defaultSiteConfig)
  const storedPosts = await getStoredPosts().catch(() => FALLBACK_POSTS)

  if (!hasValidPostgres) {
    return {
      settings: settings || defaultSiteConfig,
      posts: storedPosts.length > 0 ? storedPosts : FALLBACK_POSTS,
      testimonials: FALLBACK_TESTIMONIALS,
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
      posts: dbPosts && dbPosts.length > 0 ? dbPosts : (storedPosts.length > 0 ? storedPosts : FALLBACK_POSTS),
      testimonials: testimonials && testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS,
    }
  } catch (err) {
    return {
      settings: settings || defaultSiteConfig,
      posts: storedPosts.length > 0 ? storedPosts : FALLBACK_POSTS,
      testimonials: FALLBACK_TESTIMONIALS,
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

