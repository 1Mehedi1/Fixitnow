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

export const metadata: Metadata = {
  title: `${defaultSiteConfig.brand} — ${defaultSiteConfig.tagline}`,
  description: `Singapore trade specialist: roofing & waterproofing, painting services, and plumbing repair. ${defaultSiteConfig.yearsExperience}+ years, ${defaultSiteConfig.jobsCompleted}+ jobs completed.`,
  keywords: [
    "Roofing Singapore",
    "Waterproofing Singapore",
    "Roof leak repair",
    "Canopy repair",
    "Roof tiles installation",
    "Painting services Singapore",
    "Epoxy painting",
    "House painting HDB",
    "Office painting",
    "Plumbing Singapore",
    "Toilet leaking repair",
  ],
  authors: [{ name: defaultSiteConfig.workerName }],
  openGraph: {
    title: `${defaultSiteConfig.brand} — ${defaultSiteConfig.tagline}`,
    description: `Premium trade contractor in Singapore. Roofing & waterproofing, painting services, and plumbing repair.`,
    siteName: defaultSiteConfig.brand,
    type: "website",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSiteConfig.brand,
    description: "Singapore home-services specialist",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
