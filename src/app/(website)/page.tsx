import { HomePageClient } from "./HomePageClient";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "PartsQuote | UK Car Parts Marketplace",
  description:
    "Compare quotes from verified UK car parts suppliers, manage orders, and keep your vehicle on the road with PartsQuote.",
  path: "/",
  keywords: [
    "UK car parts marketplace",
    "instant car part quotes",
    "verified suppliers",
  ],
});

export default function Home() {
  return <HomePageClient />;
}
