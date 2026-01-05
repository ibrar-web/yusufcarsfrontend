import { createMetadata } from "@/lib/seo";
import { NewSupplierPageClient } from "./new-supplier-page-client";

export const metadata = createMetadata({
  title: "Supplier Sign Up | Sell Parts on PartsQuote",
  description:
    "Join PartsQuote as a verified supplier, respond to ready-to-buy vehicle requests, and grow repeat revenue across the UK.",
  path: "/new-supplier",
  keywords: ["supplier onboarding", "sell car parts online", "PartsQuote supplier"],
});

export default function NewSupplierPage() {
  return <NewSupplierPageClient />;
}
