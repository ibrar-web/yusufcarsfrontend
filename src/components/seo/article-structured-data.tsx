import Script from "next/script";
import type { BlogPost } from "@/data/blog-posts";
import { absoluteUrl, siteConfig } from "@/lib/seo";

type ArticleStructuredDataProps = {
  post: BlogPost;
};

export function ArticleStructuredData({ post }: ArticleStructuredDataProps) {
  const url = absoluteUrl(`/blogs/${post.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    image: post.heroImage,
    mainEntityOfPage: url,
  };

  return (
    <Script
      id={`article-structured-data-${post.slug}`}
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(structuredData)}
    </Script>
  );
}
