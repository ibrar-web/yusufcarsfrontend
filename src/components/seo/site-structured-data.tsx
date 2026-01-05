import Script from "next/script";
import { absoluteUrl, siteConfig } from "@/lib/seo";

const organizationId = `${siteConfig.url}#organization`;
const localBusinessId = `${siteConfig.url}#local-business`;
const websiteId = `${siteConfig.url}#website`;
const vehicleMaintenanceServiceId = `${siteConfig.url}#vehicle-maintenance-service`;
const xProfileUrl = siteConfig.socials.x.startsWith("http")
  ? siteConfig.socials.x
  : `https://twitter.com/${siteConfig.socials.x.replace(/^@/, "")}`;
const socialProfiles = [
  siteConfig.socials.linkedin,
  siteConfig.socials.instagram,
  xProfileUrl,
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.contactEmail,
      telephone: siteConfig.contactPhone,
      description: siteConfig.description,
      sameAs: socialProfiles,
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
      "@type": "LocalBusiness",
      "@id": localBusinessId,
      name: siteConfig.name,
      image: siteConfig.openGraphImage,
      url: siteConfig.url,
      telephone: siteConfig.contactPhone,
      email: siteConfig.contactEmail,
      description: siteConfig.shortDescription,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressCountry: "GB",
        addressLocality: siteConfig.headquarters,
      },
      parentOrganization: {
        "@id": organizationId,
      },
      serviceOffered: [
        {
          "@type": "Service",
          name: "Car Service Quotes",
          url: absoluteUrl("/car-quote"),
        },
        {
          "@type": "Service",
          name: "Vehicle Maintenance",
          url: absoluteUrl("/vehicle-maintenance"),
        },
        {
          "@type": "Service",
          name: "Auto Repair Comparison",
          url: absoluteUrl("/marketplace"),
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.shortDescription,
      publisher: {
        "@id": organizationId,
      },
      inLanguage: siteConfig.locale,
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/marketplace")}?query={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Service",
      "@id": vehicleMaintenanceServiceId,
      serviceType: "Vehicle Maintenance",
      provider: {
        "@id": organizationId,
      },
      areaServed: {
        "@type": "Place",
        name: "Global",
      },
      url: absoluteUrl("/vehicle-maintenance"),
      description: siteConfig.description,
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
