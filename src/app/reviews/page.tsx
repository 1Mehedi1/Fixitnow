import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getStoredTestimonials } from "@/lib/testimonials-store"
import { getStoredSiteSettings } from "@/lib/settings-store"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { MobileBottomDock } from "@/components/site/MobileBottomDock"
import { SiteSettingsProvider } from "@/components/site-settings-context"
import { whatsappLink } from "@/lib/site"
import { getBaseUrl, buildFaqSchema, buildBreadcrumbSchema } from "@/lib/seo"
import { Star, MessageCircle, ChevronRight, ShieldCheck, CheckCircle2, UserCheck, ThumbsUp } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const PAGE_FAQS = [
  {
    q: "How do I know these reviews and WhatsApp screenshots are authentic?",
    a: "Every review published on our site comes directly from actual Singapore homeowners who hired 4R Engineering Pte. Ltd. for HDB, condo, or landed residential repairs. We include genuine unedited WhatsApp screenshot proofs showing client chats upon project completion.",
  },
  {
    q: "Can I leave a review after my repair is completed?",
    a: "Yes! Following the completion and handover of your job, Ahmad or our service coordinator will send you a quick follow-up message on WhatsApp. You can leave your feedback directly there, and with your permission, we feature it on our verified homeowner reviews page.",
  },
  {
    q: "What happens if I encounter an issue after the contractor leaves?",
    a: "We stand 100% behind our workmanship. Because we are direct registered trade contractors (not middleman brokers), you have our direct WhatsApp line. If anything requires adjustment, we return promptly to inspect and rectify under our workmanship warranty.",
  },
  {
    q: "What is your average customer rating across Singapore?",
    a: "We maintain a 4.9 out of 5.0 star rating based on over 320+ verified residential jobs completed islandwide across Tampines, Bedok, Jurong, Woodlands, Punggol, and Central areas.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  const settings = await getStoredSiteSettings()
  const title = `Verified Homeowner Reviews & Client Proof | ${settings.brand} Singapore`
  const description = `Real Singapore homeowner reviews and WhatsApp feedback screenshots for ${settings.brand} (${settings.companyName}). Rated ${settings.rating}/5 across ${settings.happyClients}+ happy clients islandwide.`

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/reviews` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/reviews`,
      siteName: settings.brand,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function ReviewsPage() {
  const settings = await getStoredSiteSettings()
  const testimonials = await getStoredTestimonials()
  const baseUrl = getBaseUrl()

  const publishedTestimonials = testimonials.filter((t) => t.published !== false)
  const faqSchema = buildFaqSchema(PAGE_FAQS)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Reviews & Client Proof", url: `${baseUrl}/reviews` },
  ])

  return (
    <SiteSettingsProvider settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-background overflow-x-clip w-full">
        <Header />
        <div className="h-[96px] sm:h-[100px] w-full shrink-0" aria-hidden="true" />

        <main className="flex-1 w-full">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="border-b border-border/50 bg-muted/20">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
              <ol className="flex items-center gap-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link>
                </li>
                <li><ChevronRight className="h-3 w-3" /></li>
                <li className="text-foreground font-semibold">Verified Homeowner Reviews</li>
              </ol>
            </div>
          </nav>

          {/* Hero Header */}
          <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">
                  <UserCheck className="h-3.5 w-3.5 fill-current" />
                  100% Genuine Client Proof
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance">
                  Real feedback from Singapore homes.
                </h1>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Honest reviews and WhatsApp chat screenshots from everyday Singapore residents. Direct contractor accountability with zero middleman fluff.
                </p>

                {/* Trust stats pill bar */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
                  <div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-primary">
                      {settings.rating} / 5.0
                    </div>
                    <div className="flex items-center gap-0.5 mt-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">Average Rating</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-foreground">
                      {settings.happyClients}+
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-2">Happy Homeowners</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-foreground">
                      {settings.jobsCompleted}+
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-2">Jobs Completed</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {settings.yearsExperience}+ Yrs
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-2">Trade Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Review Grid */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs hover:shadow-lg transition-all"
                  >
                    <div>
                      {/* Rating stars & verified badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-500" />
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified Job
                        </span>
                      </div>

                      {/* Content */}
                      <p className="text-sm text-foreground/90 leading-relaxed italic">
                        "{t.content}"
                      </p>

                      {/* WhatsApp screenshot proof image if attached */}
                      {t.avatar && (
                        <div className="mt-4 pt-3 border-t border-border/50">
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                            WhatsApp Chat Proof:
                          </span>
                          <div className="relative rounded-lg overflow-hidden border border-border/60 bg-muted/30 max-h-56">
                            <img
                              src={t.avatar}
                              alt={`Client proof screenshot from ${t.name}`}
                              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Author footer */}
                    <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                      <div>
                        <div className="font-display font-bold text-sm text-foreground">
                          {t.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t.role || "Singapore Resident"}
                        </div>
                      </div>
                      <ShieldCheck className="h-5 w-5 text-primary/60 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Dedicated SEO FAQ Section */}
          <section className="py-16 sm:py-20 bg-muted/30 border-t border-border/50">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Frequently Asked Questions
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  Homeowner Reviews & Proof FAQ
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Everything you need to know about our customer satisfaction and verified chat feedback.
                </p>
              </div>

              <div className="space-y-4">
                {PAGE_FAQS.map((faq, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-2xs">
                    <h3 className="font-bold text-base text-foreground mb-2 flex items-start gap-2.5">
                      <span className="text-primary font-mono text-sm">Q:</span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom WhatsApp CTA */}
          <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
                Experience hassle-free home service today.
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
                Join hundreds of satisfied Singapore homeowners. Chat with Ahmad directly on WhatsApp for transparent advice and upfront quotes.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappLink(settings, "Hi Ahmad, I saw your great reviews and would like to get a quote.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-emerald-800 font-extrabold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 fill-[#25D366]" />
                  <span>Connect with Ahmad on WhatsApp</span>
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <WhatsAppFloat />
        <MobileBottomDock />
      </div>
    </SiteSettingsProvider>
  )
}
