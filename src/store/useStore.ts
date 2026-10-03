import { create } from "zustand"
import type { Post } from "@prisma/client"

export type View = "home" | "portfolio" | "blog" | "beforeAfter" | "about" | "admin"
export type AdminTab = "dashboard" | "posts" | "testimonials" | "analytics" | "settings"

interface AppState {
  view: View
  selectedPost: Post | null
  detailOpen: boolean
  adminTab: AdminTab
  editingPostId: string | null // null = list view, "new" = create, id = edit
  editorOpen: boolean
  customPosts: any[] | null

  setView: (v: View) => void
  openPost: (p: Post) => void
  closePost: () => void
  setAdminTab: (t: AdminTab) => void
  openEditor: (id: string | null) => void
  closeEditor: () => void
  setCustomPosts: (posts: any[]) => void
  upsertCustomPost: (post: any) => void
  deleteCustomPost: (id: string) => void
}

export const useStore = create<AppState>((set) => ({
  view: "home",
  selectedPost: null,
  detailOpen: false,
  adminTab: "dashboard",
  editingPostId: null,
  editorOpen: false,
  customPosts: null,

  setView: (v) => set({ view: v }),
  openPost: (p) => set({ selectedPost: p, detailOpen: true }),
  closePost: () => set({ detailOpen: false, selectedPost: null }),
  setAdminTab: (t) => set({ adminTab: t }),
  openEditor: (id) => set({ editingPostId: id, editorOpen: true }),
  closeEditor: () => set({ editorOpen: false, editingPostId: null }),
  setCustomPosts: (posts) => set({ customPosts: posts }),
  upsertCustomPost: (post) =>
    set((state) => {
      const current = state.customPosts || []
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
      } catch {}
      return { customPosts: next }
    }),
  deleteCustomPost: (id) =>
    set((state) => {
      const current = state.customPosts || []
      const next = current.filter((p) => p.id !== id)
      try {
        localStorage.setItem("fixitnow_client_posts", JSON.stringify(next))
      } catch {}
      return { customPosts: next }
    }),
}))
