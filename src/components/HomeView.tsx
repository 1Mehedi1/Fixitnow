"use client"

import { useEffect } from "react"
import { useStore } from "@/store/useStore"
import { Header } from "@/components/site/Header"
import { Hero } from "@/components/site/Hero"
import { Services } from "@/components/site/Services"
import { FeaturedJobs } from "@/components/site/FeaturedJobs"
import { BeforeAfterSection } from "@/components/site/BeforeAfterSection"
import { Testimonials } from "@/components/site/Testimonials"
import { About } from "@/components/site/About"
import { Footer } from "@/components/site/Footer"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { MobileBottomDock } from "@/components/site/MobileBottomDock"
import { WhatsAppPhotoQuote } from "@/components/site/WhatsAppPhotoQuote"
import { PostDetailModal } from "@/components/site/PostDetailModal"
import { PortfolioSection } from "@/components/site/PortfolioSection"
import { QuickQuoteCalculator } from "@/components/site/QuickQuoteCalculator"
import { ProcessSection } from "@/components/site/ProcessSection"
import { ComparisonTable } from "@/components/site/ComparisonTable"
import { PricingGuide } from "@/components/site/PricingGuide"
import { FaqSection } from "@/components/site/FaqSection"
import { TradePartnership } from "@/components/site/TradePartnership"
import { AdminPanel } from "@/components/admin/AdminPanel"
import { SiteSettingsProvider } from "@/components/site-settings-context"
import type { Post, PostImage, Testimonial } from "@prisma/client"
import type { SiteSettingsT } from "@/lib/site"

interface Props {
  settings: SiteSettingsT
  posts: (Post & { images: PostImage[] })[]
  portfolioPosts: (Post & { images: PostImage[] })[]
  beforeAfterPosts: (Post & { images: PostImage[] })[]
  testimonials: Testimonial[]
  allPosts: (Post & { images: PostImage[] })[]
  allTestimonials: Testimonial[]
}

export function HomeView({
  settings,
  posts,
  portfolioPosts,
  beforeAfterPosts,
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
    if (v && ["home", "portfolio", "blog", "beforeAfter", "about", "admin"].includes(v)) {
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
    return (
      <SiteSettingsProvider settings={settings}>
        <AdminPanel posts={allPosts} testimonials={allTestimonials} />
      </SiteSettingsProvider>
    )
  }

  return (
    <SiteSettingsProvider settings={settings}>
      <div className="min-h-screen flex flex-col bg-background overflow-x-clip w-full max-w-full pb-16 md:pb-0">
        <Header />
        <div className="h-[96px] sm:h-[98px] w-full shrink-0" aria-hidden="true" />

        <main className="flex-1 w-full max-w-full overflow-x-clip">
          {view === "home" && (
            <>
              <Hero />
              <WhatsAppPhotoQuote />
              <QuickQuoteCalculator />
              <FeaturedJobs
                posts={portfolioPosts}
                title="Selected work"
                subtitle="A sample of recent plumbing, painting, renovation, electrical and interior jobs across Singapore. Tap any card for the full story."
              />
              {beforeAfterPosts.length > 0 && (
                <BeforeAfterPreview posts={beforeAfterPosts.slice(0, 4)} onSeeAll={() => setView("beforeAfter")} />
              )}
              <Services />
              <ProcessSection />
              <ComparisonTable />
              <PricingGuide />
              <FaqSection />
              <TradePartnership />
              <Testimonials testimonials={testimonials} />
              <About />
            </>
          )}

          {view === "portfolio" && <PortfolioSection posts={portfolioPosts} />}
          {view === "beforeAfter" && <BeforeAfterSection posts={beforeAfterPosts} />}
          {view === "about" && (
            <div className="pt-8">
              <About />
              <Services />
            </div>
          )}
        </main>

        <Footer />
        <WhatsAppFloat />
        <MobileBottomDock />
        <PostDetailModal />
      </div>
    </SiteSettingsProvider>
  )
}

/** Compact preview of before/after work, shown on the homepage. */
function BeforeAfterPreview({
  posts,
  onSeeAll,
}: {
  posts: (Post & { images: PostImage[] })[]
  onSeeAll: () => void
}) {
  const { openPost } = useStore()
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-3 sm:mb-4 uppercase tracking-wider">
              Before & After
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
              See the difference.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2 sm:mt-3 text-pretty">
              Drag any slider to compare before and after. Real jobs, real transformations.
            </p>
          </div>
          <button
            onClick={onSeeAll}
            className="self-start sm:self-auto text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {posts.map((post, i) => {
            const before = post.images.find((img) => img.kind === "before")
            const after = post.images.find((img) => img.kind === "after")
            if (!before || !after) return null
            return (
              <div key={post.id}>
                <div
                  className="cursor-pointer group h-full"
                  onClick={() => openPost(post)}
                >
                  <div className="overflow-hidden rounded-xl border border-border/80 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col justify-between">
                    <div onClick={(e) => e.stopPropagation()} className="relative">
                      <BeforeAfterSliderInline before={before.url} after={after.url} alt={post.title} />
                    </div>
                    <div className="p-3.5 sm:p-4 bg-card flex-1">
                      <h3 className="font-display font-bold text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Inline import to avoid circular dep
import { BeforeAfterSlider as BeforeAfterSliderInline } from "@/components/site/BeforeAfterSlider"
import { ArrowRight } from "lucide-react"
