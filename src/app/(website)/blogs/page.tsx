import { getBlogSummaries } from "@/data/blog-posts";
import { BlogsPageClient } from "./BlogsPageClient";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Automotive News & Guides | PartsQuote Blog",
  description:
    "Read PartsQuote insights on EV technology, detailed reviews, and buying advice for UK drivers and suppliers.",
  path: "/blogs",
  keywords: ["automotive blog", "car parts industry news", "PartsQuote insights"],
  openGraph: {
    type: "website",
  },
});

export default function BlogsPage() {
  const posts = getBlogSummaries();
  return <BlogsPageClient posts={posts} />;
}
