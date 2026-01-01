"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import type { BlogRecord } from "@/types/blog";
import {
  buildBlogExcerpt,
  formatBlogAuthor,
  formatBlogDate,
  resolveBlogImage,
} from "@/components/blogs/utils";

type BlogCardProps = {
  blog: BlogRecord;
  orientation?: "vertical" | "horizontal";
  variant?: "default" | "featured";
  showExcerpt?: boolean;
  className?: string;
};

export function BlogCard({
  blog,
  orientation = "vertical",
  variant = "default",
  showExcerpt = true,
  className,
}: BlogCardProps) {
  const imageUrl = resolveBlogImage(blog);
  const authorName = formatBlogAuthor(blog.author);
  const href = `/blogs/${encodeURIComponent(blog.slug ?? blog.id)}`;
  const isFeatured = variant === "featured";
  const isHorizontal = orientation === "horizontal";
  const excerpt = buildBlogExcerpt(
    blog,
    isFeatured ? 260 : isHorizontal ? 140 : 180
  );
  const layoutClasses = cn(
    "flex gap-5 transition",
    isHorizontal ? "flex-row items-start" : "flex-col"
  );

  return (
    <Link
      href={href}
      className={cn(
        "group rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl",
        className
      )}
    >
      <div className={layoutClasses}>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#080d1e] via-[#0f1a35] to-[#1b2750] ring-1 ring-white/5",
            isHorizontal ? "w-36 sm:w-44 lg:w-48 flex-shrink-0" : "w-full",
            isFeatured
              ? "aspect-[20/9] md:aspect-[21/9]"
              : isHorizontal
              ? "aspect-[4/3]"
              : "aspect-[4/3] md:aspect-[16/9]"
          )}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-800/80 to-slate-700/70" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-70 transition group-hover:opacity-40" />
          {blog.categories?.length ? (
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              {blog.categories.slice(0, 2).map((category) => (
                <Badge
                  key={`${blog.id}-${category}`}
                  variant="secondary"
                  className="bg-white/95 text-slate-900"
                >
                  {category}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex-1 space-y-3">
          <h3
            className={cn(
              "text-2xl font-semibold leading-tight tracking-tight text-foreground transition group-hover:text-primary",
              isFeatured ? "text-3xl" : ""
            )}
          >
            {blog.title}
          </h3>
          <div className="text-sm text-muted-foreground">
            {formatBlogDate(blog.publishedAt ?? blog.createdAt)}
            {authorName ? ` · ${authorName}` : ""}
            {typeof blog.views === "number"
              ? ` · ${blog.views.toLocaleString()} views`
              : ""}
          </div>
          {showExcerpt && excerpt ? (
            <p className="text-base text-muted-foreground">{excerpt}</p>
          ) : null}
          <div className="inline-flex items-center text-sm font-semibold text-primary">
            Read more
            <span className="ml-1 transition group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
