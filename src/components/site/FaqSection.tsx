"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react"
import { whatsappLink, type SiteSettingsT, defaultSiteConfig } from "@/lib/site"
import { useSiteSettings } from "@/components/site-settings-context"
import { Button } from "@/components/ui/button"

const FAQS = [
  {
    q: "Do I need an HDB permit or MCST approval for handyman or repair work?",
    a: "Standard repairs (replacing taps, lights, switches, door locks, painting) do NOT require an HDB permit. For major renovation, wall hacking, or heavy demolition, HDB permits are required. We guide you on whether permits are needed and help coordinate submission through registered channels.",
  },
  {
    q: "What are your working hours and noise regulations across Singapore?",
    a: "We operate Monday to Saturday from 8:00 AM to 8:00 PM. In HDB flats and condominiums, noisy work (drilling, hacking) is strictly limited to 9:00 AM – 5:00 PM on weekdays only, with no noisy work permitted on Sundays and Public Holidays. We strictly observe these rules to prevent MCST fines and neighbour complaints.",
  },
  {
    q: "How fast can you arrive for urgent plumbing leaks or power trips?",
    a: "For urgent emergencies across Singapore (burst water pipe, major active ceiling leak, complete house power failure), we aim to arrive within 1 to 2 hours depending on current job locations. Message us on WhatsApp with 'URGENT' for top priority dispatch.",
  },
  {
    q: "Is site protection and debris cleanup included in the price?",
    a: "Yes. Every job includes protective floor canvas sheets, dust containment where drilling occurs, and thorough post-work cleanup with debris bagged and cleared. You will never be left with broken rubble or plaster dust on your floors.",
  },
  {
    q: "What does your 7-day workmanship warranty cover?",
    a: "If anything we repaired, installed, or replaced develops an issue within 7 days of completion, we return and rectify it completely free of charge — no disputes, no visit fee. Materials carry their respective manufacturer warranties as well.",
  },
  {
    q: "Do you charge a transport or inspection fee for on-site visits?",
    a: "Quotes given over WhatsApp with photos or videos are 100% free and binding. If an on-site technical inspection is requested for complex diagnostics without immediate work, a modest $30 – $50 transport/diagnostic fee applies, which is completely waived if you proceed with the repair.",
  },
]

export function FaqSection() {
  const s: SiteSettingsT = useSiteSettings() ?? defaultSiteConfig
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-muted/20 border-y border-border/50 relative overflow-hidden" id="faq">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3 uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" /> Singapore Homeowner FAQ
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-balance">
            Straight Answers Before You Commit.
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-2.5 max-w-xl mx-auto leading-relaxed">
            No technical jargon, no pressure. Clear answers on permits, noise hours, warranties, and emergency callouts in Singapore.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center bg-card border border-border/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-left">
            <div className="font-semibold text-sm text-foreground">Have a question not listed here?</div>
            <div className="text-xs text-muted-foreground">Message us directly on WhatsApp with your floor plan or photo.</div>
          </div>
          <Button asChild className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold shrink-0">
            <a href={whatsappLink(s, `Hi ${s.workerName}, I have a question about a home repair.`)} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="h-4 w-4 mr-2" /> Ask on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
