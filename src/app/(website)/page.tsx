import type { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: "PartsQuote | UK Car Parts Marketplace",
  description:
    "Compare quotes from verified UK car parts suppliers, manage orders, and keep your vehicle on the road with PartsQuote.",
  alternates: {
    canonical: "https://www.partsquote.co.uk/",
  },
};

export default function Home() {
  return <HomePageClient />;
}
