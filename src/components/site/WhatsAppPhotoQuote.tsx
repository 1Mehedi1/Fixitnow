"use client"

import { Camera, MessageCircle, Clock, ShieldCheck, ArrowRight, Zap, PhoneCall } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

export function WhatsAppPhotoQuote() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  const prefilledMsg = `Hi ${s.workerName || "Tanbir"}, I saw your website and would like a quick photo quote for a repair. Here are the photos/details:`
  const waUrl = whatsappLink(s, prefilledMsg)
  const phoneClean = (s.phone || "+65 8928 2459").replace(/[^0-9+]/g, "")

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-background via-emerald-500/[0.03] to-background">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-600/30 dark:border-emerald-400/40 px-3.5 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-3 sm:mb-4 uppercase tracking-wider shadow-xs">
            <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 fill-current" />
            Zero-Friction Fast Quote · 0% Middleman Markup
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance text-foreground">
            Snap a Photo. Send to WhatsApp. <br className="hidden sm:inline" />
            <span className="text-emerald-600 dark:text-emerald-400">Get a Direct Quote in 15 Mins.</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-3 sm:mt-4 text-pretty leading-relaxed">
            No lengthy contact forms. No waiting days for email replies. Snap your repair on your phone and chat directly with licensed Singapore trade specialist <span className="font-semibold text-foreground">{s.workerName || "Tanbir"}</span>.
          </p>
        </div>

        {/* 3 Step Interactive Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Step 1 */}
          <div className="relative rounded-2xl border border-emerald-500/25 dark:border-emerald-400/30 bg-card p-6 sm:p-7 shadow-sm hover:border-emerald-500/50 transition-all hover:shadow-md group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Camera className="h-6 w-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 bg-muted/60 px-2.5 py-1 rounded-full">
                Step 1
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              1. Snap Photo or Video
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Take a quick picture or 5-second video of your leaking pipe, blown power switch, water heater, or painting area.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl border border-emerald-500/25 dark:border-emerald-400/30 bg-card p-6 sm:p-7 shadow-sm hover:border-emerald-500/50 transition-all hover:shadow-md group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 bg-muted/60 px-2.5 py-1 rounded-full">
                Step 2
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              2. Send via WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Send directly to <span className="font-semibold text-foreground">{s.phone}</span>. No call centers, no aggregator sales agents. Speak straight to the technician.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl border border-emerald-500/25 dark:border-emerald-400/30 bg-card p-6 sm:p-7 shadow-sm hover:border-emerald-500/50 transition-all hover:shadow-md group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 bg-muted/60 px-2.5 py-1 rounded-full">
                Step 3
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              3. Direct Quote in 15 Mins
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Receive a transparent, itemized quote with <span className="text-emerald-600 dark:text-emerald-400 font-bold">0% middleman markup</span>. Book same-day or choose a weekend slot.
            </p>
          </div>
        </div>

        {/* High Conversion CTA Box */}
        <div className="rounded-2xl sm:rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-400/50 bg-gradient-to-br from-emerald-500/10 via-card to-emerald-500/5 dark:from-[#0f281b] dark:via-[#14231b] dark:to-[#0c1e14] p-6 sm:p-8 lg:p-10 shadow-lg text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 dark:bg-emerald-400/25 px-3 py-1 text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Tanbir is Online Now · Average Reply: ~5 Mins
          </div>

          <h4 className="font-display text-xl sm:text-3xl font-black text-foreground mb-3">
            Have a Leak, Power Fault, or Repair Right Now?
          </h4>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Click below to open WhatsApp with a pre-filled photo quote request. You can attach your photo right away.
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
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] transition-all text-white font-bold px-6 py-4 text-base shadow-lg shadow-[#25D366]/25 group cursor-pointer"
            >
              <MessageCircle className="h-5 w-5 fill-current shrink-0" />
              <span>Snap & WhatsApp Photo Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </a>

            {/* Secondary Direct Call Button */}
            <a
              href={`tel:${phoneClean}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-card hover:bg-muted border border-border/80 text-foreground font-bold px-5 py-4 text-sm transition-colors cursor-pointer"
            >
              <PhoneCall className="h-4 w-4 text-[#f95700] shrink-0" />
              <span>Call Direct: {s.phone}</span>
            </a>
          </div>

          {/* Singapore Trust Guarantees */}
          <div className="mt-6 sm:mt-8 pt-6 border-t border-emerald-500/20 dark:border-emerald-400/20 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              0% Platform Middleman Cut
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ACRA Registered Entity · 4R ENGINEERING PTE. LTD.
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Free Photo Consultation & Estimate
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              HDB & Condo MCST Compliant
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
