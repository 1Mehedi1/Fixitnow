import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Outfit, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"
import { defaultSiteConfig } from "@/lib/site"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#141318" },
  ],
}

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
})

import { getBaseUrl, buildLocalBusinessSchema } from "@/lib/seo"

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${defaultSiteConfig.brand} — Licensed Electrician, Handyman & Home Services Singapore`,
    template: `%s | ${defaultSiteConfig.brand} Singapore`,
  },
  description: `Licensed electrician, handyman, roofing & waterproofing, painting services, and plumbing repair across Singapore. Direct trade rates by 4R ENGINEERING PTE. LTD. (UEN 202143324G).`,
  keywords: [
    "electrician Singapore",
    "licensed electrician Singapore",
    "electrical rewiring Singapore",
    "power trip repair Singapore",
    "emergency electrician Singapore",
    "handyman Singapore",
    "HDB handyman service",
    "home repair Singapore",
    "TV wall mounting Singapore",
    "roofing Singapore",
    "waterproofing Singapore",
    "roof leak repair Singapore",
    "painting services Singapore",
    "house painting Singapore",
    "plumbing Singapore",
    "toilet leaking repair Singapore",
    "4R Engineering Pte Ltd",
  ],
  authors: [{ name: defaultSiteConfig.workerName }],
  creator: defaultSiteConfig.workerName,
  publisher: "4R ENGINEERING PTE. LTD.",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: `${defaultSiteConfig.brand} — Licensed Electrician, Handyman & Home Services Singapore`,
    description: `Direct trade contractor in Singapore. Licensed electrician, handyman, roofing & waterproofing, painting, and plumbing.`,
    url: baseUrl,
    siteName: defaultSiteConfig.brand,
    locale: "en_SG",
    type: "website",
    images: [
      {
        url: `${baseUrl}/hero/hero-1.webp`,
        width: 1200,
        height: 630,
        alt: `${defaultSiteConfig.brand} Singapore Trade Contractor`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${defaultSiteConfig.brand} — Licensed Electrician & Handyman Singapore`,
    description: "Direct trade contractor across Singapore homes",
    images: [`${baseUrl}/hero/hero-1.webp`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const globalSchema = buildLocalBusinessSchema(defaultSiteConfig)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var userToggled = localStorage.getItem('user_toggled_theme');
                  var isMobile = (window.innerWidth < 768) || /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                  
                  if (isMobile && !userToggled) {
                    // Mobile default is strictly DARK MODE
                    localStorage.setItem('theme', 'dark');
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  } else if (isMobile) {
                    localStorage.setItem('theme', 'dark');
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${jakartaSans.variable} ${geistMono.variable} ${outfit.variable} antialiased bg-background text-foreground`}
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
