import { HomePageClient } from "./HomePageClient";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Car Service Quotes & Vehicle Maintenance Marketplace | PartsQuote",
  description:
    "Compare car service quotes, vehicle maintenance prices, and auto repair options. Get transparent pricing and choose the best service for your car.",
  path: "/",
  keywords: [
    "car service quote",
    "vehicle maintenance quote",
    "auto repair quote",
    "car maintenance marketplace",
  ],
});

export default function Home() {
  return <HomePageClient />;
}
