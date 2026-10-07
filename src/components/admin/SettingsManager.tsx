"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Save, Loader2, Plus, Trash2, RotateCcw, Building2, Phone, Star,
  Sparkles, Image as ImageIcon, ShieldCheck, Upload, DollarSign,
  Type, MessageSquare, ArrowRight, Layers, Check, ExternalLink,
  ChevronRight, RefreshCw, Briefcase, Award, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  defaultSiteConfig,
  type ServiceItem,
  type RateItem,
  DEFAULT_SERVICE_IMAGES,
  DEFAULT_SERVICE_RATES,
  DEFAULT_TYPEWRITER_SENTENCES,
} from "@/lib/site"
import { useStore } from "@/store/useStore"

const ICON_OPTIONS = [
  "Home", "PaintRoller", "Wrench", "ShieldCheck", "Hammer", "Zap",
  "Sofa", "Settings", "Droplet", "Brush", "Layers", "Building",
  "Lightbulb", "DoorOpen", "ShowerHead",
]

function normalizeDriveUrl(url: string): string {
  if (!url) return url
  const trimmed = url.trim()
  const gdMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/)
  if (gdMatch && gdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gdMatch[1]}`
  }
  return trimmed
}

interface FormState {
  brand: string
  tagline: string
  workerName: string
  phone: string
  whatsapp: string
  email: string
  location: string
  yearsExperience: number
  jobsCompleted: number
  happyClients: number
  rating: number
  heroHeadline: string
  heroSubtext: string
  typewriterSentences: string[]
  aboutTitle: string
  aboutBody: string
  services: ServiceItem[]
  heroImages: string[]
  companyName: string
  companyUen: string
  licenseInfo: string
}

export type SettingsTab = "branding" | "categories" | "pricing" | "hero" | "acra"

interface TabConfig {
  id: SettingsTab
  label: string
  shortLabel: string
  icon: any
  badgeColor: string
  activeBg: string
  textColor: string
  description: string
}

const TABS: TabConfig[] = [
  {
    id: "branding",
    label: "General Info & Branding",
    shortLabel: "Branding",
    icon: Building2,
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    activeBg: "bg-blue-600 text-white shadow-blue-500/25",
    textColor: "text-blue-400",
    description: "Brand identity, direct contact numbers, worker name, and live trust metrics.",
  },
  {
    id: "categories",
    label: "Trade Categories & Subcategories",
    shortLabel: "Categories",
    icon: Layers,
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    activeBg: "bg-emerald-600 text-white shadow-emerald-500/25",
    textColor: "text-emerald-400",
    description: "Roofing, Painting, Plumbing, and custom trades with subcategory badges.",
  },
  {
    id: "pricing",
    label: "Singapore Rate Card (Pricing)",
    shortLabel: "Rate Card",
    icon: DollarSign,
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    activeBg: "bg-amber-600 text-white shadow-amber-500/25",
    textColor: "text-amber-400",
    description: "Itemized transparent price estimates powering the public guide and calculator.",
  },
  {
    id: "hero",
    label: "Hero & Typewriter Headlines",
    shortLabel: "Hero & Typewriter",
    icon: Sparkles,
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    activeBg: "bg-purple-600 text-white shadow-purple-500/25",
    textColor: "text-purple-400",
    description: "Animated typewriter sentences, main headline, and showcase photos.",
  },
  {
    id: "acra",
    label: "About & ACRA Credentials",
    shortLabel: "About & ACRA",
    icon: ShieldCheck,
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    activeBg: "bg-rose-600 text-white shadow-rose-500/25",
    textColor: "text-rose-400",
    description: "4R ENGINEERING PTE. LTD. ACRA UEN registration and MOM license details.",
  },
]

export function SettingsManager() {
  const { setCustomSettings, setAdminTab } = useStore()
  const [activeTab, setActiveTab] = useState<SettingsTab>("branding")

  const [form, setForm] = useState<FormState>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("fixitnow_client_settings")
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && typeof parsed === "object") {
            return {
              ...defaultSiteConfig,
              ...parsed,
              typewriterSentences: Array.isArray(parsed.typewriterSentences)
                ? parsed.typewriterSentences
                : [...(defaultSiteConfig.typewriterSentences || [])],
              services: Array.isArray(parsed.services)
                ? parsed.services
                : [...defaultSiteConfig.services],
              heroImages: Array.isArray(parsed.heroImages)
                ? parsed.heroImages
                : [...defaultSiteConfig.heroImages],
            }
          }
        }
      } catch {}
    }
    return {
      ...defaultSiteConfig,
      typewriterSentences: [...(defaultSiteConfig.typewriterSentences || [])],
      services: [...defaultSiteConfig.services],
      heroImages: [...defaultSiteConfig.heroImages],
    }
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [convertingServiceBg, setConvertingServiceBg] = useState<number | null>(null)
  const [newSubcatInputs, setNewSubcatInputs] = useState<Record<number, string>>({})

  useEffect(() => {
    fetch(`/api/settings?_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          let heroImgs = Array.isArray(d.heroImages) && d.heroImages.length > 0
            ? d.heroImages
            : [...defaultSiteConfig.heroImages]
          try {
            if (typeof d.settings.heroImagesJson === "string") {
              const parsed = JSON.parse(d.settings.heroImagesJson)
              if (Array.isArray(parsed) && parsed.length > 0) heroImgs = parsed
            }
          } catch {}
          heroImgs = heroImgs.map(normalizeDriveUrl)

          let loadedServices = Array.isArray(d.services) && d.services.length > 0
            ? d.services
            : [...defaultSiteConfig.services]
          loadedServices = loadedServices.map((svc: any) => ({
            ...svc,
            rates: Array.isArray(svc.rates) && svc.rates.length > 0
              ? svc.rates
              : (DEFAULT_SERVICE_RATES[svc.key] || []),
          }))

          let loadedSentences = Array.isArray(d.typewriterSentences) && d.typewriterSentences.length > 0
            ? d.typewriterSentences
            : (Array.isArray(d.settings?.typewriterSentences)
              ? d.settings.typewriterSentences
              : [...(defaultSiteConfig.typewriterSentences || [])])

          const loadedData: FormState = {
            brand: d.settings.brand || defaultSiteConfig.brand,
            tagline: d.settings.tagline || defaultSiteConfig.tagline,
            workerName: d.settings.workerName || defaultSiteConfig.workerName,
            phone: d.settings.phone || defaultSiteConfig.phone,
            whatsapp: d.settings.whatsapp || defaultSiteConfig.whatsapp,
            email: d.settings.email || defaultSiteConfig.email,
            location: d.settings.location || defaultSiteConfig.location,
            yearsExperience: d.settings.yearsExperience ?? defaultSiteConfig.yearsExperience,
            jobsCompleted: d.settings.jobsCompleted ?? defaultSiteConfig.jobsCompleted,
            happyClients: d.settings.happyClients ?? defaultSiteConfig.happyClients,
            rating: d.settings.rating ?? defaultSiteConfig.rating,
            heroHeadline: d.settings.heroHeadline || defaultSiteConfig.heroHeadline,
            heroSubtext: d.settings.heroSubtext || defaultSiteConfig.heroSubtext,
            typewriterSentences: loadedSentences,
            aboutTitle: d.settings.aboutTitle || defaultSiteConfig.aboutTitle,
            aboutBody: d.settings.aboutBody || defaultSiteConfig.aboutBody,
            services: loadedServices,
            heroImages: heroImgs,
            companyName: d.settings.companyName || defaultSiteConfig.companyName,
            companyUen: d.settings.companyUen || defaultSiteConfig.companyUen,
            licenseInfo: d.settings.licenseInfo || defaultSiteConfig.licenseInfo,
          }

          setForm(loadedData)
          setCustomSettings(loadedData as any)
        }
      })
      .finally(() => setLoading(false))
  }, [setCustomSettings])

  const handleConvertServiceBg = async (index: number) => {
    const rawUrl = form.services[index]?.bgImage?.trim()
    if (!rawUrl) {
      toast.error("Please enter a background image URL first")
      return
    }

    setConvertingServiceBg(index)
    const tId = toast.loading(`Converting background image for "${form.services[index]?.label}" to WebP...`)
    try {
      const res = await fetch("/api/process-image-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || "Processing failed")

      updateService(index, "bgImage", data.url)
      const sizeSaved = data.originalSize && data.optimizedSize
        ? ` (${Math.round(data.optimizedSize / 1024)} KB WebP)`
        : " (Optimized WebP)"
      toast.success(`Background image converted to WebP & saved!${sizeSaved}`, { id: tId })
    } catch (err: any) {
      toast.error("WebP conversion failed", { description: err.message, id: tId })
    } finally {
      setConvertingServiceBg(null)
    }
  }

  const save = async () => {
    setSaving(true)
    const tId = toast.loading("Checking & saving settings...")
    try {
      // Auto-convert any external non-WebP background images
      const updatedServices = [...form.services]
      for (let i = 0; i < updatedServices.length; i++) {
        const bg = updatedServices[i]?.bgImage?.trim()
        if (
          bg &&
          bg.startsWith("http") &&
          !bg.includes(".public.blob.vercel-storage.com") &&
          !bg.endsWith(".webp") &&
          !bg.includes("/uploads/")
        ) {
          try {
            const proc = await fetch("/api/process-image-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: bg }),
            }).then((r) => r.json())
            if (proc.ok && proc.url) {
              updatedServices[i] = { ...updatedServices[i], bgImage: proc.url }
            }
          } catch {}
        }
      }

      const payload: FormState = {
        ...form,
        services: updatedServices,
      }
      setForm(payload)
      setCustomSettings(payload as any)

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          servicesJson: payload.services,
          typewriterSentencesJson: payload.typewriterSentences,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Save failed")

      // Refresh settings from server to ensure 100% cloud sync
      fetch(`/api/settings?_t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      })
        .then((r) => r.json())
        .then((fresh) => {
          if (fresh.settings) {
            setCustomSettings(fresh.settings)
          }
        })
        .catch(() => {})

      toast.success("Settings saved! All changes are live across all devices.", { id: tId })
    } catch (e: any) {
      toast.error("Save failed", { description: e.message, id: tId })
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    if (!confirm("Reset all settings to defaults? Your custom values will be replaced with defaults.")) return
    const resetData: FormState = {
      ...defaultSiteConfig,
      typewriterSentences: [...(defaultSiteConfig.typewriterSentences || [])],
      services: [...defaultSiteConfig.services],
      heroImages: [...defaultSiteConfig.heroImages],
    }
    setForm(resetData)
    setCustomSettings(resetData as any)
    toast.info("Form reset to defaults. Click 'Save Changes' to apply.")
  }

  const handleServiceFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    const tId = toast.loading(`Uploading background for "${form.services[index]?.label || `Service ${index + 1}`}"...`)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.url) {
        updateService(index, "bgImage", data.url)
        toast.success(`Background image uploaded to permanent CDN!`, { id: tId })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (err: any) {
      toast.error("Upload failed", { description: err.message, id: tId })
    }
  }

  const addSubcategory = (sIdx: number) => {
    const rawVal = (newSubcatInputs[sIdx] || "").trim()
    if (!rawVal) return
    const next = [...form.services]
    const svc = { ...next[sIdx] }
    const currentSubcats = svc.subcategories && svc.subcategories.length > 0
      ? [...svc.subcategories]
      : (svc.rates || []).map((r) => r.name)
    if (!currentSubcats.includes(rawVal)) {
      currentSubcats.push(rawVal)
    }
    svc.subcategories = currentSubcats

    // Also add to rates
    const currentRates = [...(svc.rates || [])]
    if (!currentRates.some((r) => r.name.toLowerCase() === rawVal.toLowerCase())) {
      currentRates.push({
        name: rawVal,
        price: "$80 – $250",
        unit: "per job",
        details: "Professional on-site trade work, testing and clean-up included.",
      })
    }
    svc.rates = currentRates
    next[sIdx] = svc
    setForm({ ...form, services: next })
    setNewSubcatInputs({ ...newSubcatInputs, [sIdx]: "" })
    toast.success(`Subcategory "${rawVal}" added to ${svc.label}`)
  }

  const removeSubcategory = (sIdx: number, subcatName: string) => {
    const next = [...form.services]
    const svc = { ...next[sIdx] }
    const currentSubcats = (svc.subcategories && svc.subcategories.length > 0
      ? svc.subcategories
      : (svc.rates || []).map((r) => r.name)
    ).filter((s) => s !== subcatName)
    svc.subcategories = currentSubcats
    svc.rates = (svc.rates || []).filter((r) => r.name !== subcatName)
    next[sIdx] = svc
    setForm({ ...form, services: next })
    toast.info(`Removed subcategory "${subcatName}"`)
  }

  const updateService = (i: number, key: keyof ServiceItem, value: string) => {
    const next = [...form.services]
    next[i] = { ...next[i], [key]: value }
    setForm({ ...form, services: next })
  }

  const addService = () => {
    const timestamp = Date.now()
    setForm({
      ...form,
      services: [
        ...form.services,
        {
          key: `trade-${timestamp}`,
          label: "New Trade Category",
          icon: "Wrench",
          desc: "Expert repairs, installation and maintenance across Singapore.",
          bgImage: "https://files.catbox.moe/g2969p.jpg",
          subcategories: ["General Service"],
          rates: [
            {
              name: "General Service",
              price: "$80 – $180",
              unit: "per job",
              details: "Standard parts, on-site labor and testing included.",
            },
          ],
        },
      ],
    })
    toast.success("New Trade Category added! You can now customize its name and subcategories.")
  }

  const removeService = (i: number) => {
    if (!confirm(`Delete category "${form.services[i]?.label}"?`)) return
    setForm({ ...form, services: form.services.filter((_, idx) => idx !== i) })
    toast.info("Category removed.")
  }

  const updateRateItem = (serviceIndex: number, rateIndex: number, field: keyof RateItem, value: string) => {
    const next = [...form.services]
    const svc = { ...next[serviceIndex] }
    const rates = [...(svc.rates || [])]
    rates[rateIndex] = { ...rates[rateIndex], [field]: value }
    svc.rates = rates
    next[serviceIndex] = svc
    setForm({ ...form, services: next })
  }

  const addRateItem = (serviceIndex: number) => {
    const next = [...form.services]
    const svc = { ...next[serviceIndex] }
    const rates = [...(svc.rates || [])]
    rates.push({
      name: "New Service / Repair Task",
      price: "$60 – $120",
      unit: "per set",
      details: "Standard parts, on-site labor and testing included.",
    })
    svc.rates = rates
    next[serviceIndex] = svc
    setForm({ ...form, services: next })
    toast.success("New pricing rate added.")
  }

  const removeRateItem = (serviceIndex: number, rateIndex: number) => {
    const next = [...form.services]
    const svc = { ...next[serviceIndex] }
    const rates = (svc.rates || []).filter((_, idx) => idx !== rateIndex)
    svc.rates = rates
    next[serviceIndex] = svc
    setForm({ ...form, services: next })
    toast.info("Rate item removed.")
  }

  const handleSentenceChange = (idx: number, val: string) => {
    const next = [...form.typewriterSentences]
    next[idx] = val
    setForm({ ...form, typewriterSentences: next })
  }

  const handleAddSentence = () => {
    setForm({
      ...form,
      typewriterSentences: [
        ...form.typewriterSentences,
        "Fast & reliable handyman repairs, done right the first time.",
      ],
    })
    toast.success("Added new rotating sentence.")
  }

  const handleRemoveSentence = (idx: number) => {
    if (form.typewriterSentences.length <= 1) {
      toast.error("You must have at least one rotating sentence.")
      return
    }
    const next = form.typewriterSentences.filter((_, i) => i !== idx)
    setForm({ ...form, typewriterSentences: next })
  }

  const handleResetSentences = () => {
    setForm({
      ...form,
      typewriterSentences: [...DEFAULT_TYPEWRITER_SENTENCES],
    })
    toast.info("Typewriter sentences reset to Singapore trade defaults.")
  }

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span>Loading Site Settings…</span>
      </div>
    )
  }

  const currentTabConfig = TABS.find((t) => t.id === activeTab) || TABS[0]

  return (
    <div className="space-y-6">
      {/* Top Header & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm backdrop-blur">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              Site Settings & Content
            </h2>
            <Badge className={currentTabConfig.badgeColor}>
              {currentTabConfig.shortLabel}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {currentTabConfig.description}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="ghost"
            onClick={reset}
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-800 h-9"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset Defaults
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 px-5 shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Categorical Tabs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                isActive
                  ? `${tab.activeBg} shadow-md`
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : tab.textColor}`} />
              <div className="min-w-0 flex-1 truncate">
                <div className="truncate">{tab.shortLabel}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Tab 1: General Info & Branding */}
      {activeTab === "branding" && (
        <motion.div
          key="tab-branding"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Brand & Identity */}
          <Card className="bg-slate-900 border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-400" /> Brand & Worker Profile
              </CardTitle>
              <CardDescription className="text-slate-400">
                The public business name, headline tagline, and worker name used throughout the app.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 pt-5">
              <Field
                label="Business / Brand Name"
                value={form.brand}
                onChange={(v) => setForm({ ...form, brand: v })}
                placeholder="Ahmad HomeWorks"
                hint="Displayed in header logo, footer, and copyright"
              />
              <Field
                label="Primary Tagline"
                value={form.tagline}
                onChange={(v) => setForm({ ...form, tagline: v })}
                placeholder="Singapore's Trusted Handyman"
                hint="Displayed next to brand and in meta tags"
              />
              <Field
                label="Worker / Contact Person Name"
                value={form.workerName}
                onChange={(v) => setForm({ ...form, workerName: v })}
                placeholder="Ahmad Rahman"
                hint="Pre-filled in WhatsApp greeting ('Hi Ahmad…') and hero badge"
              />
              <Field
                label="Operating Islandwide Location"
                value={form.location}
                onChange={(v) => setForm({ ...form, location: v })}
                placeholder="Singapore · Islandwide"
                hint="Shows in post cards and footer coverage"
              />
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="bg-slate-900 border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" /> Direct Contact & WhatsApp Hotline
              </CardTitle>
              <CardDescription className="text-slate-400">
                Used for instant quotation buttons, floating WhatsApp chat, and header phone links.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4 pt-5">
              <Field
                label="Display Phone Number"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+65 9123 4567"
                hint="Human-readable format for calls & display"
              />
              <Field
                label="WhatsApp Digits (No +, No Spaces)"
                value={form.whatsapp}
                onChange={(v) => setForm({ ...form, whatsapp: v })}
                placeholder="6591234567"
                hint="Country code followed by digits e.g. 6589282459"
              />
              <Field
                label="Official Email Address"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="hello@ahmadhomeworks.sg"
                hint="Used in footer and inquiries"
              />
            </CardContent>
          </Card>

          {/* Key Stats */}
          <Card className="bg-slate-900 border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400" /> Live Trust & Performance Stats
              </CardTitle>
              <CardDescription className="text-slate-400">
                Key numerical indicators highlighted across the Hero, About page, and Trust badges.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
              <NumberField
                label="Years of Hands-on Experience"
                value={form.yearsExperience}
                onChange={(v) => setForm({ ...form, yearsExperience: v })}
              />
              <NumberField
                label="Completed Singapore Jobs"
                value={form.jobsCompleted}
                onChange={(v) => setForm({ ...form, jobsCompleted: v })}
              />
              <NumberField
                label="Satisfied Homeowners / Clients"
                value={form.happyClients}
                onChange={(v) => setForm({ ...form, happyClients: v })}
              />
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">
                  Average Client Rating (0–5)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-950/60 border-slate-700 text-white font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tab 2: Trade Categories & Subcategories */}
      {activeTab === "categories" && (
        <motion.div
          key="tab-categories"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-400" /> Service Trade Categories ({form.services.length})
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage your primary services and add specific subcategory chips (e.g. Roof leaking repair, Epoxy painting, Toilet leaking).
              </p>
            </div>
            <Button
              onClick={addService}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 px-4 shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add Trade Category
            </Button>
          </div>

          <div className="space-y-5">
            {form.services.map((svc, i) => {
              const subcats = svc.subcategories && svc.subcategories.length > 0
                ? svc.subcategories
                : (svc.rates || []).map((r) => r.name)

              return (
                <Card key={svc.key || i} className="bg-slate-900 border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white">{svc.label}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Key: <code className="text-emerald-400 font-mono">{svc.key}</code></span>
                          <span>·</span>
                          <span>{subcats.length} subcategories</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(i)}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 h-8 px-2.5 cursor-pointer text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Category
                    </Button>
                  </div>

                  <CardContent className="p-5 space-y-5">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Field
                        label="Category Label / Title"
                        value={svc.label}
                        onChange={(v) => updateService(i, "label", v)}
                        placeholder="Roofing & Waterproofing"
                      />
                      <Field
                        label="Unique System Key (No spaces)"
                        value={svc.key}
                        onChange={(v) => updateService(i, "key", v)}
                        placeholder="roofing"
                      />
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">
                          Display Icon
                        </Label>
                        <Select
                          value={svc.icon || "Wrench"}
                          onValueChange={(val) => updateService(i, "icon", val)}
                        >
                          <SelectTrigger className="bg-slate-950/60 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-white">
                            {ICON_OPTIONS.map((ico) => (
                              <SelectItem key={ico} value={ico}>
                                {ico}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">
                        Category Scope Description
                      </Label>
                      <Textarea
                        value={svc.desc}
                        onChange={(e) => updateService(i, "desc", e.target.value)}
                        rows={2}
                        placeholder="Expert roofing repairs, waterproofing membrane installation, and leak detection."
                        className="bg-slate-950/60 border-slate-700 text-white text-xs sm:text-sm"
                      />
                    </div>

                    {/* Background Image */}
                    <div className="space-y-2 p-3.5 rounded-xl border border-slate-800 bg-slate-950/50">
                      <Label className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <Sparkles className="h-3.5 w-3.5" /> Card Background Image (Auto WebP)
                        </span>
                        {svc.bgImage && (
                          <span className="text-[11px] text-emerald-400 font-medium">
                            ✓ {svc.bgImage.endsWith(".webp") || svc.bgImage.includes("opt-") ? "WebP Active" : "Active"}
                          </span>
                        )}
                      </Label>
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                          <img
                            src={svc.bgImage || DEFAULT_SERVICE_IMAGES[svc.key] || DEFAULT_SERVICE_IMAGES["repair"]}
                            alt={svc.label}
                            className="h-full w-full object-cover"
                          />
                          {(svc.bgImage?.endsWith(".webp") || svc.bgImage?.includes("opt-")) && (
                            <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[8px] font-bold text-white text-center py-0.5 uppercase tracking-wider">
                              WebP
                            </span>
                          )}
                        </div>
                        <Input
                          value={svc.bgImage || ""}
                          onChange={(e) => updateService(i, "bgImage", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleConvertServiceBg(i)
                            }
                          }}
                          placeholder="https://... image URL (Google Drive, Imgur, etc.)"
                          disabled={convertingServiceBg === i}
                          className="bg-slate-950/60 border-slate-700 text-white text-xs font-mono flex-1 focus:border-emerald-500"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleConvertServiceBg(i)}
                          disabled={convertingServiceBg === i || !svc.bgImage?.trim()}
                          className="h-9 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 shadow-sm cursor-pointer"
                          title="Download & convert to WebP"
                        >
                          {convertingServiceBg === i ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                              <span>Converting…</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5 mr-1 text-emerald-200" />
                              <span>Convert to WebP</span>
                            </>
                          )}
                        </Button>
                        <label className="shrink-0 h-9 px-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
                          <Upload className="h-3.5 w-3.5 text-slate-300" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleServiceFileUpload(i, e)}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Paste an external image link and tap &quot;Convert to WebP&quot; to optimize and store permanently.
                      </p>
                    </div>

                    {/* Subcategories Chips */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">
                          Subcategory Services ({subcats.length})
                        </Label>
                        <span className="text-[11px] text-slate-400">
                          Used in post tagging & customer quick selection
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {subcats.map((sc, scIdx) => (
                          <span
                            key={scIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200"
                          >
                            <span>{sc}</span>
                            <button
                              type="button"
                              onClick={() => removeSubcategory(i, sc)}
                              className="text-slate-400 hover:text-rose-400 cursor-pointer ml-1"
                              title="Remove subcategory"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-1 max-w-md">
                        <Input
                          value={newSubcatInputs[i] || ""}
                          onChange={(e) => setNewSubcatInputs({ ...newSubcatInputs, [i]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSubcategory(i)
                            }
                          }}
                          placeholder="e.g. Epoxy painting / Roof leaking repair…"
                          className="bg-slate-950/60 border-slate-700 text-white text-xs h-9"
                        />
                        <Button
                          type="button"
                          onClick={() => addSubcategory(i)}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 shrink-0 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" /> Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Tab 3: Singapore Rate Card (Pricing) */}
      {activeTab === "pricing" && (
        <motion.div
          key="tab-pricing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300">
              <span className="font-bold text-amber-300">Transparent Singapore Trade Rate Card:</span> The rates below are displayed in the public <strong>"Transparent Pricing Guide"</strong> and power the interactive Instant Quote Calculator. Homeowners love knowing realistic rates before messaging.
            </div>
          </div>

          <div className="space-y-6">
            {form.services.map((svc, sIdx) => {
              const rates = svc.rates && svc.rates.length > 0 ? svc.rates : []

              return (
                <Card key={svc.key || sIdx} className="bg-slate-900 border-slate-800 shadow-sm">
                  <CardHeader className="border-b border-slate-800/80 pb-3 flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base text-white flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-amber-400" />
                        {svc.label} — Rates
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-xs mt-0.5">
                        {rates.length} itemized price entries for this trade
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addRateItem(sIdx)}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs h-8 px-3 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Rate Entry
                    </Button>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-5">
                    {rates.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-3 text-center">
                        No pricing entries added yet. Click "Add Rate Entry" above.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {rates.map((rate, rIdx) => (
                          <div
                            key={rIdx}
                            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                          >
                            <div className="sm:col-span-4 space-y-1">
                              <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                Task / Repair Scope
                              </Label>
                              <Input
                                value={rate.name}
                                onChange={(e) => updateRateItem(sIdx, rIdx, "name", e.target.value)}
                                placeholder="e.g. Single Toilet Leak Repair"
                                className="bg-slate-900 border-slate-700 text-white text-xs h-8"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                Estimated Price Range
                              </Label>
                              <Input
                                value={rate.price}
                                onChange={(e) => updateRateItem(sIdx, rIdx, "price", e.target.value)}
                                placeholder="$80 – $180"
                                className="bg-slate-900 border-slate-700 text-amber-400 font-mono text-xs h-8 font-semibold"
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                Unit
                              </Label>
                              <Input
                                value={rate.unit}
                                onChange={(e) => updateRateItem(sIdx, rIdx, "unit", e.target.value)}
                                placeholder="per job / set"
                                className="bg-slate-900 border-slate-700 text-slate-300 text-xs h-8"
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <Label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                Details
                              </Label>
                              <Input
                                value={rate.details || ""}
                                onChange={(e) => updateRateItem(sIdx, rIdx, "details", e.target.value)}
                                placeholder="Labor & parts"
                                className="bg-slate-900 border-slate-700 text-slate-400 text-xs h-8"
                              />
                            </div>

                            <div className="sm:col-span-1 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRateItem(sIdx, rIdx)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 cursor-pointer"
                                title="Delete rate"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Tab 4: Hero Headline & Showcase */}
      {activeTab === "hero" && (
        <motion.div
          key="tab-hero"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Main Hero Headline */}
          <Card className="bg-slate-900 border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" /> Hero Primary Headline & Subtext
              </CardTitle>
              <CardDescription className="text-slate-400">
                The first text homeowners see when landing on the website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <Field
                label="Primary Hero Headline"
                value={form.heroHeadline}
                onChange={(v) => setForm({ ...form, heroHeadline: v })}
                placeholder="Your home, expertly handled."
              />
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">
                  Hero Paragraph / Subtext
                </Label>
                <Textarea
                  value={form.heroSubtext}
                  onChange={(e) => setForm({ ...form, heroSubtext: e.target.value })}
                  rows={3}
                  placeholder="Singapore's trusted handyman for roofing, painting, waterproofing, and plumbing repairs across HDBs and condos."
                  className="bg-slate-950/60 border-slate-700 text-white text-xs sm:text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rotating Typewriter Sentences */}
          <Card className="bg-slate-900 border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-800/80 pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Type className="h-4 w-4 text-purple-400" /> Rotating Dynamic Typewriter Headlines
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-0.5">
                  These rotate smoothly in the hero badge above the main title.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetSentences}
                  className="text-slate-400 hover:text-white h-8 text-xs cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Reset Defaults
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddSentence}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs h-8 px-3 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Sentence
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {form.typewriterSentences.map((sent, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-xs text-purple-400 font-bold w-6 text-center">
                    {idx + 1}.
                  </span>
                  <Input
                    value={sent}
                    onChange={(e) => handleSentenceChange(idx, e.target.value)}
                    placeholder="e.g. Master roof leak detection and persistent waterproofing across Singapore."
                    className="bg-slate-950/60 border-slate-700 text-white text-xs sm:text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSentence(idx)}
                    className="h-9 w-9 p-0 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 cursor-pointer shrink-0"
                    title="Remove sentence"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick link to 4 Hero Showcase Photos */}
          <Card className="bg-slate-900 border-slate-800 shadow-sm border-dashed">
            <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">4 Hero Showcase Photos</h4>
                  <p className="text-xs text-slate-400">
                    To upload, reorder, or replace the 4 live showcase photos on the homepage, use the dedicated Hero Showcase tab.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setAdminTab("heroPhotos")}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold h-9 px-4 shrink-0 cursor-pointer"
              >
                Go to Hero Showcase Photos <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tab 5: About & ACRA Legal Credentials */}
      {activeTab === "acra" && (
        <motion.div
          key="tab-acra"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* About Story */}
          <Card className="bg-slate-900 border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-rose-400" /> About Us & Company Story
              </CardTitle>
              <CardDescription className="text-slate-400">
                Narrative displayed in the homepage About section and dedicated About page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <Field
                label="About Section Title"
                value={form.aboutTitle}
                onChange={(v) => setForm({ ...form, aboutTitle: v })}
                placeholder="Built on trust. Delivered with care."
              />
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">
                  About Body Story Paragraph
                </Label>
                <Textarea
                  value={form.aboutBody}
                  onChange={(e) => setForm({ ...form, aboutBody: e.target.value })}
                  rows={5}
                  placeholder="We are a Singapore-based direct trade contractor entity with over a decade of hands-on experience..."
                  className="bg-slate-950/60 border-slate-700 text-white text-xs sm:text-sm leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          {/* ACRA & MOM Legal Credentials */}
          <Card className="bg-slate-900 border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Singapore ACRA & MOM Registration
              </CardTitle>
              <CardDescription className="text-slate-400">
                Crucial legal credibility details distinguishing you from unlicensed brokers.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 pt-5">
              <Field
                label="Registered Company Name"
                value={form.companyName}
                onChange={(v) => setForm({ ...form, companyName: v })}
                placeholder="4R ENGINEERING PTE. LTD."
                hint="As registered with ACRA Singapore"
              />
              <Field
                label="ACRA UEN Registration Number"
                value={form.companyUen}
                onChange={(v) => setForm({ ...form, companyUen: v })}
                placeholder="202143324G"
                hint="Singapore Unique Entity Number for live verification"
              />
              <div className="sm:col-span-2">
                <Field
                  label="MOM Licensing & Trade Description"
                  value={form.licenseInfo}
                  onChange={(v) => setForm({ ...form, licenseInfo: v })}
                  placeholder="MOM Registered Work Permit · Construction Sector · 0% Broker Fee"
                  hint="Displayed in hero trust pill and footer credentials"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Persistent Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-slate-950/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="truncate">Editing: <strong className="text-white">{currentTabConfig.label}</strong></span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            onClick={reset}
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-800 h-9"
          >
            Reset
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 px-6 shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
            {saving ? "Saving…" : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-950/60 border-slate-700 text-white text-xs sm:text-sm"
      />
      {hint && <p className="text-[11px] text-slate-400 leading-tight">{hint}</p>}
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider font-bold text-slate-300">
        {label}
      </Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="bg-slate-950/60 border-slate-700 text-white font-mono text-xs sm:text-sm"
      />
      {hint && <p className="text-[11px] text-slate-400 leading-tight">{hint}</p>}
    </div>
  )
}
