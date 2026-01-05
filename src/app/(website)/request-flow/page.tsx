import { createMetadata } from "@/lib/seo";
import { RequestFlowPageClient } from "./request-flow-page-client";

export const metadata = createMetadata({
  title: "Request Flow | Manage Supplier Quotes",
  description:
    "Understand every stage of the PartsQuote workflow—from sharing your vehicle profile to approving supplier offers and checkout.",
  path: "/request-flow",
  keywords: ["quote workflow", "supplier quote process", "PartsQuote request flow"],
});

export default function RequestFlowPage() {
  return <RequestFlowPageClient />;
}
