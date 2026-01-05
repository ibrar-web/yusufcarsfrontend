import Script from "next/script";
import { absoluteUrl, siteConfig } from "@/lib/seo";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.contactEmail,
      telephone: siteConfig.contactPhone,
      description: siteConfig.description,
      sameAs: [
        siteConfig.socials.linkedin,
        siteConfig.socials.instagram,
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "GB",
        addressLocality: siteConfig.headquarters,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: siteConfig.contactEmail,
          telephone: siteConfig.contactPhone,
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.shortDescription,
      publisher: {
        "@id": `${siteConfig.url}#organization`,
      },
      inLanguage: siteConfig.locale,
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/products")}?query={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export function SiteStructuredData() {
  return (
    <Script
      id="site-structured-data"
      type="application/ld+json"
      strategy="beforeInteractive"
    >
      {JSON.stringify(structuredData)}
    </Script>
  );
}
