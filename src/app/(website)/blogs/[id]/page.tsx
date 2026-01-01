"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { BlogCard } from "@/components/blogs/blog-card";
import {
  fetchTrendingBlogs,
  getBlogDetail,
  listBlogs,
} from "@/services/blogs";
import type { BlogRecord } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import {
  ensureAbsoluteMediaUrl,
  formatBlogAuthor,
  formatBlogDate,
} from "@/components/blogs/utils";

const renderContent = (content?: string | null) => {
  if (!content) return null;
  if (/<\/?[a-z][\s\S]*>/i.test(content)) {
    return (
      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return content.split("\n").map((paragraph, index) => (
    <p key={`paragraph-${index}`} className="leading-relaxed text-lg">
      {paragraph}
    </p>
  ));
};

const resolveHeroImage = (blog?: BlogRecord | null) => {
  if (!blog) return null;
  return ensureAbsoluteMediaUrl(blog.images?.[0] ?? blog.seoImageUrl);
};

export default function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const identifier = decodeURIComponent(params.id);
  const [blog, setBlog] = useState<BlogRecord | null>(null);
  const [related, setRelated] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detail, trending, latest] = await Promise.all([
          getBlogDetail(identifier),
          fetchTrendingBlogs(),
          listBlogs({ limit: 6 }),
        ]);
        if (!active) return;
        setBlog(detail);
        const relatedCandidates = [...trending, ...latest.items];
        setRelated(
          relatedCandidates
            .filter((record) => record.id !== detail.id)
            .slice(0, 3)
        );
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Blog not found.");
        setBlog(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [identifier]);

  const heroImage = useMemo(() => resolveHeroImage(blog), [blog]);

  return (
    <div className="bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all stories
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading article…
          </div>
        ) : blog ? (
          <article className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {blog.categories?.map((category) => (
                  <Badge key={category} className="bg-white/90 text-slate-900">
                    {category}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight">
                {blog.title}
              </h1>
              <p className="text-sm text-white/70">
                {formatBlogDate(blog.publishedAt ?? blog.createdAt)}
                {blog.author ? ` · ${formatBlogAuthor(blog.author)}` : ""}
                {typeof blog.views === "number"
                  ? ` · ${blog.views.toLocaleString()} views`
                  : ""}
              </p>
            </div>

            {heroImage ? (
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={heroImage}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div className="space-y-4 text-white/90">
              {renderContent(blog.content)}
            </div>

            {blog.references?.length ? (
              <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/80">
                <p className="font-semibold uppercase tracking-widest text-white">
                  References
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {blog.references.map((reference) => (
                    <li key={reference}>
                      <a
                        href={reference}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-300 underline"
                      >
                        {reference}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        ) : (
          <div className="rounded-3xl bg-white/10 p-10 text-center text-white/80">
            <p className="text-xl font-semibold">We couldn’t find that post.</p>
            <p className="text-sm text-white/70">{error}</p>
            <Link
              href="/blogs"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-2 font-semibold text-slate-900"
            >
              Browse all articles
            </Link>
          </div>
        )}

        {related.length ? (
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold">Keep reading</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((record) => (
                <BlogCard
                  key={record.id}
                  blog={record}
                  showExcerpt
                  orientation="vertical"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
