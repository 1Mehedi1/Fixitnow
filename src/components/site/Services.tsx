"use client"

import { motion } from "framer-motion"
import { Wrench, PaintRoller, Hammer, Zap, Sofa, Settings, ArrowRight, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { siteConfig, whatsappLink } from "@/lib/site"

const ICONS: Record<string, LucideIcon> = {
  Wrench,
  PaintRoller,
  Hammer,
  Zap,
  Sofa,
  Settings,
}

export function Services() {
  return (
    <section className="py-20 lg:py-28 bg-background relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground mb-4 uppercase tracking-wider">
            What I do
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Every job, handled with care.
          </h2>
          <p className="text-lg text-muted-foreground mt-4 text-pretty">
            From a leaky tap to a full-home renovation — one worker, one phone number, one
            warranty. Here's the work I do across Singapore.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {siteConfig.services.map((s, i) => {
            const Icon = ICONS[s.icon] || Wrench
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Card className="group h-full border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2">{s.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
                    <a
                      href={whatsappLink(`Hi ${siteConfig.name}, I'm interested in your ${s.label} service.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        fetch("/api/analytics", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ eventType: "whatsapp_click" }),
                        }).catch(() => {})
                      }
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all"
                    >
                      Get a quote
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white h-12 px-8">
            <a
              href={whatsappLink(`Hi ${siteConfig.name}, I have a job that doesn't fit any category — can I describe it?`)}
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
              Not sure if it fits? Just ask.
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
