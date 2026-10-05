"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MessageSquareQuote, ShieldCheck, Wrench, Sparkles, ArrowRight,
  CheckCircle2, Clock, ShieldAlert, Award
} from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

const PHASES = [
  {
    step: "01",
    phase: "Phase 1",
    title: "Fast Quote & Slot Confirmation",
    icon: MessageSquareQuote,
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    glow: "group-hover:border-amber-500/50 group-hover:shadow-amber-500/10",
    badge: "Within 15–60 Mins",
    bullets: [
      "Send photo / video on WhatsApp",
      "Itemized fixed price with zero broker fee",
      "Lock in same-day emergency or weekend slot",
    ],
    summary: "Clear pricing before we even arrive at your doorstep.",
  },
  {
    step: "02",
    phase: "Phase 2",
    title: "Dust & Surface Protection",
    icon: ShieldCheck,
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    glow: "group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10",
    badge: "Zero Mess Guarantee",
    bullets: [
      "Floors and carpets covered with heavy sheets",
      "Furniture masked & lift corridors protected",
      "Zero collateral damage to adjoining walls",
    ],
    summary: "Your home treated like our own — clean preparation first.",
  },
  {
    step: "03",
    phase: "Phase 3",
    title: "Direct Trade Craftsmanship",
    icon: Wrench,
    accent: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    glow: "group-hover:border-blue-500/50 group-hover:shadow-blue-500/10",
    badge: "Master Contractor",
    bullets: [
      "Executed directly by Tanbir & registered team",
      "BCA plumbing safety & EMA electrical compliance",
      "Premium waterproof membranes & branded materials",
    ],
    summary: "Zero outsourced third-party subcontractors.",
  },
  {
    step: "04",
    phase: "Phase 4",
    title: "Wiped-Down Handover & Warranty",
    icon: Sparkles,
    accent: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    glow: "group-hover:border-purple-500/50 group-hover:shadow-purple-500/10",
    badge: "7-Day Workmanship Warranty",
    bullets: [
      "All debris bagged and hauled off-site",
      "On-site testing of all fittings with homeowner",
      "7-Day workmanship warranty immediately active",
    ],
    summary: "Pay only when you are 100% satisfied with the work.",
  },
]

export function ProcessSection() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const [hoveredPhase, setHoveredPhase] = useState<number>(0)

  return (
    <section className="py-14 sm:py-20 lg:py-24 border-y border-border/50 relative overflow-hidden bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-3.5 uppercase tracking-wider shadow-xs">
            <Award className="h-3.5 w-3.5 fill-current" />
            Standard Operating Procedure
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance text-foreground">
            Four phases. Zero mess. <br className="hidden sm:inline" />
            <span className="text-emerald-600 dark:text-emerald-400">Your home handled properly.</span>
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-3 leading-relaxed">
            From initial WhatsApp photo to final wiped-down handover — a controlled, accountable sequence with no surprises and 0% subcontractor handoff.
          </p>
        </motion.div>

        {/* Visual Connected Timeline Track */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-1 bg-gradient-to-r from-amber-500/40 via-emerald-500/40 to-purple-500/40 z-0 rounded-full" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 relative z-10">
            {PHASES.map((p, i) => {
              const Icon = p.icon
              const isHovered = hoveredPhase === i

              return (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  onMouseEnter={() => setHoveredPhase(i)}
                  className="h-full group"
                >
                  <div
                    className={`rounded-3xl border bg-card p-6 h-full flex flex-col justify-between transition-all duration-300 shadow-sm relative overflow-hidden ${p.glow} ${
                      isHovered ? "border-emerald-500/60 shadow-xl shadow-emerald-500/5 -translate-y-1" : "border-border/80"
                    }`}
                  >
                    <div>
                      {/* Top Step Milestone Node */}
                      <div className="flex items-center justify-between mb-5">
                        <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${p.accent}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="font-mono text-2xl font-black text-muted-foreground/30 group-hover:text-emerald-500/60 transition-colors">
                          {p.step}
                        </span>
                      </div>

                      {/* Phase Label & Title */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {p.phase}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-muted text-muted-foreground border border-border/50">
                          {p.badge}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-lg text-foreground tracking-tight mb-3">
                        {p.title}
                      </h3>

                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-medium">
                        {p.summary}
                      </p>

                      {/* Visual Bullet Points */}
                      <div className="space-y-2 pt-3 border-t border-border/60">
                        {p.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2 text-xs text-foreground/90">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {i === 0 ? "Fast Start" : i === 3 ? "Complete" : "In Progress"}
                      </span>
                      <a
                        href={whatsappLink(s, `Hi ${s.workerName || "Tanbir"}, I'd like to book a job in ${p.phase}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 group-hover:translate-x-0.5 transition-all"
                      >
                        <span>WhatsApp</span>
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
