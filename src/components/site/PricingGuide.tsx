"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, ShieldCheck, Zap, Wrench, PaintRoller, Hammer, Clock, ArrowRight } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { Button } from "@/components/ui/button"

interface RateItem {
  name: string
  price: string
  unit: string
  details: string
}

const CATEGORIES: { id: string; label: string; icon: any; rates: RateItem[] }[] = [
  {
    id: "plumbing",
    label: "Plumbing",
    icon: Wrench,
    rates: [
      { name: "Leaking Tap or Valve Replacement", price: "$60 – $110", unit: "per set", details: "Includes new washer/valves, thread sealing and testing" },
      { name: "Toilet Bowl Flush Mechanism Repair", price: "$80 – $140", unit: "per set", details: "Syphon replacement, inlet valve and water level tune" },
      { name: "Kitchen or Basin Bottle Trap Clear / Replace", price: "$70 – $130", unit: "per point", details: "Clearing stubborn chokes, replacing PVC/chrome traps" },
      { name: "Storage or Instant Water Heater Install", price: "$120 – $220", unit: "per unit", details: "Secure mounting, pipe connection and leak inspection" },
    ],
  },
  {
    id: "electrical",
    label: "Electrical",
    icon: Zap,
    rates: [
      { name: "Lighting Fixture / Ceiling Fan Replacement", price: "$50 – $100", unit: "per point", details: "Safe mounting, wiring termination and switch test" },
      { name: "Power Socket Replacement (Single/Double)", price: "$45 – $85", unit: "per point", details: "Safety standard compliant, earthing verification" },
      { name: "Circuit Breaker / DB Box Trip Troubleshooting", price: "$90 – $160", unit: "per job", details: "Isolating faulty appliances or shorted cables" },
      { name: "Switch & Dimmer Replacement", price: "$45 – $75", unit: "per gang", details: "Standard or designer switch installation" },
    ],
  },
  {
    id: "painting",
    label: "Painting",
    icon: PaintRoller,
    rates: [
      { name: "Single Room Refresh / Water Mark Patch", price: "$180 – $320", unit: "per room", details: "Surface prep, sealer and 2 coats premium Nippon/Dulux" },
      { name: "HDB 3-Room Full Unit Painting", price: "$750 – $950", unit: "full flat", details: "Walls, ceilings, door frames with dust protection" },
      { name: "HDB 4-Room Full Unit Painting", price: "$950 – $1,250", unit: "full flat", details: "Full masking, cracks filling, premium low-VOC paint" },
      { name: "HDB 5-Room / Executive Painting", price: "$1,200 – $1,600", unit: "full flat", details: "Complete interior makeover with 1-year paint warranty" },
    ],
  },
  {
    id: "repairs",
    label: "Carpentry & Repairs",
    icon: Hammer,
    rates: [
      { name: "Door Lock & Handle Replacement", price: "$75 – $140", unit: "per set", details: "Mortise locks, lever handles, cylinder replacement" },
      { name: "Cabinet Soft-Close Hinges Replacement", price: "$60 – $120", unit: "per set (4 pcs)", details: "Aligning sagging cabinet doors and smooth operation" },
      { name: "Bathroom Silicone Mould Removal & Resealing", price: "$70 – $130", unit: "per perimeter", details: "Anti-fungal sanitary grade silicone, clean straight beads" },
      { name: "Wall Drilling & Heavy Mounting", price: "$50 – $90", unit: "first 2 items", details: "Mirrors, TV brackets, shelves with wall plug anchors" },
    ],
  },
]

export function PricingGuide() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const [activeTab, setActiveTab] = useState("plumbing")
  const currentCat = CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0]

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-background relative overflow-hidden" id="pricing">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto"
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
        </motion.div>

        {/* Trade Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-xl mx-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Rate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10">
          {currentCat.rates.map((rate, i) => (
            <motion.div
              key={rate.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
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
