import type { MetadataRoute } from "next"

import { siteOrigin } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_edge-health"],
    },
    sitemap: new URL("/sitemap.xml", siteOrigin()).href,
  }
}
