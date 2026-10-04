"use client"

import { Phone, MessageCircle } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

/** Persistent bottom dock for mobile devices, maximizing lead capture conversion rate. */
export function MobileBottomDock() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  const prefilledMsg = `Hi, I saw your website and would like a quick photo quote for a repair. Here are the details/photos:`
  const waUrl = whatsappLink(s, prefilledMsg)
  const phoneClean = (s.phone || "+65 8928 2459").replace(/[^0-9+]/g, "")

  return (
    <aside aria-label="Quick contact" className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 dark:bg-[#121018]/95 backdrop-blur-md border-t border-border/70 dark:border-white/10 p-2.5 px-3 shadow-[0_-4px_25px_rgba(0,0,0,0.15)] pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Direct Call Button (Urgent Repairs) */}
        <a
          href={`tel:${phoneClean}`}
          onClick={() => {
            fetch("/api/analytics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ eventType: "mobile_dock_call_click" }),
            }).catch(() => {})
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-muted/80 dark:bg-card hover:bg-muted border border-border/80 dark:border-white/10 text-foreground py-2.5 px-3 text-xs font-bold active:scale-[0.98] transition-all"
        >
          <Phone className="h-4 w-4 text-[#f95700] shrink-0" />
          <div className="text-left leading-tight">
            <span className="block text-[10px] text-muted-foreground uppercase font-extrabold tracking-wider">Direct Line</span>
            <span className="text-xs font-black">Call Direct</span>
          </div>
        </a>

        {/* WhatsApp Photo Quote Button (Primary High-Converting Funnel) */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            fetch("/api/analytics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ eventType: "mobile_dock_whatsapp_click" }),
            }).catch(() => {})
          }}
          className="flex-[1.4] inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] transition-all text-white py-2.5 px-3 shadow-md shadow-[#25D366]/30 text-xs font-bold"
        >
          <div className="relative shrink-0">
            <MessageCircle className="h-4.5 w-4.5 fill-current" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200" />
            </span>
          </div>
          <div className="text-left leading-tight">
            <span className="block text-[10px] text-white/90 uppercase font-extrabold tracking-wider">Fast Quote</span>
            <span className="text-xs font-black">WhatsApp Photo</span>
          </div>
        </a>
      </div>
    </aside>
  )
}
