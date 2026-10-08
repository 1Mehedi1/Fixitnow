"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { whatsappLink, type SiteSettingsT } from "@/lib/site"
import { defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { useTheme } from "next-themes"
import { BrandLogo } from "@/components/site/BrandLogo"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/work" },
  { label: "Before & After", href: "/before-and-after" },
  { label: "Reviews", href: "/reviews" },
  { label: "Pricing", href: "/pricing" },
  { label: "Process", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  const [mobileOpen, setMobileOpen] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const toggleTheme = () => {
    try {
      localStorage.setItem("user_toggled_theme", "true")
    } catch {}
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      {/* Top High-Trust WhatsApp Emerald Direct Line Bar — 100% Clickable & Mobile Responsive */}
      <a
        href={whatsappLink(s, "Hi, I would like to get an instant quote for a repair / renovation job.")}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#0d5c3a] hover:brightness-110 text-white py-1.5 sm:py-2 px-2.5 sm:px-4 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide transition-all shadow-xs block group cursor-pointer"
        title="Chat on WhatsApp for an instant consultation & quote"
      >
        <div className="container mx-auto max-w-7xl flex items-center justify-center gap-1.5 sm:gap-2 text-center">
          <WhatsAppIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white shrink-0 animate-pulse group-hover:scale-110 transition-transform" />
          <span className="truncate flex items-center gap-1.5 justify-center">
            <span>Chat on WhatsApp for an Instant Quote</span>
            <span className="hidden md:inline opacity-90 font-normal">· Tap anywhere to connect with us</span>
          </span>
        </div>
      </a>

      {/* Frosted Glass Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 backdrop-blur-xl backdrop-saturate-150 border-b ${
          scrolled
            ? "bg-background/80 dark:bg-[#14121b]/85 border-border/40 dark:border-white/10 shadow-md shadow-black/5"
            : "bg-background/65 dark:bg-[#14121b]/70 border-border/25 dark:border-white/5 shadow-xs"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo / Favicon Link - Always navigates to "/" on any page or device */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group text-left cursor-pointer transition-transform hover:scale-[1.02]"
              title={`${s.brand} - Home`}
            >
              <div id="navbar-brand-logo" className="shrink-0 flex items-center justify-center">
                <BrandLogo size="md" />
              </div>
              <div className="text-left leading-tight">
                <div className="font-display font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-600 via-primary to-amber-500 bg-clip-text text-transparent group-hover:from-primary group-hover:to-amber-400 transition-all duration-300 drop-shadow-xs">
                  {s.brand}
                </div>
                <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.22em] text-foreground/80 dark:text-foreground/90 transition-colors">
                  {s.tagline}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-1.5 text-xs font-bold tracking-wide transition-all duration-200 rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary active:scale-95 ${
                      isActive
                        ? "text-primary font-black bg-primary/10 shadow-xs"
                        : "text-foreground/85 hover:text-primary"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-x-2.5 -bottom-0.5 h-0.5 bg-primary rounded-full shadow-xs shadow-primary/50"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Actions: Theme Toggle, Phone, WhatsApp */}
            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="rounded-full hover:bg-primary/15 hover:text-primary hover:scale-110 active:scale-90 transition-all duration-200 border border-transparent hover:border-primary/25 cursor-pointer"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}

              <a href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex rounded-full hover:bg-primary/15 hover:text-primary hover:scale-110 active:scale-90 transition-all duration-200 border border-transparent hover:border-primary/25 cursor-pointer"
                  aria-label="Call Direct"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </a>

              <Button
                asChild
                className="hidden sm:flex bg-[#25D366] hover:bg-[#1ebe5d] hover:scale-105 active:scale-95 shadow-md shadow-[#25D366]/25 hover:shadow-lg hover:shadow-[#25D366]/40 transition-all duration-200 font-bold cursor-pointer text-white"
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

              {/* Mobile Hamburger Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden rounded-full" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-left font-display font-black text-lg text-primary">
                      {s.brand}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-2 py-4 flex flex-col gap-1.5">
                    {NAV_ITEMS.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isActive
                              ? "bg-primary/15 text-primary font-black"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {item.label}
                        </Link>
                      )
                    })}

                    <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium border border-border/70 my-2 bg-muted/40">
                      <span className="flex items-center gap-2 text-foreground text-xs font-semibold">
                        {mounted && theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-amber-500" />}
                        <span>{mounted && theme === "dark" ? "Dark Theme" : "Light Theme"}</span>
                      </span>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        {mounted && theme === "dark" ? "Day View" : "Night View"}
                      </button>
                    </div>

                    <a
                      href={whatsappLink(s, `Hi ${s.workerName}, I'd like to discuss a job.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 px-4 py-3 rounded-xl bg-[#25D366] text-white font-bold text-center text-sm shadow-md"
                    >
                      Chat on WhatsApp (+65 {s.whatsapp.replace(/^65/, "")})
                    </a>

                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="text-center text-xs text-muted-foreground hover:text-primary pt-3"
                    >
                      Admin Login →
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
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
