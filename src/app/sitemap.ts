import type { MetadataRoute } from "next";

import { mockBlogPosts } from "@/lib/mock-data";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/rolam",
    "/szolgaltatasok",
    "/orarend",
    "/foglalas",
    "/blog",
    "/kapcsolat",
  ].map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const blogRoutes = mockBlogPosts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  return [...staticRoutes, ...blogRoutes];
}
