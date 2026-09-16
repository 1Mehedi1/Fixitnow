"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MoveHorizontal } from "lucide-react"

interface Props {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  alt?: string
}

/** Draggable before/after image comparison slider — uses clip-path for clean clipping. */
export function BeforeAfterSlider({ before, after, beforeLabel = "Before", afterLabel = "After", alt = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const onMove = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
    setPos((x / rect.width) * 100)
  }, [])

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (dragging.current) onMove(e.clientX)
    }
    const touchMove = (e: TouchEvent) => {
      if (dragging.current) onMove(e.touches[0].clientX)
    }
    const stop = () => {
      dragging.current = false
    }
    window.addEventListener("mousemove", mouseMove)
    window.addEventListener("mouseup", stop)
    window.addEventListener("touchmove", touchMove, { passive: true })
    window.addEventListener("touchend", stop)
    return () => {
      window.removeEventListener("mousemove", mouseMove)
      window.removeEventListener("mouseup", stop)
      window.removeEventListener("touchmove", touchMove)
      window.removeEventListener("touchend", stop)
    }
  }, [onMove])

  const startDrag = (clientX: number) => {
    dragging.current = true
    onMove(clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted select-none cursor-ew-resize"
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
    >
      {/* After image (full) */}
      <img src={after} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <span className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
        {afterLabel}
      </span>

      {/* Before image clipped via clip-path — no width hack needed */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 z-20 -ml-px flex items-center justify-center pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="h-full w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.4)]" />
        <div className="absolute h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <MoveHorizontal className="h-5 w-5 text-stone-700" />
        </div>
      </div>
    </div>
  )
}
