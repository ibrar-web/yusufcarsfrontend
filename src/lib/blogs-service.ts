import { cache } from "react";
import type { BlogPost, BlogSummary } from "@/data/blog-posts";
import { getBlogPostBySlug, getBlogSummaries } from "@/data/blog-posts";
import { apiRoutes } from "@/utils/apiroutes";
import { environment } from "@/utils/environment";

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=60";

const fallbackPostBase: BlogPost = {
  slug: "partsquote-editorial-update",
  title: "Fresh automotive insights are on the way",
  excerpt:
    "Our editorial team is preparing expert buying advice, EV updates, and supplier spotlights. Check back soon for the latest articles.",
  author: "PartsQuote Editorial Team",
  date: new Date().toISOString(),
  category: "Announcements",
  readTime: "3 min read",
  heroImage: fallbackHeroImage,
  tags: ["PartsQuote", "Announcements"],
  metaDescription:
    "PartsQuote will soon publish new automotive guides. Enjoy this sample article while we finalise our content pipeline.",
  content: [
    {
      heading: "What to expect",
      body: [
        "We are curating case studies from verified suppliers, EV maintenance best practices, and price intelligence straight from our marketplace.",
        "Subscribe to email updates or follow us on social media to know when each new story drops.",
      ],
    },
    {
      heading: "Why PartsQuote writes about car parts",
      body: [
        "Matching drivers with trustworthy suppliers is easier when everyone shares transparent insights about sourcing, warranties, and installation.",
        "Our editorial voice focuses on actionable tips for both private motorists and fleet managers operating across the UK.",
      ],
    },
  ],
};

type BlogSource = "api" | "local" | "sample";

type BlogApiResponse = {
  data?: (Partial<BlogPost> & { description?: string }) | null;
};

type BlogDetailResult = {
  post: BlogPost;
  source: BlogSource;
};

const normalizeApiPost = (payload: BlogApiResponse | null, slug: string): BlogPost | null => {
  const raw = payload?.data;
  if (!raw) {
    return null;
  }

  return {
    slug: raw.slug ?? slug,
    title: raw.title ?? fallbackPostBase.title,
    excerpt: raw.excerpt ?? raw.description ?? fallbackPostBase.excerpt,
    author: raw.author ?? fallbackPostBase.author,
    date: raw.date ?? fallbackPostBase.date,
    category: raw.category ?? fallbackPostBase.category,
    readTime: raw.readTime ?? fallbackPostBase.readTime,
    heroImage: raw.heroImage ?? fallbackPostBase.heroImage,
    tags: raw.tags ?? fallbackPostBase.tags,
    metaDescription: raw.metaDescription ?? raw.description ?? fallbackPostBase.metaDescription,
    content: raw.content ?? fallbackPostBase.content,
  };
};

const fetchBlogFromApi = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const baseUrl = environment.apiBaseUrl;
    if (!baseUrl) {
      return null;
    }
    const endpoint = `${baseUrl}${apiRoutes.common.blogs.detail(slug)}`;
    const response = await fetch(endpoint, {
      next: { revalidate: 120 },
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as BlogApiResponse;
    return normalizeApiPost(payload, slug);
  } catch (error) {
    console.warn("Failed to load blog from API", { error });
    return null;
  }
});

const buildSamplePost = (slug: string): BlogPost => ({
  ...fallbackPostBase,
  slug,
});

export const loadBlogPost = cache(async (slug: string): Promise<BlogDetailResult> => {
  const apiPost = await fetchBlogFromApi(slug);
  if (apiPost) {
    return { post: apiPost, source: "api" };
  }

  const localPost = getBlogPostBySlug(slug);
  if (localPost) {
    return { post: localPost, source: "local" };
  }

  return {
    post: buildSamplePost(slug),
    source: "sample",
  };
});

export const listBlogSummaries = (): BlogSummary[] => getBlogSummaries();

export type { BlogDetailResult };
