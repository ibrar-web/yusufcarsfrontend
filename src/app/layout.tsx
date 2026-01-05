import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "@/index.css";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getSessionFromCookie } from "@/actions/session";
import { SessionHydrator } from "@/components/session-hydrator";
import { LocalSessionHydrator } from "@/components/local-session-hydrator";
import { SocketManager } from "@/components/socket-manager";
import { siteConfig } from "@/lib/seo";
import { SiteStructuredData } from "@/components/seo/site-structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.company, url: siteConfig.url }],
  creator: siteConfig.company,
  publisher: siteConfig.company,
  robots: siteConfig.robots,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.openGraphImage,
        width: 1200,
        height: 630,
        alt: siteConfig.shortDescription,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.socials.x,
    site: siteConfig.socials.x,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.openGraphImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "Automotive",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSessionFromCookie();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SiteStructuredData />
        <SessionHydrator session={session} />
        <LocalSessionHydrator />
        <SocketManager />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
