"use client"

import { motion } from "framer-motion"
import { Check, X, ShieldAlert, Award, UserCheck } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

const COMPARISON = [
  {
    feature: "Pricing Transparency",
    fixitnow: "Direct contractor pricing (0% middleman markup)",
    others: "25% to 40% markup added by Interior Designer / Main-con",
  },
  {
    feature: "On-Site Communication",
    fixitnow: "Speak directly to the technician doing the job",
    others: "Relayed through sales agents, causing miscommunication",
  },
  {
    feature: "Warranty Accountability",
    fixitnow: "1 Worker, 1 Phone Number, 1 Direct Warranty",
    others: "Finger-pointing between subcontractors when issues arise",
  },
  {
    feature: "Scheduling & Turnaround",
    fixitnow: "Fast same-day or next-day dispatch islandwide",
    others: "1 to 2 weeks coordination delay waiting for available sub-cons",
  },
  {
    feature: "Site Protection & Cleanliness",
    fixitnow: "Padded floor sheets, dust masking & full cleanup",
    others: "Often left dirty for homeowner to clean after the job",
  },
  {
    feature: "Legal Singapore Entity",
    fixitnow: "ACRA registered, MOM construction sector authorized",
    others: "Unregistered freelancers with no insurance or recourse",
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
            Why Choose Direct Contractor
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-balance">
            Direct Trade Specialist vs. Renovation Middleman
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-2.5 sm:mt-3 leading-relaxed">
            Why pay 30% more for middleman sales commissions? Deal directly with the registered craftsman who actually does the work.
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
                    <span className="font-medium mr-1 text-foreground/80">Traditional ID:</span>
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
                      <UserCheck className="h-4 w-4" /> {s.brand} (Direct)
                    </span>
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/3">
                    Traditional ID / Subcontractors
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
