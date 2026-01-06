import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Get a Car Service Quote Online – Compare Prices | PartsQuote",
  description:
    "Get an instant car service quote online. Compare vehicle maintenance and auto repair prices from verified service providers.",
  path: "/car-quote",
  keywords: [
    "car service quote",
    "vehicle maintenance quote",
    "auto repair quote",
  ],
});

const quoteSignals = [
  {
    title: "Vehicle profile & diagnostic data",
    body: "We combine your registration details, mileage, fault codes, and MOT history to determine the labour and parts requirements.",
  },
  {
    title: "Service scope & part preferences",
    body: "Select OEM, OE-matching, or budget parts, flag fluid top-ups, and add photos so technicians know exactly what you expect.",
  },
  {
    title: "Local provider availability",
    body: "Live calendars, travel distance, and workshop capacity influence labour rates. We surface the fastest appointments first.",
  },
];

const quoteBenefits = [
  {
    title: "Transparent breakdowns",
    body: "Line-item pricing shows labour, diagnostics, and materials so you can approve quotes with confidence.",
  },
  {
    title: "No hidden fees",
    body: "PartsQuote freezes every quote for 48 hours. If a provider needs to adjust pricing, you receive an updated estimate to review digitally.",
  },
  {
    title: "Seamless scheduling",
    body: "Approve, reschedule, or request collection straight from your dashboard and keep every message in one place.",
  },
];

export default function CarQuotePage() {
  return (
    <div className="bg-[#F8FAFC]">
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F02801] mb-4">
              Car service quote
            </p>
            <h1 className="font-['Inter'] text-4xl sm:text-5xl font-bold text-[#0F172A] leading-tight mb-6">
              Get an Instant Car Service Quote
            </h1>
            <p className="font-['Roboto'] text-lg text-[#475569] mb-6">
              Share your vehicle details once and PartsQuote compares labour,
              parts, and inspection fees across vetted garages. No hidden fees,
              surprise mark-ups, or last-minute upsells—just transparent vehicle
              maintenance prices.
            </p>
            <ul className="list-disc pl-5 space-y-3 text-[#475569] font-['Roboto'] text-base">
              {quoteSignals.map((signal) => (
                <li key={signal.title}>
                  <span className="font-semibold text-[#0F172A]">{signal.title}:</span>{" "}
                  {signal.body}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-['Roboto'] text-sm text-[#475569]">
              Explore the{" "}
              <Link
                href="/marketplace"
                className="text-[#F02801] font-semibold underline underline-offset-4"
              >
                auto repair marketplace
              </Link>{" "}
              to meet garages that specialise in hybrid care, EV maintenance, fleet
              servicing, and more before you accept a quote.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-[#E2E8F0] bg-[#0F172A] p-6 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80"
                alt="Vehicle repair quote comparison dashboard"
                width={640}
                height={480}
                className="w-full rounded-2xl object-cover"
                priority
              />
              <p className="font-['Roboto'] text-sm text-white/80 mt-4">
                Live quote dashboard comparing labour, diagnostic, and parts pricing for
                the same brake repair request.
              </p>
            </div>
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6">
              <h2 className="font-['Inter'] text-2xl font-semibold text-[#0F172A] mb-4">
                How quotes are calculated
              </h2>
              <p className="font-['Roboto'] text-sm text-[#475569] mb-2">
                Each estimate mixes three inputs:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-[#475569] font-['Roboto'] text-sm">
                <li>Your live vehicle health data (VIN, OBD-II, fault codes).</li>
                <li>The tasks you select (inspection, repair, full service, MOT prep).</li>
                <li>Marketplace rate cards from providers that match your postcode.</li>
              </ol>
              <p className="font-['Roboto'] text-sm text-[#475569] mt-4">
                We always surface the most relevant provider, but you can toggle between
                eco, standard, and premium options if you want faster completion or
                courtesy vehicles.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {quoteBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
              >
                <h3 className="font-['Inter'] text-xl font-semibold text-[#0F172A] mb-3">
                  {benefit.title}
                </h3>
                <p className="font-['Roboto'] text-sm text-[#475569] leading-relaxed">
                  {benefit.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
