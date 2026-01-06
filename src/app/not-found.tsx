import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Compass, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Page Not Found | ${siteConfig.name}`,
  description: `${siteConfig.name} can't find the page you're after. Use the quick links below to keep shopping for trusted parts and services.`,
};

const supportHighlights = [
  {
    icon: Compass,
    title: "Browse marketplace",
    body: "Explore hundreds of vetted garages, mobile technicians, and suppliers matched to your postcode.",
    href: "/marketplace",
    cta: "View marketplace",
  },
  {
    icon: ShieldCheck,
    title: "Track open quotes",
    body: "Jump back into your dashboard to manage quotes, approvals, and service paperwork in one place.",
    href: "/cart",
    cta: "Open dashboard",
  },
  {
    icon: MessageCircle,
    title: "Get live support",
    body: "Talk to our team if you're stuck. We can resend links, update bookings, or point you to the right supplier.",
    href: "/contact",
    cta: "Contact support",
  },
];

export default function NotFound() {
  return (
    <main className="min-h-[80vh] bg-[#F8FAFC]">
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1100px] mx-auto px-6 py-20 grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F02801] mb-4">
              404 — Page missing
            </p>
            <h1 className="font-['Inter'] text-4xl sm:text-5xl font-bold text-[#0F172A] leading-tight mb-4">
              We can't find that page
            </h1>
            <p className="font-['Roboto'] text-lg text-[#475569] mb-8">
              The link may be out of date or the address could have a typo. Use the
              quick links below to keep comparing quotes, or return to the
              {" "}
              <span className="font-semibold text-[#0F172A]">{siteConfig.name}</span>
              {" "}home page.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="inline-flex">
                <Button className="gap-2 bg-[#F02801] hover:bg-[#D22301]">
                  <ArrowLeft className="h-4 w-4" />
                  Back to home
                </Button>
              </Link>
              <Link
                href="/car-quote"
                className="inline-flex"
              >
                <Button variant="outline" className="gap-2 border-[#CBD5F5] text-[#0F172A] hover:bg-[#F8FAFC]">
                  Compare quotes
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-[#E2E8F0] bg-[#0F172A] p-8 text-white shadow-xl">
            <p className="font-['Inter'] text-2xl font-semibold mb-3">
              Need help finding something?
            </p>
            <p className="font-['Roboto'] text-white/80 mb-6">
              Share your vehicle registration, part, or booking reference and our
              support team will guide you instantly.
            </p>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-5">
              <p className="font-['Roboto'] text-sm text-white/70">
                Email us at {" "}
                <Link href="mailto:hello@partsquote.co.uk" className="font-semibold text-white">
                  hello@partsquote.co.uk
                </Link>
                {" "}or call {siteConfig.contactPhone}. We're available 7 days a week, 8am – 8pm.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {supportHighlights.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF4ED] text-[#F02801]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-['Inter'] text-xl font-semibold text-[#0F172A] mb-2">
                    {card.title}
                  </h2>
                  <p className="font-['Roboto'] text-sm text-[#475569] mb-4">
                    {card.body}
                  </p>
                  <Link
                    href={card.href}
                    className="font-['Inter'] text-sm font-semibold text-[#F02801] inline-flex items-center gap-1"
                  >
                    {card.cta}
                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
