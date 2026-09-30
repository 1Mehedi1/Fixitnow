"use client"

import { motion } from "framer-motion"
import {
  ShieldCheck, Award, Clock, Heart, Wrench, Phone, Mail, MapPin,
  Building2, Users, Sparkles, ThumbsUp, CheckCircle2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { BrandLogo } from "@/components/site/BrandLogo"

export function About() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig

  const stats = [
    { icon: Award, val: `${s.yearsExperience}+`, label: "Years in business" },
    { icon: Wrench, val: `${s.jobsCompleted}+`, label: "Jobs completed" },
    { icon: Users, val: `${s.happyClients}+`, label: "Happy clients" },
    { icon: Heart, val: `${s.rating}★`, label: "Average rating" },
  ]

  const trustPoints = [
    {
      icon: ShieldCheck,
      title: "Licensed & insured",
      body: "All trade work carried out under valid Singapore trade licences. Electrical work signed off by a Licensed Electrical Worker (LEW) where required.",
    },
    {
      icon: Clock,
      title: "7-day workmanship warranty",
      body: "If anything we touched fails within 7 days, we come back and fix it free of charge — no questions, no quibbling.",
    },
    {
      icon: ThumbsUp,
      title: "Honest quotes, no surprises",
      body: "Quotes are itemised and binding. If we discover something unexpected mid-job, we pause and re-quote before continuing — never a shock invoice at the end.",
    },
    {
      icon: Sparkles,
      title: "Clean & dust-controlled",
      body: "Furniture wrapped, floors protected, daily clean-up. We treat your home the way we'd treat our own — because we live here too.",
    },
  ]

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4 uppercase tracking-wider">
            About {s.brand}
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            {s.aboutTitle}
          </h2>
          <p className="text-lg text-muted-foreground mt-4 text-pretty leading-relaxed">
            {s.aboutBody}
          </p>
        </motion.div>

        {/* Verified Singapore Licensing & Credentials Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-4 sm:p-8 lg:p-10 shadow-lg shadow-primary/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/80">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified Singapore Entity
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">MOM & ACRA Recognized</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-2xl font-bold tracking-tight mt-1 text-foreground">
                    Licensed & Regulated Trade Specialist
                  </h3>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Unique Entity Number</div>
                <div className="font-mono text-base sm:text-lg font-bold text-primary tracking-wide">{s.companyUen || "202143324G"}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-5 border-b border-border/80">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Registered Company</div>
                <div className="font-display font-bold text-foreground text-sm sm:text-base">{s.companyName || "4R ENGINEERING PTE. LTD."}</div>
                <div className="text-xs text-muted-foreground">Singapore ACRA Registered</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Lead Trade Specialist</div>
                <div className="font-display font-bold text-foreground text-sm sm:text-base">{s.workerName || "Ahmed Mohammod Tanbir"}</div>
                <div className="text-xs text-muted-foreground">MOM Construction Sector Authorized</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Regulatory Authority</div>
                <div className="font-display font-bold text-foreground text-sm sm:text-base">Ministry of Manpower (MOM)</div>
                <div className="text-xs text-muted-foreground">EFMA Compliant & Regulated</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Trade Capabilities</div>
                <div className="font-display font-bold text-foreground text-sm sm:text-base">Electrical · Plumbing · Renovation</div>
                <div className="text-xs text-muted-foreground">BCA & Safety Code Compliant</div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
              <p className="max-w-2xl leading-relaxed">
                All structural works, electrical installations, painting, and plumbing jobs across Singapore are executed directly under strict Singapore safety regulations. Backed by an itemized quote, transparent pricing, and a genuine 7-day workmanship warranty.
              </p>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2.5 py-1 font-medium text-foreground text-[11px]">
                  ✓ No Subcontractor Markup
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2.5 py-1 font-medium text-foreground text-[11px]">
                  ✓ Workmanship Guaranteed
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats band */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat, i) => (
            <Card key={i} className="border-border/60 text-center">
              <CardContent className="p-6">
                <stat.icon className="h-7 w-7 text-primary mx-auto mb-3" />
                <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{stat.val}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Trust grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {trustPoints.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full border-border/60 hover:border-primary/40 hover:shadow-md transition-all">
                <CardContent className="p-6 flex gap-4">
                  <div className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base mb-1.5">{t.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Company / contact info card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-border">
            <div className="grid md:grid-cols-2">
              {/* Left — company info */}
              <CardContent className="p-8 lg:p-10 bg-gradient-to-br from-accent/40 to-background">
                <div className="inline-flex items-center gap-2.5 mb-4">
                  <BrandLogo size="md" />
                  <div>
                    <div className="font-display font-bold text-lg">{s.brand}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.tagline}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">{s.companyName || "4R ENGINEERING PTE. LTD."} · UEN: {s.companyUen || "202143324G"}</div>
                  </div>
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight mb-3">
                  Get in touch.
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Reach out via WhatsApp for the fastest response. We typically reply within
                  the hour during business hours.
                </p>
                <div className="space-y-3 text-sm">
                  <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{s.phone}</span>
                  </a>
                  <a href={`mailto:${s.email}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{s.email}</span>
                  </a>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{s.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>Mon–Sat · 8am to 8pm</span>
                  </div>
                </div>
              </CardContent>

              {/* Right — CTA */}
              <CardContent className="p-8 lg:p-10 flex flex-col justify-center">
                <h3 className="font-display text-2xl font-bold tracking-tight mb-2">
                  Have a job in mind?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Send us a photo and a short description on WhatsApp. We'll get back to you
                  with a rough quote — no obligation, no visit fee.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white">
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
                      <WhatsAppIcon className="h-4 w-4 mr-1.5" /> Chat on WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`tel:${s.phone.replace(/\s/g, "")}`}>
                      <Phone className="h-4 w-4 mr-1.5" /> Call
                    </a>
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
