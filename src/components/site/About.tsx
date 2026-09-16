"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Award, Clock, Heart, Wrench, Phone, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { siteConfig, whatsappLink } from "@/lib/site"

export function About() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-black/15">
              <img
                src="https://images.unsplash.com/photo-1607400201515-c3400ca199e7?w=800&auto=format&fit=crop&q=70"
                alt={siteConfig.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 lg:-right-8 bg-card border border-border rounded-2xl p-5 shadow-xl max-w-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="font-display font-bold text-lg">{siteConfig.yearsExperience}+</span>
              </div>
              <p className="text-xs text-muted-foreground">Years of hands-on experience across every Singapore housing type</p>
            </div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              About me
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
              Hi, I'm {siteConfig.name}.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I've been working with my hands for over {siteConfig.yearsExperience} years —
                starting as an apprentice to a master plumber in Geylang at 17, then picking up
                electrical, painting, tiling and carpentry skills across hundreds of HDB, condo
                and landed jobs across Singapore.
              </p>
              <p>
                Today I run <strong className="text-foreground">{siteConfig.brand}</strong> as a
                one-man operation. That means: when you call me, the same person who answers the
                phone is the person who shows up at your door, quotes your job, and (most
                importantly) warranties the work.
              </p>
              <p>
                I take a small number of jobs at a time so I can finish each one properly. If I
                can't take yours — for example if it needs a licensed structural engineer — I'll
                tell you, and recommend someone who can.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "Licensed", val: "& insured" },
                { icon: Clock, label: "Warranty", val: "7-day workmanship" },
                { icon: Heart, label: "Trusted by", val: `${siteConfig.happyClients}+ clients` },
              ].map((s) => (
                <Card key={s.label} className="border-border/60">
                  <CardContent className="p-4">
                    <s.icon className="h-5 w-5 text-primary mb-2" />
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="font-semibold text-sm">{s.val}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white">
                <a
                  href={whatsappLink(`Hi ${siteConfig.name}, I'd like to discuss a job.`)}
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
                  <Wrench className="h-4 w-4 mr-1.5" /> Hire me
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                  <Phone className="h-4 w-4 mr-1.5" /> {siteConfig.phone}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
