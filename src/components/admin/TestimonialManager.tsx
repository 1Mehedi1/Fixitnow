"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Testimonial } from "@prisma/client"

interface Props {
  testimonials: Testimonial[]
}

export function TestimonialManager({ testimonials }: Props) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    role: "",
    rating: 5,
    content: "",
    published: true,
  })

  const submit = async () => {
    if (!form.name || !form.content) {
      toast.error("Name and content required")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Save failed")
      toast.success("Testimonial added")
      setOpen(false)
      setForm({ name: "", role: "", rating: 5, content: "", published: true })
      window.location.reload()
    } catch (e: any) {
      toast.error("Failed", { description: e.message })
    } finally {
      setSaving(false)
    }
  }

  const del = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" })
    toast.success("Deleted")
    window.location.reload()
  }

  const togglePublish = async (t: Testimonial) => {
    await fetch(`/api/testimonials/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !t.published }),
    })
    window.location.reload()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Testimonials</h2>
          <p className="text-sm text-muted-foreground">
            {testimonials.length} total · {testimonials.filter((t) => t.published).length} shown on site
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Add testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No testimonials yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={t.published ? "" : "opacity-60"}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-sm">{t.name}</span>
                        {t.role && <span className="text-xs text-muted-foreground">· {t.role}</span>}
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`h-3 w-3 ${idx < t.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{t.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(t.createdAt).toLocaleDateString("en-SG")}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <div className="flex items-center gap-1 text-xs">
                        <Switch checked={t.published} onCheckedChange={() => togglePublish(t)} />
                        <span className="text-muted-foreground">{t.published ? "Live" : "Hidden"}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => del(t.id)} className="text-destructive hover:text-destructive h-7">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* New testimonial dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New testimonial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mrs Tan" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider">Role / location</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="HDB Owner · Punggol" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm({ ...form, rating: n })}
                    type="button"
                  >
                    <Star className={`h-6 w-6 ${n <= form.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider">Content *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                placeholder="What did the client say about your work?"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <span className="text-sm">Publish immediately</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Save testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
