import { getBlogSummaries } from "@/data/blog-posts";
import { BlogDetailClient } from "../BlogDetailClient";
import { createMetadata } from "@/lib/seo";
import { ArticleStructuredData } from "@/components/seo/article-structured-data";
import { loadBlogPost } from "@/lib/blogs-service";

type BlogDetailPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps) {
  const { post } = await loadBlogPost(params.id);
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

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { post } = await loadBlogPost(params.id);
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
