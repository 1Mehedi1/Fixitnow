"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Camera, MessageCircle, Clock, ShieldCheck, ArrowRight, Zap, PhoneCall,
  CheckCheck, Sparkles, Check, Send, AlertCircle
} from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

export function WhatsAppPhotoQuote() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  const prefilledMsg = `Hi ${s.workerName || "Tanbir"}, I saw your website and would like a quick photo quote for a repair. Here are the photos/details:`
  const waUrl = whatsappLink(s, prefilledMsg)
  const phoneClean = (s.phone || "+65 8928 2459").replace(/[^0-9+]/g, "")

  const [activeStep, setActiveStep] = useState<number>(1)

  return (
    <section className="py-14 sm:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-b from-background via-emerald-500/[0.03] to-background">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-600/30 dark:border-emerald-400/40 px-3.5 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-3 sm:mb-4 uppercase tracking-wider shadow-xs">
            <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 fill-current" />
            Zero-Friction Fast Quote · 0% Middleman Markup
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance text-foreground">
            Snap a Photo. Send to WhatsApp. <br className="hidden sm:inline" />
            <span className="text-emerald-600 dark:text-emerald-400">Get a Direct Quote in 15 Mins.</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-3 sm:mt-4 text-pretty leading-relaxed">
            No endless online forms. No waiting days for broker callbacks. Snap your repair and chat directly with licensed Singapore trade specialist <span className="font-semibold text-foreground">{s.workerName || "Tanbir"}</span>.
          </p>
        </div>

        {/* 3 Step Interactive Visual Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 sm:mb-14">
          {/* Visual Step 1: Camera Viewfinder */}
          <div
            onMouseEnter={() => setActiveStep(1)}
            className={`rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
              activeStep === 1
                ? "bg-card border-emerald-500/60 shadow-xl shadow-emerald-500/10 scale-[1.01]"
                : "bg-card/70 border-border/70 hover:border-emerald-500/30"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Step 01
                </span>
                <span className="text-xs font-mono font-semibold text-muted-foreground">CAMERA SNAP</span>
              </div>

              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                1. Snap Photo or Video
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                Take a quick 5-second video or picture of your leaking pipe, blown switch, ceiling stains, or peeling paint.
              </p>

              {/* Viewfinder Graphic Mockup */}
              <div className="relative rounded-2xl bg-zinc-950 p-4 border border-zinc-800 text-white overflow-hidden shadow-inner aspect-[16/10] flex flex-col justify-between">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: "url('https://files.catbox.moe/xx0tqh.jpg')" }} />
                
                {/* Viewfinder Reticle */}
                <div className="relative z-10 flex justify-between items-start text-[10px] font-mono text-emerald-400">
                  <span>[REC] 00:04</span>
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">AF-LOCKED</span>
                </div>

                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className="h-16 w-24 rounded-lg border-2 border-dashed border-emerald-400/80 flex items-center justify-center">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold bg-black/60 px-1.5 py-0.5 rounded">
                      + FOCUS +
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>4K 60FPS</span>
                  <span className="text-emerald-400 font-bold">READY TO SEND</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>Any Singapore flat / landed home</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">0 minutes setup</span>
            </div>
          </div>

          {/* Visual Step 2: Live WhatsApp Interface Mockup */}
          <div
            onMouseEnter={() => setActiveStep(2)}
            className={`rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
              activeStep === 2
                ? "bg-card border-emerald-500/60 shadow-xl shadow-emerald-500/10 scale-[1.01]"
                : "bg-card/70 border-border/70 hover:border-emerald-500/30"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30">
                  Step 02
                </span>
                <span className="text-xs font-mono font-semibold text-muted-foreground">WHATSAPP DIRECT</span>
              </div>

              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                2. Send via WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                Send directly to <strong className="text-foreground">{s.phone}</strong>. No middleman call center, no broker triage. Speak straight with your technician.
              </p>

              {/* WhatsApp Chat Bubble Mockup */}
              <div className="rounded-2xl bg-[#0b141a] dark:bg-[#0c1317] p-3.5 border border-zinc-800 text-white space-y-2.5 shadow-inner">
                {/* Outgoing Client Bubble */}
                <div className="flex justify-end">
                  <div className="bg-[#005c4b] text-zinc-100 rounded-xl rounded-tr-xs p-2.5 max-w-[85%] text-xs shadow-sm">
                    <p>Hi Tanbir, water dripping under master toilet basin. Photo attached!</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-zinc-300">
                      <span>10:42 AM</span>
                      <CheckCheck className="h-3 w-3 text-cyan-400" />
                    </div>
                  </div>
                </div>

                {/* Incoming Technician Bubble */}
                <div className="flex justify-start">
                  <div className="bg-[#202c33] text-zinc-100 rounded-xl rounded-tl-xs p-2.5 max-w-[88%] text-xs shadow-sm border border-emerald-500/20">
                    <div className="text-[10px] font-bold text-emerald-400 mb-0.5 flex items-center gap-1">
                      <span>{s.workerName || "Tanbir"}</span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[8px] px-1 py-0.2 rounded">Contractor</span>
                    </div>
                    <p>Hi Mrs Tan! That's a cracked joint washer. Fixed quote is $120 nett with parts & warranty. Can come 2:30pm today?</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-zinc-400">
                      <span>10:47 AM (5 mins later)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>Avg WhatsApp response</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">~5 minutes</span>
            </div>
          </div>

          {/* Visual Step 3: Transparent Itemized Quote Receipt */}
          <div
            onMouseEnter={() => setActiveStep(3)}
            className={`rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
              activeStep === 3
                ? "bg-card border-emerald-500/60 shadow-xl shadow-emerald-500/10 scale-[1.01]"
                : "bg-card/70 border-border/70 hover:border-emerald-500/30"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  Step 03
                </span>
                <span className="text-xs font-mono font-semibold text-muted-foreground">FIXED ESTIMATE</span>
              </div>

              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                3. Direct Quote in 15 Mins
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                Receive an itemized quote with <strong className="text-emerald-600 dark:text-emerald-400">0% middleman markup</strong>. Lock in same-day emergency or pick weekend slot.
              </p>

              {/* Digital Price Ticket Mockup */}
              <div className="rounded-2xl bg-zinc-950 p-4 border border-dashed border-emerald-500/40 text-white space-y-3 shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800 text-xs">
                  <span className="font-bold text-zinc-300">FIXED ITEM QUOTE</span>
                  <span className="bg-emerald-500/20 text-emerald-400 font-bold font-mono px-2 py-0.5 rounded text-[11px]">
                    0% BROKER CUT
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span>Direct Trade Labor & Parts:</span>
                    <span className="font-mono font-bold text-white">$120.00</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Platform Broker Fees:</span>
                    <span className="font-mono text-emerald-400 font-bold">$0.00 (Saved $45)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>7-Day Workmanship Warranty:</span>
                    <span className="font-mono text-emerald-400 font-bold">Included Free</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-200">Total All-in:</span>
                  <span className="font-display font-black text-lg text-emerald-400 font-mono">$120.00 Nett</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>Payment terms</span>
              <span className="font-semibold text-foreground">Pay upon satisfied completion</span>
            </div>
          </div>
        </div>

        {/* High Conversion CTA Box */}
        <div className="rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-400/50 bg-gradient-to-br from-emerald-500/10 via-card to-emerald-500/5 dark:from-[#0f281b] dark:via-[#14231b] dark:to-[#0c1e14] p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 dark:bg-emerald-400/25 px-3.5 py-1 text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {s.workerName || "Tanbir"} is Online Now · Direct Singapore WhatsApp
          </div>

          <h4 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-3">
            Have a Leak, Peeling Wall, or Repair Right Now?
          </h4>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Click below to open WhatsApp with a pre-filled quote request. Attach your photo for an immediate direct price.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            {/* Primary WhatsApp Action */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                fetch("/api/analytics", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ eventType: "whatsapp_photo_quote_click" }),
                }).catch(() => {})
              }}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] transition-all text-white font-bold px-7 py-4 text-base shadow-lg shadow-[#25D366]/25 group cursor-pointer"
            >
              <MessageCircle className="h-5 w-5 fill-current shrink-0" />
              <span>Snap & WhatsApp Photo Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </a>

            {/* Secondary Direct Call Button */}
            <a
              href={`tel:${phoneClean}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-card hover:bg-muted border border-border/80 text-foreground font-bold px-6 py-4 text-sm transition-colors cursor-pointer"
            >
              <PhoneCall className="h-4 w-4 text-[#f95700] shrink-0" />
              <span>Call Direct: {s.phone}</span>
            </a>
          </div>

          {/* Singapore Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-emerald-500/20 dark:border-emerald-400/20 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              0% Platform Middleman Cut
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ACRA Registered: {s.companyName || "4R ENGINEERING PTE. LTD."}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              UEN: {s.companyUen || "202143324G"}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              HDB & Condo MCST Compliant
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
