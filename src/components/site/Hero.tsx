"use client"

import { motion } from "framer-motion"
import { ArrowRight, Star, MapPin, ShieldCheck, Clock, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"

export function Hero() {
  const { setView } = useStore()
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/30">
      {/* Decorative blurred blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[88vh] py-16">
          {/* Left — content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-7"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-4 py-1.5 text-xs font-medium text-foreground/80 shadow-sm"
            >
              <span className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                ))}
              </span>
              <span className="font-semibold">{s.rating}</span>
              <span className="text-muted-foreground">·</span>
              <span>{s.happyClients}+ happy SG clients</span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.05]">
                {s.heroHeadline.split(",")[0]},{" "}<br />
                <span className="gradient-text">{s.heroHeadline.split(",")[1]?.trim() || "expertly handled."}</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl text-pretty leading-relaxed">
                {s.heroSubtext} {s.yearsExperience} years. {s.jobsCompleted}+ jobs. One phone number.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white text-base h-12 px-7 shadow-lg shadow-[#25D366]/25"
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
                className="text-base h-12 px-7"
                onClick={() => setView("portfolio")}
              >
                View My Work
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Licensed & insured
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> 7-day workmanship warranty
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" /> Islandwide
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" /> {s.yearsExperience}+ yrs
              </span>
            </div>
          </motion.div>

          {/* Right — image collage */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 pt-12"
              >
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl shadow-black/10">
                  <img
                    src="https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=600&auto=format&fit=crop&q=70"
                    alt="Electrical work"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl shadow-black/10">
                  <img
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=70"
                    alt="Renovation"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="space-y-4"
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl shadow-black/10">
                  <img
                    src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=70"
                    alt="Painting"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl shadow-black/10">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-44e3e9399a2c?w=600&auto=format&fit=crop&q=70"
                    alt="Interior works"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -left-8 bottom-16 bg-card border border-border rounded-2xl p-4 shadow-2xl shadow-black/15 w-44"
            >
              <div className="text-3xl font-display font-bold text-primary">{s.jobsCompleted}+</div>
              <div className="text-xs text-muted-foreground mt-1">Jobs completed across Singapore</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
