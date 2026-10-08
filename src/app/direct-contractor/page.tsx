import type { Metadata } from "next"
import Link from "next/link"
import { getStoredSiteSettings } from "@/lib/settings-store"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { MobileBottomDock } from "@/components/site/MobileBottomDock"
import { SiteSettingsProvider } from "@/components/site-settings-context"
import { whatsappLink } from "@/lib/site"
import { getBaseUrl, buildFaqSchema, buildBreadcrumbSchema } from "@/lib/seo"
import { ShieldCheck, MessageCircle, ChevronRight, CheckCircle2, XCircle, ArrowRight, Building2, Zap, Scale } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const PAGE_FAQS = [
  {
    q: "Why is hiring a direct contractor better than using a handyman app?",
    a: "Aggregator apps are middleman tech brokers. They charge contractors 25% to 35% commission on every job, inflating prices for you. When a problem occurs, apps deflect responsibility to the subcontractor. By hiring 4R Engineering directly, you deal directly with the registered contractor performing your work.",
  },
  {
    q: "Does 4R Engineering subcontract work to unvetted third parties?",
    a: "Never. All our electrical, waterproofing, plumbing, and painting jobs are executed directly by our own in-house trade personnel and overseen by Ahmad under our registered ACRA business.",
  },
  {
    q: "How do warranties work when dealing with a direct contractor?",
    a: "Because there is no broker between us, our warranty is simple: if any issue arises within the warranty period, call or WhatsApp Ahmad directly, and we schedule a return visit at zero cost to you.",
  },
  {
    q: "Can I verify your business registration in Singapore?",
    a: "Yes. 4R Engineering Pte. Ltd. is officially registered with the Accounting and Corporate Regulatory Authority (ACRA) of Singapore under UEN 202143324G.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  const settings = await getStoredSiteSettings()
  const title = `Direct Trade Contractor vs. Aggregator Brokers | ${settings.brand} Singapore`
  const description = `Why Singapore homeowners choose direct trade contractor ${settings.brand} (${settings.companyName}) over aggregator broker apps: direct accountability, zero broker commission markups, and genuine workmanship warranties.`

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/direct-contractor` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/direct-contractor`,
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

export default async function DirectContractorPage() {
  const settings = await getStoredSiteSettings()
  const baseUrl = getBaseUrl()

  const faqSchema = buildFaqSchema(PAGE_FAQS)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Direct Contractor vs Brokers", url: `${baseUrl}/direct-contractor` },
  ])

  const COMPARISON = [
    {
      feature: "Who performs the work?",
      direct: "Our own registered trade technicians under 4R Engineering",
      broker: "Random outsourced gig worker dispatched via app algorithm",
    },
    {
      feature: "Pricing structure",
      direct: "Direct trade rates with zero broker commission markups",
      broker: "Loaded with 25% - 35% app commission surcharge",
    },
    {
      feature: "Accountability for defects",
      direct: "Direct contractor warranty — call Ahmad on WhatsApp",
      broker: "Customer service chatbot; broker defers blame to freelance sub",
    },
    {
      feature: "Diagnosis speed",
      direct: "Instant diagnosis via photo on WhatsApp within 15 mins",
      broker: "Wait hours for app bidding system to match a bidder",
    },
    {
      feature: "Legal ACRA entity",
      direct: "4R Engineering Pte. Ltd. (UEN 202143324G)",
      broker: "Third-party platform company disclaiming technician liability",
    },
    {
      feature: "Floor & dust protection",
      direct: "Mandatory 'Four phases. Zero mess.' protocol on every job",
      broker: "Depends on freelance worker; often zero drop sheet prep",
    },
  ]

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
                <li className="text-foreground font-semibold">Direct Contractor vs Brokers</li>
              </ol>
            </div>
          </nav>

          {/* Hero Header */}
          <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">
                  <Scale className="h-3.5 w-3.5 fill-current" />
                  Transparency First
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance">
                  Direct Trade Contractor vs. Aggregator Brokers
                </h1>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Understand the difference between engaging registered contractor {settings.companyName} directly versus booking through middlemen apps.
                </p>
              </div>
            </div>
          </section>

          {/* Side by Side Comparison Matrix */}
          <section className="py-12 sm:py-20">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="overflow-x-auto rounded-2xl border border-border shadow-xs bg-card">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-foreground w-1/3">
                        Key Factor
                      </th>
                      <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 w-1/3">
                        Direct Contractor ({settings.brand})
                      </th>
                      <th className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-muted-foreground w-1/3">
                        Aggregator Broker Apps
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                    {COMPARISON.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-foreground">
                          {row.feature}
                        </td>
                        <td className="p-4 sm:p-5 font-medium text-foreground bg-emerald-500/5">
                          <div className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{row.direct}</span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-5 text-muted-foreground">
                          <div className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                            <span>{row.broker}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  Direct Contractor vs Broker FAQ
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Learn why thousands of Singaporeans deal with us directly.
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
                Deal direct. Save money. Get proper work done.
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
                No middleman fees. Chat with Ahmad directly on WhatsApp to arrange your inspection or receive a fixed quote.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappLink(settings, "Hi Ahmad, I want to deal direct. Here is my job requirement:")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-emerald-800 font-extrabold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 fill-[#25D366]" />
                  <span>WhatsApp Ahmad Directly</span>
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
