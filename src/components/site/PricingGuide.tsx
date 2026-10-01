"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Check,
  ShieldCheck,
  Zap,
  Wrench,
  PaintRoller,
  Hammer,
  Clock,
  ArrowRight,
  Sofa,
  Settings,
  Droplet,
  Brush,
  Home,
  Lightbulb,
  DoorOpen,
  ShowerHead,
  type LucideIcon,
} from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig, DEFAULT_SERVICE_RATES, type RateItem } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { Button } from "@/components/ui/button"

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Zap,
  PaintRoller,
  Hammer,
  Sofa,
  Settings,
  Droplet,
  Brush,
  Home,
  Lightbulb,
  DoorOpen,
  ShowerHead,
}

const DEFAULT_CATEGORIES: { id: string; label: string; icon: LucideIcon; rates: RateItem[] }[] = [
  { id: "plumbing", label: "Plumbing", icon: Wrench, rates: DEFAULT_SERVICE_RATES.plumbing },
  { id: "electrical", label: "Electrical", icon: Zap, rates: DEFAULT_SERVICE_RATES.electrical },
  { id: "painting", label: "Painting", icon: PaintRoller, rates: DEFAULT_SERVICE_RATES.painting },
  { id: "repair", label: "Carpentry & Repairs", icon: Hammer, rates: DEFAULT_SERVICE_RATES.repair },
]

export function PricingGuide() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  
  const categories = useMemo(() => {
    const list = (s.services || [])
      .filter((svc) => Array.isArray(svc.rates) && svc.rates.length > 0)
      .map((svc) => ({
        id: svc.key,
        label: svc.label,
        icon: ICON_MAP[svc.icon] || Wrench,
        rates: svc.rates || [],
      }))
    return list.length > 0 ? list : DEFAULT_CATEGORIES
  }, [s.services])

  const [activeTab, setActiveTab] = useState("")
  const currentCatId = activeTab || categories[0]?.id || "plumbing"
  const currentCat = categories.find((c) => c.id === currentCatId) || categories[0]

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-background relative overflow-hidden" id="pricing">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-3 uppercase tracking-wider">
            Singapore Rate Card (2026)
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-balance">
            Transparent Pricing. No Middleman Markup.
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-2.5 sm:mt-3 leading-relaxed">
            Direct contractor rates across Singapore. Every quote is itemized and confirmed before work begins — no surprise invoices.
          </p>

          {/* Negotiable pricing highlight notice */}
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/30 dark:border-amber-400/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="text-amber-600 dark:text-amber-400 text-base shrink-0">💡</span>
              <span>All prices are negotiable based on site inspection, multiple jobs, or custom scope.</span>
            </div>
          </div>
        </motion.div>

        {/* Trade Tab Switcher — High-visibility pill with glowing active indicator */}
        <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-muted/80 dark:bg-[#1c1a24] border border-border/80 dark:border-white/15 max-w-3xl mx-auto mb-10 shadow-sm">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = currentCatId === cat.id
            const count = cat.rates?.length || 0
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "text-slate-950 shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 dark:hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePricingTab"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-xl shadow-md shadow-amber-500/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4 relative z-10 shrink-0" />
                <span className="relative z-10">{cat.label}</span>
                <span
                  className={`relative z-10 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-slate-950/15 text-slate-950"
                      : "bg-muted dark:bg-white/10 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Rate Cards Grid — Executive-grade, high-visibility layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto mb-12">
          {(currentCat?.rates || []).map((rate, i) => (
            <motion.div
              key={`${rate.name}-${i}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl border-2 border-border/80 dark:border-white/12 bg-card dark:bg-[#1e1c26] p-5 sm:p-6 shadow-sm hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display font-bold text-base sm:text-lg text-foreground leading-snug">
                    {rate.name}
                  </h3>
                  <div className="text-right shrink-0 bg-emerald-500/10 dark:bg-emerald-400/15 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-xs">
                    <span className="font-display font-black text-lg sm:text-xl text-emerald-600 dark:text-emerald-300 block">
                      {rate.price}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700/80 dark:text-emerald-300/80 block uppercase tracking-wider">
                      {rate.unit}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {rate.details}
                </p>

                {/* Scope inclusion micro-badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3.5 mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    <Check className="h-3 w-3 text-emerald-500" /> Fixed quote
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-200 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="h-3 w-3 text-amber-500" /> 7-Day warranty
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted/60 dark:bg-white/5 border border-border/60 px-2 py-0.5 rounded-md">
                    Tools & clean-up included
                  </span>
                </div>
              </div>

              {/* Direct Instant WhatsApp Booking Action */}
              <div className="pt-4 mt-3 border-t border-border/60 dark:border-white/10 flex items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                  Direct contractor rate
                </span>
                <a
                  href={whatsappLink(s, `Hi ${s.workerName}, I would like to get a quote for ${rate.name} (${rate.price} ${rate.unit}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-bold text-xs transition-all shadow-xs"
                >
                  <span>Book this rate</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* "What's Always Included" Guarantee Box */}
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/20 dark:via-[#1e2324] dark:to-transparent p-6 sm:p-8 max-w-5xl mx-auto shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-display font-black text-base sm:text-lg text-foreground">
                  What is always included in every {s.brand} quote?
                </h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-foreground/85 pt-1">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Labor, transport and professional diagnostic tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Floor & furniture protective coverings</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Full testing and complete site clean-up</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>7-Day workmanship warranty with zero hassle</span>
                </li>
              </ul>
            </div>
            <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white shrink-0 font-extrabold h-12 px-7 text-sm shadow-md rounded-xl">
              <a
                href={whatsappLink(s, `Hi ${s.workerName}, can you give me a quote for my job?`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Send photo for quote
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
