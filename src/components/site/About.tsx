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

        {/* Verified Singapore Licensing & Credentials Card — Celebratory, breathing, with softly rising glowing stars */}
        {/* Verified Singapore Licensing & Credentials Card — Clean, high-performance, zero-lag static card */}
        <div className="mb-10 sm:mb-12 relative">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-emerald-600/40 dark:border-emerald-400/50 bg-gradient-to-br from-emerald-500/[0.14] via-teal-500/[0.08] to-emerald-600/[0.15] dark:from-[#0d2317] dark:via-[#12281b] dark:to-[#0a1c12] p-6 sm:p-8 lg:p-10 shadow-lg shadow-emerald-500/5 dark:shadow-[0_4px_25px_rgba(16,185,129,0.18)]">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-600/25 dark:border-emerald-400/25">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border-2 border-emerald-600/40 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 shadow-md">
                  <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Award-winning celebratory badge */}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 text-white dark:text-slate-950 border border-emerald-500/40 px-3.5 py-1 text-xs font-black shadow-sm">
                      <span className="text-amber-300 dark:text-amber-800 text-sm">🏆</span>
                      Verified Singapore Entity
                    </span>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-500/20 dark:bg-emerald-500/25 border border-emerald-600/30 dark:border-emerald-400/40 px-2.5 py-0.5 rounded-full">
                      ACRA Recognized Entity
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-2xl font-black tracking-tight mt-1 text-emerald-950 dark:text-white">
                    Company: {s.companyName || "4R ENGINEERING PTE. LTD."}
                  </h3>
                </div>
              </div>
              <div className="text-left sm:text-right bg-emerald-500/15 dark:bg-[#153422] border-2 border-emerald-600/40 dark:border-emerald-400/50 rounded-xl px-4 py-2 shrink-0 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-extrabold">Unique Entity Number</div>
                <div className="font-mono text-base sm:text-lg font-black text-emerald-950 dark:text-emerald-100 tracking-wider">{s.companyUen || "202143324G"}</div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-5 border-b border-emerald-600/25 dark:border-emerald-400/25">
              <div className="space-y-1">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-extrabold">Registered Company</div>
                <div className="font-display font-bold text-foreground text-sm sm:text-base">{s.companyName || "4R ENGINEERING PTE. LTD."}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> Singapore ACRA Registered
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-extrabold">Lead Trade Specialist</div>
                <div className="font-display font-bold text-foreground text-sm sm:text-base">{s.workerName || "Ahmed Mohammod Tanbir"}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> Trade & Construction Certified
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-extrabold">Regulatory Standards</div>
                <div className="font-display font-bold text-foreground text-sm sm:text-base">Building & Trade Standards</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> Singapore Industry Safety Compliant
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-extrabold">Trade Capabilities</div>
                <div className="font-display font-bold text-foreground text-sm sm:text-base">Electrical · Plumbing · Renovation</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span> BCA & Safety Code Compliant
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
              <p className="max-w-2xl leading-relaxed text-foreground/85">
                All structural works, electrical installations, painting, and plumbing jobs across Singapore are executed directly under strict Singapore safety regulations. Backed by itemized quotes and genuine workmanship warranty.
              </p>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-600/30 dark:border-emerald-400/40 px-2.5 py-1 font-bold text-emerald-950 dark:text-emerald-200 text-[11px]">
                  ✨ Direct SG Execution
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-600/30 dark:border-emerald-400/40 px-2.5 py-1 font-bold text-emerald-950 dark:text-emerald-200 text-[11px]">
                  🛡️ Workmanship Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Smaller Stats Cards in varied random sizes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-end mb-16"
        >
          {/* Card 1: Compact square */}
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 sm:p-3.5 text-center min-h-[92px] sm:min-h-[105px] flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
            <div className="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto mb-1 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
            <div className="font-display text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">{s.yearsExperience}+</div>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold">Years in business</div>
          </div>

          {/* Card 2: Featured taller/wider */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4 sm:p-5 text-center min-h-[112px] sm:min-h-[128px] flex flex-col items-center justify-center transition-all hover:scale-[1.02] shadow-xs">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5 flex items-center justify-center">
              <Wrench className="h-4.5 w-4.5" />
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{s.jobsCompleted}+</div>
            <div className="text-xs text-muted-foreground font-bold">Jobs completed</div>
          </div>

          {/* Card 3: Medium compact */}
          <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-3.5 sm:p-4 text-center min-h-[100px] sm:min-h-[114px] flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
            <div className="h-7 w-7 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 mx-auto mb-1 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <div className="font-display text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">{s.happyClients}+</div>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold">Happy clients</div>
          </div>

          {/* Card 4: Compact slim */}
          <div className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-3 sm:p-3.5 text-center min-h-[94px] sm:min-h-[104px] flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
            <div className="h-7 w-7 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 mx-auto mb-1 flex items-center justify-center">
              <Heart className="h-4 w-4" />
            </div>
            <div className="font-display text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">{s.rating}★</div>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold">Average rating</div>
          </div>
        </motion.div>

        {/* Trust grid — Smaller, sleeker, compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-14">
          {trustPoints.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Card className="h-full border border-border/80 dark:border-white/10 bg-card/95 hover:border-emerald-500/50 hover:shadow-md transition-all">
                <CardContent className="p-4 sm:p-4.5 flex flex-col gap-2.5">
                  <div className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <t.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-foreground mb-1 leading-snug">{t.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.body}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Company / Contact Hub — Professional Executive Redesign */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left — Professional Verification & Direct Channels */}
              <div className="p-6 sm:p-8 lg:p-10 bg-muted/30 border-b md:border-b-0 md:border-r border-border/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <BrandLogo size="md" />
                    <div>
                      <div className="font-display font-bold text-lg text-foreground">{s.brand}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {s.companyName || "4R ENGINEERING PTE. LTD."} · UEN: {s.companyUen || "202143324G"}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-2 text-foreground">
                    Direct Contact Channels
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
                    Speak directly with the trade specialist. No call-centers, no automated bots. Direct answers, fast scheduling.
                  </p>

                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <a
                      href={whatsappLink(s, `Hi ${s.workerName}, I'd like to ask a quick question about a job.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/70 hover:border-emerald-500/50 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <WhatsAppIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            WhatsApp Dispatch
                          </div>
                          <div className="text-[11px] text-muted-foreground">{s.whatsapp}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Fastest Reply
                      </span>
                    </a>

                    <a
                      href={`tel:${s.phone.replace(/\s/g, "")}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/70 hover:border-primary/50 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            Direct Phone Line
                          </div>
                          <div className="text-[11px] text-muted-foreground">{s.phone}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        Direct Specialist
                      </span>
                    </a>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/40 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold text-foreground">Service Area: </span>
                        {s.location} · Islandwide HDB, Condo, Landed
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/40 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold text-foreground">Hours: </span>
                        Mon–Sat · 8:00 AM – 8:00 PM (Emergency slots available)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Professional Fast Quote & Job Request */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-card">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold mb-3">
                    Fast Quote · No Hidden Costs
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-2 text-foreground">
                    Have a job in mind?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
                    Send a photo or short description on WhatsApp. You'll receive a clear, itemized quote before any work starts.
                  </p>

                  <div className="space-y-2.5 mb-7 text-xs">
                    <div className="flex items-center gap-2.5 text-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Itemized transparent quote — no surprise invoices</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Direct execution by registered trade specialist</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>7-Day complete workmanship warranty</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold h-12 shadow-md hover:scale-[1.01] transition-transform">
                    <a
                      href={whatsappLink(s, `Hi ${s.workerName}, I have a job in mind and would like a quote.`)}
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
                      <WhatsAppIcon className="h-4 w-4 mr-2" /> Chat on WhatsApp for Quote
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full h-11 font-semibold border-border hover:bg-muted">
                    <a href={`tel:${s.phone.replace(/\s/g, "")}`}>
                      <Phone className="h-4 w-4 mr-2 text-primary" /> Call {s.phone}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
