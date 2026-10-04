"use client"

import { motion } from "framer-motion"
import { ArrowRight, MapPin, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore, type View } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { BrandLogo } from "@/components/site/BrandLogo"

export function Footer() {
  const { setView } = useStore()
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
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance text-white">
              Ready to start your job?
            </h2>
            <p className="text-lg text-neutral-300 mt-4 text-pretty">
              Send me a WhatsApp message with a photo and I'll get back to you within the hour.
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
                  WhatsApp me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                className="h-12 px-7 border-2 border-white/40 bg-neutral-900 text-white hover:bg-white hover:text-black hover:border-white font-bold transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                onClick={() => setView("portfolio")}
              >
                Browse my work
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer body */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4 group cursor-pointer" onClick={() => setView("home")}>
              <BrandLogo size="md" />
              <div>
                <div className="font-display font-bold text-white">{s.brand}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">{s.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-neutral-300 max-w-md leading-relaxed">
              {s.brand} — a Singapore home-services company. Plumbing, painting,
              renovation, electrical & interior works. {s.yearsExperience}+ years,
              {s.jobsCompleted}+ jobs, 7-day workmanship warranty.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", view: "home" as View },
                { label: "Portfolio", view: "portfolio" as View },
                { label: "Before & After", view: "beforeAfter" as View },
                { label: "About", view: "about" as View },
              ].map((l) => (
                <li key={l.view}>
                  <button
                    onClick={() => setView(l.view)}
                    className="text-neutral-300 hover:text-white hover:underline cursor-pointer"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-neutral-300">
                <Phone className="h-4 w-4 mt-0.5 text-amber-400" />
                <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-white">{s.phone}</a>
              </li>
              <li className="flex items-start gap-2 text-neutral-300">
                <Mail className="h-4 w-4 mt-0.5 text-amber-400" />
                <a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a>
              </li>
              <li className="flex items-start gap-2 text-neutral-300">
                <MapPin className="h-4 w-4 mt-0.5 text-amber-400" />
                {s.location}
              </li>
              <li className="flex items-start gap-2 text-neutral-300">
                <Clock className="h-4 w-4 mt-0.5 text-amber-400" />
                Mon–Sat, 8am–8pm
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-neutral-400">
          <p>© {year} {s.brand}. All rights reserved.</p>
          <p>Singapore · UEN available on request · BCA-licensed sub-contractors where applicable</p>
        </div>
      </div>
    </footer>
  )
}
