import { create } from "zustand"
import type { Post } from "@prisma/client"

export type View = "home" | "portfolio" | "blog" | "about" | "admin"
export type AdminTab = "dashboard" | "posts" | "testimonials" | "analytics"

interface AppState {
  view: View
  selectedPost: Post | null
  detailOpen: boolean
  adminTab: AdminTab
  editingPostId: string | null // null = list view, "new" = create, id = edit
  editorOpen: boolean

  setView: (v: View) => void
  openPost: (p: Post) => void
  closePost: () => void
  setAdminTab: (t: AdminTab) => void
  openEditor: (id: string | null) => void
  closeEditor: () => void
}

export const useStore = create<AppState>((set) => ({
  view: "home",
  selectedPost: null,
  detailOpen: false,
  adminTab: "dashboard",
  editingPostId: null,
  editorOpen: false,

  setView: (v) => set({ view: v }),
  openPost: (p) => set({ selectedPost: p, detailOpen: true }),
  closePost: () => set({ detailOpen: false, selectedPost: null }),
  setAdminTab: (t) => set({ adminTab: t }),
  openEditor: (id) => set({ editingPostId: id, editorOpen: true }),
  closeEditor: () => set({ editorOpen: false, editingPostId: null }),
}))
