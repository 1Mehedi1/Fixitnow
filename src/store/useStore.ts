import { create } from "zustand"
import type { Post } from "@prisma/client"

import type { SiteSettingsT } from "@/lib/site"
import { DEFAULT_HERO_IMAGES } from "@/lib/site"

export type View = "home" | "portfolio" | "blog" | "beforeAfter" | "about" | "admin"
export type AdminTab = "dashboard" | "posts" | "heroPhotos" | "testimonials" | "analytics" | "settings"

interface AppState {
  view: View
  selectedPost: Post | null
  detailOpen: boolean
  adminTab: AdminTab
  editingPostId: string | null // null = list view, "new" = create, id = edit
  editorOpen: boolean
  customPosts: any[] | null
  customTestimonials: any[] | null
  customSettings: SiteSettingsT | null
  customHeroPhotos: string[] | null

  setView: (v: View) => void
  openPost: (p: Post) => void
  closePost: () => void
  setAdminTab: (t: AdminTab) => void
  openEditor: (id: string | null) => void
  closeEditor: () => void
  setCustomPosts: (posts: any[]) => void
  upsertCustomPost: (post: any) => void
  deleteCustomPost: (id: string) => void
  setCustomTestimonials: (testimonials: any[]) => void
  upsertCustomTestimonial: (testimonial: any) => void
  deleteCustomTestimonial: (id: string) => void
  setCustomSettings: (settings: SiteSettingsT) => void
  setCustomHeroPhotos: (photos: string[]) => void
  updateHeroPhoto: (index: number, url: string) => void
}

export const useStore = create<AppState>((set) => ({
  view: "home",
  selectedPost: null,
  detailOpen: false,
  adminTab: "dashboard",
  editingPostId: null,
  editorOpen: false,
  customPosts: null,
  customTestimonials: null,
  customSettings: null,
  customHeroPhotos: null,

  setView: (v) => set({ view: v }),
  openPost: (p) => set({ selectedPost: p, detailOpen: true }),
  closePost: () => set({ detailOpen: false, selectedPost: null }),
  setAdminTab: (t) => set({ adminTab: t }),
  openEditor: (id) => set({ editingPostId: id, editorOpen: true }),
  closeEditor: () => set({ editorOpen: false, editingPostId: null }),
  setCustomPosts: (posts) => set({ customPosts: posts }),
  upsertCustomPost: (post) =>
    set((state) => {
      let current = state.customPosts
      if (!current) {
        try {
          const stored = localStorage.getItem("fixitnow_client_posts")
          if (stored) {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed) && parsed.length > 0) current = parsed
          }
        } catch {}
      }
      current = current || []
      const idx = current.findIndex((p) => p.id === post.id)
      let next: any[]
      if (idx >= 0) {
        next = [...current]
        next[idx] = { ...next[idx], ...post }
      } else {
        next = [post, ...current]
      }
      try {
        localStorage.setItem("fixitnow_client_posts", JSON.stringify(next))
      } catch (err) {
        console.warn("localStorage quota exceeded or unavailable:", err)
      }
      return { customPosts: next }
    }),
  deleteCustomPost: (id) =>
    set((state) => {
      let current = state.customPosts
      if (!current) {
        try {
          const stored = localStorage.getItem("fixitnow_client_posts")
          if (stored) {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed) && parsed.length > 0) current = parsed
          }
        } catch {}
      }
      current = current || []
      const next = current.filter((p) => p.id !== id)
      try {
        localStorage.setItem("fixitnow_client_posts", JSON.stringify(next))
      } catch (err) {
        console.warn("localStorage quota exceeded or unavailable:", err)
      }
      return { customPosts: next }
    }),
  setCustomTestimonials: (testimonials) => set({ customTestimonials: testimonials }),
  upsertCustomTestimonial: (item) =>
    set((state) => {
      const current = state.customTestimonials || []
      const idx = current.findIndex((t) => t.id === item.id)
      let next: any[]
      if (idx >= 0) {
        next = [...current]
        next[idx] = { ...next[idx], ...item }
      } else {
        next = [item, ...current]
      }
      try {
        localStorage.setItem("fixitnow_client_testimonials", JSON.stringify(next))
      } catch {}
      return { customTestimonials: next }
    }),
  deleteCustomTestimonial: (id) =>
    set((state) => {
      const current = state.customTestimonials || []
      const next = current.filter((t) => t.id !== id)
      try {
        localStorage.setItem("fixitnow_client_testimonials", JSON.stringify(next))
      } catch {}
      return { customTestimonials: next }
    }),
  setCustomSettings: (settings) => {
    try {
      // Actively remove old client settings from localStorage so browser always relies on live cloud state
      localStorage.removeItem("fixitnow_client_settings")
    } catch {}
    set({ customSettings: settings })
  },
  setCustomHeroPhotos: (photos) => {
    set((state) => {
      const nextSettings = state.customSettings
        ? { ...state.customSettings, heroImages: photos }
        : null
      return { customHeroPhotos: photos, customSettings: nextSettings || state.customSettings }
    })
  },
  updateHeroPhoto: (index, url) => {
    set((state) => {
      const current = state.customHeroPhotos || [...DEFAULT_HERO_IMAGES]
      const next = [...current]
      next[index] = url
      const nextSettings = state.customSettings
        ? { ...state.customSettings, heroImages: next }
        : null
      return { customHeroPhotos: next, customSettings: nextSettings || state.customSettings }
    })
  },
}))
