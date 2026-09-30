"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion, useAnimation, type AnimationControls } from "framer-motion"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  maxRadius: number
  growth: number
  alpha: number
  decay: number
  rotation: number
  spin: number
}

interface ConstructionTruckAnimationProps {
  badge1Controls?: AnimationControls
}

const STORAGE_KEY = "fixitnow_truck_dropped_v2"

export function ConstructionTruckAnimation({ badge1Controls }: ConstructionTruckAnimationProps) {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<"idle" | "dropping" | "driving" | "pushing">("idle")
  
  const truckControls = useAnimation()
  const wheelsControls = useAnimation()
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const truckPosRef = useRef<{ x: number; y: number; isMoving: boolean; isRevving: boolean }>({
    x: 0,
    y: 0,
    isMoving: false,
    isRevving: false,
  })
  const animFrameRef = useRef<number | null>(null)

  const measureCoordinates = useCallback(() => {
    if (typeof window === "undefined") return null

    const trackEl = document.getElementById("hero-badges-track")
    const logoEl = document.getElementById("navbar-brand-logo")
    const badge1El = document.getElementById("hero-rating-badge")
    const badge2El = document.getElementById("hero-license-badge")

    if (!trackEl || !badge1El) return null

    const trackRect = trackEl.getBoundingClientRect()
    const badge1Rect = badge1El.getBoundingClientRect()
    const badge2Rect = badge2El ? badge2El.getBoundingClientRect() : null
    const logoRect = logoEl ? logoEl.getBoundingClientRect() : null

    const truckWidth = 62
    const truckHeight = 36

    const startX = logoRect
      ? logoRect.left - trackRect.left + (logoRect.width - truckWidth) / 2
      : 8
    const startY = logoRect
      ? logoRect.top - trackRect.top + (logoRect.height - truckHeight) / 2
      : -130

    const landingX = badge1Rect.left - trackRect.left + 20
    const landingY = badge1Rect.top - trackRect.top - truckHeight + 3

    const edgeX = badge2Rect
      ? badge2Rect.left - trackRect.left + badge2Rect.width - truckWidth + 6
      : badge1Rect.left - trackRect.left + badge1Rect.width - truckWidth + 4
    const edgeY = badge2Rect
      ? badge2Rect.top - trackRect.top - truckHeight + 3
      : landingY

    return { startX, startY, landingX, landingY, edgeX, edgeY }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let lastSpawn = 0

    const renderLoop = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const truck = truckPosRef.current
      const exhaustX = truck.x + 36 + 60
      const exhaustY = truck.y + 4 + 180

      if (truck.isMoving || truck.isRevving) {
        const interval = truck.isMoving ? 40 : 130
        if (time - lastSpawn > interval) {
          lastSpawn = time
          const count = truck.isRevving ? (Math.random() < 0.4 ? 4 : 2) : 1
          for (let i = 0; i < count; i++) {
            particlesRef.current.push({
              x: exhaustX + (Math.random() - 0.5) * 4,
              y: exhaustY + (Math.random() - 0.5) * 3,
              vx: (truck.isMoving ? -1.8 : -0.8) - Math.random() * 1.6,
              vy: -1.2 - Math.random() * 1.5,
              radius: 3 + Math.random() * 2,
              maxRadius: 16 + Math.random() * 8,
              growth: 0.35 + Math.random() * 0.25,
              alpha: 0.75 + Math.random() * 0.15,
              decay: 0.015 + Math.random() * 0.008,
              rotation: Math.random() * Math.PI * 2,
              spin: (Math.random() - 0.5) * 0.04,
            })
          }
        }
      }

      const active: Particle[] = []
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.97
        p.vy *= 0.98
        p.radius += p.growth
        if (p.radius > p.maxRadius) p.radius = p.maxRadius
        p.alpha -= p.decay
        p.rotation += p.spin

        if (p.alpha > 0.01) {
          active.push(p)

          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            p.radius * 0.1,
            p.x,
            p.y,
            p.radius
          )
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha * 0.95})`)
          grad.addColorStop(0.45, `rgba(240, 243, 248, ${p.alpha * 0.6})`)
          grad.addColorStop(0.85, `rgba(225, 230, 235, ${p.alpha * 0.2})`)
          grad.addColorStop(1, "rgba(220, 225, 230, 0)")

          ctx.save()
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }
      particlesRef.current = active

      animFrameRef.current = requestAnimationFrame(renderLoop)
    }

    animFrameRef.current = requestAnimationFrame(renderLoop)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const runPushingLoop = useCallback((edgeX: number, edgeY: number) => {
    truckPosRef.current = { x: edgeX, y: edgeY, isMoving: false, isRevving: true }

    truckControls.start({
      x: [edgeX, edgeX + 6, edgeX + 7, edgeX + 2, edgeX - 2, edgeX],
      y: [edgeY, edgeY + 1, edgeY, edgeY - 1, edgeY, edgeY],
      rotate: [0, 3, 4, 1, -1, 0],
      transition: {
        duration: 1.6,
        repeat: Infinity,
        repeatType: "loop",
        times: [0, 0.25, 0.45, 0.65, 0.85, 1],
        ease: "easeInOut",
      },
    })

    wheelsControls.start({
      rotate: [0, 90, 180, 240, 260, 360],
      transition: {
        duration: 1.6,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    })
  }, [truckControls, wheelsControls])

  const runDrivingSequence = useCallback(async (c: {
    startX: number
    startY: number
    landingX: number
    landingY: number
    edgeX: number
    edgeY: number
  }) => {
    truckPosRef.current = { x: c.landingX, y: c.landingY, isMoving: true, isRevving: false }

    wheelsControls.start({
      rotate: 1440,
      transition: { duration: 2.8, ease: "linear" },
    })

    const startTime = performance.now()
    const duration = 2800

    const driveAnim = new Promise<void>((resolve) => {
      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2

        const currentX = c.landingX + (c.edgeX - c.landingX) * easeProgress
        const currentY = c.landingY + (c.edgeY - c.landingY) * easeProgress
        const bumpY = Math.sin(progress * Math.PI * 14) * 0.8

        truckPosRef.current.x = currentX
        truckPosRef.current.y = currentY

        truckControls.set({
          x: currentX,
          y: currentY + bumpY,
          rotate: progress > 0.9 ? 3 : 0,
        })

        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          resolve()
        }
      }
      requestAnimationFrame(step)
    })

    await driveAnim

    truckPosRef.current.isMoving = false
    await truckControls.start({
      rotate: [3, -1, 0],
      transition: { duration: 0.3, ease: "easeOut" },
    })

    try {
      sessionStorage.setItem(STORAGE_KEY, "true")
    } catch {}

    setPhase("pushing")
    runPushingLoop(c.edgeX, c.edgeY)
  }, [wheelsControls, truckControls, runPushingLoop])

  const runDropSequence = useCallback(async (c: {
    startX: number
    startY: number
    landingX: number
    landingY: number
    edgeX: number
    edgeY: number
  }) => {
    truckPosRef.current = { x: c.startX, y: c.startY, isMoving: false, isRevving: false }

    truckControls.set({
      x: c.startX,
      y: c.startY,
      rotate: -14,
      scale: 0.65,
      opacity: 0,
    })

    await truckControls.start({
      opacity: 1,
      scale: 1,
      rotate: -8,
      transition: { duration: 0.25, ease: "easeOut" },
    })

    await truckControls.start({
      x: c.landingX,
      y: c.landingY,
      rotate: 4,
      transition: {
        duration: 0.65,
        ease: [0.55, 0.055, 0.675, 0.19],
      },
    })

    if (badge1Controls) {
      badge1Controls.start({
        y: [0, 11, -3, 1, 0],
        transition: { duration: 0.65, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeOut" },
      })
    }

    await truckControls.start({
      y: [c.landingY, c.landingY - 18, c.landingY],
      rotate: [4, -4, 2],
      transition: { duration: 0.35, ease: "easeOut" },
    })

    await truckControls.start({
      y: [c.landingY, c.landingY - 5, c.landingY],
      rotate: [2, -1, 0],
      transition: { duration: 0.22, ease: "easeInOut" },
    })

    await new Promise((r) => setTimeout(r, 200))

    setPhase("driving")
    await runDrivingSequence(c)
  }, [truckControls, badge1Controls, runDrivingSequence])

  useEffect(() => {
    setMounted(true)

    let hasSeen = false
    try {
      hasSeen = sessionStorage.getItem(STORAGE_KEY) === "true"
    } catch {}

    const timer = setTimeout(async () => {
      const measured = measureCoordinates()
      if (!measured) return

      if (hasSeen) {
        setPhase("pushing")
        truckPosRef.current = {
          x: measured.edgeX,
          y: measured.edgeY,
          isMoving: false,
          isRevving: true,
        }
        truckControls.set({
          x: measured.edgeX,
          y: measured.edgeY,
          rotate: 0,
          scale: 1,
          opacity: 1,
        })
        runPushingLoop(measured.edgeX, measured.edgeY)
      } else {
        setPhase("dropping")
        await runDropSequence(measured)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [measureCoordinates, truckControls, wheelsControls, runDropSequence, runPushingLoop])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
      <canvas
        ref={canvasRef}
        width={750}
        height={320}
        className="absolute -top-[180px] -left-[60px] pointer-events-none overflow-visible"
        style={{ width: "750px", height: "320px" }}
      />

      <motion.div
        animate={truckControls}
        initial={{ opacity: 0 }}
        className="absolute top-0 left-0 w-[62px] h-[36px] will-change-transform origin-bottom"
        style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.22))" }}
      >
        <svg
          viewBox="0 0 72 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="35%" stopColor="#F8FAFC" />
              <stop offset="70%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            <linearGradient id="yellowBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="yellowDump" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          <ellipse
            cx="36"
            cy="41"
            rx="30"
            ry="2.5"
            fill="#09090B"
            opacity="0.28"
          />

          <rect x="18" y="27" width="14" height="3" rx="1" fill="#475569" />
          <rect x="23" y="27.5" width="8" height="2" fill="#E2E8F0" />

          <path
            d="M4 11 L37 11 L37 28 L6 28 L4 11 Z"
            fill="url(#yellowDump)"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          <path
            d="M37 11 L44 6.5 L44 11 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="1"
          />
          <rect
            x="3"
            y="9"
            width="35"
            height="2.5"
            rx="1"
            fill="#FDE047"
            stroke="#D97706"
            strokeWidth="0.8"
          />
          <line x1="13" y1="12" x2="13" y2="27" stroke="#92400E" strokeWidth="1.6" />
          <line x1="21" y1="12" x2="21" y2="27" stroke="#92400E" strokeWidth="1.6" />
          <line x1="29" y1="12" x2="29" y2="27" stroke="#92400E" strokeWidth="1.6" />
          <rect x="4" y="25" width="6" height="3" fill="#DC2626" />
          <line x1="6" y1="25" x2="4" y2="28" stroke="#FFFFFF" strokeWidth="1.2" />
          <line x1="9" y1="25" x2="7" y2="28" stroke="#FFFFFF" strokeWidth="1.2" />

          <rect
            x="37"
            y="4"
            width="2.6"
            height="13"
            rx="1"
            fill="url(#chromeGrad)"
            stroke="#475569"
            strokeWidth="0.5"
          />
          <path
            d="M36 4 L41 2 L42 3.2 L37 5.2 Z"
            fill="#334155"
            stroke="#1E293B"
            strokeWidth="0.4"
          />

          <path
            d="M37 15 L47 15 L54 21 L67 22 L67 29.5 L37 29.5 Z"
            fill="url(#yellowBody)"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          <rect x="46" y="14" width="9" height="1.8" rx="0.5" fill="#18181B" />

          <polygon
            points="48,16 53,21 44,21 44,16"
            fill="url(#glassGrad)"
            stroke="#0369A1"
            strokeWidth="0.7"
          />
          <line
            x1="49"
            y1="17"
            x2="45"
            y2="20.5"
            stroke="#FFFFFF"
            strokeWidth="1"
            opacity="0.75"
          />

          <rect
            x="38.5"
            y="16.5"
            width="4"
            height="4.5"
            rx="0.5"
            fill="url(#glassGrad)"
            stroke="#0369A1"
            strokeWidth="0.5"
          />

          <line x1="43.5" y1="22" x2="43.5" y2="29" stroke="#B45309" strokeWidth="0.9" />
          <rect x="40" y="23.5" width="2.2" height="0.9" rx="0.4" fill="#18181B" />

          <rect x="48.5" y="18" width="1.6" height="3.2" rx="0.5" fill="#18181B" />

          <rect x="64.5" y="23.5" width="2.5" height="5" rx="0.6" fill="#18181B" />
          <line x1="65.5" y1="24" x2="65.5" y2="28" stroke="#475569" strokeWidth="0.6" />

          <circle cx="66" cy="24" r="3.2" fill="#FEF08A" opacity="0.35" />
          <circle cx="66" cy="24" r="1.8" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.5" />

          <rect x="63" y="28" width="6.5" height="3" rx="0.8" fill="#334155" />
          <line x1="64" y1="29.5" x2="68.5" y2="29.5" stroke="#94A3B8" strokeWidth="0.6" />

          <path d="M7 29 Q16 23 25 29" stroke="#18181B" strokeWidth="2.5" fill="none" />
          <path d="M47 29 Q55 23 63 29" stroke="#18181B" strokeWidth="2.5" fill="none" />

          <motion.g animate={wheelsControls} style={{ originX: "16px", originY: "32px" }}>
            <g transform="translate(16, 32)">
              <circle cx="0" cy="0" r="7.8" fill="#18181B" stroke="#27272A" strokeWidth="1.2" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1={Math.cos((angle * Math.PI) / 180) * 6}
                  y1={Math.sin((angle * Math.PI) / 180) * 6}
                  x2={Math.cos((angle * Math.PI) / 180) * 7.8}
                  y2={Math.sin((angle * Math.PI) / 180) * 7.8}
                  stroke="#3F3F46"
                  strokeWidth="1.2"
                />
              ))}
              <circle cx="0" cy="0" r="4.5" fill="#52525B" stroke="#71717A" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="2.2" fill="#F59E0B" />
              <circle cx="0" cy="-3" r="0.6" fill="#F8FAFC" />
              <circle cx="2.8" cy="-1" r="0.6" fill="#F8FAFC" />
              <circle cx="1.8" cy="2.5" r="0.6" fill="#F8FAFC" />
              <circle cx="-1.8" cy="2.5" r="0.6" fill="#F8FAFC" />
              <circle cx="-2.8" cy="-1" r="0.6" fill="#F8FAFC" />
            </g>
          </motion.g>

          <motion.g animate={wheelsControls} style={{ originX: "55px", originY: "32px" }}>
            <g transform="translate(55, 32)">
              <circle cx="0" cy="0" r="7.8" fill="#18181B" stroke="#27272A" strokeWidth="1.2" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1={Math.cos((angle * Math.PI) / 180) * 6}
                  y1={Math.sin((angle * Math.PI) / 180) * 6}
                  x2={Math.cos((angle * Math.PI) / 180) * 7.8}
                  y2={Math.sin((angle * Math.PI) / 180) * 7.8}
                  stroke="#3F3F46"
                  strokeWidth="1.2"
                />
              ))}
              <circle cx="0" cy="0" r="4.5" fill="#52525B" stroke="#71717A" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="2.2" fill="#F59E0B" />
              <circle cx="0" cy="-3" r="0.6" fill="#F8FAFC" />
              <circle cx="2.8" cy="-1" r="0.6" fill="#F8FAFC" />
              <circle cx="1.8" cy="2.5" r="0.6" fill="#F8FAFC" />
              <circle cx="-1.8" cy="2.5" r="0.6" fill="#F8FAFC" />
              <circle cx="-2.8" cy="-1" r="0.6" fill="#F8FAFC" />
            </g>
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}
