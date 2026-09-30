"use client"

import { motion } from "framer-motion"
import { Handshake, Building, KeyRound, Wrench, ArrowRight } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { Button } from "@/components/ui/button"

export function TradePartnership() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  return (
    <section className="py-10 sm:py-16 bg-muted/20 border-b border-border/50">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-amber-500/5 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
              <Handshake className="h-3.5 w-3.5" /> B2B & Tenancy Partnerships
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground tracking-tight">
              Are you a Landlord, Property Agent or Interior Designer?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We provide fast turnaround defect rectifications, tenancy handover restorations, and subcontract trade execution (plumbing, electrical, painting) with corporate invoicing.
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">✓ Fast Tenancy Handovers</span>
              <span className="flex items-center gap-1">✓ Corporate Invoicing Available</span>
              <span className="flex items-center gap-1">✓ Islandwide Defect Rectification</span>
            </div>
          </div>

          <div className="shrink-0">
            <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold h-11 px-6 shadow-sm">
              <a
                href={whatsappLink(s, `Hi ${s.workerName}, I am a property agent/landlord and would like to discuss a trade partnership.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Discuss Partnership</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
