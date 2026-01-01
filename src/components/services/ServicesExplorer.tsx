"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
import {
  CartServiceItem,
  loadCartSummary,
  persistServicesSelection,
  subscribeToCartUpdates,
} from "@/utils/cart-storage";
import type { ServiceCategoryDTO, ServiceItemDTO } from "@/actions/categories";

type ServicesExplorerProps = {
  categories: ServiceCategoryDTO[];
};

export function ServicesExplorer({ categories }: ServicesExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null,
  );
  const [dialogCategory, setDialogCategory] =
    useState<ServiceCategoryDTO | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cartServices, setCartServices] = useState<CartServiceItem[]>([]);
  // const router = useRouter();

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories;
    }
    const normalized = searchTerm.trim().toLowerCase();
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(normalized) ||
        (category.description?.toLowerCase().includes(normalized) ?? false),
    );
  }, [categories, searchTerm]);

  const hasCategories = filteredCategories.length > 0;

  const openCategoryDialog = (category: ServiceCategoryDTO) => {
    const firstSubcategory = category.subcategories?.[0];
    setActiveCategory(category.slug);
    setActiveSubcategory(firstSubcategory?.slug ?? null);
    setDialogCategory(category);
    setDialogOpen(true);
  };

  const handleSubcategoryClick = (slug: string) => {
    setActiveSubcategory((prev) => (prev === slug ? null : slug));
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogCategory(null);
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  useEffect(() => {
    const updateCartServices = () => {
      const summary = loadCartSummary();
      setCartServices(Array.isArray(summary.services) ? summary.services : []);
    };
    updateCartServices();
    const unsubscribe = subscribeToCartUpdates(updateCartServices);
    return unsubscribe;
  }, []);

  const handleAddService = (item: ServiceItemDTO, subcategoryName?: string) => {
    const summary = loadCartSummary();
    if (!summary.vehicle) {
      toast.error("Add your vehicle before selecting services.");
      // router.push("/");
      return;
    }
    const existingServices = Array.isArray(summary.services)
      ? [...summary.services]
      : [];
    const serviceEntry: CartServiceItem = {
      id: item.id,
      label: item.name,
      category: [dialogCategory?.name, subcategoryName]
        .filter(Boolean)
        .join(" / "),
    };

    const alreadyInCart = existingServices.some(
      (service) => service.id === serviceEntry.id,
    );
    if (!alreadyInCart) {
      existingServices.push(serviceEntry);
      persistServicesSelection(existingServices);
      toast.success("Service added to cart.");
    } else {
      toast.error("Service already in cart.");
    }

    // router.push("/cart");
  };

  const handleRemoveService = (id: string) => {
    const summary = loadCartSummary();
    const remaining = Array.isArray(summary.services)
      ? summary.services.filter((service) => service.id !== id)
      : [];
    persistServicesSelection(remaining);
    toast.success("Service removed from cart.");
  };

  return (
    <div className="space-y-6 mt-8 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div className="space-y-4">
          <Input
            placeholder="Search services"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-2xl border border-[#CBD5E1]"
          />
          <p className="text-sm text-[#475569]">
            Browse curated service categories that match your vehicle needs.
            Filters collapse naturally on narrow screens.
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {!hasCategories && (
              <div className="col-span-full">
                <p className="text-sm text-[#475569]">
                  No services match your search. Try a different keyword.
                </p>
              </div>
            )}
            {filteredCategories.map((category) => {
              const isActive = activeCategory === category.slug;
              return (
                <article
                  key={category.id}
                  className={`rounded-2xl border p-4 shadow-sm transition ${
                    isActive
                      ? "border-[#F02801] bg-white shadow-lg"
                      : "border-[#E2E8F0] bg-white/80 hover:border-[#CBD5E1]"
                  }`}
                >
                  <header className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-base md:text-lg font-semibold text-[#0F172A] truncate"
                        title={category.name}
                      >
                        {category.name}
                      </p>
                      {category.description && (
                        <p
                          className="text-xs sm:text-sm text-[#64748B] truncate"
                          title={category.description}
                        >
                          {category.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#F02801] cursor-pointer"
                      onClick={() => openCategoryDialog(category)}
                    >
                      View
                    </Button>
                  </header>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
                    {category.subcategories?.length ?? 0} subcategories
                  </p>
                  {category.subcategories?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-[#64748B]">
                      {category.subcategories.slice(0, 2).map((subcategory) => (
                        <span
                          key={subcategory.id}
                          className="rounded-full border border-dashed border-[#CBD5E1] px-3 py-1"
                        >
                          {subcategory.name}
                        </span>
                      ))}
                      {category.subcategories.length > 2 && (
                        <span className="rounded-full border border-dashed border-[#CBD5E1] px-3 py-1 text-[#94A3B8]">
                          +{category.subcategories.length - 2} more
                        </span>
                      )}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        {dialogCategory && (
          <DialogContent
            className="
              max-h-[90vh]
              flex
              flex-col
              overflow-hidden
            "
          >
            <DialogHeader>
              <DialogTitle>{dialogCategory.name}</DialogTitle>
              <DialogDescription>
                {dialogCategory.description ?? "Explore available services"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pr-1">
              {dialogCategory.subcategories?.map((subcategory) => {
                const subOpen = activeSubcategory === subcategory.slug;
                return (
                  <article
                    key={subcategory.id}
                    className={`rounded-2xl border p-4 transition ${
                      subOpen
                        ? "border-[#F02801] bg-white shadow-lg"
                        : "border-[#E2E8F0] bg-[#F8FAFC]"
                    }`}
                  >
                    <header className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-[#0F172A]">
                          {subcategory.name}
                        </p>
                        {subcategory.description && (
                          <p className="text-sm text-[#64748B]">
                            {subcategory.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#0F172A] cursor-pointer"
                        onClick={() => handleSubcategoryClick(subcategory.slug)}
                      >
                        {subOpen ? "Hide items" : "Show items"}
                      </Button>
                    </header>
                    {subOpen ? (
                      <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#CBD5E1]">
                        {subcategory.items?.length ? (
                          subcategory.items.map((item) => {
                            const inCart = cartServices.some(
                              (service) => service.id === item.id,
                            );
                            return (
                              <div
                                key={item.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
                              >
                                <div className="min-w-0">
                                  <p
                                    className="font-medium text-[#0F172A] truncate"
                                    title={item.name}
                                  >
                                    {item.name}
                                  </p>
                                  {item.description && (
                                    <p
                                      className="text-sm text-[#64748B] truncate"
                                      title={item.description}
                                    >
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  className="h-10 w-10 rounded-full border border-[#E5E7EB] text-[#F02801] bg-white hover:bg-[#FEE2E2] text-lg p-0"
                                  aria-label={
                                    inCart
                                      ? `Remove ${item.name}`
                                      : `Add ${item.name}`
                                  }
                                  onClick={() =>
                                    inCart
                                      ? handleRemoveService(item.id)
                                      : handleAddService(item, subcategory.name)
                                  }
                                >
                                  {inCart ? "−" : "+"}
                                </Button>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-sm text-[#64748B]">
                            No items currently listed for this subcategory.
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-[#94A3B8]">
                        Expand to view the services inside this subcategory.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
            <DialogFooter>
              <Button className="cursor-pointer" onClick={closeDialog}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
