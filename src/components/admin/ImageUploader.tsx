"use client"

import { useCallback, useState } from "react"
import {
  Upload, X, Loader2, ImageIcon, Check, Sparkles,
  Link as LinkIcon, ArrowRight, ShieldCheck, RefreshCw, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface UploadedImage {
  url: string
  kind: "gallery" | "before" | "after"
}

interface Props {
  images: UploadedImage[]
  onChange: (imgs: UploadedImage[]) => void
}

export function ImageUploader({ images, onChange }: Props) {
  const [urlInput, setUrlInput] = useState("")
  const [selectedKind, setSelectedKind] = useState<UploadedImage["kind"]>("gallery")
  const [processingUrl, setProcessingUrl] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showFilePicker, setShowFilePicker] = useState(false)

  // Handle URL Paste -> Serverless Download -> Convert to WebP -> Permanent Cloud Storage
  const handleProcessUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = urlInput.trim()
    if (!trimmed) {
      toast.error("Please paste an image URL first")
      return
    }

    setProcessingUrl(true)
    const tId = toast.loading("Downloading & converting to WebP format...")
    try {
      const res = await fetch("/api/process-image-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        throw new Error(data.error || `Server returned ${res.status}: Failed to process image`)
      }

      // Automatically determine kind if user didn't specify and has before/after slots open
      let kindToAssign = selectedKind
      if (images.length === 0 && !images.some((i) => i.kind === "before") && kindToAssign === "gallery") {
        kindToAssign = "before"
      } else if (images.length === 1 && images[0].kind === "before" && kindToAssign === "gallery") {
        kindToAssign = "after"
      }

      const newImage: UploadedImage = {
        url: data.url,
        kind: kindToAssign,
      }

      const next = [...images, newImage]
      onChange(next)
      setUrlInput("")

      const sizeSaved = data.originalSize && data.optimizedSize
        ? ` (${Math.round(data.optimizedSize / 1024)} KB WebP)`
        : " (Optimized WebP)"

      toast.success(`Image converted to WebP & saved permanently!${sizeSaved}`, { id: tId })
    } catch (err: any) {
      toast.error("Image processing failed", {
        description: err.message || "Please check that the image link is valid and publicly accessible.",
        id: tId,
      })
    } finally {
      setProcessingUrl(false)
    }
  }

  // Handle direct file fallback if needed
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (list.length === 0) {
      toast.error("Please select a valid image file")
      return
    }

    setUploadingFile(true)
    const tId = toast.loading("Converting file to WebP & saving permanently...")
    try {
      const uploaded: UploadedImage[] = []
      for (const file of list) {
        const form = new FormData()
        form.append("file", file, file.name)

        const res = await fetch("/api/upload", { method: "POST", body: form })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data.url) {
          throw new Error(data.error || `Server returned ${res.status}: Upload failed`)
        }
        uploaded.push({ url: data.url, kind: "gallery" as const })
      }

      if (images.length === 0 && uploaded.length === 2) {
        uploaded[0].kind = "before"
        uploaded[1].kind = "after"
      }

      onChange([...images, ...uploaded])
      toast.success(`Uploaded & converted ${uploaded.length} image(s) to WebP!`, { id: tId })
    } catch (e: any) {
      toast.error("Upload failed", { description: e.message || "Please try again", id: tId })
    } finally {
      setUploadingFile(false)
    }
  }, [images, onChange])

  const setKind = (i: number, kind: UploadedImage["kind"]) => {
    const next = images.map((img, idx) => {
      if (idx === i) return { ...img, kind }
      if (kind !== "gallery" && img.kind === kind) return { ...img, kind: "gallery" as const }
      return img
    })
    onChange(next)
  }

  const remove = (i: number) => {
    onChange(images.filter((_, idx) => idx !== i))
  }

  const moveLeft = (i: number) => {
    if (i === 0) return
    const next = [...images]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    onChange(next)
  }

  const moveRight = (i: number) => {
    if (i === images.length - 1) return
    const next = [...images]
    ;[next[i + 1], next[i]] = [next[i], next[i + 1]]
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {/* 1. PRIMARY SYSTEM: PASTE IMAGE URL -> AUTO CONVERT TO WEBP -> PERMANENT STORAGE */}
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 dark:bg-emerald-950/20 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Label className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
            <LinkIcon className="h-4 w-4" /> Paste Image URL (Auto WebP Converter)
          </Label>
          <span className="text-[11px] text-slate-400 font-medium">
            Google Drive, Imgur, Catbox, Cloudinary, Postimages, etc.
          </span>
        </div>

        <form onSubmit={handleProcessUrl} className="space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://drive.google.com/file/... or https://files.catbox.moe/..."
                disabled={processingUrl}
                className="bg-slate-950/80 border-slate-700 text-white text-xs sm:text-sm pr-10 focus:border-emerald-500 font-mono"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Role selector before conversion */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setSelectedKind("gallery")}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer",
                  selectedKind === "gallery" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                Gallery
              </button>
              <button
                type="button"
                onClick={() => setSelectedKind("before")}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer",
                  selectedKind === "before" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                Before
              </button>
              <button
                type="button"
                onClick={() => setSelectedKind("after")}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer",
                  selectedKind === "after" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                After
              </button>
            </div>

            <Button
              type="submit"
              disabled={processingUrl || !urlInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-4 shrink-0 shadow-md shadow-emerald-950/50 cursor-pointer"
            >
              {processingUrl ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  <span>Converting…</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  <span>Convert & Add WebP</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400/90">
              <ShieldCheck className="h-3.5 w-3.5" /> Automatically downloads, converts to WebP, and stores permanently in cloud storage.
            </span>
            <button
              type="button"
              onClick={() => setShowFilePicker(!showFilePicker)}
              className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              {showFilePicker ? "Hide file uploader" : "Or upload local file"}
            </button>
          </div>
        </form>
      </div>

      {/* 2. OPTIONAL FILE UPLOAD FALLBACK */}
      {showFilePicker && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer bg-slate-950/40",
            dragOver ? "border-emerald-500 bg-emerald-950/10" : "border-slate-800 hover:border-slate-700"
          )}
          onClick={() => document.getElementById("img-fallback-input")?.click()}
        >
          <input
            id="img-fallback-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files)
              e.target.value = ""
            }}
          />
          <div className="flex flex-col items-center gap-1.5">
            {uploadingFile ? (
              <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
            ) : (
              <Upload className="h-6 w-6 text-slate-400" />
            )}
            <p className="text-xs font-semibold text-slate-300">
              {uploadingFile ? "Converting to WebP & uploading…" : "Drop image file here, or click to browse"}
            </p>
            <p className="text-[10px] text-slate-500">
              Files are automatically converted to optimized WebP format
            </p>
          </div>
        </div>
      )}

      {/* 3. ATTACHED IMAGES GRID (BEFORE / AFTER / GALLERY) */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Attached Images ({images.length})</span>
            <span className="text-[11px] text-slate-400">Tap chips to toggle Before / After / Gallery roles</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-sm"
              >
                <img
                  src={img.url}
                  alt={`Project Photo ${i + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />

                {/* Top controls: WebP badge & Delete */}
                <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10">
                  <Badge className="bg-emerald-600/90 text-white font-mono text-[9px] px-1.5 py-0 border-0 shadow-xs">
                    WebP
                  </Badge>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full bg-black/60 hover:bg-rose-600 text-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(i)
                    }}
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Middle: Kind selector chips */}
                <div className="absolute inset-x-2 top-9 flex gap-1 z-10 flex-wrap">
                  {(["before", "after", "gallery"] as const).map((k) => (
                    <button
                      type="button"
                      key={k}
                      onClick={(e) => {
                        e.stopPropagation()
                        setKind(i, k)
                      }}
                      className={cn(
                        "text-[9px] uppercase font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer border",
                        img.kind === k
                          ? k === "before"
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-xs font-extrabold"
                            : k === "after"
                              ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs font-extrabold"
                              : "bg-blue-500 text-white border-blue-400 font-extrabold"
                          : "bg-black/60 text-slate-300 border-white/10 hover:bg-black/80 hover:text-white"
                      )}
                      title={`Mark as ${k}`}
                    >
                      {k === "before" && "Before"}
                      {k === "after" && "After"}
                      {k === "gallery" && "Gallery"}
                    </button>
                  ))}
                </div>

                {/* Bottom reorder buttons */}
                <div className="absolute bottom-2 inset-x-2 flex justify-between items-center z-10">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 bg-black/60 hover:bg-slate-800 text-white cursor-pointer disabled:opacity-20"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveLeft(i)
                    }}
                    disabled={i === 0}
                    title="Move left"
                  >
                    ←
                  </Button>
                  <span className="text-[10px] font-mono text-slate-300 font-bold">
                    #{i + 1}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 bg-black/60 hover:bg-slate-800 text-white cursor-pointer disabled:opacity-20"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveRight(i)
                    }}
                    disabled={i === images.length - 1}
                    title="Move right"
                  >
                    →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual before/after slider readiness indicator */}
      {images.some((i) => i.kind === "before") && images.some((i) => i.kind === "after") && (
        <div className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>Interactive Before/After slider is active for this project card!</span>
        </div>
      )}
    </div>
  )
}

