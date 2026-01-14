import { useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Search,
  Check,
  ChevronRight,
  ArrowLeft,
  Wrench,
  Plus,
} from "lucide-react";
import Masonry from "react-responsive-masonry";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "../components/ui/drawer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  persistServicesSelection,
  type CartServiceItem,
} from "@/utils/cart-storage";
import type { ServiceCategoryDTO } from "@/actions/categories";

interface PartsSelectionPageProps {
  onNavigate: (page: string) => void;
  onSignupClick?: () => void;
  categories: ServiceCategoryDTO[];
}

interface PartCategory {
  id: string;
  name: string;
  image?: string | null;
  subcategories: ServiceCategoryDTO["subcategories"];
  subparts: Array<{
    id: string;
    label: string;
    subcategoryName?: string | null;
  }>;
}

export function PartsSelectionPage({
  onNavigate,
  categories,
}: PartsSelectionPageProps) {
  console.log("categories", categories);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubparts, setSelectedSubparts] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const normalizedCategories = useMemo<PartCategory[]>(() => {
    return categories.map((category) => {
      const subcategories = category.subcategories ?? [];
      const subparts = subcategories.flatMap((subcategory) => {
        const items = subcategory.items ?? [];
        if (items.length) {
          return items.map((item) => ({
            id: item.id,
            label: item.name,
            subcategoryName: subcategory.name,
          }));
        }
        return [
          {
            id: subcategory.id,
            label: subcategory.name,
            subcategoryName: subcategory.name,
          },
        ];
      });
      return {
        id: category.id,
        name: category.name,
        image: category.imageUrl || category.imageKey || null,
        subcategories,
        subparts,
      };
    });
  }, [categories]);

  const filterOptions = useMemo(() => {
    const names = normalizedCategories.map((category) => category.name);
    return ["All", ...names];
  }, [normalizedCategories]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubparts([]);
    setDrawerOpen(true);
  };

  const toggleSubpart = (subpart: string) => {
    setSelectedSubparts((prev) =>
      prev.includes(subpart)
        ? prev.filter((s) => s !== subpart)
        : [...prev, subpart]
    );
  };

  const slugifyServiceId = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const selectedCategoryInfo = normalizedCategories.find(
    (category) => category.id === selectedCategory
  );
  const selectedSubpartsLookup = useMemo(() => {
    const entries = selectedCategoryInfo?.subparts ?? [];
    return new Map(entries.map((entry) => [entry.id, entry]));
  }, [selectedCategoryInfo]);

  const buildCartServicesPayload = (): CartServiceItem[] => {
    if (selectedSubparts.length === 0) {
      if (!selectedCategoryInfo) {
        return [];
      }
      return [
        {
          id: slugifyServiceId(
            selectedCategoryInfo.id || selectedCategoryInfo.name
          ),
          label: selectedCategoryInfo.name,
          category: selectedCategoryInfo.name,
        },
      ];
    }

    return selectedSubparts
      .map((entryId) => selectedSubpartsLookup.get(entryId))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .map((entry) => ({
        id: entry.id,
        label: entry.label,
        category: [selectedCategoryInfo?.name, entry.subcategoryName]
          .filter(Boolean)
          .join(" / "),
      }));
  };

  const handleContinue = () => {
    const services = buildCartServicesPayload();
    persistServicesSelection(services);
    onNavigate("cart");
  };

  const filteredCategories = normalizedCategories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subparts.some((sub) =>
        sub.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      activeFilter === "All" || category.name === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-[1200px] mx-auto px-12 sm:px-16 lg:px-24 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 font-['Roboto'] text-sm text-[#64748B]">
          <span>Vehicle</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-[#0F172A]">Parts</span>
          <ChevronRight className="h-4 w-4" />
          <span>Details</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-['Inter'] font-semibold text-[#0F172A] mb-3"
            style={{ fontSize: "32px", lineHeight: "1.3" }}
          >
            Select Your Parts
          </h1>
          <p
            className="font-['Roboto'] text-[#64748B]"
            style={{ fontSize: "16px", lineHeight: "1.5" }}
          >
            Pick a category or search by name/part number.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
            <Input
              type="text"
              placeholder="Search parts (e.g., alternator, 7L5 903 023)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[52px] pl-14 pr-6 bg-white border border-[#E5E7EB] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444] rounded-[14px] font-['Roboto'] text-[#0F172A] placeholder:text-[#64748B]"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mb-8 -mx-12 sm:-mx-16 lg:-mx-24 px-12 sm:px-16 lg:px-24 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full font-['Roboto'] text-sm transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-[#EF4444] text-white"
                    : "bg-white text-[#64748B] border border-[#E5E7EB] hover:border-[#EF4444]/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        {filteredCategories.length > 0 ? (
          <Masonry
            columnsCount={
              typeof window !== "undefined"
                ? window.innerWidth >= 1024
                  ? 4
                  : window.innerWidth >= 768
                  ? 3
                  : 2
                : 4
            }
            gutter="16px"
            className="mb-8"
          >
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`relative w-full aspect-square bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.12)] group ${
                  selectedCategory === category.id
                    ? "border-[#EF4444] border-2 shadow-[0_10px_40px_rgba(239,68,68,0.2)]"
                    : "border-[#E5E7EB] hover:border-[#EF4444]/50"
                }`}
              >
                {/* Full Card Image */}
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={
                      category.image ||
                      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Light gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/30 to-transparent"></div>
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-white/90 backdrop-blur-sm text-[#64748B] border border-[#E5E7EB] font-['Roboto'] text-xs px-2.5 py-1">
                    {category.subparts.length} items
                  </Badge>
                </div>

                {/* Selected Check */}
                {selectedCategory === category.id && (
                  <div className="absolute top-4 left-4 z-10 w-7 h-7 bg-[#EF4444] rounded-full flex items-center justify-center shadow-lg shadow-primary/50">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Title Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3
                    className="font-['Inter'] font-semibold text-white"
                    style={{ fontSize: "18px", lineHeight: "1.3" }}
                  >
                    {category.name}
                  </h3>
                </div>
              </button>
            ))}
          </Masonry>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-[#64748B]/40" />
            </div>
            <h3
              className="font-['Inter'] font-semibold text-[#0F172A] mb-2"
              style={{ fontSize: "20px" }}
            >
              No parts found
            </h3>
            <p className="font-['Roboto'] text-[#64748B] mb-4">
              Try a different term or pick a category.
            </p>
            <button className="font-['Roboto'] text-[#EF4444] hover:text-[#DC2626] underline">
              Request any part manually
            </button>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-6 shadow-[0_-10px_28px_rgba(0,0,0,0.08)]">
        <div className="max-w-[1200px] mx-auto px-12 sm:px-16 lg:px-24">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              onClick={() => onNavigate("cart")}
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 border border-[#E5E7EB] text-[#0F172A] hover:bg-[#F8FAFC] font-['Roboto'] font-medium rounded-xl"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedCategory && selectedSubparts.length === 0}
              className="w-full sm:flex-1 h-12 px-8 bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-center font-['Roboto'] text-sm text-[#64748B] mt-3">
            You can refine the exact part on the next step.
          </p>
        </div>
      </div>

      {/* Subpart Quick-Pick Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="bg-white border-t border-[#E5E7EB]">
          <div className="max-w-[1200px] mx-auto w-full px-8 py-8">
            {/* Header with Icon */}
            <DrawerHeader className="px-0 pb-8">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center justify-center">
                  {selectedCategoryInfo && (
                    <Wrench
                      className="h-7 w-7 text-[#EF4444]"
                      strokeWidth={2}
                    />
                  )}
                </div>
                <div>
                  <DrawerTitle
                    className="font-['Inter'] font-semibold text-[#0F172A]"
                    style={{ fontSize: "28px", lineHeight: "1.2" }}
                  >
                    {selectedCategoryInfo?.name} Parts
                  </DrawerTitle>
                  <DrawerDescription
                    className="font-['Roboto'] text-[#64748B] mt-1"
                    style={{ fontSize: "15px" }}
                  >
                    Select specific parts or continue to view all options
                  </DrawerDescription>
                </div>
              </div>
            </DrawerHeader>

            {/* Selected Counter */}
            {selectedSubparts.length > 0 && (
              <div className="mb-6 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
                <p className="font-['Roboto'] text-sm text-[#EF4444] font-medium">
                  {selectedSubparts.length} part
                  {selectedSubparts.length > 1 ? "s" : ""} selected
                </p>
              </div>
            )}

            {/* Subpart Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {selectedCategoryInfo?.subcategories?.map((subcategory) => {
                const entries =
                  subcategory.items && subcategory.items.length
                    ? subcategory.items.map((item) => ({
                        id: item.id,
                        label: item.name,
                      }))
                    : [];
                return (
                  <div key={subcategory.id}>
                    <div className="mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#0F172A]">
                        {subcategory.name}
                      </p>
                      {subcategory.description && (
                        <p className="text-sm text-[#64748B] mt-1">
                          {subcategory.description}
                        </p>
                      )}
                      <div className="h-px bg-[#E2E8F0] mt-3" />
                    </div>
                    <div className="flex flex-col gap-3 mb-6">
                      {entries.map((entry, index) => (
                        <button
                          key={entry.id}
                          onClick={() => toggleSubpart(entry.id)}
                          className={`relative px-4 py-4 rounded-xl font-['Roboto'] text-sm transition-all duration-200 text-left group ${
                            selectedSubparts.includes(entry.id)
                              ? "bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/25"
                              : "bg-[#F8FAFC] text-[#0F172A] hover:bg-white"
                          }`}
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="flex items-center gap-3">
                            {selectedSubparts.includes(entry.id) ? (
                              <Check className="h-4 w-4 text-white flex-shrink-0" />
                            ) : (
                              <Plus className="h-4 w-4 text-[#0F172A] flex-shrink-0" />
                            )}
                            <span
                              className={`font-medium ${
                                selectedSubparts.includes(entry.id)
                                  ? "text-white"
                                  : "text-[#0F172A]"
                              }`}
                            >
                              {entry.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Link */}
            <div className="flex items-center justify-center mb-8">
              <button className="font-['Roboto'] text-[#EF4444] hover:text-[#DC2626] text-sm font-semibold flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-[#EF4444]/5 transition-all">
                View all {selectedCategoryInfo?.name.toLowerCase()} subparts
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Footer Actions */}
            <DrawerFooter className="px-0 pt-8 border-t-2 border-[#E5E7EB]">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setDrawerOpen(false)}
                  variant="outline"
                  className="flex-1 h-14 border-2 border-[#E5E7EB] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#334155] font-['Roboto'] font-medium rounded-xl transition-all"
                  style={{ fontSize: "15px" }}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Close
                </Button>
                <Button
                  onClick={handleContinue}
                  className="flex-1 h-14 bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold rounded-xl shadow-lg shadow-[#EF4444]/30 hover:shadow-xl hover:shadow-[#EF4444]/40 transition-all hover:scale-[1.02]"
                  style={{ fontSize: "15px" }}
                >
                  Continue with{" "}
                  {selectedSubparts.length > 0
                    ? `${selectedSubparts.length} part${
                        selectedSubparts.length > 1 ? "s" : ""
                      }`
                    : "category"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
