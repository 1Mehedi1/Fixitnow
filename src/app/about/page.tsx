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
import { Building2, MessageCircle, ChevronRight, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, MapPin, Award, Phone } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const PAGE_FAQS = [
  {
    q: "Who is Ahmad Rahman?",
    a: "Ahmad Rahman is the lead trade supervisor and founder of Ahmad HomeWorks, operating under 4R Engineering Pte. Ltd. With over 12+ years of hands-on experience in Singapore residential engineering, Ahmad oversees all electrical, plumbing, waterproofing, and painting works.",
  },
  {
    q: "Is 4R Engineering a legally registered company in Singapore?",
    a: "Yes. 4R ENGINEERING PTE. LTD. is a Singapore-incorporated company registered with ACRA under UEN 202143324G. We hold valid MOM construction work permits and provide full commercial compliance.",
  },
  {
    q: "Which areas in Singapore do you serve?",
    a: "We provide islandwide service covering all 5 Singapore regions (East, West, North, North-East, and Central). Common estates include Tampines, Bedok, Pasir Ris, Jurong West, Clementi, Woodlands, Yishun, Ang Mo Kio, Bishan, and Punggol.",
  },
  {
    q: "Do you take on both minor handyman jobs and full renovations?",
    a: "Yes. We treat every job with equal seriousness — from simple door lock replacements and TV console wall mountings, to full HDB whole-house rewiring, DB box replacement, and full-roof waterproofing.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  const settings = await getStoredSiteSettings()
  const title = `About ${settings.brand} & ${settings.companyName} | Singapore Contractor`
  const description = `Learn about ${settings.brand} (${settings.companyName}, UEN: ${settings.companyUen}). Over ${settings.yearsExperience}+ years of hands-on Singapore residential maintenance, electrical rewiring, and waterproofing.`

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/about` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/about`,
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

export default async function AboutPage() {
  const settings = await getStoredSiteSettings()
  const baseUrl = getBaseUrl()

  const faqSchema = buildFaqSchema(PAGE_FAQS)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "About Us", url: `${baseUrl}/about` },
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
                <li className="text-foreground font-semibold">About Us</li>
              </ol>
            </div>
          </nav>

          {/* Hero Header */}
          <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary mb-4 uppercase tracking-wider">
                  <Building2 className="h-3.5 w-3.5 fill-current" />
                  Direct Singapore Contractor
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance">
                  {settings.aboutTitle || "Built on trust. Delivered with care."}
                </h1>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {settings.aboutBody || "We are a Singapore-based home-services company with over a decade of hands-on experience across HDB flats, condominiums and landed homes."}
                </p>
              </div>
            </div>
          </section>

          {/* Official ACRA & Business Credentials */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-extrabold text-primary uppercase tracking-wider block mb-1">
                      Legal ACRA Registration
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                      {settings.companyName}
                    </h2>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Operating under official UEN <strong className="text-foreground">{settings.companyUen}</strong>, we pride ourselves on being direct trade contractors rather than anonymous brokers. When you engage us, you receive full commercial accountability, legal receipts, and a single point of contact.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="text-[11px] text-muted-foreground uppercase font-bold">UEN Registration</div>
                      <div className="font-mono font-bold text-sm text-foreground mt-1">{settings.companyUen}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="text-[11px] text-muted-foreground uppercase font-bold">Workforce Compliance</div>
                      <div className="font-bold text-xs text-foreground mt-1">MOM Work Permit Registered</div>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="text-[11px] text-muted-foreground uppercase font-bold">Track Record</div>
                      <div className="font-bold text-sm text-foreground mt-1">{settings.jobsCompleted}+ Completed</div>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="text-[11px] text-muted-foreground uppercase font-bold">Customer Rating</div>
                      <div className="font-bold text-sm text-emerald-600 mt-1">{settings.rating} / 5.0 Stars</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={whatsappLink(settings, "Hi Ahmad, I'd like to consult you on a job.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
                    >
                      <MessageCircle className="h-4 w-4 fill-current" />
                      <span>Speak Directly with Ahmad on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Worker Profile Card */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-black text-2xl">
                      {settings.workerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {settings.workerName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Lead Trade Supervisor & Master Handyman
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {settings.yearsExperience}+ Years Hands-On Experience
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    "My commitment to every homeowner is straightforward: show up when promised, diagnose the real root cause honestly, quote upfront without gimmicks, and leave your house clean and safe."
                  </p>

                  <div className="space-y-2 border-t border-border/50 pt-4 text-xs text-foreground/90">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span>Islandwide Singapore coverage (East, West, North, Central)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span>Direct line: {settings.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>100% Workmanship warranty on all completed jobs</span>
                    </div>
                  </div>
                </div>
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
                  About Our Company FAQ
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Learn more about our qualifications, business registration, and values.
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
                Get in touch with Ahmad today
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
                Whether you need urgent emergency repairs or scheduled home maintenance, we are ready to assist.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappLink(settings, "Hi Ahmad, I would like to consult you regarding a home repair.")}
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
