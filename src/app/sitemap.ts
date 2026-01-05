import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { absoluteUrl, marketingRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const marketingEntries: MetadataRoute.Sitemap = marketingRoutes.map(
    (path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : 0.7,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blogs/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...marketingEntries, ...blogEntries];
}
