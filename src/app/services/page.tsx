import type { Metadata } from "next"
import Link from "next/link"
import { getStoredSiteSettings } from "@/lib/settings-store"
import { defaultSiteConfig, whatsappLink } from "@/lib/site"
import {
  getBaseUrl,
  CORE_SERVICES,
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
} from "@/lib/seo"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { ScrollToTop } from "@/components/site/ScrollToTop"
import { SiteSettingsProvider } from "@/components/site-settings-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Wrench, Home, PaintRoller, Droplet } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const SERVICE_ICONS: Record<string, any> = {
  "electrician-singapore": Zap,
  "handyman-singapore": Wrench,
  "roofing-waterproofing": Home,
  "painting-services": PaintRoller,
  "plumbing-services": Droplet,
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoredSiteSettings().catch(() => defaultSiteConfig)
  const baseUrl = getBaseUrl()

  return {
    title: `Trade Services Directory | ${settings.brand} Singapore`,
    description: `Direct trade contractor services across Singapore: licensed electrical rewiring, handyman repairs, roofing & waterproofing, house painting, and plumbing. Transparent rates by 4R Engineering.`,
    keywords: [
      "electrician Singapore",
      "handyman Singapore",
      "roofing waterproofing Singapore",
      "painting services Singapore",
      "plumbing Singapore",
      "4R Engineering Pte Ltd",
    ],
    alternates: {
      canonical: `${baseUrl}/services`,
    },
    openGraph: {
      title: `Trade Services Directory | ${settings.brand} Singapore`,
      description: `Direct trade contractor services across Singapore with upfront rates and guaranteed workmanship.`,
      url: `${baseUrl}/services`,
      siteName: settings.brand,
      locale: "en_SG",
      type: "website",
    },
  }
}

export default async function ServicesDirectoryPage() {
  const settings = await getStoredSiteSettings().catch(() => defaultSiteConfig)
  const baseUrl = getBaseUrl()

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Services", url: `${baseUrl}/services` },
  ])
  const localBusinessSchema = buildLocalBusinessSchema(settings)

  return (
    <SiteSettingsProvider settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <div className="h-[96px] sm:h-[100px] w-full shrink-0" aria-hidden="true" />

        <main className="flex-1 w-full pb-16 md:pb-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
            {/* Header Hero */}
            <div className="max-w-3xl mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                ACRA Registered Trade Contractor
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground text-balance">
                Specialized Home & Trade Services in Singapore.
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                Zero aggregator markup. When you book with {settings.brand}, you deal directly with skilled trade specialists under {settings.companyName} (UEN {settings.companyUen}).
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Object.values(CORE_SERVICES).map((service) => {
                const IconComponent = SERVICE_ICONS[service.slug] || Wrench
                return (
                  <article key={service.slug} className="group">
                    <Card className="p-6 border-border/80 hover:border-primary/40 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between bg-card">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {service.priceRange}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <h2 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                            <Link href={`/services/${service.slug}`}>
                              {service.title}
                            </Link>
                          </h2>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {service.overview}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-border/50">
                          {service.features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 mt-4 border-t border-border/50 flex items-center justify-between">
                        <Link
                          href={`/services/${service.slug}`}
                          className="font-semibold text-xs sm:text-sm text-primary hover:underline inline-flex items-center gap-1.5"
                        >
                          Explore Service & Rates
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        <a
                          href={whatsappLink(settings, `Hi, I would like to get a quote for ${service.title}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          WhatsApp Quote →
                        </a>
                      </div>
                    </Card>
                  </article>
                )
              })}
            </div>
          </div>

          {/* Dedicated SEO FAQ Section */}
          <section className="mt-16 py-16 sm:py-20 bg-muted/30 border-t border-border/50">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Frequently Asked Questions
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  Trade Services Directory FAQ
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Frequently asked questions about our Singapore direct trade contractor services.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-2xs">
                  <h3 className="font-bold text-base text-foreground mb-2 flex items-start gap-2.5">
                    <span className="text-primary font-mono text-sm">Q:</span>
                    <span>Can I combine multiple trade services in a single appointment?</span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                    Yes! Since we operate as a full-spectrum home engineering contractor, you can book an electrical rewiring inspection, bathroom silicone resealing, and wall painting in a single visit, saving you time and transportation costs.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-2xs">
                  <h3 className="font-bold text-base text-foreground mb-2 flex items-start gap-2.5">
                    <span className="text-primary font-mono text-sm">Q:</span>
                    <span>Do you provide warranty coverage for commercial or residential services?</span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                    Yes. All trade work conducted by 4R Engineering comes with direct contractor warranty coverage (up to 12 months on workmanship), backed by our ACRA registration and direct contact line.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <WhatsAppFloat />
        <ScrollToTop />
      </div>
    </SiteSettingsProvider>
  )
}
