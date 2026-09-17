"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, Plus, Trash2, RotateCcw, Building2, Phone, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { defaultSiteConfig, type ServiceItem } from "@/lib/site"

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
  aboutTitle: string
  aboutBody: string
  services: ServiceItem[]
}

export function SettingsManager() {
  const [form, setForm] = useState<FormState>({
    ...defaultSiteConfig,
    services: [...defaultSiteConfig.services],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setForm({
            brand: d.settings.brand,
            tagline: d.settings.tagline,
            workerName: d.settings.workerName,
            phone: d.settings.phone,
            whatsapp: d.settings.whatsapp,
            email: d.settings.email,
            location: d.settings.location,
            yearsExperience: d.settings.yearsExperience,
            jobsCompleted: d.settings.jobsCompleted,
            happyClients: d.settings.happyClients,
            rating: d.settings.rating,
            heroHeadline: d.settings.heroHeadline,
            heroSubtext: d.settings.heroSubtext,
            aboutTitle: d.settings.aboutTitle,
            aboutBody: d.settings.aboutBody,
            services: Array.isArray(d.services) && d.services.length > 0 ? d.services : [...defaultSiteConfig.services],
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
        body: JSON.stringify({ ...form, servicesJson: form.services }),
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
    setForm({ ...defaultSiteConfig, services: [...defaultSiteConfig.services] })
    toast.info("Form reset to defaults. Click Save to apply.")
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
        { key: `svc-${Date.now()}`, label: "New Service", icon: "Wrench", desc: "Describe this service." },
      ],
    })
  }

  const removeService = (i: number) => {
    setForm({ ...form, services: form.services.filter((_, idx) => idx !== i) })
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

      {/* Hero text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Hero Section
          </CardTitle>
          <CardDescription>The big headline and subtext at the top of the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="Hero headline"
            value={form.heroHeadline}
            onChange={(v) => setForm({ ...form, heroHeadline: v })}
            placeholder="Your home, expertly handled."
            hint="Tip: include a comma. Text before the comma is line 1; text after is line 2 (highlighted)."
          />
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider">Hero subtext</Label>
            <Textarea
              value={form.heroSubtext}
              onChange={(e) => setForm({ ...form, heroSubtext: e.target.value })}
              rows={2}
              placeholder="Singapore's trusted handyman for plumbing, painting, renovation…"
            />
          </div>
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
                  <Select value={svc.icon} onValueChange={(v) => updateService(i, "icon", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((ic) => (
                        <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            </motion.div>
          ))}
          {form.services.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No services yet. Click "Add service" to create one.
            </div>
          )}
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
      <Label className="text-xs uppercase tracking-wider">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
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
      <Label className="text-xs uppercase tracking-wider">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      />
    </div>
  )
}
