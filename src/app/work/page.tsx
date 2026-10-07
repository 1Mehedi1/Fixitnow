import type { Metadata } from "next"
import Link from "next/link"
import { getStoredPosts } from "@/lib/posts-store"
import { getStoredSiteSettings } from "@/lib/settings-store"
import { defaultSiteConfig, whatsappLink } from "@/lib/site"
import { getBaseUrl, buildBreadcrumbSchema, buildLocalBusinessSchema } from "@/lib/seo"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { ScrollToTop } from "@/components/site/ScrollToTop"
import { SiteSettingsProvider } from "@/components/site-settings-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, ArrowRight, ShieldCheck, MapPin } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoredSiteSettings().catch(() => defaultSiteConfig)
  const baseUrl = getBaseUrl()

  return {
    title: `Selected Work & Portfolio | ${settings.brand} Singapore`,
    description: `Browse completed electrical, roofing & waterproofing, painting, and plumbing jobs across Singapore homes by ${settings.brand} (${settings.companyName}). Real transformations, honest rates.`,
    keywords: [
      "Singapore handyman portfolio",
      "licensed electrician Singapore case studies",
      "roof leak repair Singapore photos",
      "house painting Singapore before after",
      "toilet plumbing repair Singapore",
      "4R Engineering Pte Ltd work",
    ],
    alternates: {
      canonical: `${baseUrl}/work`,
    },
    openGraph: {
      title: `Selected Work & Portfolio | ${settings.brand} Singapore`,
      description: `Browse completed trade projects across Singapore homes with before/after transformations.`,
      url: `${baseUrl}/work`,
      siteName: settings.brand,
      locale: "en_SG",
      type: "website",
    },
  }
}

export default async function WorkArchivePage() {
  const posts = await getStoredPosts().catch(() => [])
  const settings = await getStoredSiteSettings().catch(() => defaultSiteConfig)
  const baseUrl = getBaseUrl()

  const published = posts.filter((p) => p.published !== false)

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Selected Work", url: `${baseUrl}/work` },
  ])
  const localBusinessSchema = buildLocalBusinessSchema(settings)

  return (
    <SiteSettingsProvider settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <div className="h-[96px] sm:h-[100px] w-full shrink-0" aria-hidden="true" />

        <main className="flex-1 w-full pb-16 md:pb-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
            {/* Header Hero */}
            <div className="max-w-3xl mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Singapore Trade Work
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground text-balance">
                Real jobs. Real homes. Done properly.
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
                Explore our portfolio of completed electrical rewiring, roofing leak repairs, house painting, and plumbing projects across HDB flats, condominiums, and landed homes in Singapore.
              </p>
            </div>

            {/* Grid of Work */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {published.map((post) => {
                const before = post.images?.find((x) => x.kind === "before")
                const after = post.images?.find((x) => x.kind === "after")
                const hasBeforeAfter = Boolean(before && after)
                const cover =
                  post.coverImage ||
                  after?.url ||
                  before?.url ||
                  post.images?.[0]?.url ||
                  `${baseUrl}/hero/hero-1.webp`

                return (
                  <article key={post.id} className="group">
                    <Card className="overflow-hidden p-0 gap-0 border-border/80 hover:border-primary/40 hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-card">
                      <Link href={`/work/${post.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        {hasBeforeAfter && before && after ? (
                          <div className="absolute inset-0 flex">
                            <div className="relative w-1/2 h-full overflow-hidden border-r border-white/40">
                              <img
                                src={before.url}
                                alt={`${post.title} Before`}
                                decoding="async"
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <span className="absolute bottom-2 left-2 z-10 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                Before
                              </span>
                            </div>
                            <div className="relative w-1/2 h-full overflow-hidden">
                              <img
                                src={after.url}
                                alt={`${post.title} After`}
                                decoding="async"
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <span className="absolute bottom-2 right-2 z-10 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                After
                              </span>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={cover}
                            alt={post.title}
                            decoding="async"
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        )}

                        <div className="absolute top-3 left-3 flex gap-1.5 z-10 flex-wrap">
                          {post.featured && (
                            <Badge className="bg-primary text-primary-foreground text-[10px]">
                              Featured
                            </Badge>
                          )}
                          {post.category && (
                            <Badge variant="secondary" className="bg-white/95 text-stone-900 font-bold text-[10px]">
                              {post.category}
                            </Badge>
                          )}
                        </div>

                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full">
                          <Eye className="h-3 w-3" /> View Project
                        </div>
                      </Link>

                      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <h2 className="font-display font-bold text-base sm:text-lg leading-snug group-hover:text-primary transition-colors">
                            <Link href={`/work/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>
                          {post.excerpt && (
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                            Singapore · Islandwide
                          </span>
                          <Link
                            href={`/work/${post.slug}`}
                            className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Details
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </article>
                )
              })}
            </div>
          </div>
        </main>

        <Footer />
        <WhatsAppFloat />
        <ScrollToTop />
      </div>
    </SiteSettingsProvider>
  )
}
