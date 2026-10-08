import type { Metadata } from "next"
import Link from "next/link"
import { getStoredSiteSettings } from "@/lib/settings-store"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { MobileBottomDock } from "@/components/site/MobileBottomDock"
import { SiteSettingsProvider } from "@/components/site-settings-context"
import { whatsappLink, DEFAULT_SERVICE_RATES } from "@/lib/site"
import { getBaseUrl, buildFaqSchema, buildBreadcrumbSchema } from "@/lib/seo"
import { DollarSign, MessageCircle, ChevronRight, CheckCircle2, ShieldCheck, ArrowRight, Zap, Info } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const PAGE_FAQS = [
  {
    q: "Are there any hidden diagnosis or transportation fees?",
    a: "No hidden charges. When you send photos of your issue over WhatsApp, we provide a transparent, all-inclusive quote covering labour and standard consumables. If an on-site inspection is required for complex leak tracing or rewiring, the nominal inspection fee ($40-$60) is fully waived upon proceeding with the repair.",
  },
  {
    q: "How does your pricing compare with middleman platform apps?",
    a: "Because you are hiring 4R Engineering directly without paying 25%-35% platform commission fees to broker apps, our rates are substantially fairer. You receive genuine commercial-grade workmanship directly from registered technicians.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept PayNow (UEN: 202143324G), Bank Transfer, and Cash. Official digital invoices and receipts are issued for every job.",
  },
  {
    q: "Do you provide written quotations for MCST or landlord approvals?",
    a: "Yes. For condominium management (MCST) permits, landlord agreements, or commercial retail premises, we issue formal quotation PDFs complete with ACRA company registration and scope of work details.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  const settings = await getStoredSiteSettings()
  const title = `Transparent Pricing & Trade Rate Card | ${settings.brand} Singapore`
  const description = `Transparent Singapore pricing guide for handyman, electrical rewiring, waterproofing, painting, and plumbing services by ${settings.brand} (${settings.companyName}). No middleman markups.`

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/pricing` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/pricing`,
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

export default async function PricingPage() {
  const settings = await getStoredSiteSettings()
  const baseUrl = getBaseUrl()

  const services = settings.services || []
  const faqSchema = buildFaqSchema(PAGE_FAQS)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Pricing & Rate Card", url: `${baseUrl}/pricing` },
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
                <li className="text-foreground font-semibold">Pricing & Rates Guide</li>
              </ol>
            </div>
          </nav>

          {/* Hero Header */}
          <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">
                  <DollarSign className="h-3.5 w-3.5 fill-current" />
                  No Hidden Markups · 100% Direct Rates
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance">
                  Transparent Singapore Trade Rates
                </h1>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Clear, upfront estimates for home repairs across Singapore HDBs, condos, and landed properties. You deal directly with registered contractor {settings.companyName} with zero broker surcharge.
                </p>

                {/* Direct contractor guarantee box */}
                <div className="mt-6 p-4 rounded-2xl bg-card border border-border shadow-xs flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-foreground/90">
                    <strong className="text-foreground">Upfront WhatsApp Price Lock: </strong>
                    Send us 2-3 photos of your repair requirement. We quote a fixed price before travelling to your premises.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trade Rate Cards Grid */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((svc) => {
                  const rates = svc.rates && svc.rates.length > 0 ? svc.rates : (DEFAULT_SERVICE_RATES[svc.key] || [])

                  return (
                    <div
                      key={svc.key}
                      className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                            {svc.label}
                          </h2>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                            From {rates[0]?.price || "$50"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">
                          {svc.desc}
                        </p>

                        {/* Line items table */}
                        <div className="space-y-2 border-t border-border/50 pt-3">
                          {rates.map((r: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs py-1.5 border-b border-border/30 last:border-0"
                            >
                              <span className="text-foreground/90 font-medium flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                {r.item}
                              </span>
                              <span className="font-bold text-primary shrink-0 ml-2">
                                {r.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/40">
                        <a
                          href={whatsappLink(settings, `Hi Ahmad, I would like to inquire about ${svc.label} rates.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-[#25D366] text-emerald-700 dark:text-emerald-400 hover:text-white font-bold text-xs transition-all border border-emerald-500/30 hover:border-[#25D366]"
                        >
                          <MessageCircle className="h-4 w-4 fill-current" />
                          <span>Get Instant {svc.label} Quote</span>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Pricing Policy Cards */}
          <section className="py-12 bg-muted/20 border-y border-border/50">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground text-center mb-8">
                The 4R Engineering Pricing Promise
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">1</div>
                  <h3 className="font-bold text-foreground text-sm">Fixed Scope Quotation</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We clearly specify materials, manpower, and deliverables before lifting a tool. No surprises on the final invoice.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                  <h3 className="font-bold text-foreground text-sm">Zero Platform Fees</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By contacting us directly, you save the 30% broker surcharge loaded into directory platforms.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold">3</div>
                  <h3 className="font-bold text-foreground text-sm">Workmanship Warranty</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Every completed repair includes our direct trade warranty. If any issue arises, we return to resolve it promptly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Dedicated SEO FAQ Section */}
          <section className="py-16 sm:py-20 bg-muted/30">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Frequently Asked Questions
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  Pricing & Payment FAQ
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Frequently asked questions about our Singapore service fees and payment terms.
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
                Get an exact quote for your home repair now
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
                No obligation. Send us your requirements on WhatsApp and receive a confirmed rate within minutes.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappLink(settings, "Hi Ahmad, I would like to get a quote. Here are the details:")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-emerald-800 font-extrabold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 fill-[#25D366]" />
                  <span>WhatsApp for Upfront Price</span>
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
