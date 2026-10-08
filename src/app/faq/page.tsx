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
import { HelpCircle, MessageCircle, ChevronRight, Zap, Droplet, PaintRoller, Wrench, ShieldCheck, DollarSign } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const ALL_FAQS = [
  // Electrical
  {
    category: "Electrical & Power Trip",
    icon: Zap,
    q: "Why does my DB box keep tripping and cutting power to my HDB flat?",
    a: "DB box tripping is usually caused by an earth leakage, short circuit, or overloaded electrical circuit. Common culprits in Singapore homes include moisture in instant water heaters, degraded refrigerator compressors, or faulty kitchen socket wiring. We use insulation resistance testers to pinpoint the exact failing circuit within 30 minutes without unnecessary rewiring.",
  },
  {
    category: "Electrical & Power Trip",
    icon: Zap,
    q: "Do I need an EMA licensed electrical worker (LEW) for HDB rewiring?",
    a: "Yes. All major electrical installation and full house rewiring in Singapore must comply with CP5 (SS CP5 / SS 638) electrical standards and EMA regulations. We ensure all consumer unit replacements, isolators, and cabling are carried out safely by licensed trade personnel.",
  },
  // Waterproofing
  {
    category: "Waterproofing & Leak Repair",
    icon: Droplet,
    q: "Can ceiling water leaks in HDB toilets be fixed without hacking tiles?",
    a: "Yes! In 90% of cases, we use High-Pressure Polyurethane (PU) Injection Grouting. We inject hydrophilic chemical polyurethane resin into concrete hairline cracks under pressure. The resin expands up to 20 times when in contact with moisture, sealing micro-fissures completely from the inside without noisy hacking or tile replacement.",
  },
  {
    category: "Waterproofing & Leak Repair",
    icon: Droplet,
    q: "What should I do if water is leaking from the upper floor neighbor's unit?",
    a: "Under HDB guidelines for older flats, ceiling leaks between floors generally fall under the 50:50 cost-sharing goodwill framework between upper and lower unit owners. We can perform an initial moisture scan, prepare an objective inspection report with photos, and liaise with both owners and Town Council.",
  },
  // Plumbing
  {
    category: "Plumbing Services",
    icon: Wrench,
    q: "How fast can you clear severe toilet bowl or kitchen sink chokes?",
    a: "We carry commercial electro-mechanical drain cleaning snakes and pressurized kinetic water rams. Most residential sink and toilet bowl chokes in Singapore HDBs and condos are cleared within 45 to 60 minutes with no pipe damage.",
  },
  {
    category: "Plumbing Services",
    icon: Wrench,
    q: "Can you replace concealed water heater valves and leaking copper pipes?",
    a: "Yes. We replace rusted angle valves, flexible inlet hoses, ceiling storage water heaters, instant heaters, and trace hidden pipe leakages behind kitchen cabinetry or false ceilings.",
  },
  // Painting & Handyman
  {
    category: "Handyman & Wall Mounting",
    icon: PaintRoller,
    q: "Can you drill and mount heavy items onto HDB reinforced bomb shelter walls?",
    a: "Yes. HDB household shelters (bomb shelters) are constructed with dense reinforced structural concrete. Standard consumer hammer drills cannot penetrate them safely. We use industrial SDS-Plus rotary hammer drills with diamond-carbide masonry bits and heavy-duty steel anchor bolts to securely mount heavy mirrors, TV consoles, and storage shelving.",
  },
  {
    category: "Handyman & Wall Mounting",
    icon: PaintRoller,
    q: "Which paint brand do you use for ceiling mold and peeling paint?",
    a: "We use anti-fungal and moisture-resistant Nippon Paint (such as Nippon Vinilex 5000 and Nippon Odour-less Anti-Mold ceiling paint) or Dulux trade coatings. Before painting, we scrape loose paint, treat underlying mold spores with fungicidal wash, apply an oil-based sealer, and then apply 2 full topcoats.",
  },
  // Pricing & Warranty
  {
    category: "Pricing & Warranties",
    icon: DollarSign,
    q: "What payment modes do you accept and do you issue ACRA invoices?",
    a: "We accept PayNow (UEN: 202143324G), Bank Transfer, and Cash. Official digital tax invoices and itemized receipts from 4R ENGINEERING PTE. LTD. are issued for all completed works.",
  },
  {
    category: "Pricing & Warranties",
    icon: ShieldCheck,
    q: "What warranty comes with completed home repair jobs?",
    a: "We provide up to 1-year workmanship warranty on our installations and repairs. If any issue arises, contact Ahmad directly on WhatsApp and we will return to inspect and rectify at no extra charge.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  const settings = await getStoredSiteSettings()
  const title = `Frequently Asked Questions (FAQ) | ${settings.brand} Singapore`
  const description = `Got questions about HDB power trips, PU grouting leak repairs, plumbing chokes, handyman wall mounting, or rates? Read our comprehensive Singapore home services FAQ.`

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/faq` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/faq`,
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

export default async function FaqPage() {
  const settings = await getStoredSiteSettings()
  const baseUrl = getBaseUrl()

  const flatFaqs = ALL_FAQS.map((f) => ({ q: f.q, a: f.a }))
  const faqSchema = buildFaqSchema(flatFaqs)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "FAQ", url: `${baseUrl}/faq` },
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
                <li className="text-foreground font-semibold">Frequently Asked Questions</li>
              </ol>
            </div>
          </nav>

          {/* Hero Header */}
          <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary mb-4 uppercase tracking-wider">
                  <HelpCircle className="h-3.5 w-3.5 fill-current" />
                  Knowledge & Guidance Hub
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance">
                  Frequently Asked Questions
                </h1>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Clear answers to Singapore homeowners' most common questions regarding electrical trips, ceiling water leaks, plumbing chokes, rate cards, and warranty policies.
                </p>
              </div>
            </div>
          </section>

          {/* Categorized FAQ Grid */}
          <section className="py-12 sm:py-20">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
              {ALL_FAQS.map((faq, idx) => {
                const Icon = faq.icon
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="uppercase tracking-wider">{faq.category}</span>
                    </div>

                    <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
                      {faq.q}
                    </h2>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Bottom WhatsApp CTA */}
          <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
                Have a question not answered here?
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
                Ask Ahmad directly on WhatsApp. We provide prompt, honest advice for any home issue in Singapore.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappLink(settings, "Hi Ahmad, I have a question regarding my home repair:")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-emerald-800 font-extrabold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
                >
                  <MessageCircle className="h-5 w-5 fill-[#25D366]" />
                  <span>Ask Ahmad on WhatsApp</span>
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
