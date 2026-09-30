"use client"

import { motion } from "framer-motion"
import { Wrench, PaintRoller, Hammer, Zap, Sofa, Settings, ArrowRight, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig, DEFAULT_SERVICE_IMAGES } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

const ICONS: Record<string, LucideIcon> = {
  Wrench,
  PaintRoller,
  Hammer,
  Zap,
  Sofa,
  Settings,
}

export function Services() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground mb-3 sm:mb-4 uppercase tracking-wider">
            What I do
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
            Every job, handled with care.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-2 sm:mt-3 text-pretty">
            From a leaky tap to a full-home renovation — one worker, one phone number, one
            warranty. Here's the work I do across Singapore.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {s.services.map((svc, i) => {
            const Icon = ICONS[svc.icon] || Wrench
            const bgUrl = svc.bgImage || DEFAULT_SERVICE_IMAGES[svc.key] || DEFAULT_SERVICE_IMAGES["repair"]

            return (
              <motion.div
                key={svc.key}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <div className="group relative h-full min-h-[220px] sm:min-h-[240px] rounded-2xl overflow-hidden border border-border/80 dark:border-white/15 bg-neutral-950 shadow-md hover:shadow-2xl hover:border-amber-400/60 hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-between">
                  {/* Background Image with smooth zoom */}
                  <img
                    src={bgUrl}
                    alt={svc.label}
                    className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.70] contrast-[1.05] group-hover:brightness-[0.78]"
                  />

                  {/* Multi-layered dark gradient overlay for crystal clear text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/55 group-hover:from-black/90 group-hover:via-black/70 group-hover:to-black/45 transition-colors duration-500" />
                  
                  {/* Subtle warm amber ambient glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Card Content */}
                  <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-between">
                    <div>
                      {/* Top row: Icon badge + Islandwide tag */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/35 backdrop-blur-md group-hover:bg-amber-400 group-hover:text-black group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-amber-300/90 bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-md group-hover:border-amber-400/60 transition-colors">
                          Islandwide
                        </span>
                      </div>

                      {/* Service Title */}
                      <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight drop-shadow-md group-hover:text-amber-200 transition-colors duration-300">
                        {svc.label}
                      </h3>

                      {/* Service Description */}
                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal mt-1.5 drop-shadow-sm line-clamp-3">
                        {svc.desc}
                      </p>
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between">
                      <a
                        href={whatsappLink(s, `Hi ${s.workerName}, I'm interested in your ${svc.label} service.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          fetch("/api/analytics", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ eventType: "whatsapp_click" }),
                          }).catch(() => {})
                        }
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-300 hover:text-amber-200 group-hover:gap-2.5 transition-all drop-shadow"
                      >
                        <span>Get a quote</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </a>
                      <span className="text-[11px] text-white/60 font-medium">Warranty covered</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-12 px-8">
            <a
              href={whatsappLink(s, `Hi ${s.workerName}, I have a job that doesn't fit any category — can I describe it?`)}
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
              Not sure if it fits? Just ask.
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
