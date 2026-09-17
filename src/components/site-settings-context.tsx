"use client"

import { createContext, useContext, type ReactNode } from "react"
import { defaultSiteConfig, type SiteSettingsT } from "@/lib/site"

const SettingsContext = createContext<SiteSettingsT>(defaultSiteConfig)

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettingsT
  children: ReactNode
}) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

/** Returns the live site settings (loaded server-side via loadSiteSettings()). */
export function useSiteSettings(): SiteSettingsT {
  return useContext(SettingsContext)
}
