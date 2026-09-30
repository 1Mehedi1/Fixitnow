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
                <div className="group relative h-full min-h-[220px] sm:min-h-[235px] rounded-2xl overflow-hidden border border-border/80 dark:border-white/10 bg-card p-5 sm:p-6 shadow-sm hover:shadow-2xl hover:border-amber-400/50 hover:shadow-amber-500/10 transition-all duration-500 flex flex-col justify-between">
                  {/* Side-view image that expands to full background on hover, and returns to side on hover out */}
                  <div className="absolute right-3.5 top-3.5 bottom-3.5 w-28 sm:w-36 rounded-xl overflow-hidden shadow-xs transition-all duration-500 ease-out group-hover:top-0 group-hover:right-0 group-hover:bottom-0 group-hover:left-0 group-hover:w-full group-hover:h-full group-hover:rounded-2xl z-0 pointer-events-none">
                    <img
                      src={bgUrl}
                      alt={svc.label}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Dark gradient overlay — activates only when image expands to full background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Card Content: side layout next to image in default state, expands on hover */}
                  <div className="relative z-10 flex flex-col justify-between h-full pr-32 sm:pr-40 group-hover:pr-0 transition-all duration-500">
                    <div>
                      {/* Top row: Icon badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-amber-400 group-hover:text-black group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all duration-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground group-hover:text-amber-300/90 group-hover:bg-black/60 px-2 py-0.5 rounded-full group-hover:border group-hover:border-amber-400/30 transition-all">
                          Islandwide
                        </span>
                      </div>

                      {/* Service Title */}
                      <h3 className="font-display font-bold text-base sm:text-lg text-foreground group-hover:text-white tracking-tight group-hover:drop-shadow-md transition-colors duration-300">
                        {svc.label}
                      </h3>

                      {/* Service Description */}
                      <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-neutral-200 leading-relaxed font-normal mt-1 line-clamp-3 transition-colors duration-300">
                        {svc.desc}
                      </p>
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="pt-3 mt-4 border-t border-border/60 group-hover:border-white/15 flex items-center justify-between transition-colors duration-300">
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
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary group-hover:text-amber-300 hover:text-primary/80 group-hover:gap-2.5 transition-all"
                      >
                        <span>Get a quote</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </a>
                      <span className="text-[11px] text-muted-foreground group-hover:text-white/60 font-medium transition-colors duration-300">
                        Warranty covered
                      </span>
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
