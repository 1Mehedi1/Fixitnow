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
import { Sparkles, MessageCircle, ChevronRight, ShieldCheck, CheckCircle2, ArrowRight, Camera, Wrench, Award } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const PAGE_FAQS = [
  {
    q: "How fast can you attend to urgent repair jobs in Singapore?",
    a: "For emergency power trips, active water pipe bursts, or main door lockouts, we typically dispatch a technician within 45 to 90 minutes islandwide. For standard scheduled jobs, we offer convenient same-day or next-day slots.",
  },
  {
    q: "Do I need to clean up the area after your technicians finish?",
    a: "No! Phase 4 of our workflow is 'Zero Mess & Clean Handover'. We vacuum all drilling dust, wipe down affected surfaces, remove protective taping, and bag and dispose of all debris off-site.",
  },
  {
    q: "What if extra work is discovered while working?",
    a: "If we uncover underlying issues (such as rusted pipe fittings behind a wall or degraded wiring inside a ceiling junction), we stop and explain the situation to you with photos before doing anything. No additional charges are incurred without your prior agreement.",
  },
  {
    q: "Do your workers have legal work permits and insurance in Singapore?",
    a: "Yes. 4R Engineering Pte. Ltd. (UEN: 202143324G) operates strictly under Ministry of Manpower (MOM) registered construction and maintenance sector work permits, backed by comprehensive public liability insurance.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  const settings = await getStoredSiteSettings()
  const title = `How It Works: Four Phases. Zero Mess. | ${settings.brand} Singapore`
  const description = `Discover how ${settings.brand} (${settings.companyName}) handles home repairs across Singapore: from instant WhatsApp photo quotes to meticulous floor protection, clean execution, and guaranteed handover.`

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/how-it-works` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/how-it-works`,
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

export default async function HowItWorksPage() {
  const settings = await getStoredSiteSettings()
  const baseUrl = getBaseUrl()

  const faqSchema = buildFaqSchema(PAGE_FAQS)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "How It Works", url: `${baseUrl}/how-it-works` },
  ])

  const PHASES = [
    {
      num: "01",
      title: "WhatsApp Photo Assessment",
      subtitle: "Instant diagnosis without waiting days",
      icon: Camera,
      desc: "Send 2-3 photos or a video of the problem via WhatsApp. We examine the scope, identify necessary parts, and quote a fixed price before travelling.",
      details: ["Fast reply within 15 minutes", "Transparent price lock", "Clear timeline & slot booking"],
    },
    {
      num: "02",
      title: "Floor & Surface Protection",
      subtitle: "We treat your home with total respect",
      icon: ShieldCheck,
      desc: "Before opening our toolboxes, our team lays heavy-duty drop sheets, masks nearby fixtures, and covers furniture to prevent dust and scratches.",
      details: ["Clean shoe covers or barefoot policy", "Heavy canvas drop sheets", "Sensitive fixture masking"],
    },
    {
      num: "03",
      title: "Precision Trade Execution",
      subtitle: "Proper commercial-grade workmanship",
      icon: Wrench,
      desc: "Our registered trade technicians carry out the repair using professional materials (PU grouting, Singapore safety-certified cables, marine-grade silicone, Nippon coatings).",
      details: ["Direct skilled technicians only", "Safety-certified components", "Step-by-step photographic progress"],
    },
    {
      num: "04",
      title: "Zero-Mess Inspection & Handover",
      subtitle: "You inspect, we clean, then handover",
      icon: Sparkles,
      desc: "We perform a thorough test of the repair, vacuum and wipe down the entire area, remove all debris off-site, and issue your official receipt and workmanship warranty.",
      details: ["Live functional test with homeowner", "Full HEPA vacuum cleanup", "Direct workmanship warranty issued"],
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
                <li className="text-foreground font-semibold">How It Works</li>
              </ol>
            </div>
          </nav>

          {/* Hero Header */}
          <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary mb-4 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 fill-current" />
                  Standard Operating Protocol
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance">
                  Four phases. Zero mess. Your home handled properly.
                </h1>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Most Singapore homeowners dread hiring contractors because of unreliable timings, surprise fees, and left-behind mess. Here is how {settings.companyName} does it differently.
                </p>
              </div>
            </div>
          </section>

          {/* 4 Phases Infographic Steps */}
          <section className="py-12 sm:py-20">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PHASES.map((p) => {
                  const Icon = p.icon
                  return (
                    <div
                      key={p.num}
                      className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="absolute top-3 right-4 font-display font-black text-4xl text-primary/10 select-none">
                        {p.num}
                      </div>

                      <div>
                        <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                          <Icon className="h-6 w-6" />
                        </div>

                        <span className="text-[11px] font-extrabold text-primary uppercase tracking-widest block mb-1">
                          Phase {p.num}
                        </span>
                        <h2 className="font-display text-lg font-bold text-foreground">
                          {p.title}
                        </h2>
                        <div className="text-xs text-muted-foreground font-medium mb-3">
                          {p.subtitle}
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed mb-4">
                          {p.desc}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-border/50 text-xs">
                        {p.details.map((d, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
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
                  Service Process FAQ
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Questions about our arrival, protection methods, and handover protocol.
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
                Ready to experience proper trade service?
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
                Start Phase 1 right now — send photos of your repair to Ahmad on WhatsApp for an immediate consultation.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappLink(settings, "Hi Ahmad, I'd like to begin Phase 1: here are my job photos:")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-emerald-800 font-extrabold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 fill-[#25D366]" />
                  <span>Send Photos on WhatsApp Now</span>
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
