"use client"

import { useCallback, useState } from "react"
import imageCompression from "browser-image-compression"
import { Upload, X, Loader2, ImageIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
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

const MAX_SIZE_MB = 1.5 // after compression
const MAX_DIMENSION = 1920

export function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (list.length === 0) return

    setUploading(true)
    try {
      for (const file of list) {
        // Compress client-side
        const compressed = await imageCompression(file, {
          maxSizeMB: MAX_SIZE_MB,
          maxWidthOrHeight: MAX_DIMENSION,
          useWebWorker: true,
          fileType: file.type === "image/png" ? "image/webp" : undefined,
        })

        // Upload to server
        const form = new FormData()
        const filename = file.name.replace(/\.[^.]+$/, "") + (compressed.type === "image/webp" ? ".webp" : "")
        form.append("file", compressed, filename)

        const res = await fetch("/api/upload", { method: "POST", body: form })
        if (!res.ok) throw new Error("Upload failed")
        const { url } = await res.json()
        images = [...images, { url, kind: "gallery" as const }]
        onChange(images)
      }
      toast.success(`Uploaded ${list.length} image${list.length > 1 ? "s" : ""}`)
    } catch (e: any) {
      toast.error("Upload failed", { description: e.message })
    } finally {
      setUploading(false)
    }
  }, [images, onChange])

  const setKind = (i: number, kind: UploadedImage["kind"]) => {
    // Enforce single before / single after
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
    <div className="space-y-3">
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
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
        )}
        onClick={() => document.getElementById("img-input")?.click()}
      >
        <input
          id="img-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-primary" />
          )}
          <p className="text-sm font-medium">
            {uploading ? "Compressing & uploading…" : "Drop images here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground">
            Auto-compressed to {MAX_SIZE_MB}MB / {MAX_DIMENSION}px · converted to WebP where possible
          </p>
        </div>
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <img src={img.url} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-100">
                <div className="absolute top-1 right-1 flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 bg-black/40 hover:bg-black/60 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(i)
                    }}
                    title="Remove"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="absolute bottom-1 left-1 right-1 flex justify-between">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 bg-black/40 hover:bg-black/60 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveLeft(i)
                    }}
                    disabled={i === 0}
                  >
                    ←
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 bg-black/40 hover:bg-black/60 text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveRight(i)
                    }}
                    disabled={i === images.length - 1}
                  >
                    →
                  </Button>
                </div>
              </div>
              {/* Kind selector */}
              <div className="absolute top-1 left-1 flex gap-1">
                {(["gallery", "before", "after"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={(e) => {
                      e.stopPropagation()
                      setKind(i, k)
                    }}
                    className={cn(
                      "text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded backdrop-blur",
                      img.kind === k
                        ? k === "before"
                          ? "bg-red-500 text-white"
                          : k === "after"
                            ? "bg-green-500 text-white"
                            : "bg-primary text-primary-foreground"
                        : "bg-black/40 text-white hover:bg-black/60"
                    )}
                    title={`Mark as ${k}`}
                  >
                    {k === "gallery" ? <ImageIcon className="h-3 w-3" /> : k[0].toUpperCase()}
                    {img.kind === k && <Check className="h-3 w-3 ml-0.5 inline" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.some((i) => i.kind === "before") && images.some((i) => i.kind === "after") && (
        <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md px-3 py-2 flex items-center gap-1.5">
          <Check className="h-3 w-3" /> Before/After slider will be enabled on this post
        </div>
      )}
    </div>
  )
}
