import type { MetadataRoute } from "next"
import { getStoredPosts } from "@/lib/posts-store"
import { getBaseUrl, CORE_SERVICES } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()
  const posts = await getStoredPosts().catch(() => [])
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = Object.keys(CORE_SERVICES).map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.published !== false)
    .map((p) => ({
      url: `${baseUrl}/work/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.createdAt || now),
      changeFrequency: "weekly",
      priority: p.featured ? 0.8 : 0.7,
    }))

  return [...staticRoutes, ...serviceRoutes, ...postRoutes]
}
