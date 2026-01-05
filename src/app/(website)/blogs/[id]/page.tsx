import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getBlogPostMetadata,
  getBlogSummaries,
} from "@/data/blog-posts";
import { BlogDetailClient } from "../BlogDetailClient";

type BlogDetailPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return getBlogPostMetadata().map((post) => ({ id: post.slug }));
}

export function generateMetadata({
  params,
}: BlogDetailPageProps): Metadata {
  const post = getBlogPostBySlug(params.id);
  if (!post) {
    return {
      title: "Blog not found | PartsQuote",
    };
  }
  const url = `https://www.partsquote.co.uk/blogs/${post.slug}`;
  return {
    title: `${post.title} | PartsQuote Blog`,
    description: post.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url,
      type: "article",
      images: [
        {
          url: post.heroImage,
          alt: post.title,
        },
      ],
    },
  };
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
    <BlogDetailClient post={post} trendingArticles={trendingArticles} />
  );
}
