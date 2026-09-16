"use client"

import { useEffect } from "react"
import { useStore } from "@/store/useStore"
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
import type { Post, PostImage, Testimonial } from "@prisma/client"

interface Props {
  posts: (Post & { images: PostImage[] })[]
  portfolioPosts: (Post & { images: PostImage[] })[]
  blogPosts: (Post & { images: PostImage[] })[]
  testimonials: Testimonial[]
  allPosts: (Post & { images: PostImage[] })[]
  allTestimonials: Testimonial[]
}

export function HomeView({
  posts,
  portfolioPosts,
  blogPosts,
  testimonials,
  allPosts,
  allTestimonials,
}: Props) {
  const { view, setView } = useStore()

  // Sync view state from URL ?view= on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const v = params.get("view") as typeof view | null
    if (v && ["home", "portfolio", "blog", "about", "admin"].includes(v)) {
      setView(v)
    }
  }, [setView])

  // Scroll to top on view change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [view])

  // Analytics: track page view on mount
  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "page_view",
        path: `/?view=${view}`,
      }),
    }).catch(() => {})
  }, [view])

  // ADMIN view — full-screen, no public chrome
  if (view === "admin") {
    return <AdminPanel posts={allPosts} testimonials={allTestimonials} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {view === "home" && (
          <>
            <Hero />
            <Services />
            <FeaturedJobs
              posts={portfolioPosts}
              title="Selected work"
              subtitle="A sample of recent plumbing, painting, renovation, electrical and interior jobs across Singapore. Tap any card for the full story."
            />
            <LatestBlog
              posts={blogPosts}
              title="Notes from the toolbox"
              subtitle="Honest guides, real pricing, and what I've learned on the job."
            />
            <Testimonials testimonials={testimonials} />
            <About />
          </>
        )}

        {view === "portfolio" && <PortfolioSection posts={portfolioPosts} />}
        {view === "blog" && <BlogSection posts={blogPosts} />}
        {view === "about" && (
          <div className="pt-8">
            <About />
            <Services />
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />
      <PostDetailModal />
    </div>
  )
}
