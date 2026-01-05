import type { Metadata } from "next";
import { getBlogSummaries } from "@/data/blog-posts";
import { BlogsPageClient } from "./BlogsPageClient";

export const metadata: Metadata = {
  title: "Automotive News & Guides | PartsQuote Blog",
  description:
    "Read PartsQuote insights on EV technology, detailed reviews, and buying advice for UK drivers and suppliers.",
  alternates: {
    canonical: "https://www.partsquote.co.uk/blogs",
  },
};

export default function BlogsPage() {
  const posts = getBlogSummaries();
  return <BlogsPageClient posts={posts} />;
}
