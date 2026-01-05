import { createMetadata } from "@/lib/seo";
import { HowItWorksPageClient } from "./how-it-works-page-client";

export const metadata = createMetadata({
  title: "How PartsQuote Works | 4-Step Quote Flow",
  description:
    "See how PartsQuote verifies your vehicle, matches you with local or national suppliers, and delivers the best car parts prices.",
  path: "/how-it-works",
  keywords: ["how PartsQuote works", "car part quote process", "supplier matching"],
});

export default function HowItWorksPage() {
  return <HowItWorksPageClient />;
}
