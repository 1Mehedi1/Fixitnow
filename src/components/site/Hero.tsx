"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Star, MapPin, ShieldCheck, Clock, Award, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig, DEFAULT_HERO_IMAGES } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

interface RotatingTrade {
  prefix: string
  highlight: string
}

const DEFAULT_ROTATING_ITEMS: RotatingTrade[] = [
  { prefix: "Your home,", highlight: "expertly handled." },
  { prefix: "Plumbing & leaks,", highlight: "fixed fast & cleanly." },
  { prefix: "HDB & condo painting,", highlight: "dust-free prep guaranteed." },
  { prefix: "Full home renovation,", highlight: "one accountable warranty." },
  { prefix: "Licensed electrical works,", highlight: "EMA & LEW compliant." },
  { prefix: "Trusted craftsmanship,", highlight: "islandwide across Singapore." },
]

function TypewriterHeadline({ fallbackHeadline }: { fallbackHeadline: string }) {
  const items = useMemo(() => {
    if (fallbackHeadline && !fallbackHeadline.includes("expertly handled")) {
      return [{ prefix: fallbackHeadline, highlight: "expertly handled." }, ...DEFAULT_ROTATING_ITEMS]
    }
    return DEFAULT_ROTATING_ITEMS
  }, [fallbackHeadline])

  const [index, setIndex] = useState(0)
  const currentItem = items[index] || items[0]
  const [typedHighlight, setTypedHighlight] = useState(currentItem.highlight)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const target = currentItem.highlight
    let timer: NodeJS.Timeout

    if (!isDeleting) {
      if (typedHighlight.length < target.length) {
        // Variable typing speed: deliberate strokes + rapid flow
        const isSlowPace = (typedHighlight.length % 5 === 0) || Math.random() < 0.2
        const delay = isSlowPace ? (100 + Math.random() * 60) : (40 + Math.random() * 30)
        timer = setTimeout(() => {
          setTypedHighlight(target.slice(0, typedHighlight.length + 1))
        }, delay)
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, 2400)
      }
    } else {
      if (typedHighlight.length > 0) {
        const delay = 25 + Math.random() * 15
        timer = setTimeout(() => {
          setTypedHighlight(target.slice(0, typedHighlight.length - 1))
        }, delay)
      } else {
        setIsDeleting(false)
        setIndex((prev) => (prev + 1) % items.length)
      }
    }

    return () => clearTimeout(timer)
  }, [typedHighlight, isDeleting, currentItem, items])

  return (
    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-balance leading-snug sm:leading-tight break-words min-h-[2.4em] sm:min-h-[2.2em]">
      <span>{currentItem.prefix}</span>{" "}
      <br className="hidden xs:inline" />
      <span className="gradient-text underline underline-offset-6 decoration-amber-500/75 decoration-2">
        {typedHighlight}
      </span>
      <span className="inline-block w-[2.5px] sm:w-[3px] h-[0.85em] bg-primary ml-1.5 align-baseline animate-pulse shadow-xs shadow-primary" />
    </h1>
  )
}

export function Hero() {
  const { setView } = useStore()
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const heroPhotos = s.heroImages && s.heroImages.length >= 4 ? s.heroImages : DEFAULT_HERO_IMAGES

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/30 pt-4 pb-10 sm:py-16 w-full max-w-full">
      {/* Architectural Atmospheric Lighting with Subtle Craft Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(245,158,11,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(245,158,11,0.08),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative w-full max-w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[auto] lg:min-h-[82vh] w-full min-w-0">
          {/* Left — content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-full"
          >
            {/* Top badges: rating + professional breathing MOM license card box */}
            <div className="flex flex-wrap items-center gap-3 w-full">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-foreground/80 shadow-2xs shrink-0 hover:border-primary/40 hover:scale-105 transition-all">
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                  ))}
                </span>
                <span className="font-bold text-foreground">{s.rating}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-[11px] sm:text-xs">{s.happyClients}+ happy clients</span>
              </div>

              {/* Professional MOM license badge without outline — natural breathing (shrink & expand) */}
              <div className="animate-breathe inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 dark:bg-emerald-950/40 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-300 shadow-xs cursor-default">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">
                  MOM Licensed · <span className="font-bold">{s.companyName}</span>
                </span>
              </div>
            </div>

            {/* Headline with Typewriter animation */}
            <div className="space-y-2 sm:space-y-3 w-full min-w-0">
              <TypewriterHeadline fallbackHeadline={s.heroHeadline} />
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl text-pretty leading-relaxed break-words">
                {s.heroSubtext} <span className="font-semibold text-foreground">{s.yearsExperience} years</span> experience. <span className="font-semibold text-foreground">{s.jobsCompleted}+ jobs</span> completed across Singapore.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm sm:text-base h-12 sm:h-13 px-7 shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/45 hover:scale-[1.03] active:scale-95 transition-all duration-200 w-full sm:w-auto font-bold cursor-pointer"
              >
                <a
                  href={whatsappLink(s, `Hi ${s.workerName}, I saw your website and would like a quote.`)}
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
                  Chat on WhatsApp
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-sm sm:text-base h-12 sm:h-13 px-7 w-full sm:w-auto font-bold border-2 border-primary/30 hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-[1.03] hover:shadow-md hover:shadow-primary/15 active:scale-95 transition-all duration-200 cursor-pointer"
                onClick={() => setView("portfolio")}
              >
                View Selected Work
              </Button>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2 pt-1 text-xs text-muted-foreground w-full">
              <span className="flex items-center gap-1.5 min-w-0">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">UEN: {s.companyUen}</span>
              </span>
              <span className="flex items-center gap-1.5 min-w-0">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">7-day warranty</span>
              </span>
              <span className="flex items-center gap-1.5 min-w-0">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">Singapore Islandwide</span>
              </span>
              <span className="flex items-center gap-1.5 min-w-0">
                <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{s.yearsExperience}+ yrs hands-on</span>
              </span>
            </div>

            {/* Mobile Visual Showcase (Responsive 4-column thumbnail grid: 100% fluid, no overflow) */}
            <div className="lg:hidden pt-2 w-full min-w-0">
              <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
                {heroPhotos.slice(0, 4).map((imgUrl, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden shadow-xs border border-border/80 relative">
                    <img src={imgUrl} alt={`Showcase work ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — desktop image collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 pt-10"
              >
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl shadow-black/10 border border-border/50">
                  <img
                    src={heroPhotos[0]}
                    alt="Work showcase 1"
                    className="h-full w-full object-cover hover:scale-105 transition duration-500"
                    loading="eager"
                  />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl shadow-black/10 border border-border/50">
                  <img
                    src={heroPhotos[1]}
                    alt="Work showcase 2"
                    className="h-full w-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="space-y-4"
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl shadow-black/10 border border-border/50">
                  <img
                    src={heroPhotos[2]}
                    alt="Work showcase 3"
                    className="h-full w-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl shadow-black/10 border border-border/50">
                  <img
                    src={heroPhotos[3]}
                    alt="Work showcase 4"
                    className="h-full w-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -left-6 bottom-12 bg-card/95 backdrop-blur-md border border-border rounded-2xl p-4 shadow-xl shadow-black/10 w-48"
            >
              <div className="text-2xl font-display font-bold text-primary">{s.jobsCompleted}+ Jobs</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Under {s.companyName} (UEN: {s.companyUen})</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

