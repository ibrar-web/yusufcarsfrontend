import { createMetadata } from "@/lib/seo";
import { CartPageClient } from "./cart-page-client";

export const metadata = createMetadata({
  title: "Quote Cart | Review Vehicles & Services",
  description:
    "Review your saved vehicles, selected services, and quote requests before sharing them with UK suppliers on PartsQuote.",
  path: "/cart",
  keywords: ["quote cart", "saved car parts", "PartsQuote cart"],
});

export default function CartPage() {
  return <CartPageClient />;
}
