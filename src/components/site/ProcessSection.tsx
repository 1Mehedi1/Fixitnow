"use client"

import { motion } from "framer-motion"
import { MessageSquareQuote, ShieldCheck, Wrench, Sparkles, ArrowRight } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

const STEPS = [
  {
    step: "01",
    phase: "Phase 1",
    title: "Fast Quote and Schedule",
    icon: MessageSquareQuote,
    color: "from-amber-500/20 text-amber-500 border-amber-500/30",
    desc: "Send photos or a video on WhatsApp. Receive an itemized fixed quote within 1 hour, then lock in your preferred date.",
    highlight: "Within 1 Hour",
  },
  {
    step: "02",
    phase: "Phase 2",
    title: "Site and Dust Protection",
    icon: ShieldCheck,
    color: "from-emerald-500/20 text-emerald-500 border-emerald-500/30",
    desc: "Floors covered, lift and common corridors protected, furniture masked. Zero collateral damage to adjoining surfaces.",
    highlight: "Zero Damage Protocol",
  },
  {
    step: "03",
    phase: "Phase 3",
    title: "Direct Trade Execution",
    icon: Wrench,
    color: "from-blue-500/20 text-blue-500 border-blue-500/30",
    desc: "Direct execution by your trade-certified specialist. EMA electrical compliance, BCA plumbing safety, neat craftsmanship.",
    highlight: "No Subcontractors",
  },
  {
    step: "04",
    phase: "Phase 4",
    title: "Clean Handover and Warranty",
    icon: Sparkles,
    color: "from-purple-500/20 text-purple-500 border-purple-500/30",
    desc: "Debris bagged, surfaces wiped clean. We test all fittings together, and your genuine 7-day workmanship warranty activates.",
    highlight: "7-Day Warranty",
  },
]

export function ProcessSection() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  return (
    <section className="py-12 sm:py-20 lg:py-24 tech-grid-emerald border-y border-border/50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            How It Works
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-balance">
            Four phases. Zero mess. Your home handled properly.
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-2.5 sm:mt-3 leading-relaxed">
            From initial WhatsApp message to final wiped-down handover — a controlled, professional sequence with no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="h-full relative"
            >
              <div className="relative rounded-2xl border border-border/80 dark:border-white/10 bg-card dark:bg-zinc-950/70 p-5 sm:p-6 h-full flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-400/50 transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${step.color} border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-2xl font-black text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                      {step.step}
                    </span>
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                    {step.phase}
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-foreground tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/50 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground/80 bg-muted dark:bg-zinc-900 px-2.5 py-0.5 rounded-full border border-border/40 dark:border-white/5">
                    {step.highlight}
                  </span>
                  <a
                    href={whatsappLink(s, `Hi ${s.workerName}, I'd like to book a job in Phase 1.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1"
                  >
                    <span>Start</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Connecting arrow indicator between phases on desktop */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-6 w-6 rounded-full bg-background dark:bg-zinc-900 border border-border/80 dark:border-white/10 items-center justify-center text-muted-foreground shadow-xs pointer-events-none">
                  <ArrowRight className="h-3 w-3 text-primary/70" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
