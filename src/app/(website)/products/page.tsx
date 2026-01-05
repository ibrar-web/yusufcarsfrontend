import { createMetadata } from "@/lib/seo";
import { ProductsPageClient } from "./products-page-client";

export const metadata = createMetadata({
  title: "Vehicle-Specific Parts | Intelligent Product Matching",
  description:
    "Search compatible products for your registration, compare supplier stock, and send structured quote requests within the PartsQuote marketplace.",
  path: "/products",
  keywords: ["vehicle products", "car part search", "PartsQuote products"],
});

export default function ProductsPage() {
  return <ProductsPageClient />;
}
