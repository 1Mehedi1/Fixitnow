"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  Loader2,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Layers,
  Building2,
  Phone,
  Star,
  RefreshCw,
  Eye,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { AnalyticsDashboard } from "./AnalyticsDashboard"
import { AdminLogin } from "./AdminLogin"
import { defaultSiteConfig, type SiteSettingsT, type ServiceItem } from "@/lib/site"
import type { Post, PostImage, Testimonial } from "@prisma/client"

type TabType = "analytics" | "content" | "hero" | "posts" | "reviews" | "services"

export function ModernAdminPanel() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<TabType>("analytics")

  // State loaded from server
  const [settings, setSettings] = useState<SiteSettingsT>(defaultSiteConfig)
  const [posts, setPosts] = useState<(Post & { images: PostImage[] })[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  const [loadingData, setLoadingData] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [convertingUrl, setConvertingUrl] = useState<string | null>(null)

  // Post Editor Modal State
  const [editingPost, setEditingPost] = useState<any | null>(null)
  const [savingPost, setSavingPost] = useState(false)

  // Testimonial Editor State
  const [editingReview, setEditingReview] = useState<any | null>(null)
  const [savingReview, setSavingReview] = useState(false)

  // Initial Load from authoritative server APIs
  useEffect(() => {
    if (!session) return

    const loadAll = async () => {
      setLoadingData(true)
      const t = Date.now()
      const opts: RequestInit = { cache: "no-store", headers: { "Cache-Control": "no-cache" } }

      try {
        const [settingsRes, postsRes, testRes] = await Promise.all([
          fetch(`/api/settings?_t=${t}`, opts).then((r) => r.json()).catch(() => ({})),
          fetch(`/api/posts?limit=100&includeDrafts=true&_t=${t}`, opts).then((r) => r.json()).catch(() => ({})),
          fetch(`/api/testimonials?all=1&_t=${t}`, opts).then((r) => r.json()).catch(() => ({})),
        ])

        if (settingsRes.settings) setSettings(settingsRes.settings)
        if (Array.isArray(postsRes.posts)) setPosts(postsRes.posts)
        if (Array.isArray(testRes.testimonials)) setTestimonials(testRes.testimonials)
      } catch (err) {
        console.error("Failed to load admin data:", err)
      } finally {
        setLoadingData(false)
      }
    }

    loadAll()
  }, [session])

  // Helper: Convert any external image URL to permanent WebP in Vercel Blob
  const processImageToWebp = async (rawUrl: string): Promise<string | null> => {
    if (!rawUrl || !rawUrl.trim()) {
      toast.error("Please enter a valid image URL first.")
      return null
    }

    setConvertingUrl(rawUrl)
    const tId = toast.loading("Downloading, converting to WebP & saving permanently to cloud...")

    try {
      const res = await fetch("/api/process-image-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok || !data.url) {
        throw new Error(data.error || "WebP conversion failed")
      }

      const sizeInfo = data.optimizedSize
        ? ` (${Math.round(data.optimizedSize / 1024)} KB WebP)`
        : ""
      toast.success(`Image converted to WebP successfully!${sizeInfo}`, { id: tId })
      return data.url
    } catch (err: any) {
      toast.error("Image processing error", { description: err.message, id: tId })
      return null
    } finally {
      setConvertingUrl(null)
    }
  }

  // Save Settings Handler
  const handleSaveSettings = async () => {
    setSavingSettings(true)
    const tId = toast.loading("Saving site settings to cloud...")

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save settings")

      if (data.settings) setSettings(data.settings)
      toast.success("Site settings saved! Live across all devices.", { id: tId })
    } catch (err: any) {
      toast.error("Save failed", { description: err.message, id: tId })
    } finally {
      setSavingSettings(false)
    }
  }

  // Save Hero Photos
  const handleSaveHeroPhotos = async (newPhotos: string[]) => {
    const tId = toast.loading("Saving hero photos to cloud...")
    try {
      const res = await fetch("/api/hero-photos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroImages: newPhotos }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save hero photos")

      if (Array.isArray(data.heroImages)) {
        setSettings((prev) => ({ ...prev, heroImages: data.heroImages }))
      }
      toast.success("Hero showcase photos saved! Live across all devices.", { id: tId })
    } catch (err: any) {
      toast.error("Hero save failed", { description: err.message, id: tId })
    }
  }

  // Save or Create Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost?.title?.trim()) {
      toast.error("Please enter a project title.")
      return
    }

    setSavingPost(true)
    const isNew = !editingPost.id || editingPost.id === "new"
    const tId = toast.loading(isNew ? "Creating new post..." : "Updating post...")

    try {
      const url = isNew ? "/api/posts" : `/api/posts/${editingPost.id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPost),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save post")

      // Refresh post list from server
      const fresh = await fetch(`/api/posts?limit=100&includeDrafts=true&_t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json())
      if (Array.isArray(fresh.posts)) setPosts(fresh.posts)

      setEditingPost(null)
      toast.success(isNew ? "Post created successfully!" : "Post updated successfully!", { id: tId })
    } catch (err: any) {
      toast.error("Failed to save post", { description: err.message, id: tId })
    } finally {
      setSavingPost(false)
    }
  }

  // Delete Post
  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    const tId = toast.loading("Deleting post...")

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")

      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success("Post deleted successfully", { id: tId })
    } catch (err: any) {
      toast.error("Delete failed", { description: err.message, id: tId })
    }
  }

  // Save Review / Testimonial
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingReview?.name?.trim() || !editingReview?.content?.trim()) {
      toast.error("Please enter client name and review content.")
      return
    }

    setSavingReview(true)
    const isNew = !editingReview.id || editingReview.id === "new"
    const tId = toast.loading(isNew ? "Creating testimonial..." : "Updating testimonial...")

    try {
      const url = isNew ? "/api/testimonials" : `/api/testimonials/${editingReview.id}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReview),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save testimonial")

      // Refresh list
      const fresh = await fetch(`/api/testimonials?all=1&_t=${Date.now()}`, { cache: "no-store" }).then((r) => r.json())
      if (Array.isArray(fresh.testimonials)) setTestimonials(fresh.testimonials)

      setEditingReview(null)
      toast.success("Testimonial saved successfully!", { id: tId })
    } catch (err: any) {
      toast.error("Failed to save testimonial", { description: err.message, id: tId })
    } finally {
      setSavingReview(false)
    }
  }

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    const tId = toast.loading("Deleting testimonial...")

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")

      setTestimonials((prev) => prev.filter((t) => t.id !== id))
      toast.success("Testimonial deleted successfully", { id: tId })
    } catch (err: any) {
      toast.error("Delete failed", { description: err.message, id: tId })
    }
  }

  // Authentication check
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  if (!session) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 md:min-h-screen flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-6 px-2 flex items-center justify-between">
            <div>
              <div className="font-display font-black text-lg tracking-tight text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Admin Portal
              </div>
              <div className="text-xs text-slate-400">4R Engineering Pte. Ltd.</div>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="Open Public Website"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              <span>Analytics & Traffic</span>
            </button>

            <button
              onClick={() => setActiveTab("content")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "content"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>Site Text & Content</span>
            </button>

            <button
              onClick={() => setActiveTab("hero")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "hero"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <ImageIcon className="h-4 w-4 shrink-0" />
              <span>Hero Photos (4 Images)</span>
            </button>

            <button
              onClick={() => setActiveTab("posts")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "posts"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>Portfolio & Before/After</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-slate-800/60 border-slate-700 text-slate-300">
                {posts.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "reviews"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span>Reviews & WhatsApp Proof</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-slate-800/60 border-slate-700 text-slate-300">
                {testimonials.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "services"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <DollarSign className="h-4 w-4 shrink-0" />
              <span>Services & Rates</span>
            </button>
          </nav>
        </div>

        {/* Footer with sign out */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="px-2 py-1 text-xs text-slate-400 truncate">
            Logged in as <strong className="text-white">{session.user?.email}</strong>
          </div>
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-start text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 gap-2 text-xs"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Tab Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto overflow-y-auto">
        {loadingData ? (
          <div className="py-24 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading synchronized data from cloud storage...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: ANALYTICS (Kept exact working code) */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <AnalyticsDashboard />
              </div>
            )}

            {/* TAB 2: SITE TEXT & CONTENT */}
            {activeTab === "content" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white">Site Text & Company Settings</h2>
                    <p className="text-sm text-slate-400">
                      Changes saved here immediately update the website across all devices.
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="bg-emerald-600 hover:bg-emerald-500 font-bold gap-2 text-white shadow-md shadow-emerald-900/30"
                  >
                    {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>Save All Changes</span>
                  </Button>
                </div>

                <div className="grid gap-6">
                  {/* General Info */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-base text-white">Brand & Contact Numbers</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Primary contact displayed on headers, WhatsApp buttons, and footers.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Brand Name</Label>
                        <Input
                          value={settings.brand}
                          onChange={(e) => setSettings({ ...settings, brand: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Tagline</Label>
                        <Input
                          value={settings.tagline}
                          onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Direct Phone (e.g. +65 8928 2459)</Label>
                        <Input
                          value={settings.phone}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">WhatsApp Number (e.g. 6589282459)</Label>
                        <Input
                          value={settings.whatsapp}
                          onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Lead Worker Name</Label>
                        <Input
                          value={settings.workerName}
                          onChange={(e) => setSettings({ ...settings, workerName: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Location Tag</Label>
                        <Input
                          value={settings.location}
                          onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hero Headlines */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-base text-white">Hero Section Copy</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Headlines appearing at the top of the homepage.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Main Hero Headline</Label>
                        <Input
                          value={settings.heroHeadline}
                          onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Hero Subtext Description</Label>
                        <Textarea
                          rows={3}
                          value={settings.heroSubtext}
                          onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Counters */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-base text-white">Proof & Trust Metrics</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Numerical proof stats displayed across the site.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Years Experience</Label>
                        <Input
                          type="number"
                          value={settings.yearsExperience}
                          onChange={(e) => setSettings({ ...settings, yearsExperience: parseInt(e.target.value) || 0 })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Jobs Completed</Label>
                        <Input
                          type="number"
                          value={settings.jobsCompleted}
                          onChange={(e) => setSettings({ ...settings, jobsCompleted: parseInt(e.target.value) || 0 })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Happy Clients</Label>
                        <Input
                          type="number"
                          value={settings.happyClients}
                          onChange={(e) => setSettings({ ...settings, happyClients: parseInt(e.target.value) || 0 })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Rating (out of 5)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={settings.rating}
                          onChange={(e) => setSettings({ ...settings, rating: parseFloat(e.target.value) || 5.0 })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company ACRA */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-base text-white">Legal ACRA Registration</CardTitle>
                      <CardDescription className="text-xs text-slate-400">Singapore corporate registration details for schema and trust proof.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Registered Entity Name</Label>
                        <Input
                          value={settings.companyName}
                          onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">ACRA UEN Number</Label>
                        <Input
                          value={settings.companyUen}
                          onChange={(e) => setSettings({ ...settings, companyUen: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label className="text-xs text-slate-300">Workforce & License Info</Label>
                        <Input
                          value={settings.licenseInfo}
                          onChange={(e) => setSettings({ ...settings, licenseInfo: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* About Us Body */}
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-base text-white">About Us Section Copy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">About Headline</Label>
                        <Input
                          value={settings.aboutTitle}
                          onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">About Story & Body</Label>
                        <Textarea
                          rows={4}
                          value={settings.aboutBody}
                          onChange={(e) => setSettings({ ...settings, aboutBody: e.target.value })}
                          className="bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB 3: HERO PHOTOS (4 Images) */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-white">Hero Showcase Photos (4 Images)</h2>
                  <p className="text-sm text-slate-400">
                    Paste any image URL (Google Drive, Postimages, Imgur, etc.) and click <strong>"Convert to WebP & Store"</strong>. The system will optimize it, store it permanently in Vercel Blob, and update the hero showcase.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {[0, 1, 2, 3].map((idx) => {
                    const currentImg = settings.heroImages?.[idx] || ""

                    return (
                      <Card key={idx} className="bg-slate-900 border-slate-800 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">
                            Hero Photo #{idx + 1}
                          </span>
                          {currentImg?.endsWith(".webp") && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                              WebP Optimized
                            </Badge>
                          )}
                        </div>

                        {/* Image Preview */}
                        <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                          {currentImg ? (
                            <img
                              src={currentImg}
                              alt={`Hero preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <ImageIcon className="h-5 w-5" /> No image configured
                            </div>
                          )}
                        </div>

                        {/* URL input and convert button */}
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-300">Direct Image URL</Label>
                          <div className="flex gap-2">
                            <Input
                              value={currentImg}
                              onChange={(e) => {
                                const next = [...(settings.heroImages || [])]
                                next[idx] = e.target.value
                                setSettings({ ...settings, heroImages: next })
                              }}
                              placeholder="https://..."
                              className="bg-slate-950 border-slate-700 text-xs text-white"
                            />
                            <Button
                              type="button"
                              onClick={async () => {
                                const webpUrl = await processImageToWebp(currentImg)
                                if (webpUrl) {
                                  const next = [...(settings.heroImages || [])]
                                  next[idx] = webpUrl
                                  setSettings({ ...settings, heroImages: next })
                                  await handleSaveHeroPhotos(next)
                                }
                              }}
                              disabled={convertingUrl === currentImg}
                              className="bg-primary hover:bg-primary/90 text-xs shrink-0 font-bold"
                            >
                              {convertingUrl === currentImg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Convert & Save"}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: PORTFOLIO & POSTS */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white">Portfolio & Before/After Posts</h2>
                    <p className="text-sm text-slate-400">
                      Manage case studies, before/after comparisons, and trade project stories.
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      setEditingPost({
                        id: "new",
                        title: "",
                        slug: "",
                        category: "Electrical",
                        excerpt: "",
                        content: "",
                        type: "portfolio",
                        published: true,
                        featured: false,
                        coverImage: "",
                        images: [
                          { url: "", kind: "before", position: 0 },
                          { url: "", kind: "after", position: 1 },
                        ],
                      })
                    }
                    className="bg-primary hover:bg-primary/90 font-bold gap-2 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New Post</span>
                  </Button>
                </div>

                {/* Posts Table / Grid */}
                <div className="grid gap-4">
                  {posts.map((post) => {
                    const before = post.images?.find((x) => x.kind === "before")?.url
                    const after = post.images?.find((x) => x.kind === "after")?.url
                    const cover = post.coverImage || after || before || post.images?.[0]?.url

                    return (
                      <Card key={post.id} className="bg-slate-900 border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 rounded-xl bg-slate-950 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
                            {cover ? (
                              <img src={cover} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white text-sm sm:text-base leading-snug">{post.title}</h3>
                              {post.featured && <Badge className="bg-amber-500/20 text-amber-300 text-[10px]">Featured</Badge>}
                              {!post.published && <Badge variant="destructive" className="text-[10px]">Draft</Badge>}
                            </div>
                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                              <span>Category: {post.category || "General"}</span>
                              <span>·</span>
                              <span>Slug: /{post.slug}</span>
                              {before && after && (
                                <>
                                  <span>·</span>
                                  <span className="text-emerald-400 font-semibold">Has Before/After</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <Link
                            href={`/work/${post.slug || post.id}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs"
                            title="View Live Page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPost({ ...post })}
                            className="border-slate-700 bg-slate-800 text-white text-xs hover:bg-slate-700"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: REVIEWS & WHATSAPP PROOF */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white">Customer Reviews & WhatsApp Chat Proofs</h2>
                    <p className="text-sm text-slate-400">
                      Manage verified homeowner testimonials and attach screenshot proofs.
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      setEditingReview({
                        id: "new",
                        name: "",
                        role: "HDB Homeowner",
                        rating: 5,
                        content: "",
                        avatar: "",
                        published: true,
                      })
                    }
                    className="bg-primary hover:bg-primary/90 font-bold gap-2 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Review</span>
                  </Button>
                </div>

                <div className="grid gap-4">
                  {testimonials.map((t) => (
                    <Card key={t.id} className="bg-slate-900 border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {t.avatar ? (
                          <div className="h-16 w-16 rounded-xl bg-slate-950 border border-slate-800 shrink-0 overflow-hidden">
                            <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-slate-800 text-primary font-bold flex items-center justify-center shrink-0">
                            {t.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm">{t.name}</h3>
                            <span className="text-xs text-slate-400">({t.role || "Singapore Resident"})</span>
                            <div className="flex items-center text-amber-400 text-xs ml-1">
                              {[...Array(t.rating || 5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 line-clamp-2 italic">
                            "{t.content}"
                          </p>
                          {t.avatar && (
                            <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                              ✓ WhatsApp Screenshot Attached
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingReview({ ...t })}
                          className="border-slate-700 bg-slate-800 text-white text-xs hover:bg-slate-700"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteReview(t.id)}
                          className="text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: SERVICES & RATES */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white">Services & Pricing Rate Cards</h2>
                    <p className="text-sm text-slate-400">
                      Configure trade categories, starting prices, and sub-services.
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="bg-emerald-600 hover:bg-emerald-500 font-bold gap-2 text-white"
                  >
                    {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>Save Service Settings</span>
                  </Button>
                </div>

                <div className="grid gap-6">
                  {settings.services?.map((svc, sIdx) => (
                    <Card key={svc.key} className="bg-slate-900 border-slate-800 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                          <Layers className="h-4 w-4 text-primary" />
                          {svc.label}
                        </h3>
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                          Key: {svc.key}
                        </Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-300">Display Label</Label>
                          <Input
                            value={svc.label}
                            onChange={(e) => {
                              const next = [...settings.services]
                              next[sIdx].label = e.target.value
                              setSettings({ ...settings, services: next })
                            }}
                            className="bg-slate-950 border-slate-700 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-300">Description</Label>
                          <Input
                            value={svc.desc}
                            onChange={(e) => {
                              const next = [...settings.services]
                              next[sIdx].desc = e.target.value
                              setSettings({ ...settings, services: next })
                            }}
                            className="bg-slate-950 border-slate-700 text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Rates Line Items */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <Label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                          Rate Card Items
                        </Label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {svc.rates?.map((r, rIdx) => (
                            <div key={rIdx} className="flex gap-2">
                              <Input
                                value={r.name}
                                onChange={(e) => {
                                  const next = [...settings.services]
                                  if (next[sIdx]?.rates?.[rIdx]) {
                                    next[sIdx].rates![rIdx].name = e.target.value
                                    setSettings({ ...settings, services: next })
                                  }
                                }}
                                placeholder="Service item"
                                className="bg-slate-950 border-slate-700 text-xs text-white"
                              />
                              <Input
                                value={r.price}
                                onChange={(e) => {
                                  const next = [...settings.services]
                                  if (next[sIdx]?.rates?.[rIdx]) {
                                    next[sIdx].rates![rIdx].price = e.target.value
                                    setSettings({ ...settings, services: next })
                                  }
                                }}
                                placeholder="$80 - $120"
                                className="bg-slate-950 border-slate-700 text-xs text-white w-28 shrink-0 font-bold text-emerald-400"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL: POST EDITOR */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <Card className="bg-slate-900 border-slate-800 text-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
              <CardTitle className="text-lg">
                {editingPost.id === "new" ? "Create New Portfolio Post" : "Edit Post"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingPost(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <form onSubmit={handleSavePost}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Project Title *</Label>
                  <Input
                    required
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder="e.g. Full HDB Rewiring & DB Box Replacement in Tampines"
                    className="bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Category</Label>
                    <Input
                      value={editingPost.category || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      placeholder="Electrical / Waterproofing / Painting"
                      className="bg-slate-950 border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Custom URL Slug (optional)</Label>
                    <Input
                      value={editingPost.slug || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                      placeholder="e.g. hdb-rewiring-tampines"
                      className="bg-slate-950 border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Short Summary / Excerpt</Label>
                  <Textarea
                    rows={2}
                    value={editingPost.excerpt || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white text-xs"
                  />
                </div>

                {/* Before Image URL */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <Label className="text-xs text-slate-300 font-bold text-amber-400">
                    Before Image URL (Paste URL & click convert)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={editingPost.images?.find((x: any) => x.kind === "before")?.url || ""}
                      onChange={(e) => {
                        const val = e.target.value
                        const images = [...(editingPost.images || [])]
                        const idx = images.findIndex((x) => x.kind === "before")
                        if (idx >= 0) images[idx].url = val
                        else images.push({ url: val, kind: "before", position: 0 })
                        setEditingPost({ ...editingPost, images })
                      }}
                      placeholder="https://..."
                      className="bg-slate-900 border-slate-700 text-xs text-white"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={async () => {
                        const current = editingPost.images?.find((x: any) => x.kind === "before")?.url
                        if (!current) return
                        const webp = await processImageToWebp(current)
                        if (webp) {
                          const images = [...(editingPost.images || [])]
                          const idx = images.findIndex((x) => x.kind === "before")
                          if (idx >= 0) images[idx].url = webp
                          setEditingPost({ ...editingPost, images })
                        }
                      }}
                      className="text-xs shrink-0 bg-primary font-bold"
                    >
                      Convert to WebP
                    </Button>
                  </div>
                </div>

                {/* After Image URL */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <Label className="text-xs text-slate-300 font-bold text-emerald-400">
                    After Image URL (Paste URL & click convert)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={editingPost.images?.find((x: any) => x.kind === "after")?.url || ""}
                      onChange={(e) => {
                        const val = e.target.value
                        const images = [...(editingPost.images || [])]
                        const idx = images.findIndex((x) => x.kind === "after")
                        if (idx >= 0) images[idx].url = val
                        else images.push({ url: val, kind: "after", position: 1 })
                        setEditingPost({ ...editingPost, images, coverImage: val })
                      }}
                      placeholder="https://..."
                      className="bg-slate-900 border-slate-700 text-xs text-white"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={async () => {
                        const current = editingPost.images?.find((x: any) => x.kind === "after")?.url
                        if (!current) return
                        const webp = await processImageToWebp(current)
                        if (webp) {
                          const images = [...(editingPost.images || [])]
                          const idx = images.findIndex((x) => x.kind === "after")
                          if (idx >= 0) images[idx].url = webp
                          setEditingPost({ ...editingPost, images, coverImage: webp })
                        }
                      }}
                      className="text-xs shrink-0 bg-primary font-bold"
                    >
                      Convert to WebP
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Detailed Description / Work Notes (Markdown)</Label>
                  <Textarea
                    rows={4}
                    value={editingPost.content || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="bg-slate-950 border-slate-700 text-white text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPost.published !== false}
                      onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                      className="rounded accent-primary"
                    />
                    <span>Publish live on website</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingPost.featured)}
                      onChange={(e) => setEditingPost({ ...editingPost, featured: e.target.checked })}
                      className="rounded accent-primary"
                    />
                    <span>Feature on homepage</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingPost(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={savingPost}
                    className="bg-primary hover:bg-primary/90 font-bold"
                  >
                    {savingPost && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                    Save Post
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL: TESTIMONIAL EDITOR */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <Card className="bg-slate-900 border-slate-800 text-white w-full max-w-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
              <CardTitle className="text-lg">
                {editingReview.id === "new" ? "Add Homeowner Review" : "Edit Review"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingReview(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <form onSubmit={handleSaveReview}>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Client Name *</Label>
                    <Input
                      required
                      value={editingReview.name}
                      onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                      placeholder="e.g. Mr. Tan K. H."
                      className="bg-slate-950 border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Role / Estate</Label>
                    <Input
                      value={editingReview.role || ""}
                      onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                      placeholder="e.g. HDB Owner, Tampines"
                      className="bg-slate-950 border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Star Rating (1 - 5)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={editingReview.rating || 5}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) || 5 })}
                    className="bg-slate-950 border-slate-700 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Review Feedback Text *</Label>
                  <Textarea
                    required
                    rows={3}
                    value={editingReview.content}
                    onChange={(e) => setEditingReview({ ...editingReview, content: e.target.value })}
                    placeholder="Feedback from the homeowner..."
                    className="bg-slate-950 border-slate-700 text-white text-xs"
                  />
                </div>

                {/* WhatsApp Chat Screenshot Proof URL */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <Label className="text-xs text-slate-300 font-bold text-emerald-400">
                    WhatsApp Chat Screenshot Proof URL (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={editingReview.avatar || ""}
                      onChange={(e) => setEditingReview({ ...editingReview, avatar: e.target.value })}
                      placeholder="https://..."
                      className="bg-slate-900 border-slate-700 text-xs text-white"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={async () => {
                        if (!editingReview.avatar) return
                        const webp = await processImageToWebp(editingReview.avatar)
                        if (webp) setEditingReview({ ...editingReview, avatar: webp })
                      }}
                      className="text-xs shrink-0 bg-primary font-bold"
                    >
                      Convert to WebP
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingReview(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={savingReview}
                    className="bg-primary hover:bg-primary/90 font-bold"
                  >
                    {savingReview && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                    Save Review
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
