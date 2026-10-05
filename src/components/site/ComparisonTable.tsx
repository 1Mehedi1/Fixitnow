"use client"

import { motion } from "framer-motion"
import {
  Check, X, ShieldCheck, Zap, ArrowRight, MessageCircle,
  Clock, DollarSign, AlertTriangle, UserCheck, ShieldAlert,
  Layers, CheckCircle2, XCircle, Sparkles, Building2
} from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

export function ComparisonTable() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  return (
    <section className="py-14 sm:py-20 lg:py-24 relative overflow-hidden bg-background">
      {/* Background ambient lighting for Day & Night modes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Infographic Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-3.5 uppercase tracking-wider shadow-xs">
            <Zap className="h-3.5 w-3.5 fill-current" />
            Infographic Comparison
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-balance text-foreground">
            Direct Trade Contractor <br className="hidden sm:inline" />
            <span className="text-muted-foreground font-light">vs.</span> Aggregator Brokers
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-2.5 font-medium max-w-2xl mx-auto">
            Why pay an extra 25%–35% middleman commission for an outsourced broker? See the two routes compared visually below.
          </p>
        </motion.div>

        {/* 1. DOMINATING VISUAL HEAD-TO-HEAD ARENA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 sm:mb-16">
          {/* LEFT: DIRECT TRADE CONTRACTOR (FIXITNOW) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border-2 border-emerald-500 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-xl shadow-emerald-500/10 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 pb-5 border-b border-emerald-500/20 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse" />
                    <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900 dark:text-white">
                      {s.brand}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Direct Trade Craftsman · UEN: {s.companyUen}
                  </p>
                </div>
                <span className="text-[11px] font-black font-mono uppercase bg-emerald-500 text-white px-3 py-1 rounded-full shadow-xs shrink-0">
                  0% Mark-up
                </span>
              </div>

              {/* DOMINATING VISUAL: DIRECT ROUTE BEAM */}
              <div className="space-y-3.5 my-4">
                <div className="text-[11px] font-mono font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>⚡ 1-Step Direct Route</span>
                  <span className="text-stone-500 dark:text-stone-400 font-bold">100% Value</span>
                </div>

                {/* Stage 1 */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-500/30">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
                    📸
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-black">STEP 1: SNAP & SEND</div>
                    <div className="text-sm font-extrabold text-stone-900 dark:text-white">You Snap Repair Photo via WhatsApp</div>
                    <div className="text-[11px] text-stone-600 dark:text-stone-400">Direct transmission to Master Craftsman Tanbir</div>
                  </div>
                  <span className="text-[10px] font-bold font-mono bg-emerald-600 text-white px-2 py-0.5 rounded shadow-xs shrink-0">
                    &lt; 15 mins
                  </span>
                </div>

                {/* Direct High-Speed Indicator */}
                <div className="flex items-center justify-center gap-2 py-1">
                  <div className="h-6 w-0.5 bg-emerald-500" />
                  <span className="text-[10px] font-mono font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/40">
                    ZERO CALL CENTER · DIRECT EXECUTION
                  </span>
                  <div className="h-6 w-0.5 bg-emerald-500" />
                </div>

                {/* Stage 2 */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/60 border-2 border-emerald-500/60">
                  <div className="h-11 w-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-black">STEP 2: CRAFTSMANSHIP</div>
                    <div className="text-sm font-extrabold text-stone-900 dark:text-white">Tanbir Personally On-Site Handling</div>
                    <div className="text-[11px] text-stone-600 dark:text-stone-400">BCA & EMA compliant · Premium materials · Zero sub-con</div>
                  </div>
                  <span className="text-[10px] font-bold font-mono bg-emerald-600 text-white px-2 py-0.5 rounded shadow-xs shrink-0">
                    100% Trade
                  </span>
                </div>

                {/* Direct High-Speed Indicator */}
                <div className="flex items-center justify-center gap-2 py-1">
                  <div className="h-6 w-0.5 bg-emerald-500" />
                  <span className="text-[10px] font-mono font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/40">
                    SPOTLESS CLEANUP & FIRM WARRANTY
                  </span>
                  <div className="h-6 w-0.5 bg-emerald-500" />
                </div>

                {/* Stage 3 */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-500/30">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-black">STEP 3: HANDOVER</div>
                    <div className="text-sm font-extrabold text-stone-900 dark:text-white">7-Day Firm Workmanship Guarantee</div>
                    <div className="text-[11px] text-stone-600 dark:text-stone-400">Direct phone & WhatsApp direct to the actual worker</div>
                  </div>
                  <span className="text-[10px] font-bold font-mono bg-emerald-600 text-white px-2 py-0.5 rounded shadow-xs shrink-0">
                    Firm Peace
                  </span>
                </div>
              </div>

              {/* Visual Value Bar */}
              <div className="mt-5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30">
                <div className="flex justify-between text-xs font-black text-stone-800 dark:text-stone-200 mb-1.5">
                  <span>Your Dollars Breakdown:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">100% to Actual Trade Work</span>
                </div>
                <div className="h-3 w-full bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500 w-full rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-stone-500 dark:text-stone-400 mt-1">
                  <span>Direct Craftsman Labor & Materials: 100%</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Platform Cut: $0</span>
                </div>
              </div>
            </div>

            {/* Bottom summary */}
            <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Middleman Surcharge:</span>
              <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">$0.00 (You save 25%–35%)</span>
            </div>
          </motion.div>

          {/* RIGHT: AGGREGATOR PLATFORMS & BROKERS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border-2 border-rose-400/80 dark:border-rose-500/60 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-xl shadow-rose-500/5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top decorative warning bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-red-500 to-rose-600" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 pb-5 border-b border-rose-500/20 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
                    <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900 dark:text-white">
                      Aggregator Broker Portals
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    Lead Generation Middlemen & Broker Apps
                  </p>
                </div>
                <span className="text-[11px] font-black font-mono uppercase bg-rose-600 text-white px-3 py-1 rounded-full shadow-xs shrink-0">
                  +35% Fee Added
                </span>
              </div>

              {/* DOMINATING VISUAL: BROKEN CHAIN */}
              <div className="space-y-2.5 my-4">
                <div className="text-[11px] font-mono font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center justify-between">
                  <span>⚠️ 5-Tier Broken Chain</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">+35% Leakage</span>
                </div>

                {/* Broken Step 1 */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800">
                  <div className="h-8 w-8 rounded-lg bg-stone-200 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <span className="font-extrabold text-stone-900 dark:text-white">Lengthy Web Lead Form</span>
                    <span className="text-stone-500 dark:text-stone-400 block text-[10px]">Data collected for remarketing</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">Wait</span>
                </div>

                {/* Broken Step 2 */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-900/40">
                  <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <span className="font-extrabold text-stone-900 dark:text-white">Call Center Sales Agent Call</span>
                    <span className="text-stone-500 dark:text-stone-400 block text-[10px]">No technical trade knowledge, only scripts</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">24-48hr Delay</span>
                </div>

                {/* Broken Step 3 - THE COMMISSION CUT */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 dark:bg-rose-950/40 border-2 border-rose-500/50">
                  <div className="h-8 w-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    3
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <span className="font-black text-rose-700 dark:text-rose-300 uppercase tracking-wide">
                      Platform Takes 25%–35% Commission
                    </span>
                    <span className="text-stone-600 dark:text-stone-400 block text-[10px]">
                      Added directly on top of your invoice
                    </span>
                  </div>
                  <span className="text-[11px] font-black font-mono bg-rose-600 text-white px-2 py-0.5 rounded shadow-xs shrink-0">
                    +35% COST
                  </span>
                </div>

                {/* Broken Step 4 */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800">
                  <div className="h-8 w-8 rounded-lg bg-stone-200 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <span className="font-extrabold text-stone-900 dark:text-white">Lowest-Bid Subcontractor Dispatched</span>
                    <span className="text-stone-500 dark:text-stone-400 block text-[10px]">Unvetted worker you’ve never seen</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">Roulette</span>
                </div>

                {/* Broken Step 5 */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-900/40">
                  <div className="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                    5
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <span className="font-extrabold text-stone-900 dark:text-white">Warranty Blame-Shifting</span>
                    <span className="text-stone-500 dark:text-stone-400 block text-[10px]">Platform says "call the sub-con", sub-con vanishes</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">No Recourse</span>
                </div>
              </div>

              {/* Visual Leakage Bar */}
              <div className="mt-5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-400/40">
                <div className="flex justify-between text-xs font-black text-stone-800 dark:text-stone-200 mb-1.5">
                  <span>Your Dollars Breakdown:</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono">+35% Broker Cut Surcharge</span>
                </div>
                <div className="h-3 w-full bg-stone-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-stone-400 dark:bg-zinc-600 w-[65%]" />
                  <div className="h-full bg-rose-500 w-[35%]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-stone-500 dark:text-stone-400 mt-1">
                  <span>Actual Work: ~65%</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">Middleman Markup: +35%</span>
                </div>
              </div>
            </div>

            {/* Bottom summary */}
            <div className="mt-6 pt-4 border-t border-rose-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Middleman Cut:</span>
              <span className="font-mono text-base font-black text-rose-600 dark:text-rose-400">+25% to +35% Markup Added</span>
            </div>
          </motion.div>
        </div>

        {/* 2. VISUAL SCORECARD TILES: DAY & NIGHT HIGH-CONTRAST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 sm:mb-14">
          {[
            {
              title: "Price & Markup",
              icon: DollarSign,
              direct: "100% Fair Direct Rate",
              directSub: "0% Broker Markup",
              broker: "+25% to +35% Broker Cut",
              brokerSub: "Inflated Platform Price",
              directBadge: "0% CUT",
              brokerBadge: "+35% TAX",
            },
            {
              title: "Who Does The Work",
              icon: UserCheck,
              direct: "Tanbir Personally On-Site",
              directSub: "Registered Master Tech",
              broker: "Random Outsourced Sub-con",
              brokerSub: "Unvetted Lowest Bidder",
              directBadge: "MASTER TECH",
              brokerBadge: "UNKNOWN",
            },
            {
              title: "Quote Response Time",
              icon: Clock,
              direct: "< 15 Mins Direct WhatsApp",
              directSub: "Direct Tech Diagnosis",
              broker: "24–48 Hours Ticket Lag",
              brokerSub: "Non-Technical Call Center",
              directBadge: "15 MINS",
              brokerBadge: "2 DAYS",
            },
            {
              title: "Warranty & Recourse",
              icon: ShieldCheck,
              direct: "7-Day Firm Guarantee",
              directSub: "Direct Owner Accountability",
              broker: "Blame-Shifting Carousel",
              brokerSub: '"Call the Subcontractor"',
              directBadge: "7-DAY FIRM",
              brokerBadge: "DISPUTED",
            },
          ].map((m, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <m.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-extrabold text-xs text-stone-900 dark:text-white uppercase tracking-wider">{m.title}</span>
                </div>
              </div>

              {/* Direct Advantage */}
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 font-mono">FIXITNOW DIRECT</span>
                  <span className="text-[9px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded">{m.directBadge}</span>
                </div>
                <div className="text-xs font-extrabold text-stone-900 dark:text-white mt-1">{m.direct}</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">{m.directSub}</div>
              </div>

              {/* Broker Disadvantage */}
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-900/40 opacity-90">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-rose-800 dark:text-rose-400 font-mono">BROKER PORTAL</span>
                  <span className="text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded">{m.brokerBadge}</span>
                </div>
                <div className="text-xs font-bold text-stone-800 dark:text-stone-300 mt-1 line-through decoration-rose-500">{m.broker}</div>
                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">{m.brokerSub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. DIRECT ACTION CALLOUT */}
        <div className="rounded-3xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Skip the Middleman Markup
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black">
              Speak directly with Master Craftsman Tanbir
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-xl">
              Snap a photo of your leak, waterproofing, painting or repair on WhatsApp. Get a direct, transparent fixed-price quote with zero broker fee.
            </p>
          </div>

          <a
            href={whatsappLink(s, `Hi Tanbir, I saw your direct comparison table and want a direct photo quote with 0% broker fee.`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventType: "whatsapp_click" }),
              }).catch(() => {})
            }
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-emerald-950 font-black text-sm hover:bg-stone-100 hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0 cursor-pointer"
          >
            <MessageCircle className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            <span>WhatsApp Direct (<span className="text-emerald-700">&lt; 15 mins</span>)</span>
            <ArrowRight className="h-4 w-4 text-emerald-800" />
          </a>
        </div>
      </div>
    </section>
  )
}
