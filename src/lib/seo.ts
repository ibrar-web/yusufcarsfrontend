import type { Metadata } from "next";

const fallbackSiteUrl = "https://www.carclinic.com";

const normalizeUrl = (url: string): string =>
  url.endsWith("/") ? url.slice(0, -1) : url;

const resolvedSiteUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl,
);

const dedupeKeywords = (values: string[] = []): string[] => {
  const next = new Set(
    values
      .map((keyword) => keyword.trim())
      .filter((keyword) => Boolean(keyword)),
  );
  return Array.from(next);
};

export const siteConfig = {
  name: "CarClinic",
  tagline: "Compare Car Service Quotes & Vehicle Maintenance Prices",
  description:
    "CarClinic helps you compare car service quotes, vehicle maintenance prices, and auto repair services from trusted providers near you.",
  shortDescription: "Compare car service quotes and maintenance pricing online.",
  url: resolvedSiteUrl,
  locale: "en_GB",
  company: "CarClinic Ltd",
  contactEmail: "support@carclinic.com",
  contactPhone: "+44 20 3999 1234",
  headquarters: "London, United Kingdom",
  socials: {
    x: "@CarClinicHQ",
    linkedin: "https://www.linkedin.com/company/carclinic",
    instagram: "https://www.instagram.com/carclinichq",
  },
  keywords: [
    "car service quote",
    "vehicle maintenance quote",
    "auto repair quote",
    "car maintenance marketplace",
    "car service pricing",
    "vehicle service comparison",
  ],
  openGraphImage:
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  } as Metadata["robots"],
} as const;

const defaultOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  locale: siteConfig.locale,
  siteName: siteConfig.name,
  images: [
    {
      url: siteConfig.openGraphImage,
      width: 1200,
      height: 630,
      alt: siteConfig.shortDescription,
    },
  ],
};

const defaultTwitter: NonNullable<Metadata["twitter"]> = {
  card: "summary_large_image",
  creator: siteConfig.socials.x,
  site: siteConfig.socials.x,
  images: [siteConfig.openGraphImage],
};

export type CreateMetadataParams = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  alternates?: Metadata["alternates"];
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
  robots?: Metadata["robots"];
  category?: string;
};

export const absoluteUrl = (path = "/"): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
};

export const marketingRoutes = [
  "/",
  "/car-quote",
  "/vehicle-maintenance",
  "/marketplace",
] as const;

export const createMetadata = ({
  title,
  description,
  path = "/",
  keywords = [],
  alternates,
  openGraph,
  twitter,
  robots,
  category,
}: CreateMetadataParams): Metadata => {
  const canonicalUrl = absoluteUrl(path);
  const computedAlternates = {
    canonical: canonicalUrl,
    ...alternates,
  };

  const keywordList = dedupeKeywords([...siteConfig.keywords, ...keywords]);

  const computedOpenGraph: Metadata["openGraph"] = {
    ...defaultOpenGraph,
    url: canonicalUrl,
    ...openGraph,
    title: openGraph?.title ?? title,
    description: openGraph?.description ?? description,
    images: openGraph?.images ?? defaultOpenGraph.images,
  };

  const computedTwitter: Metadata["twitter"] = {
    ...defaultTwitter,
    ...twitter,
    title: twitter?.title ?? title,
    description: twitter?.description ?? description,
    images: twitter?.images ?? defaultTwitter.images,
  };

  return {
    title,
    description,
    category,
    alternates: computedAlternates,
    keywords: keywordList,
    openGraph: computedOpenGraph,
    twitter: computedTwitter,
    robots: robots ?? siteConfig.robots,
  };
};
