import type { MetadataRoute } from "next"
import { getBaseUrl } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
