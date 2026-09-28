"use client"

import { motion } from "framer-motion"
import { ArrowRight, Star, MapPin, ShieldCheck, Clock, Award, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig, DEFAULT_HERO_IMAGES } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

export function Hero() {
  const { setView } = useStore()
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const heroPhotos = s.heroImages && s.heroImages.length >= 4 ? s.heroImages : DEFAULT_HERO_IMAGES

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/30 pt-4 pb-10 sm:py-16">
      {/* Decorative blurred blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[auto] lg:min-h-[82vh]">
          {/* Left — content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Top badges: rating + 4R Engineering license badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium text-foreground/80 shadow-2xs">
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                  ))}
                </span>
                <span className="font-bold text-foreground">{s.rating}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-[11px] sm:text-xs">{s.happyClients}+ happy clients</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] sm:text-xs font-medium text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>MOM Licensed · {s.companyName}</span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.1] sm:leading-[1.05]">
                {s.heroHeadline.split(",")[0]},{" "}<br className="hidden xs:inline" />
                <span className="gradient-text">{s.heroHeadline.split(",")[1]?.trim() || "expertly handled."}</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl text-pretty leading-relaxed">
                {s.heroSubtext} <span className="font-semibold text-foreground">{s.yearsExperience} years</span> experience. <span className="font-semibold text-foreground">{s.jobsCompleted}+ jobs</span> completed across Singapore.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm sm:text-base h-11 sm:h-12 px-6 shadow-md shadow-[#25D366]/25"
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
                className="text-sm sm:text-base h-11 sm:h-12 px-6"
                onClick={() => setView("portfolio")}
              >
                View Selected Work
              </Button>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>UEN: {s.companyUen}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>7-day warranty</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Singapore Islandwide</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{s.yearsExperience}+ yrs hands-on</span>
              </span>
            </div>

            {/* Mobile Visual Showcase Strip (Brings desktop visual richness to mobile) */}
            <div className="lg:hidden pt-2">
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                {heroPhotos.map((imgUrl, i) => (
                  <div key={i} className="shrink-0 w-32 h-24 rounded-xl overflow-hidden shadow-xs border border-border/80 snap-start relative">
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

