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

        {/* Trade Tab Switcher — Segmented pill with sliding active indicator */}
        <div className="flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-muted/60 dark:bg-zinc-900/80 border border-border/70 dark:border-white/10 max-w-2xl mx-auto mb-10 shadow-xs">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = currentCatId === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePricingTab"
                    className="absolute inset-0 bg-primary rounded-xl shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Rate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto mb-10">
          {(currentCat?.rates || []).map((rate, i) => (
            <motion.div
              key={`${rate.name}-${i}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl border border-border/80 dark:border-white/10 bg-card dark:bg-zinc-950/70 p-5 sm:p-6 shadow-xs hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground leading-snug">
                    {rate.name}
                  </h3>
                  <div className="text-right shrink-0">
                    <span className="font-display font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                      {rate.price}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">{rate.unit}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rate.details}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" /> Fixed itemized quote
                </span>
                <a
                  href={whatsappLink(s, `Hi ${s.workerName}, I would like to get a quote for ${rate.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Book this</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* "What's Always Included" Guarantee Box */}
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 sm:p-7 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-display font-bold text-sm sm:text-base text-foreground">
                  What is always included in every Fixitnow quote?
                </h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Labor, transport and professional tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Floor & furniture protective coverings</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Full testing and site clean-up</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>7-Day workmanship warranty</span>
                </li>
              </ul>
            </div>
            <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white shrink-0 font-bold h-11 px-6 shadow-sm">
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
