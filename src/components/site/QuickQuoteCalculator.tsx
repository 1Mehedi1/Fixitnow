"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building, Home, Building2, Store, Wrench, ArrowRight, ShieldCheck, Zap } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { Button } from "@/components/ui/button"

const PROPERTY_TYPES = [
  { id: "hdb", label: "HDB Flat", sub: "3/4/5-Room", icon: Building },
  { id: "condo", label: "Condominium", sub: "Private Apt", icon: Building2 },
  { id: "landed", label: "Landed House", sub: "Terrace/Semi-D", icon: Home },
  { id: "commercial", label: "Commercial", sub: "Office/Shop", icon: Store },
]

export function QuickQuoteCalculator() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const servicesList = (s.services && s.services.length > 0)
    ? s.services.map((svc) => ({ id: svc.key, label: svc.label }))
    : [
        { id: "roofing", label: "Roofing & Waterproofing" },
        { id: "painting", label: "Painting Services" },
        { id: "plumbing", label: "Plumbing Services" },
      ]
  const [selectedProperty, setSelectedProperty] = useState("hdb")
  const [selectedService, setSelectedService] = useState(servicesList[0]?.id || "roofing")

  const propLabel = PROPERTY_TYPES.find((p) => p.id === selectedProperty)?.label || "HDB Flat"
  const svcLabel = servicesList.find((sv) => sv.id === selectedService)?.label || servicesList[0]?.label || "Roofing & Waterproofing"

  const generatedMsg = `Hi ${s.workerName}, I need ${svcLabel} for my ${propLabel} in Singapore. Can you give me an estimated quote?`

  return (
    <section className="py-8 sm:py-14 bg-background relative border-b border-border/40">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/20 p-5 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-lg">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                <Zap className="h-3 w-3" /> Quick Singapore Scope Estimator
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground tracking-tight">
                Select your property and get an instant quote.
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Tailored for Singapore HDB regulations, MCST protocols and landed homes. Send with 1 tap.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-3.5 py-1.5 rounded-xl border border-border/40 self-start lg:self-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>1-Hour WhatsApp Response Guarantee</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Step 1: Property Type */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                1. Select Property Type
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PROPERTY_TYPES.map((prop) => {
                  const Icon = prop.icon
                  const isSelected = selectedProperty === prop.id
                  return (
                    <button
                      key={prop.id}
                      onClick={() => setSelectedProperty(prop.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-border/70 bg-background hover:border-border"
                      }`}
                    >
                      <Icon className={`h-4 w-4 mb-1.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="font-semibold text-xs sm:text-sm text-foreground">{prop.label}</div>
                      <div className="text-[10px] text-muted-foreground">{prop.sub}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Service Category */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                2. Select Service Needed
              </span>
              <div className="flex flex-wrap gap-2">
                {servicesList.map((svc) => {
                  const isSelected = selectedService === svc.id
                  return (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedService(svc.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-foreground text-background border-foreground shadow-xs"
                          : "bg-background text-muted-foreground border-border/70 hover:border-foreground/40"
                      }`}
                    >
                      {svc.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 3: Fast Action Output */}
            <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Selected: <span className="font-semibold text-foreground">{propLabel}</span> · <span className="font-semibold text-foreground">{svcLabel}</span>
              </div>
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold h-11 px-6 shadow-md hover:scale-[1.01] transition-transform">
                <a href={whatsappLink(s, generatedMsg)} target="_blank" rel="noopener noreferrer">
                  <span>Get Quote for {propLabel}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
