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
import { Phone, MessageCircle, ChevronRight, MapPin, Clock, Mail, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

const PAGE_FAQS = [
  {
    q: "What is your typical response time on WhatsApp?",
    a: "We usually reply within 5 to 15 minutes during operating hours (8:00 AM – 10:00 PM). For emergency power trips or burst pipes, call our direct phone line for immediate dispatch.",
  },
  {
    q: "Do you charge extra for weekend or after-hours appointments?",
    a: "We operate 7 days a week, including Saturdays and Sundays, at standard transparent rates. Late-night emergency callouts after 10:00 PM have a small nominal surcharge which will always be confirmed with you beforehand.",
  },
  {
    q: "Can I book a specific appointment slot for next week?",
    a: "Yes. Simply drop us a WhatsApp message with your preferred date, morning/afternoon window, and address. We will lock in your slot and reconfirm 2 hours before arrival.",
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl()
  const settings = await getStoredSiteSettings()
  const title = `Contact Us & WhatsApp Quote | ${settings.brand} Singapore`
  const description = `Contact ${settings.brand} (${settings.companyName}). Call ${settings.phone} or WhatsApp +65 ${settings.whatsapp.replace(/^65/, "")} for fast Singapore home repairs, electrical, waterproofing & handyman.`

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/contact` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/contact`,
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

export default async function ContactPage() {
  const settings = await getStoredSiteSettings()
  const baseUrl = getBaseUrl()

  const faqSchema = buildFaqSchema(PAGE_FAQS)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Contact", url: `${baseUrl}/contact` },
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
                <li className="text-foreground font-semibold">Contact & Support</li>
              </ol>
            </div>
          </nav>

          {/* Hero Header */}
          <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider">
                  <Phone className="h-3.5 w-3.5 fill-current" />
                  Islandwide Fast Dispatch
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground text-balance">
                  Get in touch for an instant consultation.
                </h1>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Have an urgent repair or planning a home upgrade? Connect directly with Ahmad and the {settings.companyName} trade team.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Cards Grid */}
          <section className="py-12 sm:py-20">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-6">
                {/* WhatsApp Card */}
                <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-card p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center mb-5 shadow-md shadow-[#25D366]/20">
                      <MessageCircle className="h-6 w-6 fill-current" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                      Fastest Option
                    </span>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      WhatsApp Photo Quote
                    </h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Snap 2-3 photos of your repair issue. We reply with a diagnosis and fixed price estimate within 15 minutes.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <a
                      href={whatsappLink(settings, "Hi Ahmad, I would like to get a quote.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
                    >
                      <MessageCircle className="h-4 w-4 fill-current" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Direct Phone Card */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-5">
                      <Phone className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                      Urgent Emergency Line
                    </span>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Direct Voice Call
                    </h2>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      For active power trips, burst pipes, or urgent main door issues requiring immediate technician mobilization.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call {settings.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Company & Office Card */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center mb-5">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                      Registered ACRA Office
                    </span>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      4R Engineering Pte. Ltd.
                    </h2>
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      <div>UEN: <strong className="text-foreground">{settings.companyUen}</strong></div>
                      <div>Coverage: <span className="text-foreground">{settings.location}</span></div>
                      <div>Hours: <span className="text-foreground">Daily 8:00 AM – 10:00 PM</span></div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Emergency standby available</span>
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
                  Contact & Booking FAQ
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Questions about our response time and appointment scheduling.
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
        </main>

        <Footer />
        <WhatsAppFloat />
        <MobileBottomDock />
      </div>
    </SiteSettingsProvider>
  )
}
