import type { Metadata } from "next"
import Link from "next/link"
import { getStoredPosts } from "@/lib/posts-store"
import { getStoredSiteSettings } from "@/lib/settings-store"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { MobileBottomDock } from "@/components/site/MobileBottomDock"
import { SiteSettingsProvider } from "@/components/site-settings-context"
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider"
import { whatsappLink } from "@/lib/site"
import { getBaseUrl, buildFaqSchema, buildBreadcrumbSchema } from "@/lib/seo"
import { Sparkles, ArrowRight, CheckCircle2, MessageCircle, ChevronRight, ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const PAGE_FAQS = [
  {
    q: "Are all the before and after photos shown taken from real Singapore jobs?",
    a: "Yes, 100%. Every single before-and-after transformation showcased on our website was photographed on-site at real HDB flats, private condominiums, and landed properties across Singapore by 4R Engineering Pte. Ltd. technicians.",
  },
  {
    q: "Can I send photos of my home issue over WhatsApp to get an immediate quote?",
    a: "Absolutely. 90% of our clients send 2-3 photos or a 10-second video of their leak, power trip, cracked wall, or handyman mounting requirements via WhatsApp. We will respond with transparent upfront pricing and available time slots.",
  },
  {
    q: "Do you protect my home furniture and floors before starting messy jobs?",
    a: "Yes. As direct trade contractors, we follow our strict 'Four phases. Zero mess.' protocol. We lay down heavy-duty protective sheets, mask switches and cabinetry, and perform a full vacuum and wipe-down before handover.",
  },
  {
    q: "What warranty is provided for waterproofing, rewiring, and painting work?",
    a: "We provide up to 1-year workmanship warranty for electrical and handyman installations, and dedicated warranty certificates for full PU grouting / roof waterproofing and repainting projects.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  const settings = await getStoredSiteSettings()
  const title = `Before & After Transformations | ${settings.brand} Singapore`
  const description = `Real Singapore home transformation photos by ${settings.brand} (${settings.companyName}). See before & after slider comparisons for HDB rewiring, roofing waterproofing, wall painting, and plumbing repairs.`

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/before-and-after` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/before-and-after`,
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

export default async function BeforeAndAfterPage() {
  const settings = await getStoredSiteSettings()
  const posts = await getStoredPosts()
  const baseUrl = getBaseUrl()

  const beforeAfterPosts = posts.filter(
    (p) =>
      p.published !== false &&
      p.images &&
      p.images.some((img) => img.kind === "before") &&
      p.images.some((img) => img.kind === "after")
  )

  const faqSchema = buildFaqSchema(PAGE_FAQS)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Before & After", url: `${baseUrl}/before-and-after` },
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
                <li className="text-foreground font-semibold">Before & After</li>
              </ol>
            </div>
          </nav>

          {/* Hero Header */}
          <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary mb-4 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 fill-current" />
                  Real Singapore Transformations
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance">
                  See the difference. Real before & after proof.
                </h1>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Drag the sliders below to inspect actual transformations completed by {settings.companyName} across Singapore HDBs, condominiums, and landed properties. No stock photos — only honest trade work.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={whatsappLink(settings, "Hi Ahmad, I'd like a photo quote for my home repair.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="h-4 w-4 fill-current" />
                    <span>Send Photos for Fast Quote</span>
                  </a>
                  <Link
                    href="/work"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border hover:bg-muted font-bold text-sm text-foreground transition-all"
                  >
                    <span>Browse All Case Studies</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Before & After Interactive Showcase */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {beforeAfterPosts.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  No before & after posts available yet. Check back soon!
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
                  {beforeAfterPosts.map((post) => {
                    const before = post.images.find((img) => img.kind === "before")
                    const after = post.images.find((img) => img.kind === "after")
                    if (!before || !after) return null

                    return (
                      <div
                        key={post.id}
                        className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs hover:shadow-lg transition-all space-y-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                            {post.category || "Home Repair"}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            Drag slider to compare
                          </span>
                        </div>

                        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-border/50 bg-black/5">
                          <BeforeAfterSlider
                            before={before.url}
                            after={after.url}
                            alt={post.title}
                          />
                        </div>

                        <div>
                          <Link href={`/work/${post.slug || post.id}`} className="group block">
                            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                              <span>{post.title}</span>
                              <ArrowRight className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
                            </h2>
                          </Link>
                          {post.excerpt && (
                            <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Direct trade contractor
                          </span>
                          <Link
                            href={`/work/${post.slug || post.id}`}
                            className="font-bold text-primary hover:underline"
                          >
                            Read Full Story →
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
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
                  Before & After Transformations FAQ
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Common questions Singapore homeowners ask about our workmanship and photo quotes.
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
                Want similar results for your Singapore home?
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
                Snap 2 photos of your repair or renovation area and send them to Ahmad on WhatsApp for an immediate assessment.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappLink(settings, "Hi Ahmad, I would like a quote for my home. Here are my photos:")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-emerald-800 font-extrabold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 fill-[#25D366]" />
                  <span>WhatsApp Ahmad (+65 {settings.whatsapp.replace(/^65/, "")})</span>
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
