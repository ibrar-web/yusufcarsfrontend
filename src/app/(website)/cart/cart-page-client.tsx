"use client";

import { useEffect, useState } from "react";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, CheckCircle, XCircle } from "lucide-react";
import {
  loadCartSummary,
  subscribeToCartUpdates,
  type CartSummary,
  removeVehicleFromCart,
  removeServiceByIndex,
  persistServicesSelection,
} from "@/utils/cart-storage";
import { useAppState } from "@/hooks/use-app-state";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VehicleSummaryCard } from "@/components/vehicles/vehicle-summary-card";
import { toast } from "sonner";
import { apiPost } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
type ExtendedError = Error & { status?: number };

export function CartPageClient() {
  const { handleNavigate, isAuthenticated } = useAppState();
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    vehicle: null,
    services: [],
  });
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [requestingQuote, setRequestingQuote] = useState(false);

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

  const handleVehicleConfirm = () => {
    if (!vehicle) {
      toast.error("Add your vehicle before continuing.");
      return;
    }
    setVehicleDialogOpen(false);
    handleNavigate("products", undefined, vehicle);
  };

  const buildQuoteRequestPayload = (
    vehicleData: NonNullable<CartSummary["vehicle"]>,
    serviceList: CartSummary["services"]
  ) => {
    if (!serviceList || !serviceList.length) {
      throw new Error("Add at least one service to proceed.");
    }

    const services = serviceList
      .map((service) => service?.id || service?.label)
      .filter((service): service is string =>
        Boolean(service && service.trim())
      );

    if (!services.length) {
      throw new Error("Add at least one service to proceed.");
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    return {
      make: vehicleData.make,
      model: vehicleData.model,
      registrationNumber: vehicleData.registrationNumber,
      taxStatus: vehicleData.taxStatus,
      taxDueDate: vehicleData.taxDueDate,
      motStatus: vehicleData.motStatus,
      yearOfManufacture: vehicleData.yearOfManufacture,
      fuelType: vehicleData.fuelType,
      engineSize: vehicleData.engineSize,
      engineCapacity: vehicleData.engineCapacity,
      co2Emissions: vehicleData.co2Emissions,
      services,
      postcode: vehicleData.postcode,
      requestType:
        vehicleData.requestType ??
        (vehicleData.localRequest ? "local" : "national"),
      expiresAt: expiryDate.toISOString(),
    };
  };

  const handleQuoteRequest = async () => {
    if (!vehicle) {
      toast.error("Add your vehicle before requesting a quote.");
      return;
    }
    if (!services.length) {
      toast.error("Add at least one service.");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please sign in before requesting a quote.");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("request-sign-in"));
      }
      return;
    }

    setRequestingQuote(true);
    try {
      const payload = buildQuoteRequestPayload(vehicle, services);
      await apiPost(apiRoutes.user.quote.requestQuote, payload);
      toast.success("Quote request submitted.");
      persistServicesSelection([]);
      refreshSummary();
    } catch (error) {
      const err = error as ExtendedError;
      if (err.status === 401) {
        toast.error("Please sign in before requesting a quote.");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("request-sign-in"));
        }
        return;
      }
      toast.error(
        err instanceof Error ? err.message : "Failed to send quote request."
      );
    } finally {
      setRequestingQuote(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* <Header /> */}
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
                Start by entering your vehicle details and selecting at least
                one service so suppliers know what to quote for.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => handleNavigate("home")}>
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
                    {[vehicle?.yearOfManufacture, vehicle?.make, vehicle?.model]
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
                  <div className="mt-6 border-t border-[#E2E8F0] pt-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                        Services requested
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigate("parts-selection")}
                      >
                        {services.length
                          ? "Add or update services"
                          : "Add services"}
                      </Button>
                    </div>
                    {services.length > 0 ? (
                      <div className="space-y-3 flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        {services.map((service, index) => (
                          <div
                            key={service.id ?? `${service.label}-${index}`}
                            className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="space-y-1">
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
                              className="text-sm font-semibold text-[#F02801] hover:text-[#D22301] flex items-center gap-1 justify-center cursor-pointer"
                              onClick={() => handleServiceRemove(index)}
                            >
                              <X className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-5 py-4 text-sm text-[#475569]">
                        Add at least one service so suppliers know what to quote
                        for.
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        size="lg"
                        onClick={handleQuoteRequest}
                        disabled={requestingQuote || services.length === 0}
                        className="w-full sm:w-auto"
                      >
                        {requestingQuote ? "Requesting…" : "Submit request"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  className="flex-1 min-w-[180px]"
                  onClick={openVehicleDialog}
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
              </div> */}

              {/* <div className="rounded-2xl border border-[#E2E8F0] bg-[#0F172A] text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              </div> */}
            </div>
          )}
        </section>
        <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
          <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0">
            {vehicle ? (
              <div className="space-y-6">
                <VehicleSummaryCard
                  vehicle={vehicle}
                  title="Is This Your Vehicle?"
                  subtitle="Confirm your details to proceed"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setVehicleDialogOpen(false)}
                    className="flex-1 h-12 rounded-full border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    No, Go Back
                  </Button>
                  <Button
                    onClick={handleVehicleConfirm}
                    className="flex-1 h-12 rounded-full bg-primary hover:bg-primary-hover text-white font-['Roboto'] font-semibold transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <CheckCircle className="mr-2 h-5 w-5 relative z-10" />
                    <span className="relative z-10">Yes, Continue</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-[#E2E8F0] p-8 text-center">
                <h3 className="font-['Inter'] text-xl font-semibold text-[#0F172A] mb-2">
                  No vehicle selected
                </h3>
                <p className="font-['Roboto'] text-[#475569]">
                  Add your vehicle details first so we can confirm everything
                  looks right.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
