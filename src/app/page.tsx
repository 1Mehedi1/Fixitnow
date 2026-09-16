import { db } from "@/lib/db"
import { Header } from "@/components/site/Header"
import { Hero } from "@/components/site/Hero"
import { Services } from "@/components/site/Services"
import { FeaturedJobs } from "@/components/site/FeaturedJobs"
import { LatestBlog } from "@/components/site/LatestBlog"
import { Testimonials } from "@/components/site/Testimonials"
import { About } from "@/components/site/About"
import { Footer } from "@/components/site/Footer"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { PostDetailModal } from "@/components/site/PostDetailModal"
import { PortfolioSection } from "@/components/site/PortfolioSection"
import { BlogSection } from "@/components/site/BlogSection"
import { AdminPanel } from "@/components/admin/AdminPanel"
import { HomeView } from "@/components/HomeView"

export const dynamic = "force-dynamic"

export default async function Page() {
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
  const blogPosts = posts.filter((p) => p.type === "blog")

  return (
    <HomeView
      posts={posts}
      portfolioPosts={portfolioPosts}
      blogPosts={blogPosts}
      testimonials={testimonials}
      allPosts={allPosts}
      allTestimonials={allTestimonials}
    />
  )
}
