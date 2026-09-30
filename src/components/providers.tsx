"use client"

import { useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider, useTheme } from "next-themes"

function MobileThemeInitializer() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme")
      if (!saved) {
        const isMobile =
          window.innerWidth < 768 ||
          /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        if (isMobile && theme !== "dark") {
          setTheme("dark")
        }
      }
    } catch {}
  }, [theme, setTheme])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MobileThemeInitializer />
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
