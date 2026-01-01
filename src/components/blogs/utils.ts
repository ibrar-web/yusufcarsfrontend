import type { BlogAuthor, BlogRecord } from "@/types/blog";
import { environment } from "@/utils/environment";

export const blogApiOrigin =
  environment.apiBaseUrl?.replace(/\/api\/?.*$/i, "") ?? "";

export const formatBlogDate = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatBlogAuthor = (author?: BlogAuthor | null) => {
  if (!author) return "";
  if (author.displayName?.trim()) return author.displayName.trim();
  const candidate = [author.firstName, author.lastName]
    .filter((part) => part && part.trim())
    .join(" ")
    .trim();
  return candidate || "";
};

export const ensureAbsoluteMediaUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  if (!blogApiOrigin) {
    return value.startsWith("/") ? value : `/${value}`;
  }
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${blogApiOrigin}${normalized}`;
};

export const buildBlogExcerpt = (
  blog: BlogRecord,
  maxLength = 180
): string => {
  const source =
    blog.excerpt ??
    blog.seoDescription ??
    blog.content?.replace(/<[^>]+>/g, "") ??
    "";
  if (source.length <= maxLength) {
    return source;
  }
  return `${source.slice(0, maxLength).trim()}…`;
};

export const resolveBlogImage = (blog: BlogRecord) => {
  const candidate =
    blog.images?.[0] ?? blog.seoImageUrl ?? blog.videoUrl ?? null;
  return ensureAbsoluteMediaUrl(candidate);
};
