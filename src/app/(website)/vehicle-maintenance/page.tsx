import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Vehicle Maintenance Quotes & Pricing Guide | PartsQuote",
  description:
    "Explore vehicle maintenance quotes, service pricing, and repair options. Compare maintenance services and keep your car in top condition.",
  path: "/vehicle-maintenance",
  keywords: [
    "vehicle maintenance pricing",
    "car maintenance quote",
    "auto service comparison",
  ],
});

export default function VehicleMaintenancePage() {
  return (
    <div className="bg-[#F8FAFC]">
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-6 py-20 grid gap-12 lg:grid-cols-[3fr,2fr] items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F02801] mb-4">
              Maintenance pricing guide
            </p>
            <h1 className="font-['Inter'] text-4xl sm:text-5xl font-bold text-[#0F172A] leading-tight mb-6">
              Vehicle Maintenance Quotes & Services
            </h1>
            <p className="font-['Roboto'] text-lg text-[#475569]">
              Compare full-service schedules, quick inspections, and urgent repairs.
              PartsQuote benchmarks thousands of garage and mobile technician prices so
              you can keep your vehicle in peak condition year-round.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E2E8F0] bg-[#0F172A] p-4 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
              alt="Auto mechanic performing car maintenance"
              width={560}
              height={420}
              className="h-full w-full rounded-2xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-['Inter'] text-3xl font-bold text-[#0F172A] mb-4">
              Routine Maintenance Services
            </h2>
            <p className="font-['Roboto'] text-[#475569] mb-4">
              Build a full-service checklist that covers fluids, filters, belts, and
              tyres. Every quote shows the recommended OEM intervals and optional add-ons
              such as brake fluid flushes or cabin air filter replacements.
            </p>
            <ul className="list-disc pl-5 space-y-2 font-['Roboto'] text-[#475569]">
              <li>Interim, annual, and major services with digital service stamps.</li>
              <li>Hybrid and EV-safe maintenance packages with insulated tooling.</li>
              <li>Pick-up and drop-off options when you cannot make it to the garage.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-dashed border-[#CBD5F5] bg-[#F8FAFC] p-6">
            <p className="font-['Roboto'] text-sm text-[#475569]">
              Download your personalised service calendar, export the PDF to share with
              any technician, or book directly through PartsQuote and track every invoice
              in your dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-[#E2E8F0] bg-[#FDFDFE]">
        <div className="max-w-[1200px] mx-auto px-6 grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm order-2 lg:order-1">
            <h2 className="font-['Inter'] text-3xl font-bold text-[#0F172A] mb-4">
              Car Repair & Diagnostics
            </h2>
            <p className="font-['Roboto'] text-[#475569]">
              Upload dash-light photos, describe noises or performance issues, and let
              providers run remote diagnostics before they visit. Every repair quote
              includes parts sourcing options and estimated turnaround times.
            </p>
            <p className="font-['Roboto'] text-sm text-[#475569] mt-4">
              Choose between genuine, OEM-equivalent, or refurbished parts and see how it
              affects warranty coverage instantly.
            </p>
          </div>
          <div className="order-1 lg:order-2 rounded-2xl bg-[#0F172A] p-6 text-white">
            <p className="font-['Inter'] text-lg font-semibold mb-2">
              Diagnostic coverage
            </p>
            <p className="font-['Roboto'] text-sm">
              Engine misfires · Battery draw · ADAS calibration · Suspension geometry ·
              Air-con servicing · MOT advisory fixes
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-['Inter'] text-3xl font-bold text-[#0F172A] mb-4">
              Compare Maintenance Providers
            </h2>
            <p className="font-['Roboto'] text-[#475569] mb-4">
              Filter by location, mobile availability, courtesy cars, warranty length,
              and sustainability practices. Reviews and completion stats keep every
              provider accountable.
            </p>
            <p className="font-['Roboto'] text-sm text-[#475569]">
              Ready to lock in a service slot? Jump back to the{" "}
              <Link
                href="/car-quote"
                className="text-[#F02801] font-semibold underline underline-offset-4"
              >
                compare car service quotes
              </Link>{" "}
              flow and send a structured request to your chosen shop.
            </p>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
            <dl className="grid grid-cols-2 gap-4">
              {[
                { label: "Average response", value: "< 15 min" },
                { label: "Provider rating", value: "4.9 / 5" },
                { label: "Cities covered", value: "120+" },
                { label: "Mobile technicians", value: "650+" },
              ].map((metric) => (
                <div key={metric.label}>
                  <dt className="font-['Roboto'] text-xs uppercase tracking-wide text-[#94A3B8]">
                    {metric.label}
                  </dt>
                  <dd className="font-['Inter'] text-2xl font-semibold text-[#0F172A]">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0F172A]">
        <div className="max-w-[1200px] mx-auto px-6 grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
          <div>
            <h2 className="font-['Inter'] text-3xl font-bold text-white mb-4">
              Save Time and Money on Car Maintenance
            </h2>
            <p className="font-['Roboto'] text-white/80 mb-6">
              Centralise every quote, invoice, and warranty document inside PartsQuote.
              Automated reminders ensure you never miss a service, and our support team
              monitors for duplicate charges so your budget stays intact.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-['Inter'] font-semibold text-[#0F172A]"
              >
                Explore providers
              </Link>
              <Link
                href="/car-quote"
                className="inline-flex items-center justify-center rounded-full border border-white/50 px-6 py-3 font-['Inter'] font-semibold text-white"
              >
                Request a quote
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-white">
            <ul className="space-y-3 font-['Roboto']">
              <li>Service reminders synced to your mileage and MOT dates.</li>
              <li>Personalised tips to stretch tyres, brakes, and fluids further.</li>
              <li>Consolidated receipts for easy resale or fleet reporting.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
