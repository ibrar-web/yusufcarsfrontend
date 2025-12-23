"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, ArrowRight, RefreshCcw, X } from "lucide-react";
import {
  clearCartCookies,
  loadCartSummary,
  subscribeToCartUpdates,
  type CartSummary,
  removeVehicleFromCart,
  removeServiceByIndex,
} from "@/utils/cart-storage";
import { useAppState } from "@/hooks/use-app-state";

export default function CartPage() {
  const { handleNavigate } = useAppState();
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    vehicle: null,
    services: [],
  });

  useEffect(() => {
    const updateSummary = () => setCartSummary(loadCartSummary());
    updateSummary();
    const unsubscribe = subscribeToCartUpdates(updateSummary);
    return () => unsubscribe();
  }, []);

  const refreshSummary = () => {
    setCartSummary(loadCartSummary());
  };

  const handleVehicleRemove = () => {
    removeVehicleFromCart();
    refreshSummary();
  };

  const handleServiceRemove = (index: number) => {
    removeServiceByIndex(index);
    refreshSummary();
  };

  const vehicle = cartSummary.vehicle;
  const services = Array.isArray(cartSummary.services)
    ? cartSummary.services
    : [];
  const isEmpty = !vehicle && services.length === 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <section className="rounded-3xl bg-white shadow-[0_15px_60px_rgba(15,23,42,0.08)] border border-[#E2E8F0] p-6 sm:p-10">
          <header className="mb-8">
            <p className="text-sm font-semibold text-[#F02801] uppercase tracking-[0.2em]">
              Quote cart
            </p>
            <h1 className="font-['Inter'] text-3xl font-bold text-[#0F172A] mt-2">
              Review your request details
            </h1>
            <p className="font-['Roboto'] text-base text-[#475569] mt-2">
              We save your selected vehicle and services so you can finish a
              quote request anytime.
            </p>
          </header>

          {isEmpty ? (
            <div className="flex flex-col items-center text-center py-16">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FEF2F2] text-[#F02801]">
                <ShoppingCart className="h-10 w-10" />
              </div>
              <h2 className="font-['Inter'] text-2xl font-semibold text-[#0F172A] mb-2">
                Your cart is empty
              </h2>
              <p className="font-['Roboto'] text-[#64748B] max-w-md mb-6">
                Start by entering your vehicle details and selecting at least one
                service so suppliers know what to quote for.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => handleNavigate("vehicle-confirmation")}>
                  Enter Vehicle Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNavigate("parts-selection")}
                >
                  Browse Services
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {vehicle && (
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                      Vehicle
                    </p>
                    <button
                      onClick={handleVehicleRemove}
                      className="text-xs font-semibold text-[#F02801] hover:text-[#D22301] flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Remove
                    </button>
                  </div>
                  <p className="font-['Inter'] text-2xl font-semibold text-[#0F172A] mt-2">
                    {[
                      vehicle?.yearOfManufacture,
                      vehicle?.make,
                      vehicle?.model,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                  {vehicle?.registrationNumber && (
                    <p className="font-['Roboto'] text-sm text-[#475569] mt-1">
                      Reg: {vehicle.registrationNumber}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[#475569]">
                    {vehicle?.requestType && (
                      <span className="rounded-full bg-white px-3 py-1 text-[#0F172A]">
                        {vehicle.requestType === "local"
                          ? "Local request"
                          : "National request"}
                      </span>
                    )}
                    {vehicle?.fuelType && (
                      <span className="rounded-full bg-white px-3 py-1">
                        {vehicle.fuelType}
                      </span>
                    )}
                    {vehicle?.engineSize && (
                      <span className="rounded-full bg-white px-3 py-1">
                        {vehicle.engineSize}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                  Services requested
                </p>
                {services.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {services.map((service, index) => (
                      <div
                        key={service.id ?? `${service.label}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] px-5 py-4"
                      >
                        <div>
                          <p className="font-['Inter'] text-base font-semibold text-[#0F172A]">
                            {service.label}
                          </p>
                          {service.category && (
                            <p className="font-['Roboto'] text-sm text-[#64748B]">
                              {service.category}
                            </p>
                          )}
                          {service.notes && (
                            <p className="font-['Roboto'] text-xs text-[#94A3B8]">
                              {service.notes}
                            </p>
                          )}
                        </div>
                        <button
                          className="text-sm font-semibold text-[#F02801] hover:text-[#D22301] flex items-center gap-1"
                          onClick={() => handleServiceRemove(index)}
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-5 py-4 text-sm text-[#475569]">
                    Add at least one service so suppliers know what to quote
                    for.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  className="flex-1 min-w-[180px]"
                  onClick={() => handleNavigate("vehicle-confirmation")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Review Request
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 min-w-[180px]"
                  onClick={() => handleNavigate("parts-selection")}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Update Services
                </Button>
                <Button
                  variant="ghost"
                  className="text-[#F02801] hover:text-[#D22301]"
                  onClick={() => {
                    clearCartCookies();
                    setCartSummary({ vehicle: null, services: [] });
                  }}
                >
                  Clear Cart
                </Button>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-[#0F172A] text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-['Inter'] text-lg font-semibold">
                    Ready to request quotes?
                  </p>
                  <p className="font-['Roboto'] text-sm text-white/80">
                    Send your vehicle and service list to suppliers in one tap.
                  </p>
                </div>
                <Button
                  onClick={() => handleNavigate("quotes")}
                  className="bg-white text-[#0F172A] hover:bg-white/90"
                >
                  Continue to Quotes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
