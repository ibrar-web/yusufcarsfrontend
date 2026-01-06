import Image from "next/image";
import Link from "next/link";
import { fetchServiceCategories } from "@/actions/categories";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Car Maintenance Marketplace – Compare Auto Services | PartsQuote",
  description:
    "Browse a car maintenance marketplace to compare auto service providers, prices, and customer ratings in one place.",
  path: "/marketplace",
  keywords: [
    "car maintenance marketplace",
    "auto service marketplace",
    "vehicle service comparison",
  ],
});

export default async function MarketplacePage() {
  const categories = await fetchServiceCategories({
    includeSubcategories: true,
    includeItems: true,
  });

  return (
    <div className="min-h-[90vh] bg-[#F8FAFC]">
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid gap-12 lg:grid-cols-[3fr,2fr] items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F02801] mb-4">
              Marketplace overview
            </p>
            <h1 className="font-['Inter'] text-4xl sm:text-5xl font-bold text-[#0F172A] leading-tight mb-6">
              Car Maintenance & Auto Service Marketplace
            </h1>
            <p className="font-['Roboto'] text-lg text-[#475569] mb-4">
              Search nearby garages, national chains, or mobile mechanics. PartsQuote
              surfaces verified availability, response times, and price ranges so you can
              pick the right service partner in minutes.
            </p>
            <p className="font-['Roboto'] text-sm text-[#475569]">
              Need to double-check{" "}
              <Link
                href="/vehicle-maintenance"
                className="text-[#F02801] font-semibold underline underline-offset-4"
              >
                vehicle maintenance pricing
              </Link>{" "}
              before you book? Every provider profile links back to our pricing guide so
              you understand what the quote should include.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/car-quote"
                className="inline-flex items-center justify-center rounded-full bg-[#F02801] px-6 py-3 font-['Inter'] font-semibold text-white hover:bg-[#D22301]"
              >
                Request quotes
              </Link>
              <Link
                href="/vehicle-maintenance"
                className="inline-flex items-center justify-center rounded-full border border-[#0F172A] px-6 py-3 font-['Inter'] font-semibold text-[#0F172A]"
              >
                View maintenance guide
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-[#E2E8F0] bg-[#0F172A] p-4 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
              alt="Auto repair marketplace dashboard"
              width={560}
              height={420}
              className="h-full w-full rounded-2xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Average response", value: "12 minutes" },
              { label: "Active providers", value: "1,400+" },
              { label: "Cities covered", value: "120+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm"
              >
                <p className="font-['Roboto'] text-sm uppercase tracking-[0.2em] text-[#94A3B8]">
                  {stat.label}
                </p>
                <p className="font-['Inter'] text-3xl font-semibold text-[#0F172A] mt-2">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-[#E2E8F0] bg-white">
            <ServicesExplorer categories={categories} />
          </div>
        </div>
      </section>
    </div>
  );
}
