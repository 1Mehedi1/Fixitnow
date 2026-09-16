import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"
import { siteConfig } from "@/lib/site"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: `${siteConfig.brand} — ${siteConfig.tagline}`,
  description: `Singapore home-services specialist: plumbing, painting, renovation, electrical & interior works by ${siteConfig.name}. ${siteConfig.yearsExperience}+ years, ${siteConfig.jobsCompleted}+ jobs completed.`,
  keywords: [
    "Singapore handyman",
    "HDB renovation",
    "plumbing Singapore",
    "painting HDB",
    "electrical Singapore",
    "interior works",
    "home repair Singapore",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.brand} — ${siteConfig.tagline}`,
    description: `Premium home-services worker in Singapore. Plumbing, painting, renovation, electrical, interior works.`,
    siteName: siteConfig.brand,
    type: "website",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.brand,
    description: "Singapore home-services specialist",
  },
  icons: { icon: "/logo.svg" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
