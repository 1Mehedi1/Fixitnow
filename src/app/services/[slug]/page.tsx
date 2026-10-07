import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  MapPin,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
} from "lucide-react"
import { getStoredPosts } from "@/lib/posts-store"
import { getStoredSiteSettings } from "@/lib/settings-store"
import { defaultSiteConfig, whatsappLink } from "@/lib/site"
import {
  getBaseUrl,
  CORE_SERVICES,
  SINGAPORE_AREAS,
  buildServiceSchema,
  buildLocalBusinessSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "@/lib/seo"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { ScrollToTop } from "@/components/site/ScrollToTop"
import { SiteSettingsProvider } from "@/components/site-settings-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"
export const revalidate = 0

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(CORE_SERVICES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = CORE_SERVICES[slug]
  const settings = await getStoredSiteSettings().catch(() => defaultSiteConfig)
  const baseUrl = getBaseUrl()

  if (!service) {
    return {
      title: "Service Not Found | Fixitnow Singapore",
      description: "The requested trade service page could not be found.",
    }
  }

  const canonicalUrl = `${baseUrl}/services/${service.slug}`

  return {
    title: `${service.metaTitle} | ${settings.brand}`,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${service.title} | ${settings.brand} Singapore`,
      description: service.metaDescription,
      url: canonicalUrl,
      siteName: `${settings.brand} — ${settings.companyName}`,
      locale: "en_SG",
      type: "website",
      images: [
        {
          url: `${baseUrl}/hero/hero-1.webp`,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | ${settings.brand} Singapore`,
      description: service.metaDescription,
    },
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = CORE_SERVICES[slug]

  if (!service) {
    notFound()
  }

  const settings = await getStoredSiteSettings().catch(() => defaultSiteConfig)
  const allPosts = await getStoredPosts().catch(() => [])
  const baseUrl = getBaseUrl()

  // Find rate card items for this service from settings or defaults
  const matchedSvc = settings.services.find(
    (s) =>
      s.key === service.key ||
      s.label.toLowerCase().includes(service.title.toLowerCase()) ||
      service.title.toLowerCase().includes(s.label.toLowerCase())
  )
  const rates = matchedSvc?.rates || []

  // Filter posts related to this service
  const matchingPosts = allPosts.filter((p) => {
    const pCat = (p.category || "").toLowerCase()
    const pTags = (p.tags || "").toLowerCase()
    const pTitle = p.title.toLowerCase()
    return (
      pCat.includes(service.key) ||
      pCat.includes(service.title.toLowerCase()) ||
      pTags.includes(service.key) ||
      pTitle.includes(service.key)
    )
  })

  // WhatsApp quote text
  const waQuoteText = `Hi ${settings.workerName}, I'm inquiring about ${service.title} on ${settings.brand}. Can I get a free estimate for my home?`

  // Schemas
  const serviceSchema = buildServiceSchema(service, settings)
  const localBusinessSchema = buildLocalBusinessSchema(settings)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Services", url: `${baseUrl}/services` },
    { name: service.title, url: `${baseUrl}/services/${service.slug}` },
  ])
  const faqSchema = buildFaqSchema(service.faqs)

  return (
    <SiteSettingsProvider settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <div className="h-[96px] sm:h-[100px] w-full shrink-0" aria-hidden="true" />

        <main className="flex-1 w-full pb-16 md:pb-24">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link href="/services" className="hover:text-primary transition-colors">
                Services
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-foreground font-medium">{service.title}</span>
            </nav>

            {/* Service Hero Header */}
            <header className="space-y-4 mb-10">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                  Singapore Trade Specialist
                </Badge>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {settings.companyName || "4R ENGINEERING PTE. LTD."}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  UEN {settings.companyUen || "202143324G"}
                </Badge>
              </div>

              {/* Exact H1 for Target Commercial Query */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground text-balance leading-tight">
                {service.h1}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl text-pretty">
                {service.subtitle}
              </p>

              {/* Fast CTA Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm h-12 px-6 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <a
                    href={whatsappLink(settings, waQuoteText)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp for Instant Quote
                  </a>
                </Button>

                {settings.phone && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 px-6 text-sm font-semibold hover:border-emerald-500/50 cursor-pointer"
                  >
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>
                      <Phone className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                      Direct Call: {settings.phone}
                    </a>
                  </Button>
                )}
              </div>
            </header>

            {/* Overview & Key Capabilities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Professional Standards & Overview
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {service.overview}
                  </p>
                </div>

                {/* Features & Why Choose Us Checklist */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-5 shadow-xs">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    What You Get With {settings.brand}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rate Card Table if present */}
                {rates.length > 0 && (
                  <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                        Transparent Singapore Pricing Guide
                      </h2>
                      <span className="text-xs text-muted-foreground">0% Broker Markup</span>
                    </div>
                    <div className="divide-y divide-border/60">
                      {rates.map((rate, idx) => (
                        <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="font-semibold text-sm text-foreground">{rate.name}</div>
                            {rate.details && (
                              <div className="text-xs text-muted-foreground mt-0.5">{rate.details}</div>
                            )}
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <span className="font-bold text-primary text-sm sm:text-base">{rate.price}</span>
                            {rate.unit && (
                              <span className="text-xs text-muted-foreground ml-1">/ {rate.unit}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Singapore Neighborhood Coverage */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    Islandwide Singapore Service Coverage
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    We deploy directly to all major estates across Singapore for HDB BTO/resale flats, private condominiums, landed properties, and commercial premises:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SINGAPORE_AREAS.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs py-1 px-2.5">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div className="space-y-4 pt-4">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {service.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 space-y-1.5 shadow-xs"
                      >
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          {faq.question}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: High Trust Side Card & Direct WhatsApp Quote */}
              <div className="space-y-6">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10 border-2 border-emerald-500/30 p-5 space-y-4 shadow-md sticky top-28">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Fast Direct Dispatch
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-foreground">
                    Book {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Message Ahmad directly on WhatsApp. Send a photo or description for immediate quote and appointment booking.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <Button
                      asChild
                      className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm h-11 px-4 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <a
                        href={whatsappLink(settings, waQuoteText)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat on WhatsApp
                      </a>
                    </Button>

                    {settings.phone && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full h-10 text-xs font-semibold hover:border-emerald-500/50 cursor-pointer"
                      >
                        <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>
                          <Phone className="h-3.5 w-3.5 mr-2 text-emerald-600 dark:text-emerald-400" />
                          Call: {settings.phone}
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{settings.companyName} (UEN {settings.companyUen})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Mon - Sun: 8:00 AM – 9:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Transparent Quote Before Any Work</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Completed Projects for this Service */}
            {matchingPosts.length > 0 && (
              <section className="pt-8 border-t border-border/70 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Completed {service.title} Case Studies
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Real verified projects completed in Singapore homes.
                    </p>
                  </div>
                  <Link
                    href="/work"
                    className="text-xs sm:text-sm font-semibold text-primary hover:underline"
                  >
                    View all projects →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {matchingPosts.slice(0, 3).map((mPost) => {
                    const mCover =
                      mPost.coverImage ||
                      mPost.images?.find((i) => i.kind === "after")?.url ||
                      mPost.images?.[0]?.url ||
                      `${baseUrl}/hero/hero-1.webp`

                    return (
                      <Link
                        key={mPost.id}
                        href={`/work/${mPost.slug}`}
                        className="group block rounded-xl overflow-hidden border border-border/70 bg-card hover:border-primary/40 hover:shadow-lg transition-all"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                          <img
                            src={mCover}
                            alt={mPost.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 space-y-1.5">
                          <h3 className="font-display font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {mPost.title}
                          </h3>
                          {mPost.excerpt && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {mPost.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />
        <WhatsAppFloat />
        <ScrollToTop />
      </div>
    </SiteSettingsProvider>
  )
}
