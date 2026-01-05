import { createMetadata } from "@/lib/seo";
import { SupplierProfilePageClient } from "./supplier-profile-page-client";

export const metadata = createMetadata({
  title: "Supplier Profiles | Verified UK Partners",
  description:
    "Explore PartsQuote supplier profiles, see trading history, response speed, and customer ratings before selecting a partner.",
  path: "/supplier-profile",
  keywords: ["supplier reviews", "verified car part suppliers", "PartsQuote partners"],
});

export default function SupplierProfilePage() {
  return <SupplierProfilePageClient />;
}
