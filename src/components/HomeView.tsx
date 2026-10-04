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
import { ArrowRight } from "lucide-react"
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider"
import { SiteSettingsProvider, useSiteSettings } from "@/components/site-settings-context"
import { defaultSiteConfig, whatsappLink } from "@/lib/site"
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
  portfolioPosts: initialPortfolioPosts,
  beforeAfterPosts: initialBeforeAfterPosts,
  testimonials,
  allPosts,
  allTestimonials,
}: Props) {
  const {
    view, setView, openPost,
    customPosts, setCustomPosts,
    customTestimonials, setCustomTestimonials,
    customSettings, setCustomSettings,
  } = useStore()

  // Hydrate client-side posts, testimonials, and settings on mount strictly ONCE (zero infinite loops)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fixitnow_client_posts")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomPosts(parsed)
        } else if (posts && posts.length > 0) {
          setCustomPosts(posts)
        }
      } else if (posts && posts.length > 0) {
        setCustomPosts(posts)
      }
    } catch {}

    try {
      const storedTests = localStorage.getItem("fixitnow_client_testimonials")
      if (storedTests) {
        const parsedTests = JSON.parse(storedTests)
        if (Array.isArray(parsedTests) && parsedTests.length > 0) {
          setCustomTestimonials(parsedTests)
        } else if (testimonials && testimonials.length > 0) {
          setCustomTestimonials(testimonials)
        }
      } else if (testimonials && testimonials.length > 0) {
        setCustomTestimonials(testimonials)
      }
    } catch {}

    try {
      const storedSettings = localStorage.getItem("fixitnow_client_settings")
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings)
        if (parsedSettings && typeof parsedSettings === "object") {
          setCustomSettings(parsedSettings)
        }
      }
    } catch {}

    // Also background fetch latest settings from API to ensure cross-device updates sync
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          const fresh = {
            ...d.settings,
            services: d.services || d.settings.services,
            heroImages: d.heroImages || d.settings.heroImages,
            typewriterSentences: d.typewriterSentences || d.settings.typewriterSentences,
          }
          setCustomSettings(fresh)
        }
      })
      .catch(() => {})
  }, []) // Empty dependency array runs once on mount!

  const activeSettings = customSettings || settings
  const activePosts = (customPosts && customPosts.length > 0) ? customPosts : posts
  const activeTestimonials = (customTestimonials && customTestimonials.length > 0) ? customTestimonials : (allTestimonials || testimonials)

  const portfolioPosts = (activePosts || []).filter((p) => p.published !== false && p.type === "portfolio")
  const beforeAfterPosts = (activePosts || []).filter(
    (p) => p.published !== false && p.images && p.images.some((img: any) => img.kind === "before") && p.images.some((img: any) => img.kind === "after")
  )

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

  // Analytics: track page view on mount & view change with real session, visitorId, and load time
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

    // Track visitor identity (New vs Returning) in localStorage
    let visitorId = ""
    let isNewVisitor = false
    try {
      visitorId = localStorage.getItem("fixitnow_visitor_id") || ""
      if (!visitorId) {
        isNewVisitor = true
        visitorId = `vis_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
        localStorage.setItem("fixitnow_visitor_id", visitorId)
      }
    } catch {}

    // Real client load time in ms
    let loadTime = 0
    try {
      const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
      if (navEntries && navEntries.length > 0 && navEntries[0].duration) {
        loadTime = Math.round(navEntries[0].duration)
      } else if (performance.timing) {
        loadTime = Math.max(0, performance.timing.loadEventEnd - performance.timing.navigationStart)
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
        visitorId,
        isNewVisitor,
        loadTime,
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
      <SiteSettingsProvider settings={activeSettings}>
        <AdminPanel posts={allPosts} testimonials={activeTestimonials} />
      </SiteSettingsProvider>
    )
  }

  return (
    <SiteSettingsProvider settings={activeSettings}>
      <div className="min-h-screen flex flex-col bg-background overflow-x-clip w-full max-w-full pb-16 md:pb-0">
        <Header />
        <div className="h-[96px] sm:h-[100px] w-full shrink-0" aria-hidden="true" />

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
              <Testimonials testimonials={activeTestimonials} />
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
  const s = useSiteSettings() ?? defaultSiteConfig

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
            className="self-start sm:self-auto text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {posts.map((post) => {
            const before = post.images.find((img) => img.kind === "before")
            const after = post.images.find((img) => img.kind === "after")
            if (!before || !after) return null
            return (
              <div key={post.id}>
                <div
                  className="cursor-pointer group h-full"
                  onClick={() => openPost(post)}
                >
                  <div className="overflow-hidden rounded-xl border border-border/80 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col justify-between bg-card">
                    <div onClick={(e) => e.stopPropagation()} className="relative">
                      <BeforeAfterSlider before={before.url} after={after.url} alt={post.title} />
                    </div>
                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Outside View WhatsApp Button */}
                      <div className="pt-2.5 mt-2.5 border-t border-border/50 flex justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const text = `Hi, I saw your work "${post.title}" on Fixitnow. Can I get a quote for a similar job?`
                            window.open(whatsappLink(s, text), "_blank", "noopener,noreferrer")
                            fetch("/api/analytics", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ eventType: "whatsapp_click", postId: post.id }),
                            }).catch(() => {})
                          }}
                          className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-[#25D366] text-emerald-700 dark:text-emerald-400 hover:text-white font-bold text-xs transition-all hover:scale-[1.02] border border-emerald-500/30 hover:border-[#25D366] shadow-xs cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          <span>WhatsApp for Quote</span>
                        </button>
                      </div>
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


