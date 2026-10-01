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
}

interface ConstructionTruckAnimationProps {
  badge1Controls?: AnimationControls
}

export function ConstructionTruckAnimation({ badge1Controls }: ConstructionTruckAnimationProps) {
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  
  // Animation Phase:
  // "idle" -> "dropping" -> "driving" -> "struggling" -> "coughing" -> "walking" -> "waving"
  const [phase, setPhase] = useState<
    "idle" | "dropping" | "driving" | "struggling" | "coughing" | "walking" | "waving"
  >("idle")

  const [wheelAngle, setWheelAngle] = useState(0)

  // Motion controls
  const truckControls = useAnimation()
  const manControls = useAnimation()
  const waveControls = useAnimation()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const truckPosRef = useRef<{
    x: number
    y: number
    smokeIntensity: "none" | "low" | "medium" | "heavy" | "burst"
  }>({
    x: 0,
    y: 0,
    smokeIntensity: "none",
  })
  const animFrameRef = useRef<number | null>(null)

  // Measure exact coordinates between navbar logo and badges
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

    // Mechanical truck dimensions (larger, heavier)
    const truckWidth = 84
    const truckHeight = 48

    const startX = logoRect
      ? logoRect.left - trackRect.left + (logoRect.width - truckWidth) / 2
      : 8
    const startY = logoRect
      ? logoRect.top - trackRect.top + (logoRect.height - truckHeight) / 2
      : -140

    // Lands on Badge 1
    const landingX = badge1Rect.left - trackRect.left + 14
    const landingY = badge1Rect.top - trackRect.top - truckHeight + 6

    // Right edge of Badge 2
    const edgeX = badge2Rect
      ? badge2Rect.left - trackRect.left + badge2Rect.width - truckWidth + 8
      : badge1Rect.left - trackRect.left + badge1Rect.width - truckWidth + 6
    const edgeY = badge2Rect
      ? badge2Rect.top - trackRect.top - truckHeight + 6
      : landingY

    // Resting place for the handyman on Badge 1
    const manRestX = badge1Rect.left - trackRect.left + badge1Rect.width / 2 - 12
    const manRestY = badge1Rect.top - trackRect.top - 38

    return { startX, startY, landingX, landingY, edgeX, edgeY, manRestX, manRestY }
  }, [])

  // Canvas loop: bold, heavy spreading and vaporizing white diesel smoke
  useEffect(() => {
    if (!isDesktop) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let lastSpawn = 0

    const renderLoop = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const truck = truckPosRef.current
      // Exhaust stack position relative to canvas (canvas offset: left -80, top -200)
      const exhaustX = truck.x + 48 + 80
      const exhaustY = truck.y + 6 + 200

      const intensity = truck.smokeIntensity
      if (intensity !== "none") {
        let spawnInterval = 100
        let spawnCount = 1

        if (intensity === "low") {
          spawnInterval = 90
          spawnCount = 1
        } else if (intensity === "medium") {
          spawnInterval = 45
          spawnCount = 2
        } else if (intensity === "heavy") {
          spawnInterval = 30
          spawnCount = 3
        } else if (intensity === "burst") {
          spawnInterval = 20
          spawnCount = 6
        }

        if (time - lastSpawn > spawnInterval) {
          lastSpawn = time
          for (let i = 0; i < spawnCount; i++) {
            particlesRef.current.push({
              x: exhaustX + (Math.random() - 0.5) * 6,
              y: exhaustY + (Math.random() - 0.5) * 4,
              vx: -1.6 - Math.random() * 2.2,
              vy: -1.4 - Math.random() * 2.2,
              radius: 4 + Math.random() * 3,
              maxRadius: intensity === "burst" ? 34 + Math.random() * 12 : 24 + Math.random() * 10,
              growth: intensity === "burst" ? 0.75 + Math.random() * 0.4 : 0.55 + Math.random() * 0.35,
              alpha: intensity === "burst" ? 0.95 : 0.85,
              decay: 0.012 + Math.random() * 0.006,
            })
          }
        }
      }

      // Update and draw active particles
      const active: Particle[] = []
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96 // Atmospheric drag
        p.vy *= 0.97
        p.radius += p.growth
        if (p.radius > p.maxRadius) p.radius = p.maxRadius
        p.alpha -= p.decay

        if (p.alpha > 0.01) {
          active.push(p)

          // Soft billowing cloud radial gradient (pure white diesel smoke)
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            p.radius * 0.1,
            p.x,
            p.y,
            p.radius
          )
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha * 0.95})`)
          grad.addColorStop(0.35, `rgba(245, 248, 250, ${p.alpha * 0.7})`)
          grad.addColorStop(0.7, `rgba(230, 235, 240, ${p.alpha * 0.3})`)
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
  }, [isDesktop])

  // Master Animation Sequence - Replays on Every Page Refresh on Desktop!
  useEffect(() => {
    setMounted(true)
    const checkDesktop = window.innerWidth >= 768
    setIsDesktop(checkDesktop)
    if (!checkDesktop) return

    let cancelled = false

    const timer = setTimeout(async () => {
      const c = measureCoordinates()
      if (!c || cancelled) return

      // --- PHASE 1: THE DROP & HEAVY SPRING IMPACT ---
      setPhase("dropping")
      truckPosRef.current = { x: c.startX, y: c.startY, smokeIntensity: "none" }

      truckControls.set({
        x: c.startX,
        y: c.startY,
        rotate: -12,
        scale: 0.7,
        opacity: 0,
      })

      // Pop out of navbar logo
      await truckControls.start({
        opacity: 1,
        scale: 1,
        rotate: -6,
        transition: { duration: 0.25, ease: "easeOut" },
      })
      if (cancelled) return

      // Heavy gravity acceleration fall
      await truckControls.start({
        x: c.landingX,
        y: c.landingY,
        rotate: 4,
        transition: {
          duration: 0.65,
          ease: [0.55, 0.055, 0.675, 0.19],
        },
      })
      if (cancelled) return

      // Hard impact on Badge 1: 12px spring compression!
      if (badge1Controls) {
        badge1Controls.start({
          y: [0, 12, -4, 1.5, 0],
          transition: { duration: 0.65, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeOut" },
        })
      }

      // Heavy truck rebound & suspension bounce
      await truckControls.start({
        y: [c.landingY, c.landingY - 18, c.landingY],
        rotate: [4, -5, 2],
        transition: { duration: 0.35, ease: "easeOut" },
      })
      if (cancelled) return

      await truckControls.start({
        y: [c.landingY, c.landingY - 5, c.landingY],
        rotate: [2, -1, 0],
        transition: { duration: 0.22, ease: "easeInOut" },
      })
      if (cancelled) return

      await new Promise((r) => setTimeout(r, 250))
      if (cancelled) return

      // --- PHASE 2: DRIVE ACROSS BADGES WITH DENSE DIESEL SMOKE ---
      setPhase("driving")
      truckPosRef.current = { x: c.landingX, y: c.landingY, smokeIntensity: "heavy" }

      const driveStart = performance.now()
      const driveDuration = 2400

      const drivePromise = new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (cancelled) return resolve()
          const elapsed = now - driveStart
          const p = Math.min(elapsed / driveDuration, 1)
          const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

          const curX = c.landingX + (c.edgeX - c.landingX) * ease
          const curY = c.landingY + (c.edgeY - c.landingY) * ease
          const bumpY = Math.sin(p * Math.PI * 12) * 1.0

          truckPosRef.current.x = curX
          truckPosRef.current.y = curY
          setWheelAngle(p * 1440) // Physical wheel spin

          truckControls.set({
            x: curX,
            y: curY + bumpY,
            rotate: p > 0.92 ? 3 : 0,
          })

          if (p < 1) {
            requestAnimationFrame(step)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(step)
      })

      await drivePromise
      if (cancelled) return

      // --- PHASE 3: SHORT STRUGGLE TO BREAK THROUGH LIMIT (2 SECONDS) ---
      setPhase("struggling")
      truckPosRef.current.smokeIntensity = "heavy"

      const struggleStart = performance.now()
      const struggleDuration = 2200

      const strugglePromise = new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (cancelled) return resolve()
          const elapsed = now - struggleStart
          const p = Math.min(elapsed / struggleDuration, 1)

          // Rocking push against the right edge
          const cycle = Math.sin(elapsed * 0.015)
          const pushX = c.edgeX + Math.max(0, cycle * 7)
          const rockY = c.edgeY + (cycle > 0 ? 1 : 0)
          const rockRot = cycle * 3.5

          truckPosRef.current.x = pushX
          truckPosRef.current.y = rockY
          setWheelAngle((prev) => prev + 12)

          truckControls.set({
            x: pushX,
            y: rockY,
            rotate: rockRot,
          })

          if (p < 1) {
            requestAnimationFrame(step)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(step)
      })

      await strugglePromise
      if (cancelled) return

      // --- PHASE 4: ENGINE CUTS OFF WITH LARGE COUGHING SMOKE BURST ---
      setPhase("coughing")
      truckPosRef.current.smokeIntensity = "burst"

      await truckControls.start({
        x: [c.edgeX + 4, c.edgeX - 3, c.edgeX],
        y: [c.edgeY + 2, c.edgeY - 1, c.edgeY],
        rotate: [4, -2, 0],
        transition: { duration: 0.6, ease: "easeOut" },
      })
      if (cancelled) return

      // Allow the large smoke cloud to billow high
      await new Promise((r) => setTimeout(r, 600))
      truckPosRef.current.smokeIntensity = "low"
      if (cancelled) return

      // --- PHASE 5: HANDYMAN GETS OUT OF TRUCK & STEPS BACK TO BADGE 1 ---
      setPhase("walking")
      // Handyman starts at truck cab door
      const manStartX = c.edgeX + 46
      const manStartY = c.edgeY + 12

      manControls.set({
        x: manStartX,
        y: manStartY,
        scale: 0.6,
        opacity: 0,
      })

      // Step out of the cab
      await manControls.start({
        opacity: 1,
        scale: 1,
        y: c.edgeY + 6,
        transition: { duration: 0.4, ease: "easeOut" },
      })
      if (cancelled) return

      // Walk leftward across to Badge 1
      const walkStart = performance.now()
      const walkDuration = 2200

      const walkPromise = new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (cancelled) return resolve()
          const elapsed = now - walkStart
          const p = Math.min(elapsed / walkDuration, 1)

          const curX = manStartX + (c.manRestX - manStartX) * p
          // Walking step bobbing
          const stepBob = -Math.abs(Math.sin(p * Math.PI * 8)) * 3

          manControls.set({
            x: curX,
            y: c.manRestY + stepBob,
          })

          if (p < 1) {
            requestAnimationFrame(step)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(step)
      })

      await walkPromise
      if (cancelled) return

      // --- PHASE 6: PROUD WELCOMING POSE & FRIENDLY CONTINUOUS HAND WAVE ---
      setPhase("waving")
      truckPosRef.current.smokeIntensity = "low"

      manControls.set({
        x: c.manRestX,
        y: c.manRestY,
      })

      // Wave arm loop
      waveControls.start({
        rotate: [-14, 22, -14],
        transition: {
          duration: 1.1,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        },
      })
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isDesktop, measureCoordinates, truckControls, manControls, waveControls, badge1Controls])

  // DESKTOP ONLY: If not desktop or not mounted, render nothing!
  if (!mounted || !isDesktop) return null

  return (
    <div className="hidden md:block absolute inset-0 pointer-events-none z-30 overflow-visible">
      {/* 60fps Canvas for Bold Billowing White Diesel Smoke */}
      <canvas
        ref={canvasRef}
        width={850}
        height={340}
        className="absolute -top-[200px] -left-[80px] pointer-events-none overflow-visible"
        style={{ width: "850px", height: "340px" }}
      />

      {/* The Heavy Mechanical Iron Construction Truck */}
      <motion.div
        animate={truckControls}
        initial={{ opacity: 0 }}
        className="absolute top-0 left-0 w-[84px] h-[48px] will-change-transform origin-bottom pointer-events-none"
        style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))" }}
      >
        <svg
          viewBox="0 0 96 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Cast Iron & Weathered Gunmetal Gradients */}
            <linearGradient id="ironPlate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4B535E" />
              <stop offset="35%" stopColor="#353B44" />
              <stop offset="75%" stopColor="#252A30" />
              <stop offset="100%" stopColor="#1A1D22" />
            </linearGradient>

            <linearGradient id="ironHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Industrial Warning Hazard Yellow Stripes */}
            <pattern id="hazardStripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="4" height="8" fill="#F59E0B" />
              <rect x="4" width="4" height="8" fill="#18181B" />
            </pattern>

            {/* Steel Exhaust Pipe Gradient */}
            <linearGradient id="exhaustGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="30%" stopColor="#E2E8F0" />
              <stop offset="60%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Heavy Ground Shadow under Chassis */}
          <ellipse cx="48" cy="53" rx="42" ry="3.2" fill="#09090B" opacity="0.4" />

          {/* Heavy Iron Chassis Subframe */}
          <rect x="14" y="36" width="70" height="5" rx="1.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />

          {/* Electrical & Mechanical Messy Elements: Coiled Wiring Conduits */}
          <path d="M26 38 Q32 41 38 38 Q44 41 50 38" stroke="#EF4444" strokeWidth="1.2" fill="none" />
          <path d="M28 39 Q34 42 40 39 Q46 42 52 39" stroke="#EAB308" strokeWidth="1" fill="none" />
          <path d="M30 40 Q36 43 42 40 Q48 43 54 40" stroke="#3B82F6" strokeWidth="1" fill="none" />
          {/* Conduit zip-ties */}
          <line x1="33" y1="37" x2="33" y2="41" stroke="#000000" strokeWidth="1.5" />
          <line x1="45" y1="37" x2="45" y2="41" stroke="#000000" strokeWidth="1.5" />

          {/* Mechanical Battery & Electrical Box */}
          <rect x="36" y="34" width="12" height="6" rx="1" fill="#334155" stroke="#1E293B" strokeWidth="0.8" />
          <text x="39" y="39" fill="#F59E0B" fontSize="4" fontWeight="bold">⚡</text>

          {/* Hydraulic Cylinder under Dump Bed */}
          <rect x="22" y="33" width="16" height="3.5" rx="1" fill="#475569" />
          <rect x="28" y="34" width="10" height="1.8" fill="#F1F5F9" />

          {/* Heavy Iron Tipper Dump Bed with Welded Structural Plates */}
          <path
            d="M4 14 L48 14 L48 36 L7 36 L4 14 Z"
            fill="url(#ironPlate)"
            stroke="#1E293B"
            strokeWidth="1.6"
          />
          {/* Iron Cab Protector Shield */}
          <path
            d="M48 14 L56 8 L56 14 Z"
            fill="#334155"
            stroke="#1E293B"
            strokeWidth="1.2"
          />
          {/* Top Reinforced Iron Lip with Rivets */}
          <rect x="3" y="12" width="46" height="3" rx="1" fill="#475569" stroke="#1E293B" strokeWidth="0.8" />
          {/* Rivets along the top rail */}
          {[6, 14, 22, 30, 38, 46].map((rx) => (
            <circle key={rx} cx={rx} cy="13.5" r="0.8" fill="#CBD5E1" />
          ))}

          {/* Heavy Iron Structural Ribs with Rivet Details */}
          {[16, 26, 36, 44].map((lx) => (
            <g key={lx}>
              <line x1={lx} y1="15" x2={lx} y2="35" stroke="#1E293B" strokeWidth="2.5" />
              <line x1={lx} y1="15" x2={lx} y2="35" stroke="#64748B" strokeWidth="1" />
              <circle cx={lx} cy="18" r="0.7" fill="#E2E8F0" />
              <circle cx={lx} cy="32" r="0.7" fill="#E2E8F0" />
            </g>
          ))}

          {/* Hazard Safety Chevrons on Lower Dump Bed */}
          <rect x="5" y="32" width="12" height="3.5" fill="url(#hazardStripes)" stroke="#1E293B" strokeWidth="0.5" />

          {/* Heavy Steel Vertical Exhaust Stack */}
          <rect
            x="48"
            y="4"
            width="3.5"
            height="18"
            rx="1.2"
            fill="url(#exhaustGrad)"
            stroke="#1E293B"
            strokeWidth="0.8"
          />
          {/* Exhaust Rain Flapper Pipe Cap */}
          <path d="M46.5 4 L53 1.5 L54 3.2 L47.5 5.8 Z" fill="#1E293B" />
          {/* Heat shield perforation dots */}
          <circle cx="49.7" cy="11" r="0.6" fill="#1E293B" />
          <circle cx="49.7" cy="14" r="0.6" fill="#1E293B" />
          <circle cx="49.7" cy="17" r="0.6" fill="#1E293B" />

          {/* Mechanical Iron Truck Cab */}
          <path
            d="M48 20 L62 20 L72 28 L88 29 L88 38 L48 38 Z"
            fill="url(#ironPlate)"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Roof Visor & Orange Amber Warning Beacon */}
          <rect x="60" y="19" width="12" height="2" rx="0.6" fill="#0F172A" />
          <rect x="64" y="16.5" width="4" height="2.5" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="66" cy="17.7" r="1.5" fill="#FEF08A" opacity="0.8" />

          {/* Tinted Armored Windshield */}
          <polygon
            points="63,21 69,27 57,27 57,21"
            fill="#0369A1"
            stroke="#075985"
            strokeWidth="0.8"
          />
          <line x1="64" y1="22" x2="58" y2="26.5" stroke="#E0F2FE" strokeWidth="1.2" opacity="0.8" />

          {/* Cabin Side Window */}
          <rect x="50" y="21.5" width="5.5" height="5.5" rx="0.8" fill="#0369A1" stroke="#075985" strokeWidth="0.6" />

          {/* Door Seam & Heavy Industrial Iron Handle */}
          <line x1="56" y1="28" x2="56" y2="37" stroke="#1E293B" strokeWidth="1.2" />
          <rect x="52" y="30" width="3" height="1.2" rx="0.5" fill="#E2E8F0" stroke="#334155" strokeWidth="0.5" />

          {/* Steel Diamond-Plate Step */}
          <rect x="50" y="37" width="7" height="1.5" fill="#64748B" />

          {/* Front Heavy Iron Bull-Bar & Radiator Grille */}
          <rect x="85" y="30" width="4" height="7" rx="0.8" fill="#0F172A" />
          <line x1="86.5" y1="31" x2="86.5" y2="36" stroke="#475569" strokeWidth="0.8" />
          <line x1="87.8" y1="31" x2="87.8" y2="36" stroke="#475569" strokeWidth="0.8" />

          {/* Heavy Halogen Work Headlight with Warm Beam Glow */}
          <circle cx="87" cy="31" r="3.5" fill="#FEF08A" opacity="0.35" />
          <circle cx="87" cy="31" r="2.2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.6" />

          {/* Cast Iron Front Bumper with Towing Hooks */}
          <rect x="83" y="36.5" width="9" height="4" rx="1" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="85.5" cy="38.5" r="1.2" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />

          {/* Fixed Non-Scattering Wheels: Rotated cleanly around center cx, cy via SVG transform! */}
          {/* Rear Heavy Dual Wheels: center at (20, 42) */}
          <g transform={`rotate(${wheelAngle}, 20, 42)`}>
            {/* Dark Rubber Tire with Heavy Deep Treads */}
            <circle cx="20" cy="42" r="10" fill="#111827" stroke="#1F2937" strokeWidth="1.5" />
            {/* 8 Radial Tread Notches */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
              <line
                key={ang}
                x1={20 + Math.cos((ang * Math.PI) / 180) * 7.5}
                y1={42 + Math.sin((ang * Math.PI) / 180) * 7.5}
                x2={20 + Math.cos((ang * Math.PI) / 180) * 10}
                y2={42 + Math.sin((ang * Math.PI) / 180) * 10}
                stroke="#374151"
                strokeWidth="1.5"
              />
            ))}
            {/* Cast Iron Rim */}
            <circle cx="20" cy="42" r="6" fill="#374151" stroke="#4B535E" strokeWidth="1" />
            {/* Center Golden Hub */}
            <circle cx="20" cy="42" r="2.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />
            {/* Star Lug Nuts */}
            <circle cx="20" cy="38.5" r="0.7" fill="#F8FAFC" />
            <circle cx="23.3" cy="40.5" r="0.7" fill="#F8FAFC" />
            <circle cx="22" cy="44.5" r="0.7" fill="#F8FAFC" />
            <circle cx="18" cy="44.5" r="0.7" fill="#F8FAFC" />
            <circle cx="16.7" cy="40.5" r="0.7" fill="#F8FAFC" />
          </g>

          {/* Front Heavy Wheel: center at (73, 42) */}
          <g transform={`rotate(${wheelAngle}, 73, 42)`}>
            <circle cx="73" cy="42" r="10" fill="#111827" stroke="#1F2937" strokeWidth="1.5" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
              <line
                key={ang}
                x1={73 + Math.cos((ang * Math.PI) / 180) * 7.5}
                y1={42 + Math.sin((ang * Math.PI) / 180) * 7.5}
                x2={73 + Math.cos((ang * Math.PI) / 180) * 10}
                y2={42 + Math.sin((ang * Math.PI) / 180) * 10}
                stroke="#374151"
                strokeWidth="1.5"
              />
            ))}
            <circle cx="73" cy="42" r="6" fill="#374151" stroke="#4B535E" strokeWidth="1" />
            <circle cx="73" cy="42" r="2.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />
            <circle cx="73" cy="38.5" r="0.7" fill="#F8FAFC" />
            <circle cx="76.3" cy="40.5" r="0.7" fill="#F8FAFC" />
            <circle cx="75" cy="44.5" r="0.7" fill="#F8FAFC" />
            <circle cx="71" cy="44.5" r="0.7" fill="#F8FAFC" />
            <circle cx="69.7" cy="40.5" r="0.7" fill="#F8FAFC" />
          </g>
        </svg>
      </motion.div>

      {/* The Construction Handyman Character */}
      {/* Steps out of the truck, walks back to Badge 1, and warmly waves at the visitor! */}
      <motion.div
        animate={manControls}
        initial={{ opacity: 0 }}
        className="absolute top-0 left-0 w-[24px] h-[40px] will-change-transform z-40 pointer-events-none"
        style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))" }}
      >
        <svg
          viewBox="0 0 28 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Yellow Construction Safety Hard Hat */}
          <path d="M7 11 Q14 4 21 11 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
          <rect x="5.5" y="10.5" width="17" height="2" rx="1" fill="#D97706" />

          {/* Handyman Face & Friendly Smile */}
          <circle cx="14" cy="15" r="4.2" fill="#FBBF24" />
          {/* Eyes */}
          <circle cx="12.5" cy="14" r="0.6" fill="#1E293B" />
          <circle cx="15.5" cy="14" r="0.6" fill="#1E293B" />
          {/* Smile */}
          <path d="M12.5 16.5 Q14 18 15.5 16.5" stroke="#92400E" strokeWidth="0.7" fill="none" />

          {/* High-Vis Fluorescent Orange Safety Vest with Reflective Silver Tape */}
          <path d="M9 19 L19 19 L20 31 L8 31 Z" fill="#EA580C" />
          {/* Inner work shirt */}
          <polygon points="12,19 14,24 16,19" fill="#1E3A8A" />
          {/* Silver Reflective Safety Stripes */}
          <rect x="10" y="24" width="8" height="2" fill="#F1F5F9" />
          <line x1="11.5" y1="19" x2="11.5" y2="31" stroke="#F1F5F9" strokeWidth="1.2" />
          <line x1="16.5" y1="19" x2="16.5" y2="31" stroke="#F1F5F9" strokeWidth="1.2" />

          {/* Heavy Leather Toolbelt with Wrench */}
          <rect x="7.5" y="30" width="13" height="2.5" rx="0.5" fill="#78350F" />
          <rect x="12.5" y="30" width="3" height="2.5" fill="#E2E8F0" />
          {/* Tool hanging */}
          <line x1="17.5" y1="31" x2="19" y2="36" stroke="#94A3B8" strokeWidth="1.2" />
          <circle cx="19" cy="36" r="1" fill="#94A3B8" />

          {/* Denim Work Jeans */}
          <rect x="9.5" y="32.5" width="4" height="11" fill="#1E3A8A" />
          <rect x="14.5" y="32.5" width="4" height="11" fill="#1D4ED8" />

          {/* Heavy Steel-Toe Work Boots */}
          <rect x="8.5" y="42.5" width="5.5" height="3" rx="1" fill="#451A03" />
          <rect x="14" y="42.5" width="5.5" height="3" rx="1" fill="#451A03" />

          {/* Left Arm Resting at Side */}
          <path d="M8.5 20 L6.5 28 L7.5 30" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="7.5" cy="30" r="1.2" fill="#FDE047" />

          {/* Right Arm: Raising & Waving Warmly at the Visitor! */}
          <g transform="translate(19, 20)">
            <motion.g animate={waveControls}>
              <path d="M0.5 0 L4 -5 L5 -11" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
              {/* Waving Hand with Work Glove */}
              <circle cx="5" cy="-11.5" r="2" fill="#F8FAFC" stroke="#F59E0B" strokeWidth="0.6" />
              <line x1="5" y1="-13" x2="6" y2="-15" stroke="#F8FAFC" strokeWidth="1" strokeLinecap="round" />
            </motion.g>
          </g>
        </svg>
      </motion.div>
    </div>
  )
}
