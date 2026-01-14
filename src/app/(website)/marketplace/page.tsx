import { fetchServiceCategories } from "@/actions/categories";
import { MarketplacePageClient } from "./marketplace-page-client";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Car Maintenance Marketplace – Compare Auto Services | PartsQuote",
  description:
    "Browse a car maintenance marketplace to compare auto service providers, prices, and customer ratings in one place.",
  path: "/marketplace",
  keywords: [
    "car maintenance marketplace",
    "auto service marketplace",
    "vehicle service comparison",
  ],
});

export default async function MarketplacePage() {
  const categories = await fetchServiceCategories({
    includeSubcategories: true,
    includeItems: true,
  });

  return <MarketplacePageClient categories={categories} />;
}
