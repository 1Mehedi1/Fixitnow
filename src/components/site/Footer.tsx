"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { BrandLogo } from "@/components/site/BrandLogo"

export function Footer() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-neutral-950 text-white border-t border-white/10">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-balance text-white">
              Ready to start your home repair?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 mt-4 text-pretty">
              Send Ahmad a WhatsApp message with 2 photos of the issue. We quote upfront within minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-12 px-7 shadow-lg shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all duration-200 font-bold">
                <a
                  href={whatsappLink(s, `Hi ${s.workerName}, I'd like to start a job. Here are the details:`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    fetch("/api/analytics", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ eventType: "whatsapp_click" }),
                    }).catch(() => {})
                  }
                >
                  WhatsApp Ahmad
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-12 px-7 border-2 border-white/40 bg-neutral-900 text-white hover:bg-white hover:text-black hover:border-white font-bold transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
              >
                <Link href="/work">
                  Browse Case Studies
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer body */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group inline-flex">
              <BrandLogo size="md" />
              <div>
                <div className="font-display font-bold text-white text-lg">{s.brand}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">{s.tagline}</div>
              </div>
            </Link>
            <p className="text-sm text-neutral-300 max-w-md leading-relaxed">
              {s.companyName} (UEN: {s.companyUen}) — direct Singapore registered trade contractor.
              Specializing in electrical rewiring, waterproofing, painting, and plumbing repairs across Singapore HDB flats, condos, and landed residences.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>MOM Work Permit Registered · 100% Direct Workmanship Warranty</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-4">Dedicated Pages</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-neutral-300 hover:text-white hover:underline">
                  Trade Services Directory
                </Link>
              </li>
              <li>
                <Link href="/work" className="text-neutral-300 hover:text-white hover:underline">
                  Selected Work & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/before-and-after" className="text-neutral-300 hover:text-white hover:underline">
                  Before & After Transformations
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-neutral-300 hover:text-white hover:underline">
                  Verified Homeowner Reviews
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-neutral-300 hover:text-white hover:underline">
                  Pricing & Trade Rates
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-neutral-300 hover:text-white hover:underline">
                  How It Works (Four Phases)
                </Link>
              </li>
              <li>
                <Link href="/direct-contractor" className="text-neutral-300 hover:text-white hover:underline">
                  Direct Contractor vs Brokers
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-white hover:underline">
                  About 4R Engineering
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-300 hover:text-white hover:underline">
                  Knowledge & FAQ Hub
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white hover:underline">
                  Contact & Emergency Hotline
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-4">Direct Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-neutral-300">
                <Phone className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <a href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-white">{s.phone}</a>
              </li>
              <li className="flex items-start gap-2 text-neutral-300">
                <Mail className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a>
              </li>
              <li className="flex items-start gap-2 text-neutral-300">
                <MapPin className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <span>{s.location}</span>
              </li>
              <li className="flex items-start gap-2 text-neutral-300">
                <Clock className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <span>Daily 8:00 AM – 10:00 PM (Emergency Standby)</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link href="/admin" className="text-xs text-neutral-500 hover:text-neutral-300">
                Worker Admin Portal →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-neutral-400">
          <p>© {year} {s.brand} ({s.companyName}). All rights reserved.</p>
          <p>ACRA UEN: {s.companyUen} · Singapore Islandwide Coverage</p>
        </div>
      </div>
    </footer>
  )
}
