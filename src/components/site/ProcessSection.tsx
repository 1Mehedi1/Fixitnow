"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Camera, MessageCircle, Clock, ShieldCheck, Wrench, Sparkles,
  ArrowRight, Check, Zap, Award, Layers, CheckCircle2, ChevronRight
} from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

const INFOGRAPHIC_STEPS = [
  {
    step: "01",
    phase: "PHASE 1",
    title: "15-Min Photo Quote",
    badge: "< 15 Mins",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    gradient: "from-amber-500/10 via-amber-500/[0.03] to-transparent",
    borderGlow: "group-hover:border-amber-500/60 group-hover:shadow-amber-500/15",
    icon: Camera,
    iconColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    // Minimal Visual Illustration Diagram
    visual: (
      <div className="relative w-full aspect-[16/10] rounded-2xl bg-zinc-950/90 border border-zinc-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Smartphone Viewfinder mockup */}
        <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            WHATSAPP SNAP
          </span>
          <span className="bg-amber-500/20 px-1.5 py-0.5 rounded font-bold font-mono">15m REPLY</span>
        </div>

        {/* Visual Mini Chat Dialogue */}
        <div className="space-y-1.5 my-auto">
          <div className="bg-zinc-800/90 text-white rounded-lg rounded-tl-none p-1.5 text-[11px] max-w-[85%] flex items-center gap-1.5">
            <Camera className="h-3 w-3 text-amber-400 shrink-0" />
            <span className="truncate">Photo of repair sent</span>
          </div>
          <div className="bg-emerald-600 text-white rounded-lg rounded-tr-none p-1.5 text-[11px] max-w-[90%] ml-auto flex items-center justify-between gap-1 shadow-xs">
            <span className="font-bold font-mono">Fixed Quote: $120</span>
            <CheckCircle2 className="h-3 w-3 text-emerald-200 shrink-0" />
          </div>
        </div>

        {/* Bottom Status bar */}
        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 pt-1 border-t border-zinc-800/80">
          <span>0% BROKER MARKUP</span>
          <span className="text-emerald-400">DATE CONFIRMED</span>
        </div>
      </div>
    ),
    chips: [
      "📸 Snap photo / video",
      "⏱️ ~15 mins reply",
      "🏷️ Itemized fixed price",
    ],
  },
  {
    step: "02",
    phase: "PHASE 2",
    title: "100% Dust Protection",
    badge: "Zero Mess",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    gradient: "from-emerald-500/10 via-emerald-500/[0.03] to-transparent",
    borderGlow: "group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/15",
    icon: ShieldCheck,
    iconColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    // Minimal Visual Illustration Diagram
    visual: (
      <div className="relative w-full aspect-[16/10] rounded-2xl bg-zinc-950/90 border border-zinc-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            HOME PREPARATION
          </span>
          <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold font-mono">0 DAMAGE</span>
        </div>

        {/* Protection Sheeting Graphic */}
        <div className="my-auto relative p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Heavy Floor Mats Laid</span>
            </div>
            <div className="text-[9px] text-zinc-400 flex items-center gap-1">
              <span>Corridors</span> · <span>Lifts</span> · <span>Furniture Masked</span>
            </div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs font-black shrink-0">
            100%
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 pt-1 border-t border-zinc-800/80">
          <span>CLEAN AIR BARRIER</span>
          <span className="text-emerald-400">ZERO RESIDUE</span>
        </div>
      </div>
    ),
    chips: [
      "🛡️ Floors & lifts covered",
      "🛋️ Furniture masked",
      "🚫 Zero collateral damage",
    ],
  },
  {
    step: "03",
    phase: "PHASE 3",
    title: "Master Trade Execution",
    badge: "Direct Specialist",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    gradient: "from-blue-500/10 via-blue-500/[0.03] to-transparent",
    borderGlow: "group-hover:border-blue-500/60 group-hover:shadow-blue-500/15",
    icon: Wrench,
    iconColor: "text-blue-400 bg-blue-500/15 border-blue-500/30",
    // Minimal Visual Illustration Diagram
    visual: (
      <div className="relative w-full aspect-[16/10] rounded-2xl bg-zinc-950/90 border border-zinc-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-mono text-blue-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            TRADE CRAFTSMANSHIP
          </span>
          <span className="bg-blue-500/20 px-1.5 py-0.5 rounded font-bold font-mono">NO SUB-CON</span>
        </div>

        {/* Master Trade Graphic */}
        <div className="my-auto p-2 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-300">
              <Wrench className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span>Tanbir On-Site Handling</span>
            </div>
            <div className="text-[9px] text-zinc-400 flex items-center gap-1">
              <span>BCA Standards</span> · <span>EMA Safety</span> · <span>Clean Welds</span>
            </div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 text-xs font-black shrink-0">
            PRO
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 pt-1 border-t border-zinc-800/80">
          <span>SINGAPORE COMPLIANT</span>
          <span className="text-blue-400">PREMIUM MATERIALS</span>
        </div>
      </div>
    ),
    chips: [
      "👷 Registered master tech",
      "⚡ BCA & EMA safety",
      "❌ 0% Third-party handoff",
    ],
  },
  {
    step: "04",
    phase: "PHASE 4",
    title: "Clean Handover & Warranty",
    badge: "7-Day Guarantee",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    gradient: "from-purple-500/10 via-purple-500/[0.03] to-transparent",
    borderGlow: "group-hover:border-purple-500/60 group-hover:shadow-purple-500/15",
    icon: Sparkles,
    iconColor: "text-purple-400 bg-purple-500/15 border-purple-500/30",
    // Minimal Visual Illustration Diagram
    visual: (
      <div className="relative w-full aspect-[16/10] rounded-2xl bg-zinc-950/90 border border-zinc-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-mono text-purple-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            FINAL HANDOVER
          </span>
          <span className="bg-purple-500/20 px-1.5 py-0.5 rounded font-bold font-mono">WARRANTY</span>
        </div>

        {/* 7-Day Guarantee Graphic */}
        <div className="my-auto p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-300">
              <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span>Surfaces Wiped Clean</span>
            </div>
            <div className="text-[9px] text-zinc-400 flex items-center gap-1">
              <span>Joint Testing</span> · <span>7-Day Warranty</span> · <span>Pay After</span>
            </div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-xs font-black shrink-0">
            7D
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 pt-1 border-t border-zinc-800/80">
          <span>DEBRIS BAGGED OFF</span>
          <span className="text-purple-400">100% SATISFACTION</span>
        </div>
      </div>
    ),
    chips: [
      "✨ Surfaces wiped clean",
      "🤝 Joint testing together",
      "🛡️ 7-Day firm warranty",
    ],
  },
]

export function ProcessSection() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const [hoveredIdx, setHoveredIdx] = useState<number>(0)

  return (
    <section className="py-14 sm:py-20 lg:py-24 border-y border-border/50 relative overflow-hidden bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Infographic Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-3 uppercase tracking-wider shadow-xs">
            <Zap className="h-3.5 w-3.5 fill-current" />
            Infographic Workflow
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance text-foreground">
            Four phases. Zero mess. <br className="hidden sm:inline" />
            <span className="text-emerald-600 dark:text-emerald-400">Your home handled properly.</span>
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-2.5 font-medium">
            Look below: A simple 4-step visual flow from WhatsApp snap to sparkling clean handover.
          </p>
        </motion.div>

        {/* Infographic Stepper Pipeline */}
        <div className="relative">
          {/* Continuous Desktop Process Flow Arrow Track */}
          <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-amber-500/50 via-emerald-500/50 to-purple-500/50 z-0 rounded-full" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {INFOGRAPHIC_STEPS.map((item, i) => {
              const Icon = item.icon
              const isHovered = hoveredIdx === i

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  className="h-full group"
                >
                  <div
                    className={`rounded-3xl border bg-card p-5 h-full flex flex-col justify-between transition-all duration-300 shadow-sm relative overflow-hidden bg-gradient-to-b ${item.gradient} ${item.borderGlow} ${
                      isHovered ? "border-emerald-500/60 shadow-xl -translate-y-1" : "border-border/80"
                    }`}
                  >
                    <div>
                      {/* Top Infographic Milestone Node */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${item.iconColor}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                          <span className="font-mono text-2xl font-black text-muted-foreground/30 group-hover:text-foreground/60 transition-colors">
                            {item.step}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="mb-3">
                        <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                          {item.phase}
                        </div>
                        <h3 className="font-display font-black text-lg text-foreground tracking-tight">
                          {item.title}
                        </h3>
                      </div>

                      {/* Visual Diagram Mockup */}
                      <div className="mb-4">
                        {item.visual}
                      </div>

                      {/* 3 Punchy Micro Visual Chips */}
                      <div className="space-y-1.5 pt-2 border-t border-border/60">
                        {item.chips.map((chip, cIdx) => (
                          <div
                            key={cIdx}
                            className="text-[11px] font-bold text-foreground/90 bg-muted/60 dark:bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-border/40 flex items-center gap-1.5"
                          >
                            <span>{chip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Micro Action */}
                    <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">
                        {i === 0 ? "START" : i === 3 ? "DONE" : "IN PROGRESS"}
                      </span>
                      <a
                        href={whatsappLink(s, `Hi ${s.workerName || "Tanbir"}, I'd like to schedule a repair in ${item.phase}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline group-hover:translate-x-0.5 transition-transform"
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
