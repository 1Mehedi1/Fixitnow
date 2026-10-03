"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const [isVanishing, setIsVanishing] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Find the Before & After section on the page
      const beforeAfterSection = document.getElementById("before-after-section")
      if (beforeAfterSection) {
        const rect = beforeAfterSection.getBoundingClientRect()
        // If bottom of before-after section has scrolled past the top of viewport (or near it)
        const hasPassed = rect.bottom < 150
        if (hasPassed && !isVanishing) {
          setVisible(true)
        } else if (!hasPassed) {
          setVisible(false)
          setIsVanishing(false)
        }
      } else {
        // Fallback: show if scrolled down > 1200px
        if (window.scrollY > 1200 && !isVanishing) {
          setVisible(true)
        } else if (window.scrollY <= 600) {
          setVisible(false)
          setIsVanishing(false)
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isVanishing])

  const scrollToTop = () => {
    setIsVanishing(true)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
    // Hide quickly as it flies up
    setTimeout(() => {
      setVisible(false)
    }, 450)
  }

  return (
    <AnimatePresence>
      {visible && !isVanishing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: 0.3,
            y: -70,
            transition: { duration: 0.35, ease: "easeIn" },
          }}
          className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-40"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll speedy to top"
            className="group relative flex items-center justify-center h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-background/85 dark:bg-[#14121b]/90 backdrop-blur-md border-2 border-emerald-500/50 hover:border-emerald-500 shadow-xl shadow-black/20 text-foreground hover:text-emerald-500 transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-hidden"
          >
            {/* Subtle rotating glow ring */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 to-amber-500/20 group-hover:from-emerald-500/40 group-hover:to-teal-500/40 animate-pulse pointer-events-none" />

            {/* Speedy arrow with bounce */}
            <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-y-1 duration-200" />

            {/* Tooltip on desktop */}
            <span className="sr-only">Go to top</span>
            <span className="hidden md:group-hover:block absolute -top-9 px-2 py-1 bg-stone-900 text-stone-100 text-[10px] font-bold rounded-md whitespace-nowrap shadow-md pointer-events-none">
              Top ⚡
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
