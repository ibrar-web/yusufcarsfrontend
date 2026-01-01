"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BlogCard } from "@/components/blogs/blog-card";
import {
  fetchFeaturedBlogs,
  fetchTrendingBlogs,
  listBlogs,
} from "@/services/blogs";
import type { BlogRecord } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Newspaper, Search, Sparkles } from "lucide-react";
import useDebounce from "@/components/debouncedSearch/debouncedSearch";
import { cn } from "@/components/ui/utils";
import { resolveBlogImage } from "@/components/blogs/utils";

const sampleStories: BlogRecord[] = [
  {
    id: "sample-ev-buying-guide",
    title: "Ultimate EV Buying Guide for 2025",
    content:
      "Considering an EV this year? We break down incentives, charging myths, and the trims worth your money.",
    excerpt:
      "Considering an EV this year? We break down incentives, charging myths, and the trims worth your money.",
    categories: ["Guides", "EV"],
    images: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=80",
    ],
    seoDescription:
      "Everything UK motorists need to know before switching to an electric vehicle in 2025.",
    publishedAt: "2025-01-10T09:00:00Z",
    author: {
      id: "sample-author-1",
      displayName: "Amelia Reyes",
    },
    views: 13400,
  },

  {
    id: "sample-trackday",
    title: "Track Day Checklist for Daily Drivers",
    content:
      "Suspension torque specs, fluids, and tools you should pack before hitting a UK open track session.",
    categories: ["Motorsport"],
    images: [
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=80",
    ],
    publishedAt: "2024-12-30T08:30:00Z",
    author: {
      id: "sample-author-3",
      displayName: "Dan Pearson",
    },
    views: 7600,
  },
];

export default function BlogsPage() {
  const [featured, setFeatured] = useState<BlogRecord | null>(null);
  const [trending, setTrending] = useState<BlogRecord[]>([]);
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 9 });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const searchFieldRef = useRef<HTMLInputElement | null>(null);

const searchQuery = useDebounce(searchFilter, 400);
const discoveryTopics = [
  "EV Ownership",
  "Motorsport",
    "Detailing",
    "Supplier Diaries",
    "Buying Guides",
    "Maintenance",
];
  const navLinks = [
    { label: "News", href: "#news" },
    { label: "Reviews", href: "#reviews" },
    { label: "Guides", href: "#guides" },
    { label: "Videos", href: "#videos" },
    { label: "Opinion", href: "#opinion" },
  ];

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

  const fetchBlogs = useCallback(
    async (pageToLoad: number, replace = false) => {
      if (pageToLoad === 1 || replace) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const { items, meta: pagination } = await listBlogs({
          page: pageToLoad,
          limit: pageSize,
          search: searchQuery || undefined,
        });

        let nextList: BlogRecord[] = [];
        setBlogs((previous) => {
          if (pageToLoad === 1 || replace) {
            nextList = items;
            return items;
          }
          const merged = new Map(previous.map((entry) => [entry.id, entry]));
          for (const entry of items) {
            merged.set(entry.id, entry);
          }
          nextList = Array.from(merged.values());
          return nextList;
        });

        const nextMeta = {
          total: pagination.total ?? meta.total ?? items.length,
          page: pagination.page ?? pageToLoad,
          limit: pagination.limit ?? pageSize,
        };
        setMeta(nextMeta);
        const estimatedTotal =
          nextMeta.total ??
          nextList.length + (items.length < pageSize ? 0 : pageSize);
        setHasMore(nextList.length < estimatedTotal);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load blog articles. Please try again."
        );
        if (pageToLoad === 1) {
          setBlogs([]);
          setHasMore(false);
        }
      } finally {
        if (pageToLoad === 1 || replace) {
          setInitialLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [meta.total, pageSize, searchQuery]
  );

  useEffect(() => {
    loadHeroContent();
  }, [loadHeroContent]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchBlogs(1, true);
  }, [fetchBlogs, searchQuery]);

  useEffect(() => {
    if (page === 1) return;
    fetchBlogs(page);
  }, [fetchBlogs, page]);

  useEffect(() => {
    if (!hasMore || loadingMore) {
      return;
    }
    const target = loadMoreRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage((current) => current + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

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

  const applyQuickSearch = (term: string) => {
    setSearchInput(term);
    setSearchFilter(term);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const highlightStory = featured ?? trending[0] ?? sampleStories[0];
  const trendingStories =
    trending.length > 0 ? trending.slice(0, 5) : sampleStories;
  const displayStories = blogs.length > 0 ? blogs : sampleStories;
  const totalStories =
    meta.total || displayStories.length || sampleStories.length;
  const totalReaders = (
    displayStories.reduce((acc, story) => acc + (story.views ?? 0), 0) || 21000
  ).toLocaleString();
  const heroImage = resolveBlogImage(highlightStory);
  const heroExcerpt =
    highlightStory?.excerpt ||
    highlightStory?.seoDescription ||
    highlightStory?.content ||
    sampleStories[0].excerpt;
  const heroHref = `/blogs/${encodeURIComponent(
    highlightStory.slug ?? highlightStory.id
  )}`;
  const shotStories = (heroLoading ? sampleStories : displayStories).slice(
    0,
    6
  );

  return (
    <div className="bg-[#030712] pb-16 pt-24 text-white lg:pt-28">
      <section className="relative isolate mx-auto w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 px-5 py-12 shadow-[0_20px_120px_rgba(0,0,0,0.45)] sm:px-8 lg:py-16">
        {heroImage ? (
          <img
            src={heroImage}
            alt={highlightStory.title}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-[#050c1f]/95 to-transparent" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">
              <Sparkles className="h-4 w-4" />
              PartsQuote Journal
            </div>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              The UK&apos;s supplier-first garage stories, daily.
            </h1>
            <p className="max-w-2xl text-base text-white/80 sm:text-lg">
              {heroExcerpt}
            </p>
            <div className="flex flex-wrap gap-8 text-white/70">
              <div>
                <p className="text-3xl font-semibold text-white">
                  {totalStories.toLocaleString()}+
                </p>
                <p className="text-sm uppercase tracking-wide text-white/60">
                  Stories published
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">
                  {totalReaders}
                </p>
                <p className="text-sm uppercase tracking-wide text-white/60">
                  Monthly readers
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">
                  {new Date().getFullYear()}
                </p>
                <p className="text-sm uppercase tracking-wide text-white/60">
                  Current season
                </p>
              </div>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search EVs, tuning, supplier profiles…"
                className="h-14 rounded-2xl border-white/20 bg-white/5 pl-12 text-white placeholder:text-white/60"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-2xl bg-white text-slate-900 hover:bg-white/90"
              >
                Explore
              </Button>
            </form>
            <div className="flex flex-wrap gap-2">
              {discoveryTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => applyQuickSearch(topic)}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white hover:bg-white/10 hover:text-white"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-5 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Featured garage story
            </p>
            <h2 className="text-3xl font-semibold text-white">
              {highlightStory.title}
            </h2>
            <p className="text-sm text-white/80">{heroExcerpt}</p>
            <div className="flex flex-wrap gap-2">
              {highlightStory.categories?.slice(0, 3).map((category) => (
                <span
                  key={`${highlightStory.id}-${category}`}
                  className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-wide text-white/80"
                >
                  {category}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={heroHref}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
              >
                Read feature
              </Link>
              <button
                type="button"
                onClick={() =>
                  applyQuickSearch(
                    highlightStory.categories?.[0] ?? discoveryTopics[0]
                  )
                }
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Discover more
              </button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Trending lineup
              </p>
              <div className="mt-3 space-y-3">
                {trendingStories.slice(0, 3).map((story) => (
                  <Link
                    key={`hero-trend-${story.id}`}
                    href={`/blogs/${encodeURIComponent(
                      story.slug ?? story.id
                    )}`}
                    className="flex flex-col rounded-xl border border-white/0 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
                  >
                    <span className="font-semibold text-white">
                      {story.title}
                    </span>
                    <span className="text-white/60">
                      {story.categories?.[0] ?? "Community"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 lg:gap-10 lg:px-8">
        <section className="rounded-3xl border border-slate-100 bg-white p-6 text-slate-900 shadow-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Daily shots
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Quick reads from the garage
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Micro updates from suppliers, tuners, and detailing crews.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shotStories.map((shot) => {
              const imageUrl = resolveBlogImage(shot);
              return (
                <Link
                  key={`shot-${shot.id}`}
                  href={`/blogs/${encodeURIComponent(shot.slug ?? shot.id)}`}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-200">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={shot.title}
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-slate-200 via-slate-100 to-white" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {shot.categories?.[0] ?? "Community"}
                    </p>
                    <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
                      {shot.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {shot.excerpt ??
                        shot.seoDescription ??
                        "Supplier notes from the workshop floor."}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-rose-200">
            <Flame className="h-4 w-4" />
            Community pulse
          </div>
          <p className="mt-2 text-sm text-white/70">
            Builds, tips, and reviews the PartsQuote fam can&apos;t stop
            sharing.
          </p>
          <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-4">
            {(heroLoading ? sampleStories : trendingStories.slice(0, 6)).map(
              (story) => (
                <div
                  key={`pulse-${story.id}`}
                  className="min-w-[280px] max-w-[320px] snap-start"
                >
                  <BlogCard
                    blog={story}
                    showExcerpt={false}
                    className="h-full border-white/10 bg-black/40 text-white"
                  />
                </div>
              )
            )}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.25fr,0.75fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
            <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-amber-200">
              <Sparkles className="h-4 w-4" />
              Knowledge centre
            </div>
            {heroLoading && initialLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-2/3 rounded-full bg-white/10" />
                <Skeleton className="h-6 w-4/5 rounded-full bg-white/10" />
                <Skeleton className="h-6 w-3/5 rounded-full bg-white/10" />
              </div>
            ) : highlightStory ? (
              <BlogCard
                blog={highlightStory}
                variant="featured"
                orientation="vertical"
                showExcerpt
                className="border-white/15 bg-white/5 text-white"
              />
            ) : (
              <p className="text-sm text-white/70">
                {error ??
                  "No featured stories yet. Check back soon for industry insights."}
              </p>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              Pit wall briefing
            </h2>
            <p className="text-sm text-white/65">
              Supplier dispatches moving the comment sections.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {(heroLoading ? sampleStories : trendingStories)
                .slice(0, 4)
                .map((blog) => (
                  <BlogCard
                    key={`briefing-${blog.id}`}
                    blog={blog}
                    orientation="horizontal"
                    showExcerpt={false}
                    className="border-white/10 bg-white/10 text-white shadow-none"
                  />
                ))}
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-rose-500">
                <Flame className="h-4 w-4" />
                Fresh off the lift
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Latest stories
              </h2>
              <p className="text-sm text-slate-600">
                Honest advice, ownership tips, and supplier features—updated
                daily.
              </p>
            </div>
            {searchFilter && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchInput("");
                  setSearchFilter("");
                  setPage(1);
                }}
                className="text-slate-700 hover:text-slate-900"
              >
                Clear search
              </Button>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {initialLoading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <Skeleton
                    key={`blog-skeleton-${index}`}
                    className="h-64 w-full rounded-3xl bg-slate-200"
                  />
                ))
              : displayStories.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    showExcerpt
                    orientation="vertical"
                  />
                ))}
          </div>

          {!initialLoading && !displayStories.length ? (
            <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No articles found
              </p>
              <p className="text-sm text-slate-600">
                {error ??
                  "Try searching a different term, or come back when suppliers push new stories."}
              </p>
            </div>
          ) : null}

          <div
            ref={loadMoreRef}
            className={cn(
              "mt-4 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500",
              loadingMore && "border-rose-200 bg-rose-50"
            )}
          >
            {loadingMore ? (
              <>
                <Newspaper className="h-5 w-5 animate-pulse text-rose-500" />
                <p>Fetching more stories…</p>
              </>
            ) : hasMore ? (
              <p>Keep scrolling to load more</p>
            ) : (
              <p>You&apos;ve reached the pit lane—no more articles for now.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
