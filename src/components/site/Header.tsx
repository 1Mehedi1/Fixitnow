"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, Phone, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore, type View } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT } from "@/lib/site"
import { defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { useTheme } from "next-themes"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV: { label: string; view: View }[] = [
  { label: "Home", view: "home" },
  { label: "Portfolio", view: "portfolio" },
  { label: "Before & After", view: "beforeAfter" },
  { label: "About", view: "about" },
]

export function Header() {
  const { view, setView } = useStore()
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => setView("home")} className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg shadow-md shadow-primary/30">
              {s.brand.charAt(0)}
            </div>
            <div className="text-left leading-none">
              <div className="font-display font-bold text-base tracking-tight">{s.brand}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.tagline}</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  view === item.view ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {view === item.view && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            <a href={`tel:${s.phone.replace(/\s/g, "")}`}>
              <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full" aria-label="Call">
                <Phone className="h-4 w-4" />
              </Button>
            </a>

            <Button
              asChild
              className="hidden sm:flex bg-[#25D366] hover:bg-[#1ebe5d] text-white"
            >
              <a
                href={whatsappLink(s, `Hi ${s.workerName}, I'd like to discuss a job.`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  fetch("/api/analytics", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ eventType: "whatsapp_click" }),
                  }).catch(() => {})
                }
              >
                <WhatsAppIcon className="h-4 w-4 mr-1.5" />
                WhatsApp
              </a>
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className="text-left">{s.brand}</SheetTitle>
                </SheetHeader>
                <div className="px-4 py-2 flex flex-col gap-1">
                  {NAV.map((item) => (
                    <button
                      key={item.view}
                      onClick={() => {
                        setView(item.view)
                      }}
                      className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        view === item.view ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setView("admin")}
                    className="text-left px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" /> Admin Login
                  </button>
                  <a
                    href={whatsappLink(s, `Hi ${s.workerName}, I'd like to discuss a job.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-3 rounded-lg bg-[#25D366] text-white font-semibold text-center text-sm"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
