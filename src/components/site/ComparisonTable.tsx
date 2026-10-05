"use client"

import { motion } from "framer-motion"
import { Check, X, ShieldAlert, Award, UserCheck, ShieldCheck, Zap, ArrowRight, MessageCircle } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

const COMPARISON_ROWS = [
  {
    feature: "Pricing Transparency",
    directTitle: "0% Middleman Markups",
    directDesc: "Fair trade rates with zero broker platform fee added. You pay only for genuine parts and skilled labor.",
    brokerTitle: "25% to 35% Inflated Markup",
    brokerDesc: "Aggregator platforms and sales portals take a steep 25%–35% commission on top of the repair cost.",
  },
  {
    feature: "Workmanship Execution",
    directTitle: "Direct Registered Trade Contractor",
    directDesc: "Executed directly by our registered Singapore team (4R ENGINEERING PTE. LTD. · UEN: 202143324G).",
    brokerTitle: "Outsourced to Unknown Freelancers",
    brokerDesc: "Jobs are auctioned to random third-party handymen with no verified quality control.",
  },
  {
    feature: "Technical Communication",
    directTitle: "Direct WhatsApp with Master Specialist",
    directDesc: "Speak straight to technician Tanbir. Send photos, get immediate technical advice and instant fixes.",
    brokerTitle: "Non-Technical Call Centers",
    brokerDesc: "Customer service agents relay generic messages back and forth with endless delays.",
  },
  {
    feature: "Warranty Accountability",
    directTitle: "1 Specialist · 1 Phone · 7-Day Guarantee",
    directDesc: "Zero finger-pointing. If any fitting needs tweaking within 7 days, we return promptly to fix it.",
    brokerTitle: "Finger-Pointing Liability Runaround",
    brokerDesc: "Brokers blame the subcontractor; subcontractors claim the platform underquoted. You get stuck in between.",
  },
  {
    feature: "Scheduling & Response",
    directTitle: "Same-Day Emergency & Weekend Slots",
    directDesc: "Direct dispatch islandwide across Singapore HDBs, condos, and landed properties.",
    brokerTitle: "Multi-Day Scheduling Delays",
    brokerDesc: "Prolonged back-and-forth waiting for a subcontractor to accept the job.",
  },
]

export function ComparisonTable() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  return (
    <section className="py-14 sm:py-20 lg:py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-3.5 uppercase tracking-wider shadow-xs">
            <Zap className="h-3.5 w-3.5 fill-current" />
            Direct Contractor vs Platform Brokers
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance text-foreground">
            Direct Trade Contractor vs. Aggregator Brokers
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-3 leading-relaxed">
            Why pay 25%–35% extra for aggregator platform fees and outsourced middlemen? Deal directly with the registered Singapore trade specialist who actually executes your work.
          </p>
        </motion.div>

        {/* Visual Comparison Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Winner Card: Fixitnow Direct Contractor */}
          <div className="rounded-3xl border-2 border-emerald-500/50 dark:border-emerald-400/60 bg-gradient-to-b from-emerald-500/[0.08] via-card to-card p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-emerald-500/10 relative overflow-hidden">
            {/* Top Recommended Banner */}
            <div className="absolute top-0 right-0 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest py-1 px-4 rounded-bl-xl shadow-sm">
              Recommended Choice
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-foreground">
                    {s.brand} (Direct Specialist)
                  </h3>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    4R ENGINEERING PTE. LTD. · UEN: 202143324G
                  </p>
                </div>
              </div>

              {/* Price advantage banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 mb-6 flex items-center justify-between gap-3">
                <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  Direct Trade Rates · Zero Platform Fees
                </div>
                <span className="font-mono text-xs font-black bg-emerald-600 text-white px-2.5 py-1 rounded-lg shrink-0">
                  SAVE 25%–35%
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-4">
                {COMPARISON_ROWS.map((row, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-500/5 transition-colors">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {row.directTitle}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {row.directDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-500/20">
              <a
                href={whatsappLink(s, `Hi ${s.workerName || "Tanbir"}, I'd like a direct quote with 0% middleman fees.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 text-sm shadow-md shadow-emerald-950/30 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 fill-current shrink-0" />
                <span>Chat Direct with Specialist on WhatsApp</span>
                <ArrowRight className="h-4 w-4 ml-1 shrink-0" />
              </a>
            </div>
          </div>

          {/* Aggregator Platforms Card */}
          <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center font-black">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground">
                    Aggregator Platforms & Brokers
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Third-Party Directories & Lead Resellers
                  </p>
                </div>
              </div>

              {/* Price penalty banner */}
              <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6 flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-destructive dark:text-red-300">
                  Hidden 25%–35% Broker Markups Added
                </div>
                <span className="font-mono text-xs font-bold bg-destructive/20 text-destructive dark:text-red-300 px-2.5 py-1 rounded-lg shrink-0">
                  +30% COST
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-4">
                {COMPARISON_ROWS.map((row, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl opacity-80">
                    <div className="h-6 w-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 mt-0.5">
                      <X className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground/90">
                        {row.brokerTitle}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {row.brokerDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <span className="text-xs text-muted-foreground italic font-medium">
                "Platform terms frequently disclaim on-site liability for third-party subcontractors."
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
