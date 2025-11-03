import type { Metadata, Viewport } from 'next';
import { Inter, Roboto } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'PartsQuote - UK Car Parts Marketplace',
    template: '%s | PartsQuote',
  },
  description: 'Get quotes from trusted UK car parts suppliers. Fast, reliable, and transparent pricing for all your automotive needs.',
  keywords: ['car parts', 'UK', 'quotes', 'automotive', 'spare parts', 'vehicle parts', 'car repairs'],
  authors: [{ name: 'PartsQuote' }],
  creator: 'PartsQuote',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://partsquote.co.uk',
    title: 'PartsQuote - UK Car Parts Marketplace',
    description: 'Get quotes from trusted UK car parts suppliers. Fast, reliable, and transparent.',
    siteName: 'PartsQuote',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PartsQuote - UK Car Parts Marketplace',
    description: 'Get quotes from trusted UK car parts suppliers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F02801',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${roboto.variable}`} suppressHydrationWarning>
      <body className="bg-white text-[#0F172A] antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-roboto)',
            },
          }}
        />
      </body>
    </html>
  );
}
