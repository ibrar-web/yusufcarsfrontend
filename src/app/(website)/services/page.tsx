import { fetchServiceCategories } from "@/actions/categories";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Vehicle Services Directory | PartsQuote",
  description:
    "Browse MOT, repair, and maintenance categories to tell PartsQuote exactly which parts or services you need from verified suppliers.",
  path: "/services",
  keywords: ["vehicle services directory", "service categories", "PartsQuote services"],
});

export default async function ServicesPage() {
  const categories = await fetchServiceCategories({
    includeSubcategories: true,
    includeItems: true,
  });

  return (
    <div className="min-h-[90vh] bg-[#F8FAFC]">
      <section className="bg-white border-b border-[#E5E7EB] pt-24 pb-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-[#0F172A] sm:text-4xl">
            Tell us what you need
          </h1>
        </header>
        <ServicesExplorer categories={categories} />
      </section>
    </div>
  );
}
