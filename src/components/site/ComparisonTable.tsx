"use client"

import { motion } from "framer-motion"
import {
  Check, X, ShieldAlert, Award, UserCheck, ShieldCheck, Zap,
  ArrowRight, MessageCircle, ArrowDown, User, DollarSign,
  PhoneCall, Users, HelpCircle, AlertTriangle
} from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

export function ComparisonTable() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  return (
    <section className="py-14 sm:py-20 lg:py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Infographic Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-3.5 uppercase tracking-wider shadow-xs">
            <Zap className="h-3.5 w-3.5 fill-current" />
            Infographic Breakdown
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance text-foreground">
            Direct Trade Contractor <br className="hidden sm:inline" />
            <span className="text-muted-foreground font-light">vs.</span> Aggregator Brokers
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-2.5 font-medium">
            Look at the workflow comparison below: Why pay an extra 25%–35% middleman commission for an outsourced broker?
          </p>
        </motion.div>

        {/* 1. VISUAL WORKFLOW INFOGRAPHIC: Direct Route vs Broken Middleman Chain */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10 sm:mb-14">
          {/* Direct Contractor Workflow Diagram */}
          <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 via-card to-card p-6 sm:p-7 shadow-lg shadow-emerald-500/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
                  <span className="font-display font-black text-lg text-foreground">
                    {s.brand} (Direct Trade Flow)
                  </span>
                </div>
                <span className="text-[10px] font-black font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  1 Simple Step · 0% Cut
                </span>
              </div>

              {/* Visual Flow Diagram */}
              <div className="space-y-3 py-2">
                {/* Node 1 */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/70 border border-emerald-500/30">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">START</div>
                    <div className="text-xs font-bold text-white">You (Singapore Homeowner)</div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    Snaps Photo
                  </span>
                </div>

                {/* Direct Connecting Line */}
                <div className="flex justify-center my-0.5">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 font-mono">
                    <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                    DIRECT WHATSAPP · ZERO MIDDLEMEN
                  </div>
                </div>

                {/* Node 2 */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/70 border border-emerald-500/40">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">EXECUTION</div>
                    <div className="text-xs font-bold text-white">Tanbir (Master Specialist)</div>
                    <div className="text-[10px] text-zinc-400">4R ENGINEERING PTE. LTD. · UEN: 202143324G</div>
                  </div>
                  <span className="text-[11px] font-mono text-white font-bold bg-emerald-600 px-2 py-0.5 rounded shadow-xs">
                    0% Commission
                  </span>
                </div>

                {/* Direct Connecting Line */}
                <div className="flex justify-center my-0.5">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 font-mono">
                    <ArrowDown className="h-3.5 w-3.5" />
                    ON-SITE CRAFTSMANSHIP & HANDOVER
                  </div>
                </div>

                {/* Node 3 */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-black shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">RESULT</div>
                    <div className="text-xs font-bold text-white">Clean Handover · 7-Day Firm Warranty</div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    100% Value
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">Total Middleman Cost:</span>
              <span className="font-mono text-sm font-black text-emerald-400">$0.00 (You save 25%–35%)</span>
            </div>
          </div>

          {/* Aggregator Platform Fragmented Flow Diagram */}
          <div className="rounded-3xl border border-destructive/40 bg-gradient-to-b from-destructive/[0.06] via-card to-card p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-destructive/20 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full bg-destructive shadow-sm shadow-destructive" />
                  <span className="font-display font-bold text-lg text-foreground">
                    Aggregator Platforms & Broker Portals
                  </span>
                </div>
                <span className="text-[10px] font-black font-mono uppercase bg-destructive/20 text-destructive dark:text-red-400 border border-destructive/30 px-2 py-0.5 rounded-full">
                  5 Handoffs · +35% Markup
                </span>
              </div>

              {/* Visual Broken Chain */}
              <div className="space-y-2 py-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-950/60 border border-border/70 opacity-75">
                  <User className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span className="text-xs text-zinc-300 font-medium">Homeowner fills lengthy website form</span>
                </div>

                <div className="flex justify-center text-destructive">
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive dark:text-red-300">
                  <div className="flex items-center gap-2.5 text-xs font-bold">
                    <PhoneCall className="h-4 w-4 shrink-0" />
                    <span>Non-Technical Call Center / Sales Rep</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-destructive/20 px-2 py-0.5 rounded">
                    Delays
                  </span>
                </div>

                <div className="flex justify-center text-destructive">
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-destructive/15 border border-destructive/40 text-destructive dark:text-red-200">
                  <div className="flex items-center gap-2.5 text-xs font-black">
                    <DollarSign className="h-4 w-4 shrink-0" />
                    <span>Platform Takes 25%–35% Broker Cut</span>
                  </div>
                  <span className="text-[10px] font-mono font-black bg-destructive text-white px-2 py-0.5 rounded">
                    +35% COST
                  </span>
                </div>

                <div className="flex justify-center text-destructive">
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-border/70 opacity-80">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <Users className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Subcontracted to Random Third Party</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Unverified</span>
                </div>

                <div className="flex justify-center text-destructive">
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border border-destructive/30 text-zinc-300">
                  <div className="flex items-center gap-2 text-xs">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                    <span>Finger-Pointing Warranty Liability</span>
                  </div>
                  <span className="text-[10px] font-mono text-destructive">No Ownership</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-destructive/20 flex items-center justify-between">
              <span className="text-xs font-bold text-destructive">Platform Markup Added:</span>
              <span className="font-mono text-sm font-bold text-destructive">+25% to 35% on every repair</span>
            </div>
          </div>
        </div>

        {/* 2. INFOGRAPHIC SIDE-BY-SIDE METRICS (Visual Gauges & Badges) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {/* Card 1: Pricing */}
          <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground mb-2">01. PRICING</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4 shrink-0 stroke-[3]" />
                <span>Fair Direct Trade Rates</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-destructive">
                <X className="h-4 w-4 shrink-0 stroke-[3]" />
                <span>+35% Broker Fee Added</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/50 text-[10px] font-mono font-bold text-emerald-500">
              ✓ 0% BROKER COMMISSIONS
            </div>
          </div>

          {/* Card 2: Execution */}
          <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground mb-2">02. EXECUTION</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4 shrink-0 stroke-[3]" />
                <span>4R ENGINEERING (Direct)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-destructive">
                <X className="h-4 w-4 shrink-0 stroke-[3]" />
                <span>Random Subcontractors</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/50 text-[10px] font-mono font-bold text-emerald-500">
              ✓ ACRA UEN: 202143324G
            </div>
          </div>

          {/* Card 3: Communication */}
          <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground mb-2">03. COMMUNICATION</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4 shrink-0 stroke-[3]" />
                <span>Direct with Tanbir</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-destructive">
                <X className="h-4 w-4 shrink-0 stroke-[3]" />
                <span>Offshore Call Centers</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/50 text-[10px] font-mono font-bold text-emerald-500">
              ✓ ~15 MIN RESPONSE
            </div>
          </div>

          {/* Card 4: Accountability */}
          <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground mb-2">04. WARRANTY</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4 shrink-0 stroke-[3]" />
                <span>7-Day Direct Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-destructive">
                <X className="h-4 w-4 shrink-0 stroke-[3]" />
                <span>Finger-Pointing Disclaimers</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border/50 text-[10px] font-mono font-bold text-emerald-500">
              ✓ 1 PHONE, 1 CONTRACTOR
            </div>
          </div>
        </div>

        {/* Bottom Direct CTA */}
        <div className="text-center">
          <a
            href={whatsappLink(s, `Hi ${s.workerName || "Tanbir"}, I saw the contractor comparison and want a direct trade quote with 0% broker fee.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-8 text-sm sm:text-base shadow-lg shadow-emerald-950/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle className="h-5 w-5 fill-current shrink-0" />
            <span>Skip Broker Fees · Chat Directly on WhatsApp</span>
            <ArrowRight className="h-4 w-4 ml-1 shrink-0" />
          </a>
        </div>
      </div>
    </section>
  )
}
