import { fetchServiceCategories } from "@/actions/categories";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";

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
