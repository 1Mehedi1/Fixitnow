import { Loader2, Sparkles } from "lucide-react"

export function PageLoading({ title = "Loading page..." }: { title?: string }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center animate-in fade-in duration-300">
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
      <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-sm">
        Preparing verified trade information, Singapore rates & photo proof...
      </p>
      {/* Animated shimmer skeleton bar */}
      <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden mt-6">
        <div className="w-full h-full bg-primary/60 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
