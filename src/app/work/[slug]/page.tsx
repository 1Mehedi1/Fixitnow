import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Calendar,
  MapPin,
  Eye,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { getStoredPosts, getStoredPostBySlug } from "@/lib/posts-store"
import { getStoredSiteSettings } from "@/lib/settings-store"
import { defaultSiteConfig, whatsappLink } from "@/lib/site"
import {
  getBaseUrl,
  buildProjectSchema,
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildFaqSchema,
  CORE_SERVICES,
} from "@/lib/seo"
import { Header } from "@/components/site/Header"
import { Footer } from "@/components/site/Footer"
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider"
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat"
import { ScrollToTop } from "@/components/site/ScrollToTop"
import { SiteSettingsProvider } from "@/components/site-settings-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"
export const revalidate = 0

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getStoredPosts().catch(() => [])
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getStoredPostBySlug(slug)
  const settings = await getStoredSiteSettings().catch(() => defaultSiteConfig)
  const baseUrl = getBaseUrl()

  if (!post) {
    return {
      title: "Project Not Found | Fixitnow Singapore",
      description: "The requested project portfolio page could not be found.",
    }
  }

  const categoryName = post.category || "Home Services"
  const title = `${post.title} | ${categoryName} Singapore | ${settings.brand}`
  const description =
    post.excerpt ||
    `Verified ${categoryName.toLowerCase()} project completed across Singapore homes by ${settings.brand} (${settings.companyName}). Call or WhatsApp for direct quote.`
  const coverImage = post.coverImage || post.images?.[0]?.url || `${baseUrl}/hero/hero-1.webp`
  const canonicalUrl = `${baseUrl}/work/${post.slug}`

  return {
    title,
    description,
    keywords: [
      post.title,
      categoryName,
      `${categoryName} Singapore`,
      "handyman Singapore",
      "licensed electrician Singapore",
      "4R Engineering Pte Ltd",
      "HDB repair Singapore",
      ...(post.tags ? post.tags.split(",").map((t) => t.trim()) : []),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: `${settings.brand} — ${settings.companyName}`,
      locale: "en_SG",
      type: "article",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
    },
  }
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getStoredPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const settings = await getStoredSiteSettings().catch(() => defaultSiteConfig)
  const allPosts = await getStoredPosts().catch(() => [])
  const baseUrl = getBaseUrl()

  const beforeImg = post.images?.find((i) => i.kind === "before")
  const afterImg = post.images?.find((i) => i.kind === "after")
  const galleryImgs = post.images?.filter((i) => i.kind === "gallery") || []
  const hasSlider = Boolean(beforeImg && afterImg)
  const mainImage = post.coverImage || post.images?.[0]?.url || `${baseUrl}/hero/hero-1.webp`

  // Related posts (excluding current post)
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.slug !== post.slug)
    .slice(0, 3)

  // Context-tailored WhatsApp quote message
  const waQuoteText = `Hi ${settings.workerName}, I saw your project "${post.title}" on ${settings.brand}. Can I get an estimate/quote for a similar job in Singapore?`

  // Matched core service
  const matchedServiceSlug = Object.keys(CORE_SERVICES).find((key) => {
    const s = CORE_SERVICES[key]
    return (
      (post.category && s.title.toLowerCase().includes(post.category.toLowerCase())) ||
      (post.tags && post.tags.toLowerCase().includes(s.key))
    )
  })

  // Local Singapore FAQs for this project
  const projectFaqs = [
    {
      question: `How long does a job like "${post.title}" typically take in Singapore?`,
      answer:
        "Most standard residential repair, replacement, or overhaul jobs are completed within 1 to 3 days depending on scope and curing times. Emergency electrical and plumbing calls are often resolved within the same day.",
    },
    {
      question: "Are your works warrantied and compliant with Singapore building & safety standards?",
      answer:
        "Yes. All projects conducted by 4R ENGINEERING PTE. LTD. (UEN: 202143324G) comply strictly with EMA, PUB, and BCA guidelines and include a transparent workmanship warranty.",
    },
    {
      question: "Can I get an immediate quote before scheduling an on-site visit?",
      answer:
        "Yes! Send us photos or videos of the issue or floor plan on WhatsApp. We provide upfront, transparent estimates with zero hidden middleman fees.",
    },
  ]

  // Structured Data JSON-LD Schemas
  const projectSchema = buildProjectSchema(post, settings)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${baseUrl}/` },
    { name: "Selected Work", url: `${baseUrl}/work` },
    { name: post.title, url: `${baseUrl}/work/${post.slug}` },
  ])
  const localBusinessSchema = buildLocalBusinessSchema(settings)
  const faqSchema = buildFaqSchema(projectFaqs)

  return (
    <SiteSettingsProvider settings={settings}>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <div className="h-[96px] sm:h-[100px] w-full shrink-0" aria-hidden="true" />

        <main className="flex-1 w-full pb-16 md:pb-24">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link href="/work" className="hover:text-primary transition-colors">
                Selected Work
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">
                {post.title}
              </span>
            </nav>

            {/* Back link */}
            <div className="mb-4">
              <Link
                href="/work"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to All Work
              </Link>
            </div>

            {/* Header Area */}
            <header className="space-y-4 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                {post.featured && (
                  <Badge className="bg-amber-500/20 text-amber-500 dark:text-amber-400 font-bold border border-amber-500/30 text-xs">
                    ⭐ Featured Project
                  </Badge>
                )}
                {post.category && (
                  <Badge variant="secondary" className="font-semibold text-xs">
                    {post.category}
                  </Badge>
                )}
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Trade Work
                </Badge>
              </div>

              {/* Exactly one H1 for SEO */}
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground text-balance leading-tight">
                {post.title}
              </h1>

              {/* Meta detail pill strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-1 pb-2 border-b border-border/50">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {new Date(post.createdAt).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                  {settings.location || "Singapore · Islandwide"}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
                  {settings.companyName || "4R ENGINEERING PTE. LTD."}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-blue-500" />
                  {(post.views || 0) + 1} views
                </span>
              </div>
            </header>

            {/* Main Visual Showcase (Before/After Slider or High-Res Hero) */}
            <div className="mb-10 rounded-2xl overflow-hidden border border-border/80 shadow-lg bg-card">
              {hasSlider && beforeImg && afterImg ? (
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="relative rounded-xl overflow-hidden shadow-inner">
                    <BeforeAfterSlider
                      before={beforeImg.url}
                      after={afterImg.url}
                      alt={post.title}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground px-2 pt-1 font-medium">
                    <span className="text-primary font-bold">◀ Before / After Comparison ▶</span>
                    <span>Drag slider to inspect transformation</span>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-muted">
                  <img
                    src={mainImage}
                    alt={`${post.title} — Singapore trade project`}
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Content & Case Study Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Left 2 Cols: Excerpt, Project Scope & Markdown Body */}
              <div className="lg:col-span-2 space-y-6">
                {post.excerpt && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/60 text-sm sm:text-base leading-relaxed font-medium text-foreground/90">
                    {post.excerpt}
                  </div>
                )}

                {post.content ? (
                  <article className="prose prose-stone dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed break-words">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </article>
                ) : (
                  <div className="prose prose-stone dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
                    <p>
                      This project was completed on-site in Singapore adhering strictly to our workmanship standards and safety protocols. Every phase was executed with premium materials and zero middleman markups.
                    </p>
                  </div>
                )}

                {/* Additional Gallery Photos if available */}
                {galleryImgs.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <h2 className="font-display font-bold text-lg sm:text-xl text-foreground">
                      Additional Project Photos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {galleryImgs.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border/60 shadow-xs"
                        >
                          <img
                            src={img.url}
                            alt={`${post.title} photo ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Local Singapore FAQs for this Project Type */}
                <div className="pt-6 space-y-4">
                  <h2 className="font-display font-bold text-lg sm:text-xl text-foreground">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {projectFaqs.map((faq, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border/70 bg-card p-4 space-y-1.5 shadow-xs"
                      >
                        <h3 className="font-bold text-sm text-foreground">
                          {faq.question}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: High-Converting Quote Box & Trade Specs */}
              <div className="space-y-6">
                {/* Instant Quote Card */}
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10 border-2 border-emerald-500/30 p-5 space-y-4 shadow-md sticky top-28">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Direct Trade Contractor
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-foreground leading-snug">
                    Need a similar job done at your place?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Send photos on WhatsApp for an immediate, upfront price estimate. 0% broker fee.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <Button
                      asChild
                      className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm h-11 px-4 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <a
                        href={whatsappLink(settings, waQuoteText)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        WhatsApp Photo for Quote
                      </a>
                    </Button>

                    {settings.phone && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full h-10 text-xs font-semibold hover:border-emerald-500/50 cursor-pointer"
                      >
                        <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>
                          <Phone className="h-3.5 w-3.5 mr-2 text-emerald-600 dark:text-emerald-400" />
                          Call: {settings.phone}
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Trust credentials */}
                  <div className="pt-3 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{settings.companyName} (UEN {settings.companyUen})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{settings.yearsExperience}+ Years Hands-On Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Islandwide Singapore Coverage</span>
                    </div>
                  </div>

                  {/* Link to matching service hub */}
                  {matchedServiceSlug && (
                    <div className="pt-2">
                      <Link
                        href={`/services/${matchedServiceSlug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Explore all {CORE_SERVICES[matchedServiceSlug].title}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Work / Internal Linking Section */}
            {relatedPosts.length > 0 && (
              <section className="pt-8 border-t border-border/70 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      More Completed Work
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Browse other verified projects across Singapore.
                    </p>
                  </div>
                  <Link
                    href="/work"
                    className="text-xs sm:text-sm font-semibold text-primary hover:underline"
                  >
                    View all work →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedPosts.map((rPost) => {
                    const rCover =
                      rPost.coverImage ||
                      rPost.images?.find((i) => i.kind === "after")?.url ||
                      rPost.images?.[0]?.url ||
                      `${baseUrl}/hero/hero-1.webp`

                    return (
                      <Link
                        key={rPost.id}
                        href={`/work/${rPost.slug}`}
                        className="group block rounded-xl overflow-hidden border border-border/70 bg-card hover:border-primary/40 hover:shadow-lg transition-all"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                          <img
                            src={rCover}
                            alt={rPost.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {rPost.category && (
                            <Badge className="absolute top-2.5 left-2.5 bg-black/70 text-white text-[10px] backdrop-blur-xs border-0">
                              {rPost.category}
                            </Badge>
                          )}
                        </div>
                        <div className="p-4 space-y-1.5">
                          <h3 className="font-display font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {rPost.title}
                          </h3>
                          {rPost.excerpt && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {rPost.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />
        <WhatsAppFloat />
        <ScrollToTop />
      </div>
    </SiteSettingsProvider>
  )
}
