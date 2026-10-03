"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import {
  Eye, Users, MousePointerClick, PhoneCall, TrendingUp, BarChart3,
  Smartphone, Laptop, Tablet, Globe, MapPin, ArrowUpRight, Clock,
  Activity, Share2, Layers, Filter, CheckCircle2, ChevronRight, ShieldCheck,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts"

interface AnalyticsStatsResponse {
  range: string
  totals: {
    pageViews: number
    uniqueVisitors: number
    whatsappClicks: number
    phoneCalls: number
    calculatorRuns: number
    totalConversions: number
    conversionRate: string
    avgDwellSeconds: number
    trends: {
      viewsChange: string
      visitorsChange: string
      conversionsChange: string
    }
  }
  devices: { name: string; type: string; count: number; percentage: number }[]
  locations: { country: string; code: string; flag: string; count: number; percentage: number }[]
  sgRegions: { name: string; count: number; share: string }[]
  browsers: { name: string; count: number; percentage: number }[]
  operatingSystems: { name: string; count: number; percentage: number }[]
  referrers: { source: string; count: number; percentage: number; icon: string }[]
  funnel: { step: string; count: number; percentage: number; dropoff: string }[]
  topPages: { path: string; label: string; views: number; share: string }[]
  topPosts: { id: string; title: string; type: string; views: number; whatsappClicks: number }[]
  timeline: { date: string; pageViews: number; uniqueVisitors: number; conversions: number }[]
  liveFeed: { id: string; eventType: string; label: string; path: string; device: string; country: string; countryFlag: string; city: string; timeAgo: string }[]
}

const RANGES = [
  { id: "today", label: "Today (24h)" },
  { id: "7d", label: "7 Days" },
  { id: "14d", label: "14 Days" },
  { id: "30d", label: "30 Days" },
  { id: "all", label: "All Time" },
]

export function AnalyticsDashboard() {
  const { data: session } = useSession()
  const [range, setRange] = useState("14d")
  const [stats, setStats] = useState<AnalyticsStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)
  const [locationTab, setLocationTab] = useState<"countries" | "sg_regions">("countries")
  const [deviceTab, setDeviceTab] = useState<"device" | "os" | "browser">("device")

  const fetchStats = (selectedRange: string) => {
    setLoading(true)
    fetch(`/api/analytics/stats?range=${selectedRange}`)
      .then(async (r) => {
        if (r.status === 401) {
          setAuthError(true)
          await signOut({ redirect: false })
          setTimeout(() => window.location.reload(), 500)
          return null
        }
        if (!r.ok) return null
        return r.json()
      })
      .then((d) => {
        if (d) setStats(d)
      })
      .finally(() => setLoading(false))
  }

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all visitor telemetry to zero?")) return
    try {
      const res = await fetch("/api/analytics/stats", { method: "DELETE" })
      if (res.ok) {
        toast.success("All test telemetry cleared")
        fetchStats(range)
      }
    } catch {
      toast.error("Failed to reset")
    }
  }

  useEffect(() => {
    fetchStats(range)
  }, [range])

  if (loading && !stats) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground font-medium">Aggregating visitor analytics & telemetry…</p>
      </div>
    )
  }

  if (authError || !session) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-muted-foreground text-sm">Your session has expired. Please sign in again.</p>
        <Button onClick={() => window.location.reload()}>Reload to sign in</Button>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Title, Telemetry Badge, Range Picker & Reset Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Visitor Telemetry & Analytics
            </h2>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Real Live Telemetry (Zero Synthetic Data)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strictly records real visitor devices, Singapore locations, and WhatsApp photo inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Timeframe Filter Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 dark:bg-muted/30 border border-border/70 dark:border-white/10 overflow-x-auto">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  range === r.id
                    ? "bg-card text-foreground shadow-xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/30 cursor-pointer"
            title="Clear all test clicks and start fresh"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Reset Test Data
          </Button>
        </div>
      </div>

      {/* Hero Metric Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Unique Visitors */}
        <Card className="hover:border-primary/40 transition-all bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-300">Unique Visitors</span>
              <div className="h-8 w-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white">
              {(stats?.totals?.uniqueVisitors ?? 0).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="font-bold text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {stats?.totals?.trends?.visitorsChange ?? "+0%"}
              </span>
              <span className="text-slate-400 text-[11px]">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Page Views */}
        <Card className="hover:border-primary/40 transition-all bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-300">Page Views</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-white">
              {(stats?.totals?.pageViews ?? 0).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="font-bold text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {stats?.totals?.trends?.viewsChange ?? "+0%"}
              </span>
              <span className="text-slate-400 text-[11px]">total impressions</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: WhatsApp & Phone Leads */}
        <Card className="hover:border-primary/40 transition-all border-emerald-500/30 bg-emerald-950/20 text-slate-100">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-300">Total Inquiries</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MousePointerClick className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-emerald-400">
              {(stats?.totals?.totalConversions ?? 0).toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-300">
              <span className="font-bold text-white">💬 {stats?.totals?.whatsappClicks ?? 0} WA</span>
              <span>·</span>
              <span className="font-bold text-white">📞 {stats?.totals?.phoneCalls ?? 0} Calls</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Conversion Rate % */}
        <Card className="hover:border-primary/40 transition-all bg-slate-900 border-slate-800 text-slate-100">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-300">Conversion Rate</span>
              <div className="h-8 w-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-black text-purple-400">
              {stats?.totals?.conversionRate ?? "0.0%"}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-300">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>Avg dwell: ~{stats?.totals?.avgDwellSeconds ?? 60}s per visit</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic & Conversion Trend Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Traffic & Conversion Timeline
              </CardTitle>
              <CardDescription>Daily page views, unique visitors, and customer inquiries</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Page views
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Visitors
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Leads
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.timeline || []} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} />
                <YAxis tick={{ fontSize: 11 }} stroke="currentColor" opacity={0.5} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsGrad)" />
                <Area type="monotone" dataKey="uniqueVisitors" name="Unique Visitors" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#visitorsGrad)" />
                <Area type="monotone" dataKey="conversions" name="Leads & Clicks" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#convGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Grid: Geolocation vs Device Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Module 1: Visitor Geolocation (Country & Singapore Regions) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Visitor Geolocation & Locations
              </CardTitle>
              {/* Country vs Singapore Regions tab */}
              <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg text-[11px] font-bold">
                <button
                  onClick={() => setLocationTab("countries")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    locationTab === "countries" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Countries
                </button>
                <button
                  onClick={() => setLocationTab("sg_regions")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    locationTab === "sg_regions" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  SG Regions
                </button>
              </div>
            </div>
            <CardDescription>
              {locationTab === "countries" ? "Origin country of inbound site visitors" : "Estimated Singapore planning district distribution"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {locationTab === "countries" ? (
              (stats?.locations || []).map((loc) => (
                <div key={loc.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold flex items-center gap-2 text-white">
                      <span className="text-base">{loc.flag}</span>
                      <span>{loc.country}</span>
                    </span>
                    <span className="font-mono text-slate-300">
                      <span className="font-bold text-white">{loc.count.toLocaleString()}</span> ({loc.percentage}%)
                    </span>
                  </div>
                  <Progress value={loc.percentage} className="h-2 bg-slate-800" />
                </div>
              ))
            ) : (
              (stats?.sgRegions || []).map((reg) => (
                <div key={reg.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold flex items-center gap-2 text-white">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{reg.name}</span>
                    </span>
                    <span className="font-mono text-slate-300">
                      <span className="font-bold text-white">{reg.count}</span> ({reg.share})
                    </span>
                  </div>
                  <Progress value={parseInt(reg.share, 10)} className="h-2 bg-slate-800" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Module 2: Device Breakdown (PC vs Phone vs Tablet) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Laptop className="h-4 w-4 text-cyan-500" />
                Device & Platform Attribution
              </CardTitle>
              {/* Device vs OS vs Browser tab */}
              <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg text-[11px] font-bold">
                <button
                  onClick={() => setDeviceTab("device")}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    deviceTab === "device" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Device
                </button>
                <button
                  onClick={() => setDeviceTab("os")}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    deviceTab === "os" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  OS
                </button>
                <button
                  onClick={() => setDeviceTab("browser")}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    deviceTab === "browser" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Browser
                </button>
              </div>
            </div>
            <CardDescription>
              {deviceTab === "device"
                ? "Phone vs PC vs Tablet breakdown"
                : deviceTab === "os"
                ? "Mobile and Desktop Operating Systems"
                : "Web browser engines used by visitors"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceTab === "device" && (
              <div className="space-y-4">
                {(stats?.devices || []).map((d) => (
                  <div key={d.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold flex items-center gap-2 text-white">
                        {d.type === "mobile" && <Smartphone className="h-4 w-4 text-emerald-400" />}
                        {d.type === "desktop" && <Laptop className="h-4 w-4 text-blue-400" />}
                        {d.type === "tablet" && <Tablet className="h-4 w-4 text-amber-400" />}
                        <span>{d.name}</span>
                      </span>
                      <span className="font-mono text-slate-300">
                        <span className="font-bold text-white">{d.count}</span> ({d.percentage}%)
                      </span>
                    </div>
                    <Progress
                      value={d.percentage}
                      className={`h-2.5 bg-slate-800 ${
                        d.type === "mobile" ? "[&>div]:bg-emerald-500" : d.type === "desktop" ? "[&>div]:bg-blue-500" : "[&>div]:bg-amber-500"
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {deviceTab === "os" && (
              <div className="space-y-3">
                {(stats?.operatingSystems || []).map((os) => (
                  <div key={os.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{os.name}</span>
                      <span className="font-mono text-slate-300">
                        <span className="font-bold text-white">{os.count}</span> ({os.percentage}%)
                      </span>
                    </div>
                    <Progress value={os.percentage} className="h-2 bg-slate-800" />
                  </div>
                ))}
              </div>
            )}

            {deviceTab === "browser" && (
              <div className="space-y-3">
                {(stats?.browsers || []).map((b) => (
                  <div key={b.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{b.name}</span>
                      <span className="font-mono text-slate-300">
                        <span className="font-bold text-white">{b.count}</span> ({b.percentage}%)
                      </span>
                    </div>
                    <Progress value={b.percentage} className="h-2 bg-slate-800" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel & Traffic Acquisition Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Module 3: Conversion Funnel */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
              <Layers className="h-4 w-4 text-purple-400" />
              Customer Conversion Funnel
            </CardTitle>
            <CardDescription className="text-slate-300">From initial visit to confirmed WhatsApp / Call inquiry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(stats?.funnel || []).map((step, idx) => (
              <div key={step.step} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`h-6 w-6 rounded-md flex items-center justify-center font-black text-[11px] shrink-0 ${
                    idx === 3 ? "bg-emerald-500 text-white" : "bg-primary/20 text-primary"
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="font-bold text-white truncate">{step.step}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-white">{step.count}</span>
                  <span className="text-[11px] text-slate-300 ml-1.5 font-medium">({step.percentage}%)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Module 4: Traffic Acquisition / Referrers */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
              <Share2 className="h-4 w-4 text-blue-400" />
              Traffic Sources & Acquisition Channels
            </CardTitle>
            <CardDescription className="text-slate-300">Where your visitors and inquiries are coming from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {(stats?.referrers || []).map((ref) => (
              <div key={ref.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{ref.source}</span>
                  <span className="font-mono text-slate-300">
                    <span className="font-bold text-white">{ref.count}</span> ({ref.percentage}%)
                  </span>
                </div>
                <Progress value={ref.percentage} className="h-2 bg-slate-800" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Module 5: Real-Time Live Activity Stream */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                Live Visitor Activity Stream
              </CardTitle>
              <CardDescription className="text-slate-300">Recent visitor events, clicks, and inquiries recorded anonymously</CardDescription>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-300">
              Last {(stats?.liveFeed || []).length} events
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-800">
            {(stats?.liveFeed || []).map((e) => (
              <div key={e.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0" title={e.country}>{e.countryFlag}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                      <span>{e.label}</span>
                      {e.eventType.includes("whatsapp") && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px] py-0 px-1.5">
                          WhatsApp
                        </Badge>
                      )}
                      {e.eventType.includes("call") && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px] py-0 px-1.5">
                          Call
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span>{e.device}</span>
                      <span>·</span>
                      <span>{e.city}, {e.country}</span>
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[11px] text-slate-400 shrink-0 text-right">
                  {e.timeAgo}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
