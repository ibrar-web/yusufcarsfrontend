"use client";

import { Car, CheckCircle, XCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useAppState } from "@/hooks/use-app-state";
import type { VehicleData } from "@/stores/app-store";

interface VehicleConfirmationPageProps {
  onNavigate: (page: string) => void;
  vehicleData?: VehicleData | null;
  onSignupClick?: () => void;
}

function VehicleConfirmationPage({
  onNavigate,
  vehicleData,
}: VehicleConfirmationPageProps) {
  const vehicleTitle =
    [
      vehicleData?.yearOfManufacture,
      vehicleData?.make,
      vehicleData?.model,
    ]
      .filter(Boolean)
      .join(" ") || "Review Your Vehicle";

  const baseDetails = [
    { label: "Make", value: vehicleData?.make },
    { label: "Model", value: vehicleData?.model },
    {
      label: "Year of Manufacture",
      value: vehicleData?.yearOfManufacture,
    },
  ];

  const extendedDetails = [
    {
      label: "Registration",
      value: vehicleData?.registrationNumber,
    },
    { label: "Postcode", value: vehicleData?.postcode },
    {
      label: "Fuel Type",
      value: vehicleData?.fuelType,
    },
    {
      label: "Engine Size",
      value:
        vehicleData?.engineSize ??
        (vehicleData?.engineCapacity
          ? `${vehicleData.engineCapacity}cc`
          : undefined),
    },
    {
      label: "Request Scope",
      value:
        vehicleData?.localRequest === undefined
          ? undefined
          : vehicleData.localRequest
            ? "Local suppliers only"
            : "Any supplier",
    },
  ];

  const vehicleExtras = [
    { label: "Colour", value: vehicleData?.colour },
    { label: "Fuel", value: vehicleData?.fuelType },
    { label: "Wheelplan", value: vehicleData?.wheelplan },
    { label: "Tax Status", value: vehicleData?.taxStatus },
    { label: "Tax Due Date", value: vehicleData?.taxDueDate },
    { label: "MOT Status", value: vehicleData?.motStatus },
    { label: "MOT Expiry", value: vehicleData?.motExpiryDate },
    { label: "CO2 Emissions", value: vehicleData?.co2Emissions },
    {
      label: "Engine Capacity",
      value: vehicleData?.engineCapacity
        ? `${vehicleData.engineCapacity}cc`
        : undefined,
    },
  ].filter(
    (detail) => detail.value !== undefined && detail.value !== null && detail.value !== ""
  );

  const formatValue = (value?: string | number | boolean) =>
    value !== undefined && value !== null && value !== ""
      ? String(value)
      : "Not provided";

  const handleNo = () => {
    onNavigate("home");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} currentPage="vehicle-confirmation" />

      <div className="max-w-[1000px] mx-auto px-6 pt-32 pb-16 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 fade-in-up">
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1609465397944-be1ce3ebda61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTkyMzg1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Luxury car interior"
              className="w-full h-full object-cover opacity-20"
              style={{ filter: "blur(4px)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/95 via-[#1E293B]/90 to-[#0F172A]/95" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-hover to-primary z-10" />

          <div className="relative z-10 px-24 py-12">
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756990688487-38fea20c395b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBzaWRlJTIwdmlld3xlbnwxfHx8fDE3NTkyMzI1MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Luxury sports car"
                className="w-full h-full object-cover opacity-5"
                style={{ filter: "blur(1px)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/20 to-transparent" />
            </div>

            <div className="relative z-10 text-center mb-8">
              <h1
                className="font-['Inter'] font-bold text-white/80"
                style={{ fontSize: "32px", lineHeight: "1.2" }}
              >
                Is This Your Vehicle?
              </h1>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-[#1E293B]/60 to-[#0F172A]/70 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/5">
              <div className="absolute inset-0 z-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1578148211838-491f3014dfc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBlbmdpbmUlMjBkZXRhaWx8ZW58MXx8fHwxNzU5MzA3MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Car engine detail"
                  className="w-full h-full object-cover opacity-10"
                  style={{ filter: "blur(2px)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/95" />
              </div>

              <div className="relative z-10 text-center mb-6">
                <div className="inline-block px-4 py-1 bg-primary/15 rounded-full mb-3 border border-primary/20">
                  <p className="font-['Roboto'] text-xs text-primary/90 font-semibold uppercase tracking-wider">
                    Confirmed Details
                  </p>
                </div>
                <h2
                  className="font-['Inter'] font-bold text-white/70"
                  style={{ fontSize: "28px", lineHeight: "1.3" }}
                >
                  {vehicleTitle}
                </h2>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-3">
                {baseDetails.map((detail) => (
                  <div key={detail.label} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <div className="relative text-center p-5 bg-[#0F172A]/40 backdrop-blur-sm rounded-xl shadow-sm border border-white/[0.03] hover:border-primary/20 transition-all">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2 border border-primary/20">
                        <Car className="h-4 w-4 text-primary/80" />
                      </div>
                      <p className="font-['Roboto'] text-xs text-white/40 uppercase tracking-wider mb-1">
                        {detail.label}
                      </p>
                      <p
                        className="font-['Inter'] font-bold text-white/70"
                        style={{ fontSize: "16px" }}
                      >
                        {formatValue(detail.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {extendedDetails.map((detail) => (
                  <div key={detail.label} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <div className="relative text-center p-4 bg-[#0F172A]/30 backdrop-blur-sm rounded-xl border border-white/[0.04] hover:border-primary/20 transition-all">
                      <p className="font-['Roboto'] text-xs text-white/40 uppercase tracking-wider mb-1">
                        {detail.label}
                      </p>
                      <p className="font-['Inter'] font-semibold text-white/70">
                        {formatValue(detail.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {vehicleExtras.length > 0 && (
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {vehicleExtras.map((detail) => (
                    <div key={detail.label} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                      <div className="relative text-center p-4 bg-[#0F172A]/20 backdrop-blur-sm rounded-xl border border-white/[0.04] hover:border-primary/20 transition-all">
                        <p className="font-['Roboto'] text-xs text-white/40 uppercase tracking-wider mb-1">
                          {detail.label}
                        </p>
                        <p className="font-['Inter'] font-semibold text-white/70">
                          {formatValue(detail.value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleNo}
                variant="outline"
                className="flex-1 h-14 border-2 border-white/10 hover:bg-white/5 hover:border-white/20 text-white/70 hover:text-white/90 font-['Roboto'] font-medium rounded-full transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
                style={{ fontSize: "15px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <XCircle className="mr-2 h-5 w-5 text-white/60 group-hover:text-white/80 transition-colors relative z-10" />
                <span className="relative z-10 text-[rgba(0,0,0,0.7)]">
                  No, Go Back
                </span>
              </Button>

              <Button
                onClick={() => onNavigate("products", undefined, vehicleData ?? undefined)}
                className="flex-1 h-14 bg-primary hover:bg-primary-hover text-white font-['Roboto'] font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
                style={{ fontSize: "15px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <CheckCircle className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10">Yes, Continue</span>
              </Button>
            </div>

            <p className="relative z-10 text-center mt-6 font-['Roboto'] text-sm text-white/40">
              Confirm your vehicle to proceed to parts selection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VehicleConfirmation() {
  const { handleNavigate, openSignupDialog, vehicleData } = useAppState();

  return (
    <VehicleConfirmationPage
      onNavigate={handleNavigate}
      vehicleData={vehicleData ?? undefined}
      onSignupClick={openSignupDialog}
    />
  );
}
