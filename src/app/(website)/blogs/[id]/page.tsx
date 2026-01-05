import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getBlogSummaries,
} from "@/data/blog-posts";
import { BlogDetailClient } from "../BlogDetailClient";
import { createMetadata } from "@/lib/seo";
import { ArticleStructuredData } from "@/components/seo/article-structured-data";

type BlogDetailPageProps = {
  params: {
    id: string;
  };
};

export function generateMetadata({ params }: BlogDetailPageProps) {
  const post = getBlogPostBySlug(params.id);
  if (!post) {
    return createMetadata({
      title: "Blog not found | PartsQuote",
      description: "The requested article could not be located.",
      path: "/blogs",
    });
  }
  const path = `/blogs/${post.slug}`;
  return createMetadata({
    title: `${post.title} | PartsQuote Blog`,
    description: post.metaDescription,
    path,
    keywords: post.tags,
    openGraph: {
      type: "article",
      images: [{ url: post.heroImage, alt: post.title }],
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      images: [post.heroImage],
    },
  });
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = getBlogPostBySlug(params.id);
  if (!post) {
    notFound();
  }

  const trendingArticles = getBlogSummaries()
    .filter((article) => article.slug !== post.slug)
    .slice(0, 6);

  return (
    <>
      <ArticleStructuredData post={post} />
      <BlogDetailClient post={post} trendingArticles={trendingArticles} />
    </>
  );
}
