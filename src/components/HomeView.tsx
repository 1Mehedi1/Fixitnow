"use client"

import { useEffect, useState } from "react"
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
import { ScrollToTop } from "@/components/site/ScrollToTop"
import { AdminPanel } from "@/components/admin/AdminPanel"
import { SiteSettingsProvider, useSiteSettings } from "@/components/site-settings-context"
import { defaultSiteConfig } from "@/lib/site"
import type { Post, PostImage, Testimonial } from "@prisma/client"
import type { SiteSettingsT } from "@/lib/site"
import type { CustomSection } from "@/lib/sections-store"

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
  const { view, setView, openPost } = useStore()
  const [customSections, setCustomSections] = useState<CustomSection[]>([])

  // Load enabled custom sections
  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.sections)) {
          setCustomSections(d.sections.filter((s: any) => s.enabled))
        }
      })
      .catch(() => {})
  }, [])

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

  // Analytics: track page view on mount & view change
  useEffect(() => {
    if (typeof window === "undefined") return

    // Maintain persistent anonymous session ID in sessionStorage
    let session = ""
    try {
      session = sessionStorage.getItem("fixitnow_session_id") || ""
      if (!session) {
        session = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
        sessionStorage.setItem("fixitnow_session_id", session)
      }
    } catch {}

    const isMobile = window.innerWidth < 768
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
    const device = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "page_view",
        path: `/?view=${view}`,
        session,
        clientMeta: {
          device,
          referrer: document.referrer || "",
          language: navigator.language || "en-SG",
        },
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
              {/* Dynamic Custom Sections created by Admin (e.g. "Our Blog", "Handyman Guides", etc.) */}
              {customSections.map((sec) => {
                const secPosts = posts.filter(
                  (p) => (p as any).customSectionId === sec.id && p.published
                )
                if (secPosts.length === 0) return null
                return (
                  <DynamicCustomSection
                    key={sec.id}
                    section={sec}
                    posts={secPosts}
                    onOpenPost={openPost}
                  />
                )
              })}
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
        <ScrollToTop />
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
    <section id="before-after-section" className="py-12 sm:py-20 lg:py-24 bg-muted/30">
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

/** Renders an admin-created custom section dynamically on the homepage */
function DynamicCustomSection({
  section,
  posts,
  onOpenPost,
}: {
  section: CustomSection
  posts: (Post & { images: PostImage[] })[]
  onOpenPost: (p: Post) => void
}) {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-card/60 border-t border-border/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            {section.badge || "Articles & Updates"}
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-balance text-foreground">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground mt-2.5 leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const cover = post.coverImage || post.images[0]?.url
            return (
              <div
                key={post.id}
                onClick={() => onOpenPost(post)}
                className="group rounded-2xl overflow-hidden border border-border/80 bg-card hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                {cover && (
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    <img
                      src={cover}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {post.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                        {post.category}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-SG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-semibold text-primary group-hover:underline">Read details →</span>
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

