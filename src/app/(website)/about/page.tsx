import { createMetadata } from "@/lib/seo";
import { AboutPageClient } from "./about-page-client";

export const metadata = createMetadata({
  title: "About PartsQuote | Mission & Leadership",
  description:
    "Meet the PartsQuote team that is modernising how UK drivers and local suppliers collaborate on vehicle repairs and parts sourcing.",
  path: "/about",
  keywords: ["about PartsQuote", "auto marketplace mission", "PartsQuote team"],
});

export default function AboutPage() {
  return <AboutPageClient />;
}
