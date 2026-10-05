"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, CheckCircle2, X, ExternalLink, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useStore } from "@/store/useStore"
import type { Testimonial } from "@prisma/client"

interface Props {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: Props) {
  const { customTestimonials } = useStore()
  const activeTestimonials = (customTestimonials && customTestimonials.length > 0)
    ? customTestimonials
    : testimonials
  const [selectedProof, setSelectedProof] = useState<{ url: string; name: string } | null>(null)

  const publishedList = (activeTestimonials || []).filter((t) => t.published !== false)
  if (publishedList.length === 0) return null

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-accent/30 to-background overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wider border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Verified Homeowner Reviews
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Real feedback from Singapore homes.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 text-pretty">
            Genuine testimonials and direct WhatsApp chat screenshots from HDB, condo and landed homeowners across Singapore.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Carousel opts={{ align: "start", loop: publishedList.length > 3 }} className="w-full">
            <CarouselContent className="-ml-4">
              {publishedList.map((t, i) => {
                const hasProof = Boolean(t.avatar && t.avatar.length > 5)
                return (
                  <CarouselItem key={t.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.4) }}
                      className="h-full"
                    >
                      <Card className="h-full border-border/80 dark:border-white/10 bg-card dark:bg-zinc-950/70 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between">
                        <CardContent className="p-5 sm:p-6 flex flex-col h-full justify-between gap-4">
                          <div className="space-y-3.5">
                            {/* Header row: stars & badges */}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    className={`h-4 w-4 ${
                                      idx < t.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-muted text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                100% Verified
                              </span>
                            </div>

                            {/* WhatsApp proof screenshot preview if available */}
                            {hasProof && (
                              <div
                                onClick={() => setSelectedProof({ url: t.avatar!, name: t.name })}
                                className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-muted/60 cursor-pointer group shadow-xs aspect-[16/10]"
                              >
                                <img
                                  src={t.avatar!}
                                  alt={`${t.name} WhatsApp Review`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  decoding="async"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0 flex items-end justify-between p-2.5">
                                  <span className="text-[11px] font-bold text-white flex items-center gap-1.5 drop-shadow-md">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    WhatsApp Screenshot
                                  </span>
                                  <span className="text-[10px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" /> Zoom
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Review text */}
                            {t.content && (
                              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                                &ldquo;{t.content}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Footer: client name and location */}
                          <div className="pt-3 border-t border-border/60 dark:border-white/10 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-display font-bold flex items-center justify-center shrink-0 border border-emerald-500/20">
                              {t.name?.charAt(0) || "C"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs sm:text-sm truncate text-foreground">{t.name}</div>
                              {t.role && <div className="text-[11px] text-muted-foreground truncate">{t.role}</div>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-background dark:bg-zinc-900 border border-border/80 dark:border-white/10 cursor-pointer" />
            <CarouselNext className="hidden md:flex -right-4 bg-background dark:bg-zinc-900 border border-border/80 dark:border-white/10 cursor-pointer" />
          </Carousel>
          <div className="flex items-center justify-center gap-1.5 mt-6 md:hidden text-[11px] font-medium text-muted-foreground">
            <span className="h-1.5 w-6 rounded-full bg-emerald-500/50"></span>
            <span>Swipe across to view more homeowner reviews & proof</span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full Screenshot Proof */}
      {selectedProof && (
        <Dialog open={Boolean(selectedProof)} onOpenChange={() => setSelectedProof(null)}>
          <DialogContent className="max-w-2xl w-[95vw] p-3 sm:p-5 rounded-2xl bg-zinc-950 text-white border-zinc-800">
            <DialogTitle className="sr-only">WhatsApp Chat Review Proof</DialogTitle>
            <DialogDescription className="sr-only">Original WhatsApp screenshot review</DialogDescription>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-bold text-white">
                  Verified WhatsApp Review · {selectedProof.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedProof(null)}
                className="h-8 w-8 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto rounded-xl mt-3 flex items-center justify-center bg-black p-2">
              <img
                src={selectedProof.url}
                alt="Original WhatsApp Review Screenshot"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
