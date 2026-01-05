import { createMetadata } from "@/lib/seo";
import { ContactPageClient } from "./contact-page-client";

export const metadata = createMetadata({
  title: "Contact PartsQuote | UK Support Team",
  description:
    "Speak with the PartsQuote support team for partnership questions, supplier onboarding, or help with an open car parts quote.",
  path: "/contact",
  keywords: ["contact PartsQuote", "car parts support", "supplier enquiries"],
});

export default function ContactPage() {
  return <ContactPageClient />;
}
