"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, Plus, Trash2, RotateCcw, Building2, Phone, Star, Sparkles, Image as ImageIcon, ShieldCheck, Upload, DollarSign, Type, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { defaultSiteConfig, type ServiceItem, type RateItem, DEFAULT_SERVICE_IMAGES, DEFAULT_SERVICE_RATES, DEFAULT_TYPEWRITER_SENTENCES } from "@/lib/site"

const ICON_OPTIONS = [
  "Wrench", "PaintRoller", "Hammer", "Zap", "Sofa", "Settings",
  "Droplet", "Brush", "Home", "Lightbulb", "DoorOpen", "ShowerHead",
]

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

export function SettingsManager() {
  const [form, setForm] = useState<FormState>({
    ...defaultSiteConfig,
    typewriterSentences: [...(defaultSiteConfig.typewriterSentences || [])],
    services: [...defaultSiteConfig.services],
    heroImages: [...defaultSiteConfig.heroImages],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          let heroImgs = [...defaultSiteConfig.heroImages]
          try {
            const parsed = JSON.parse(d.settings.heroImagesJson || "[]")
            if (Array.isArray(parsed) && parsed.length > 0) heroImgs = parsed
          } catch {}

          let loadedServices = Array.isArray(d.services) && d.services.length > 0 ? d.services : [...defaultSiteConfig.services]
          loadedServices = loadedServices.map((svc: any) => ({
            ...svc,
            rates: Array.isArray(svc.rates) && svc.rates.length > 0 ? svc.rates : (DEFAULT_SERVICE_RATES[svc.key] || []),
          }))

          let loadedSentences = Array.isArray(d.typewriterSentences) && d.typewriterSentences.length > 0
            ? d.typewriterSentences
            : (Array.isArray(d.settings.typewriterSentences) ? d.settings.typewriterSentences : [...(defaultSiteConfig.typewriterSentences || [])])

          setForm({
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
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          servicesJson: form.services,
          heroImagesJson: form.heroImages,
          typewriterSentencesJson: form.typewriterSentences,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      toast.success("Settings saved — site is now live with your changes.")
      // Reload the page so server-rendered components pick up the new settings
      setTimeout(() => window.location.reload(), 800)
    } catch (e: any) {
      toast.error("Save failed", { description: e.message })
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    if (!confirm("Reset all settings to defaults? Your custom values will be lost.")) return
    setForm({
      ...defaultSiteConfig,
      typewriterSentences: [...(defaultSiteConfig.typewriterSentences || [])],
      services: [...defaultSiteConfig.services],
      heroImages: [...defaultSiteConfig.heroImages],
    })
    toast.info("Form reset to defaults. Click Save to apply.")
  }

  const handleHeroImageChange = (index: number, url: string) => {
    const updated = [...form.heroImages]
    updated[index] = url
    setForm({ ...form, heroImages: updated })
  }

  const handleHeroFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    const tId = toast.loading(`Uploading Hero Photo ${index + 1}...`)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.url) {
        handleHeroImageChange(index, data.url)
        toast.success(`Hero Photo ${index + 1} uploaded!`, { id: tId })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (err: any) {
      toast.error("Upload failed", { description: err.message, id: tId })
    }
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
        toast.success(`Background image uploaded!`, { id: tId })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (err: any) {
      toast.error("Upload failed", { description: err.message, id: tId })
    }
  }

  const updateService = (i: number, key: keyof ServiceItem, value: string) => {
    const next = [...form.services]
    next[i] = { ...next[i], [key]: value }
    setForm({ ...form, services: next })
  }

  const addService = () => {
    setForm({
      ...form,
      services: [
        ...form.services,
        {
          key: `svc-${Date.now()}`,
          label: "New Service",
          icon: "Wrench",
          desc: "Describe this service.",
          bgImage: DEFAULT_SERVICE_IMAGES["repair"],
          rates: [
            {
              name: "Standard Service / Repair Task",
              price: "$60 – $120",
              unit: "per set",
              details: "Standard parts, labor and safety test included.",
            },
          ],
        },
      ],
    })
  }

  const removeService = (i: number) => {
    setForm({ ...form, services: form.services.filter((_, idx) => idx !== i) })
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
  }

  const removeRateItem = (serviceIndex: number, rateIndex: number) => {
    const next = [...form.services]
    const svc = { ...next[serviceIndex] }
    const rates = (svc.rates || []).filter((_, idx) => idx !== rateIndex)
    svc.rates = rates
    next[serviceIndex] = svc
    setForm({ ...form, services: next })
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
    return <div className="py-24 text-center text-muted-foreground">Loading settings…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Site Settings</h2>
          <p className="text-sm text-muted-foreground">
            Everything visible on the public site is editable here. Changes go live the moment you save.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={reset} size="sm">
            <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Brand & contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" /> Brand & Contact
          </CardTitle>
          <CardDescription>The business name shown across the site, plus your contact details.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field label="Business / brand name" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} placeholder="Ahmad HomeWorks" />
          <Field label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} placeholder="Singapore's Trusted Handyman" />
          <Field label="Worker / contact name" value={form.workerName} onChange={(v) => setForm({ ...form, workerName: v })} placeholder="Ahmad Rahman" hint="Used in WhatsApp messages ('Hi Ahmad…')" />
          <Field label="Phone number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+65 9123 4567" />
          <Field label="WhatsApp number" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="6591234567" hint="Digits only, country code first — no +, no spaces" />
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="hello@ahmadhomeworks.sg" />
          <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Singapore · Islandwide" />
          <Field label="Company Name (Work Permit Employer)" value={form.companyName} onChange={(v) => setForm({ ...form, companyName: v })} placeholder="4R ENGINEERING PTE. LTD." hint="Shown in trust badges & licensing details" />
          <Field label="Company UEN (ACRA)" value={form.companyUen} onChange={(v) => setForm({ ...form, companyUen: v })} placeholder="202143324G" hint="Singapore Unique Entity Number" />
          <div className="sm:col-span-2">
            <Field label="Licensing & Trust Description" value={form.licenseInfo} onChange={(v) => setForm({ ...form, licenseInfo: v })} placeholder="ACRA Registered Entity · Company: 4R ENGINEERING PTE. LTD." hint="Displayed under Hero and in About section" />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" /> Showcase Stats
          </CardTitle>
          <CardDescription>Numbers shown in the hero, about page and footer.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NumberField label="Years in business" value={form.yearsExperience} onChange={(v) => setForm({ ...form, yearsExperience: v })} />
          <NumberField label="Jobs completed" value={form.jobsCompleted} onChange={(v) => setForm({ ...form, jobsCompleted: v })} />
          <NumberField label="Happy clients" value={form.happyClients} onChange={(v) => setForm({ ...form, happyClients: v })} />
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider">Average rating</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero Section & Typewriter Headline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Hero Section & Typewriter Headlines
              </CardTitle>
              <CardDescription>
                Customize the animated typewriter sentences, primary headline, and introductory about paragraph.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetSentences}
              className="text-xs h-8 border-primary/30 hover:border-primary"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset Sentences
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field
            label="Hero fallback headline"
            value={form.heroHeadline}
            onChange={(v) => setForm({ ...form, heroHeadline: v })}
            placeholder="Your home, expertly handled."
            hint="Static fallback if typewriter is disabled or initial render."
          />

          {/* Typewriter Rotating Sentences List */}
          <div className="space-y-3 rounded-xl border border-primary/20 bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5 text-primary" /> Rotating Typewriter Sentences ({form.typewriterSentences.length})
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSentence}
                className="text-xs h-7 px-2.5 bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Sentence
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              These sentences continuously type out on the home page. <span className="font-semibold text-foreground">Format rule:</span> use a comma (e.g., <code>&quot;Plumbing &amp; leaks, fixed fast &amp; cleanly.&quot;</code>) — words before the comma appear on line 1, and words after the comma appear as the bold red-underlined punchline.
            </p>

            <div className="space-y-2 mt-2">
              {form.typewriterSentences.map((sentence, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-muted-foreground w-6 text-right shrink-0">
                    {idx + 1}.
                  </span>
                  <Input
                    value={sentence}
                    onChange={(e) => handleSentenceChange(idx, e.target.value)}
                    placeholder="e.g. Electrical &amp; wiring, EMA licensed."
                    className="text-sm h-9 bg-background"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSentence(idx)}
                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    title="Delete sentence"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Subtext / About Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-primary" /> Hero Introductory About Text
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              The introductory description displayed directly beneath the hero headline.
            </p>
            <Textarea
              value={form.heroSubtext}
              onChange={(e) => setForm({ ...form, heroSubtext: e.target.value })}
              rows={3}
              placeholder="Singapore's trusted handyman for plumbing, painting, renovation, electrical and interior works."
              className="text-sm bg-background leading-relaxed"
            />
            {/* Live Preview Box */}
            <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs">
              <span className="font-semibold text-muted-foreground block mb-1">Live Hero Text Preview:</span>
              <p className="text-foreground leading-relaxed">
                {form.heroSubtext}{" "}
                <span className="font-semibold text-primary">{form.yearsExperience} years</span> experience.{" "}
                <span className="font-semibold text-primary">{form.jobsCompleted}+ jobs</span> completed across Singapore.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero 4 Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" /> Hero Showcase Photos (4 Images)
          </CardTitle>
          <CardDescription>
            The 4 photos featured prominently in the hero collage. Paste image URLs or upload photos directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-5">
          {[0, 1, 2, 3].map((idx) => {
            const labels = [
              "Photo 1 · Top-Left (Portrait)",
              "Photo 2 · Bottom-Left (Square)",
              "Photo 3 · Top-Right (Square)",
              "Photo 4 · Bottom-Right (Portrait)"
            ]
            const currentImg = form.heroImages[idx] || defaultSiteConfig.heroImages[idx] || ""
            return (
              <div key={idx} className="border border-border/80 rounded-xl p-4 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{labels[idx]}</span>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload new</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleHeroFileUpload(idx, e)}
                    />
                  </label>
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center relative group">
                  {currentImg ? (
                    <img src={currentImg} alt={`Hero Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-muted-foreground flex flex-col items-center gap-1">
                      <ImageIcon className="h-6 w-6 opacity-40" />
                      <span>No photo set</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Image URL</Label>
                  <Input
                    value={form.heroImages[idx] || ""}
                    onChange={(e) => handleHeroImageChange(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* About section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" /> About Section
          </CardTitle>
          <CardDescription>The company-focused About section. No personal info required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="About title"
            value={form.aboutTitle}
            onChange={(v) => setForm({ ...form, aboutTitle: v })}
            placeholder="Built on trust. Delivered with care."
          />
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider">About body</Label>
            <Textarea
              value={form.aboutBody}
              onChange={(e) => setForm({ ...form, aboutBody: e.target.value })}
              rows={4}
              placeholder="We are a Singapore-based home-services company…"
            />
            <p className="text-xs text-muted-foreground">2–4 sentences work best. Focus on the company, not any individual.</p>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> Services List
              </CardTitle>
              <CardDescription>The services shown in the grid. Add, edit, remove.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addService}>
              <Plus className="h-4 w-4 mr-1.5" /> Add service
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-lg border border-border p-4 space-y-3 bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service #{i + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(i)}
                  className="text-destructive hover:text-destructive h-7"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Label" value={svc.label} onChange={(v) => updateService(i, "label", v)} placeholder="Plumbing" />
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider">Icon</Label>
                  <select
                    value={svc.icon}
                    onChange={(e) => updateService(i, "icon", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-1 text-sm text-white shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
                  >
                    {ICON_OPTIONS.map((ic) => (
                      <option key={ic} value={ic} className="bg-slate-900 text-white">
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
                <Field label="Key (slug)" value={svc.key} onChange={(v) => updateService(i, "key", v)} placeholder="plumbing" hint="Used internally, lowercase no spaces" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Description</Label>
                <Textarea
                  value={svc.desc}
                  onChange={(e) => updateService(i, "desc", e.target.value)}
                  rows={2}
                  placeholder="Short description of this service."
                />
              </div>

              {/* Service Card Background Image */}
              <div className="border border-border/70 rounded-lg p-3 bg-muted/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-primary" /> Card Background Image
                  </span>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleServiceFileUpload(i, e)}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-20 rounded-md overflow-hidden border border-border bg-black/60 flex-shrink-0 relative">
                    <img
                      src={svc.bgImage || DEFAULT_SERVICE_IMAGES[svc.key] || DEFAULT_SERVICE_IMAGES["repair"]}
                      alt={svc.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Input
                      value={svc.bgImage || ""}
                      onChange={(e) => updateService(i, "bgImage", e.target.value)}
                      placeholder={DEFAULT_SERVICE_IMAGES[svc.key] || "https://images.unsplash.com/..."}
                      className="text-xs h-9 font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Paste an image URL or upload directly. Leave empty to use the curated default.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {form.services.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No services yet. Click "Add service" to create one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Singapore Rate Card (2026) Rates & Pricing Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Singapore Rate Card (2026) — Rates & Pricing
              </CardTitle>
              <CardDescription>
                Edit prices, units, and item descriptions for each service shown in the Rate Card section. Add or remove items as needed.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {form.services.map((svc, sIdx) => {
            const rates = svc.rates || []
            return (
              <div key={svc.key || sIdx} className="rounded-xl border border-border/80 p-4 space-y-4 bg-muted/20">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <span>{svc.label}</span>
                      <span className="text-xs text-muted-foreground font-normal">({svc.key})</span>
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {rates.length} {rates.length === 1 ? "rate item" : "rate items"}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addRateItem(sIdx)}
                    className="h-8 text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Rate Item
                  </Button>
                </div>

                {rates.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">
                    No rate items added for this service yet. Click &quot;Add Rate Item&quot; to publish pricing.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {rates.map((rate, rIdx) => (
                      <div
                        key={rIdx}
                        className="rounded-lg border border-border/70 p-3 bg-background/80 space-y-2.5 relative group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Item #{rIdx + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRateItem(sIdx, rIdx)}
                            className="text-destructive hover:text-destructive h-6 w-6 p-0 cursor-pointer"
                            title="Delete rate item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <div className="grid sm:grid-cols-12 gap-2.5">
                          <div className="sm:col-span-6 space-y-1">
                            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Task / Service Name</Label>
                            <Input
                              value={rate.name}
                              onChange={(e) => updateRateItem(sIdx, rIdx, "name", e.target.value)}
                              placeholder="Leaking Tap or Valve Replacement"
                              className="text-xs h-8"
                            />
                          </div>
                          <div className="sm:col-span-3 space-y-1">
                            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Price Range</Label>
                            <Input
                              value={rate.price}
                              onChange={(e) => updateRateItem(sIdx, rIdx, "price", e.target.value)}
                              placeholder="$60 – $110"
                              className="text-xs h-8 font-semibold text-emerald-600 dark:text-emerald-400"
                            />
                          </div>
                          <div className="sm:col-span-3 space-y-1">
                            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Unit</Label>
                            <Input
                              value={rate.unit}
                              onChange={(e) => updateRateItem(sIdx, rIdx, "unit", e.target.value)}
                              placeholder="per set"
                              className="text-xs h-8"
                            />
                          </div>
                          <div className="sm:col-span-12 space-y-1">
                            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">What&apos;s Included / Scope Details</Label>
                            <Input
                              value={rate.details}
                              onChange={(e) => updateRateItem(sIdx, rIdx, "details", e.target.value)}
                              placeholder="Includes new washer/valves, thread sealing and testing"
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-2 sticky bottom-4 bg-background/80 backdrop-blur p-3 rounded-lg border border-border">
        <span className="text-xs text-muted-foreground self-center mr-auto">Changes apply site-wide the moment you save.</span>
        <Button variant="ghost" onClick={reset} disabled={saving}>Reset</Button>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-slate-200 font-semibold">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 font-medium" />
      {hint && <p className="text-[11px] text-slate-300 font-medium">{hint}</p>}
    </div>
  )
}

function NumberField({
  label, value, onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-slate-200 font-semibold">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="bg-slate-900 border-slate-700 text-white font-semibold"
      />
    </div>
  )
}
