import { db } from "@/lib/db"
import { loadSiteSettings } from "@/lib/site"
import { HomeView } from "@/components/HomeView"

export const dynamic = "force-dynamic"

export default async function Page() {
  // Load site settings from DB (with defaults fallback)
  const settings = await loadSiteSettings()

  // Fetch all data server-side
  const [posts, testimonials] = await Promise.all([
    db.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    db.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  // Also fetch ALL posts (incl. drafts) for admin view
  const allPosts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { position: "asc" } } },
  })
  const allTestimonials = await db.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  })

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
      allPosts={allPosts}
      allTestimonials={allTestimonials}
    />
  )
}
