"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface BrandLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.defaultMuted = true
    video.muted = true
    video.playsInline = true
    video.setAttribute("playsinline", "")
    video.setAttribute("webkit-playsinline", "true")

    const playVideo = () => {
      const p = video.play()
      if (p !== undefined) {
        p.then(() => setIsLoaded(true)).catch(() => {
          // Autoplay policy fallback (resumes on touch/scroll)
        })
      }
    }

    playVideo()

    // Handlers ensuring the animation continuously runs on mobile without freezing
    const onPause = () => {
      if (!document.hidden && video.paused) {
        playVideo()
      }
    }

    const onVisibilityChange = () => {
      if (!document.hidden) {
        playVideo()
      }
    }

    const onEnded = () => {
      video.currentTime = 0
      playVideo()
    }

    const onUserInteraction = () => {
      if (video.paused) {
        playVideo()
      }
    }

    video.addEventListener("pause", onPause)
    video.addEventListener("ended", onEnded)
    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("focus", playVideo)
    window.addEventListener("touchstart", onUserInteraction, { passive: true })
    window.addEventListener("scroll", onUserInteraction, { passive: true })

    return () => {
      video.removeEventListener("pause", onPause)
      video.removeEventListener("ended", onEnded)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("focus", playVideo)
      window.removeEventListener("touchstart", onUserInteraction)
      window.removeEventListener("scroll", onUserInteraction)
    }
  }, [])

  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  }[size]

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative overflow-hidden shrink-0 flex items-center justify-center bg-background border border-primary/20 shadow-md shadow-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-primary/30 ${sizeClasses} ${className}`}
    >
      {/* Fallback image while video buffers or on mobile power-save mode */}
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

      {/* Continuously running animation */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setIsLoaded(true)}
        onLoadedData={() => setIsLoaded(true)}
        onPlay={() => setIsLoaded(true)}
        className="w-full h-full object-cover relative z-10"
      >
        <source src="/logo-animation.mp4" type="video/mp4" />
      </video>
    </motion.div>
  )
}
