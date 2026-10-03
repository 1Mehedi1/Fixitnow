"use client"

import { motion } from "framer-motion"
import { Check, X, ShieldAlert, Award, UserCheck } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

const COMPARISON = [
  {
    feature: "Pricing Transparency",
    fixitnow: "Direct contractor trade rates (0% middleman markup)",
    others: "25% to 35% broker markup added by aggregator platforms & IDs",
  },
  {
    feature: "Who Actually Does the Work?",
    fixitnow: "Executed directly by registered trade entity (4R ENGINEERING PTE. LTD.)",
    others: "Subcontracted out to unknown random third-party freelancers",
  },
  {
    feature: "Direct Technical Communication",
    fixitnow: "Direct WhatsApp with master trade specialist Tanbir",
    others: "Relayed through non-technical customer service call centers",
  },
  {
    feature: "Warranty Accountability",
    fixitnow: "1 Direct Specialist, 1 Phone Number, 1 Firm Workmanship Warranty",
    others: "Finger-pointing between platform customer service and subcontractors",
  },
  {
    feature: "Turnaround & Scheduling",
    fixitnow: "Same-day emergency response or scheduled weekend slots islandwide",
    others: "Coordination delays waiting for an available subcontractor",
  },
  {
    feature: "Legal Singapore Entity",
    fixitnow: "ACRA Registered UEN: 202143324G · Company: 4R ENGINEERING PTE. LTD.",
    others: "Often disclaim on-site liability in platform fine print terms",
  },
]

export function ComparisonTable() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  return (
    <section className="py-12 sm:py-20 lg:py-24 tech-grid-slate relative overflow-hidden">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            Direct Trade Specialist vs Platform Middlemen
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-balance">
            Direct Trade Contractor vs. Aggregator Brokers
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-2.5 sm:mt-3 leading-relaxed">
            Why pay 25%–35% extra for aggregator platform fees and outsourced middlemen? Deal directly with the registered Singapore trade specialist who actually executes your work.
          </p>
        </motion.div>

        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
          {/* Mobile stacked card view */}
          <div className="md:hidden divide-y divide-border/60">
            {COMPARISON.map((row, i) => (
              <div key={i} className="p-4 space-y-2.5">
                <div className="font-bold text-xs uppercase tracking-wide text-primary">
                  {row.feature}
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-primary font-bold mr-1">{s.brand} (Direct):</span>
                    {row.fixitnow}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 flex items-start gap-2.5 text-xs text-muted-foreground">
                  <X className="h-4 w-4 text-destructive/70 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium mr-1 text-foreground/80">Platform Brokers / Middlemen:</span>
                    {row.others}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[540px]">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30">
                  <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/3">
                    Factor
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 w-1/3">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4" /> {s.brand} (Direct Trade Contractor)
                    </span>
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/3">
                    Aggregator Platforms / Broker Middlemen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 text-foreground font-medium">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{row.fixitnow}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive/70 shrink-0 mt-0.5" />
                        <span>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
