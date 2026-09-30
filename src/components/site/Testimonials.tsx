"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { Testimonial } from "@prisma/client"

interface Props {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: Props) {
  if (testimonials.length === 0) return null

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-accent/30 to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4 uppercase tracking-wider">
            Client voices
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Trusted by Singapore homeowners.
          </h2>
          <p className="text-lg text-muted-foreground mt-4 text-pretty">
            Real words from real HDB, condo and landed owners I've worked with.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Carousel opts={{ align: "start", loop: testimonials.length > 3 }} className="w-full">
            <CarouselContent className="-ml-4">
              {testimonials.map((t, i) => (
                <CarouselItem key={t.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.4) }}
                    className="h-full"
                  >
                    <Card className="h-full border-border/80 dark:border-white/10 bg-card dark:bg-zinc-950/70 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
                      <CardContent className="p-6 flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`h-4 w-4 ${
                                    idx < t.rating
                                      ? "fill-amber-500 text-amber-500"
                                      : "fill-muted text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Verified
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                            &ldquo;{t.content}&rdquo;
                          </p>
                        </div>
                        <div className="mt-5 pt-4 border-t border-border/60 dark:border-white/10 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-display font-bold flex items-center justify-center shrink-0">
                            {t.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs sm:text-sm truncate text-foreground">{t.name}</div>
                            {t.role && <div className="text-[11px] text-muted-foreground truncate">{t.role}</div>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-background dark:bg-zinc-900 border border-border/80 dark:border-white/10" />
            <CarouselNext className="hidden md:flex -right-4 bg-background dark:bg-zinc-900 border border-border/80 dark:border-white/10" />
          </Carousel>
          <div className="flex items-center justify-center gap-1.5 mt-6 md:hidden text-[11px] font-medium text-muted-foreground">
            <span className="h-1.5 w-6 rounded-full bg-primary/50"></span>
            <span>Swipe across to view more homeowner reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
