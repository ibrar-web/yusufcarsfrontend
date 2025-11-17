import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "@/index.css";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getSessionFromCookie } from "@/actions/session";
import { SessionHydrator } from "@/components/session-hydrator";

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
  title: "PartsQuote - UK Car Parts Marketplace",
  description: "Get instant quotes for car parts from verified UK suppliers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSessionFromCookie();

  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SessionHydrator session={session} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
