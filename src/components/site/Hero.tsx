"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Star, MapPin, ShieldCheck, Clock, Award, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig, DEFAULT_HERO_IMAGES, DEFAULT_TYPEWRITER_SENTENCES } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

interface RotatingTrade {
  prefix: string
  highlight: string
}

function parseSentence(sentence: string): RotatingTrade {
  if (sentence.includes(",")) {
    const parts = sentence.split(",")
    return {
      prefix: parts[0].trim() + ",",
      highlight: parts.slice(1).join(",").trim(),
    }
  }
  return { prefix: sentence, highlight: "" }
}

function TypewriterHeadline({
  fallbackHeadline,
  sentences,
}: {
  fallbackHeadline: string
  sentences?: string[]
}) {
  const items: RotatingTrade[] = useMemo(() => {
    if (sentences && sentences.length > 0) {
      return sentences.map(parseSentence)
    }
    if (fallbackHeadline && !fallbackHeadline.includes("expertly handled")) {
      return [parseSentence(fallbackHeadline), ...DEFAULT_TYPEWRITER_SENTENCES.map(parseSentence)]
    }
    return DEFAULT_TYPEWRITER_SENTENCES.map(parseSentence)
  }, [sentences, fallbackHeadline])

  const [index, setIndex] = useState(0)
  const currentItem = items[index] || items[0]
  
  const fullText = useMemo(() => `${currentItem.prefix} ${currentItem.highlight}`.trim(), [currentItem])
  const prefixLength = currentItem.prefix.length
  
  const [typedLength, setTypedLength] = useState(fullText.length)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (!isDeleting) {
      if (typedLength < fullText.length) {
        // Variable typing speed: natural cadence with occasional subtle rhythm
        const isSlowPace = (typedLength % 5 === 0) || Math.random() < 0.15
        const delay = isSlowPace ? (90 + Math.random() * 50) : (35 + Math.random() * 25)
        timer = setTimeout(() => {
          setTypedLength((prev) => prev + 1)
        }, delay)
      } else {
        // Full sentence typed out — pause so user can comfortably read it
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, 2600)
      }
    } else {
      if (typedLength > 0) {
        const delay = 18 + Math.random() * 12
        timer = setTimeout(() => {
          setTypedLength((prev) => prev - 1)
        }, delay)
      } else {
        setIsDeleting(false)
        setIndex((prev) => (prev + 1) % items.length)
      }
    }

    return () => clearTimeout(timer)
  }, [typedLength, isDeleting, fullText, items.length])

  // Derive typed prefix and typed highlight from current typedLength
  const typedPrefix = fullText.slice(0, Math.min(typedLength, prefixLength))
  const hasReachedHighlight = typedLength > prefixLength
  const typedHighlight = hasReachedHighlight
    ? fullText.slice(prefixLength + 1, typedLength)
    : ""

  return (
    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-balance leading-snug sm:leading-tight break-words min-h-[2.4em] sm:min-h-[2.2em]">
      <span>{typedPrefix}</span>
      {hasReachedHighlight && (
        <>
          {" "}
          <br className="hidden xs:inline" />
          <span className="gradient-text underline underline-offset-6 decoration-red-500 decoration-2 drop-shadow-[0_2px_10px_rgba(239,68,68,0.55)]">
            {typedHighlight}
          </span>
        </>
      )}
      <span className="inline-block w-[2.5px] sm:w-[3px] h-[0.85em] bg-primary ml-1.5 align-baseline animate-pulse shadow-xs shadow-primary" />
    </h1>
  )
}

export function Hero() {
  const { setView } = useStore()
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const heroPhotos = [0, 1, 2, 3].map(
    (i) => (s.heroImages && s.heroImages[i] && s.heroImages[i].trim()) ? s.heroImages[i].trim() : DEFAULT_HERO_IMAGES[i]
  )

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-amber-500/[0.04] to-background pt-5 sm:pt-10 pb-10 sm:py-16 w-full max-w-full">
      {/* Scattered Architectural Technical Grid & Luminous Amber Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Crisp Technical Micro-Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.14] dark:opacity-[0.18]" />
        {/* Soft Radial Ambient Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative w-full max-w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[auto] lg:min-h-[82vh] w-full min-w-0">
          {/* Left — content: Render instantly with 100% opacity on mobile and desktop */}
          <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-full">
            {/* Top badges: un-bolded, elegant celebratory style */}
            <div id="hero-badges-track" className="relative flex flex-wrap items-center gap-3 w-full">
              {/* Rating badge — refined celebratory styling */}
              <div
                id="hero-rating-badge"
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-card/95 to-amber-500/15 dark:from-amber-500/15 dark:via-[#1e1c26] dark:to-amber-500/20 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground shadow-xs shrink-0 hover:border-amber-500/70 hover:scale-[1.02] transition-all"
              >
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                  ))}
                </span>
                <span className="font-semibold text-foreground text-xs sm:text-sm">4.5</span>
                <span className="text-muted-foreground/60 font-normal">·</span>
                <span className="text-xs sm:text-sm font-medium text-foreground/90">{s.happyClients || 320}+ happy clients</span>
              </div>

              {/* Company entity badge — celebratory prestige style */}
              <div
                id="hero-license-badge"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-teal-500/15 dark:from-emerald-950/60 dark:via-[#14231b] dark:to-teal-950/50 border border-emerald-500/40 dark:border-emerald-400/35 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-emerald-950 dark:text-emerald-200 shadow-xs cursor-default hover:border-emerald-500/60 transition-all"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">
                  Company:{" "}
                  <span className="font-semibold text-emerald-950 dark:text-emerald-100">
                    {s.companyName || "4R ENGINEERING PTE. LTD."}
                  </span>
                </span>
              </div>
            </div>

            {/* Headline with Typewriter animation */}
            <div className="space-y-2 sm:space-y-3 w-full min-w-0">
              <TypewriterHeadline fallbackHeadline={s.heroHeadline} sentences={s.typewriterSentences} />
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
          </div>

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

