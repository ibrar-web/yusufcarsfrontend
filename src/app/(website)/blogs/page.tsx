"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BlogCard } from "@/components/blogs/blog-card";
import {
  fetchFeaturedBlogs,
  fetchTrendingBlogs,
  listBlogs,
} from "@/services/blogs";
import type { BlogRecord } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles } from "lucide-react";
import useDebounce from "@/components/debouncedSearch/debouncedSearch";

export default function BlogsPage() {
  const [featured, setFeatured] = useState<BlogRecord | null>(null);
  const [trending, setTrending] = useState<BlogRecord[]>([]);
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 9 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchQuery = useDebounce(searchFilter, 400);

  const loadHeroContent = useCallback(async () => {
    setHeroLoading(true);
    try {
      const [featuredBlogs, trendingBlogs] = await Promise.all([
        fetchFeaturedBlogs(),
        fetchTrendingBlogs(),
      ]);
      setFeatured(featuredBlogs[0] ?? trendingBlogs[0] ?? null);
      setTrending(trendingBlogs.slice(0, 6));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load highlighted stories."
      );
    } finally {
      setHeroLoading(false);
    }
  }, []);

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { items, meta: pagination } = await listBlogs({
        page,
        limit: pageSize,
        search: searchQuery || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
      });
      setBlogs(items);
      setMeta({
        total: pagination.total ?? items.length,
        page: pagination.page ?? page,
        limit: pagination.limit ?? pageSize,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load blog articles. Please try again."
      );
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, categoryFilter]);

  useEffect(() => {
    loadHeroContent();
  }, [loadHeroContent]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    const append = (record?: BlogRecord | null) => {
      record?.categories?.forEach((category) => {
        if (category) {
          set.add(category);
        }
      });
    };
    append(featured);
    trending.forEach(append);
    blogs.forEach(append);
    return Array.from(set);
  }, [featured, trending, blogs]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchFilter(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="space-y-10 bg-gradient-to-b from-slate-950 via-slate-900 to-background pb-16 pt-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-lg lg:col-span-2">
            <div className="mb-4 flex items-center gap-3 text-sm uppercase tracking-widest text-amber-300">
              <Sparkles className="h-4 w-4" />
              Knowledge Centre
            </div>
            {heroLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/5 bg-white/10" />
                <Skeleton className="h-6 w-4/5 bg-white/10" />
                <Skeleton className="h-6 w-4/6 bg-white/10" />
              </div>
            ) : featured ? (
              <BlogCard
                blog={featured}
                variant="featured"
                orientation="vertical"
                showExcerpt
                className="bg-white/5 text-white"
              />
            ) : (
              <p className="text-sm text-white/70">
                {error ??
                  "No featured stories yet. Check back soon for industry insights."}
              </p>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-900 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Trending</h2>
            <p className="text-sm text-white/70">
              Stories the car community can&apos;t stop sharing.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {heroLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={`trending-skeleton-${index}`}
                      className="h-16 w-full bg-white/10"
                    />
                  ))
                : trending.slice(0, 4).map((blog) => (
                    <BlogCard
                      key={`trending-${blog.id}`}
                      blog={blog}
                      orientation="horizontal"
                      showExcerpt={false}
                      className="border-none bg-white/10 text-white shadow-none"
                    />
                  ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Latest stories
              </h2>
              <p className="text-sm text-muted-foreground">
                Honest advice, ownership tips, and supplier features—updated
                daily.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search topics"
                  className="pl-9"
                />
              </form>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchFilter || categoryFilter !== "all") && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchInput("");
                    setSearchFilter("");
                    setCategoryFilter("all");
                    setPage(1);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <Skeleton
                    key={`blog-skeleton-${index}`}
                    className="h-64 w-full bg-slate-200"
                  />
                ))
              : blogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    showExcerpt
                    orientation="vertical"
                  />
                ))}
          </div>

          {!loading && !blogs.length ? (
            <div className="py-14 text-center">
              <p className="text-lg font-semibold text-foreground">
                No articles found
              </p>
              <p className="text-sm text-muted-foreground">
                {error ??
                  "Try searching for another topic or reset the filters."}
              </p>
            </div>
          ) : null}

          <TablePagination
            page={page}
            pageSize={pageSize}
            totalItems={meta.total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            className="mt-8"
          />
        </div>
      </div>
    </div>
  );
}
