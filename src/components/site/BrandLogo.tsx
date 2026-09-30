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
    if (video) {
      video.muted = true
      video.play().catch(() => {
        // Autoplay policy fallback
      })
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
      {/* Fallback image while video buffers */}
      <img
        src="/favicon.ico"
        alt="Logo"
        className={`absolute inset-0 w-full h-full object-contain p-1.5 transition-opacity duration-300 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      {/* Continuously running animation */}
      <video
        ref={videoRef}
        src="/logo-animation.mp4"
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setIsLoaded(true)}
        className="w-full h-full object-cover relative z-10"
      />
    </motion.div>
  )
}
