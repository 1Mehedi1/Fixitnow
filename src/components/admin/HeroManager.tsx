"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Image as ImageIcon, Upload, Trash2, CheckCircle2, RotateCcw,
  Save, Loader2, Sparkles, ExternalLink, Eye, Smartphone, Monitor
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { DEFAULT_HERO_IMAGES, normalizeImageUrl } from "@/lib/site"
import { useStore } from "@/store/useStore"

const SLOT_META = [
  { index: 0, label: "Photo 1 · Top-Left (Portrait)", ratio: "aspect-[3/4]", note: "Main portrait shot featured top-left" },
  { index: 1, label: "Photo 2 · Bottom-Left (Square)", ratio: "aspect-square", note: "Square detail shot bottom-left" },
  { index: 2, label: "Photo 3 · Top-Right (Square)", ratio: "aspect-square", note: "Square highlight shot top-right" },
  { index: 3, label: "Photo 4 · Bottom-Right (Portrait)", ratio: "aspect-[3/4]", note: "Supporting portrait shot bottom-right" },
]

export function HeroManager() {
  const { customHeroPhotos, setCustomHeroPhotos, updateHeroPhoto } = useStore()
  const [photos, setPhotos] = useState<string[]>([
    "https://files.catbox.moe/xx0tqh.jpg",
    "https://files.catbox.moe/fcb1g7.jpg",
    "https://files.catbox.moe/6pj5rs.jpg",
    "https://files.catbox.moe/g2969p.jpg",
  ])
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop")

  // Load from localStorage or API on mount
  useEffect(() => {
    let loadedFromLocal = false
    try {
      const stored = localStorage.getItem("fixitnow_hero_photos")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length >= 4) {
          const cleaned = parsed.map((p, i) => (p && typeof p === "string" && p.trim()) ? normalizeImageUrl(p.trim()) : DEFAULT_HERO_IMAGES[i])
          setPhotos(cleaned)
          setCustomHeroPhotos(cleaned)
          loadedFromLocal = true
        }
      }
    } catch {}

    if (!loadedFromLocal) {
      fetch("/api/hero-photos")
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.heroImages) && d.heroImages.length >= 4) {
            const cleaned = d.heroImages.map((p: any, i: number) => (p && typeof p === "string" && p.trim()) ? normalizeImageUrl(p.trim()) : DEFAULT_HERO_IMAGES[i])
            setPhotos(cleaned)
            setCustomHeroPhotos(cleaned)
          }
        })
        .catch(() => {})
    }
  }, [setCustomHeroPhotos])

  const handleUrlChange = (idx: number, rawUrl: string) => {
    const cleaned = normalizeImageUrl(rawUrl)
    const next = [...photos]
    next[idx] = cleaned
    setPhotos(next)
    updateHeroPhoto(idx, cleaned)
  }

  const handleFileUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingIndex(idx)
    const fd = new FormData()
    fd.append("file", file)

    const tId = toast.loading(`Uploading Photo ${idx + 1}...`)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.url) {
        const directUrl = normalizeImageUrl(data.url)
        setPhotos((prev) => {
          const next = [...prev]
          next[idx] = directUrl
          return next
        })
        updateHeroPhoto(idx, directUrl)

        // Instant background sync to /api/hero-photos
        fetch("/api/hero-photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index: idx, url: directUrl }),
        }).catch(() => {})

        toast.success(`Photo ${idx + 1} updated and saved!`, { id: tId })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (err: any) {
      toast.error("Upload failed", { description: err.message, id: tId })
    } finally {
      setUploadingIndex(null)
      e.target.value = ""
    }
  }

  const handleClear = (idx: number) => {
    const next = [...photos]
    next[idx] = DEFAULT_HERO_IMAGES[idx]
    setPhotos(next)
    updateHeroPhoto(idx, DEFAULT_HERO_IMAGES[idx])
    toast.info(`Photo ${idx + 1} reset to default template image.`)
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      const cleaned = photos.map((p, i) => (p && typeof p === "string" && p.trim()) ? normalizeImageUrl(p.trim()) : DEFAULT_HERO_IMAGES[i])
      setPhotos(cleaned)
      setCustomHeroPhotos(cleaned)

      const res = await fetch("/api/hero-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroImages: cleaned }),
      })
      if (!res.ok) throw new Error("Server save failed")

      toast.success("All 4 Hero Photos saved! They are live on your website.")
    } catch (e: any) {
      toast.error("Save completed locally", { description: "Your photos are active on this device." })
    } finally {
      setSaving(false)
    }
  }

  const resetAll = () => {
    if (!confirm("Reset all 4 hero photos to default template images?")) return
    const defaults = [...DEFAULT_HERO_IMAGES]
    setPhotos(defaults)
    setCustomHeroPhotos(defaults)
    fetch("/api/hero-photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroImages: defaults }),
    }).catch(() => {})
    toast.info("All hero photos reset to default.")
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Hero Showcase Photos</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The 4 key photos that visitors see first on your homepage hero collage.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
            className="text-xs border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset Defaults
          </Button>

          <Button
            size="sm"
            onClick={saveAll}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md shadow-amber-600/20"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
            Save Hero Photos
          </Button>
        </div>
      </div>

      {/* 4 Photo Cards Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {SLOT_META.map((slot) => {
          const idx = slot.index
          const currentUrl = photos[idx] || DEFAULT_HERO_IMAGES[idx]
          const isCustom = currentUrl !== DEFAULT_HERO_IMAGES[idx]
          const isUploading = uploadingIndex === idx

          return (
            <Card key={idx} className="bg-slate-900/80 border-slate-800 overflow-hidden shadow-md hover:border-slate-700 transition-all">
              <CardHeader className="p-4 pb-3 bg-slate-950/40 border-b border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">{slot.label}</span>
                    {isCustom ? (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-1.5">
                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Custom
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px] py-0 px-1.5">
                        Default
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => handleClear(idx)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Reset this slot to default"
                      >
                        <Trash2 className="h-3 w-3" /> Clear
                      </button>
                    )}

                    <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload photo</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        className="hidden"
                        onChange={(e) => handleFileUpload(idx, e)}
                      />
                    </label>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {/* Visual Image Preview Box */}
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center relative group">
                  {currentUrl ? (
                    <img
                      src={currentUrl}
                      alt={`Hero Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-xs text-slate-500 flex flex-col items-center gap-1">
                      <ImageIcon className="h-6 w-6 opacity-40" />
                      <span>No photo</span>
                    </div>
                  )}

                  {/* Overlay URL viewer button */}
                  {currentUrl && (
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-slate-300 p-1.5 rounded-lg border border-slate-700/80 text-[10px] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-3 w-3" /> View full
                    </a>
                  )}
                </div>

                {/* Direct Image URL input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Image URL</Label>
                    <span className="text-[10px] text-slate-500">Google Drive share links supported</span>
                  </div>
                  <Input
                    value={photos[idx] || ""}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder="https://... or Google Drive sharing link"
                    className="text-xs h-9 font-mono bg-slate-950/60 border-slate-800 text-slate-200"
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Live Homepage Collage Preview Box */}
      <Card className="bg-slate-900/80 border-slate-800 overflow-hidden shadow-lg">
        <CardHeader className="p-4 pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-400" /> Live Homepage Hero Preview
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Preview how your 4 photos appear to visitors on the actual website.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                previewDevice === "desktop" ? "bg-amber-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                previewDevice === "mobile" ? "bg-amber-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 bg-slate-950/50 flex items-center justify-center">
          {previewDevice === "desktop" ? (
            /* Desktop 2x2 collage preview */
            <div className="w-full max-w-md grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="space-y-3 pt-6">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-700 shadow-md">
                  <img src={photos[0]} alt="Hero 1" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden border border-slate-700 shadow-md">
                  <img src={photos[1]} alt="Hero 2" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="aspect-square rounded-2xl overflow-hidden border border-slate-700 shadow-md">
                  <img src={photos[2]} alt="Hero 3" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-700 shadow-md">
                  <img src={photos[3]} alt="Hero 4" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ) : (
            /* Mobile 4-thumbnail row preview */
            <div className="w-full max-w-sm p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2 font-semibold">Mobile Thumbnail Bar</span>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-700 shadow-xs">
                    <img src={photos[idx]} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
