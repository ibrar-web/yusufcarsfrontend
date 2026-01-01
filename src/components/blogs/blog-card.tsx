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
  const excerpt = buildBlogExcerpt(blog, variant === "featured" ? 240 : 160);
  const layoutClasses =
    orientation === "horizontal"
      ? "flex gap-4 sm:gap-6 items-start"
      : "flex flex-col";

  return (
    <Link
      href={href}
      className={cn(
        "group rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <div className={layoutClasses}>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800",
            orientation === "horizontal" ? "h-40 w-40 min-w-[10rem]" : "h-48 w-full"
          )}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-800/80 to-slate-700/70" />
          )}
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
          <div className="text-sm text-muted-foreground">
            {formatBlogDate(blog.publishedAt ?? blog.createdAt)}
            {authorName ? ` · ${authorName}` : ""}
            {typeof blog.views === "number"
              ? ` · ${blog.views.toLocaleString()} views`
              : ""}
          </div>
          <h3
            className={cn(
              "text-2xl font-semibold leading-tight tracking-tight text-foreground transition group-hover:text-primary",
              variant === "featured" ? "text-3xl" : ""
            )}
          >
            {blog.title}
          </h3>
          {showExcerpt && excerpt ? (
            <p className="text-base text-muted-foreground">
              {excerpt}
            </p>
          ) : null}
          <div className="text-sm font-semibold text-primary">
            Read more →
          </div>
        </div>
      </div>
    </Link>
  );
}
