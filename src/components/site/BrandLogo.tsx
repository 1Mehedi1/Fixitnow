"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface BrandLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  // IntersectionObserver: Only load/stream video when the logo is in viewport
  // This avoids loading 3 instances simultaneously and saves 1.6MB bandwidth on mobile!
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // If IntersectionObserver is not supported, just set true
    if (!("IntersectionObserver" in window)) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: "150px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView) return
    const video = videoRef.current
    if (!video) return

    video.defaultMuted = true
    video.muted = true
    video.playsInline = true
    video.setAttribute("playsinline", "")
    video.setAttribute("webkit-playsinline", "true")

    const playSafe = () => {
      if (video && video.paused) {
        video.play().then(() => setIsLoaded(true)).catch(() => {})
      }
    }

    playSafe()

    // Resume cleanly if mobile browser throttles background tabs
    const onVisibilityChange = () => {
      if (!document.hidden) {
        playSafe()
      }
    }

    // Single passive touch gesture fallback in case browser policy blocked autoplay initially
    const onFirstTouch = () => {
      playSafe()
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("touchstart", onFirstTouch, { once: true, passive: true })

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("touchstart", onFirstTouch)
    }
  }, [isInView])

  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  }[size]

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative overflow-hidden shrink-0 flex items-center justify-center bg-background border border-primary/20 shadow-md shadow-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-primary/30 ${sizeClasses} ${className}`}
    >
      {/* Crisp fallback image while video loads or when power-saver mode active */}
      <img
        src="/favicon.ico"
        alt="Logo"
        width={36}
        height={36}
        decoding="async"
        className={`absolute inset-0 w-full h-full object-contain p-1.5 transition-opacity duration-300 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* Video animation with native HTML5 continuous looping */}
      {isInView && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlay={() => setIsLoaded(true)}
          onLoadedData={() => setIsLoaded(true)}
          onPlay={() => setIsLoaded(true)}
          className="w-full h-full object-cover relative z-10"
        >
          <source src="/logo-animation.mp4" type="video/mp4" />
        </video>
      )}
    </motion.div>
  )
}
