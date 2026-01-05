import { createMetadata } from "@/lib/seo";
import { PartsSelectionPageClient } from "./parts-selection-page-client";

export const metadata = createMetadata({
  title: "Browse Car Parts Categories | PartsQuote",
  description:
    "Filter OEM or aftermarket parts by system, shortlist sub-components, and send accurate quote requests to trusted UK suppliers.",
  path: "/parts-selection",
  keywords: ["car parts catalogue", "PartsQuote categories", "vehicle service selection"],
});

export default function PartsSelectionPage() {
  return <PartsSelectionPageClient />;
}
