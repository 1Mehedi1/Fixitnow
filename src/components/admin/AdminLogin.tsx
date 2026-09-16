"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import { Lock, Mail, Loader2, ArrowLeft, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useStore } from "@/store/useStore"
import { toast } from "sonner"

export function AdminLogin() {
  const { setView } = useStore()
  const [email, setEmail] = useState("admin@homeworks.sg")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (!res?.ok) {
      setError(res?.error || "Invalid credentials")
      toast.error("Login failed", { description: res?.error })
      return
    }
    toast.success("Welcome back!")
    // Trigger parent re-fetch of session
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/30 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => setView("home")}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to site
        </button>

        <Card className="border-border shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
            <CardDescription>Sign in to manage your portfolio, blog & analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  {error}
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full h-11">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
            <div className="mt-5 text-xs text-muted-foreground bg-muted/50 rounded-md p-3 text-center">
              <span className="font-semibold">Demo credentials</span> · admin@homeworks.sg / admin123
              <br />
              (Call <code className="font-mono">/api/seed</code> first to create the user.)
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
