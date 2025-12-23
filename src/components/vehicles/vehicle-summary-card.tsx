"use client";

import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import type { VehicleData } from "@/stores/app-store";
import { Car } from "lucide-react";
import { cn } from "@/components/ui/utils";

type VehicleSummaryCardProps = {
  vehicle: VehicleData;
  title?: string;
  subtitle?: string;
  className?: string;
};

const formatValue = (value?: string | number | boolean) =>
  value !== undefined && value !== null && value !== ""
    ? String(value)
    : "Not provided";

export function VehicleSummaryCard({
  vehicle,
  title,
  subtitle,
  className,
}: VehicleSummaryCardProps) {
  if (!vehicle) {
    return null;
  }

  const vehicleTitle =
    [vehicle?.yearOfManufacture, vehicle?.make, vehicle?.model]
      .filter(Boolean)
      .join(" ") || "Review Your Vehicle";

  const baseDetails = [
    { label: "Make", value: vehicle?.make },
    { label: "Model", value: vehicle?.model },
    {
      label: "Year of Manufacture",
      value: vehicle?.yearOfManufacture,
    },
  ];

  const extendedDetails = [
    {
      label: "Registration",
      value: vehicle?.registrationNumber,
    },
    {
      label: "Fuel Type",
      value: vehicle?.fuelType,
    },
    {
      label: "Request Scope",
      value:
        vehicle?.localRequest === undefined
          ? undefined
          : vehicle.localRequest
          ? "Local suppliers only"
          : "Any supplier",
    },
  ];

  const vehicleExtras = [
    { label: "Colour", value: vehicle?.colour },
    { label: "Fuel", value: vehicle?.fuelType },
    { label: "Wheelplan", value: vehicle?.wheelplan },
    { label: "Tax Due Date", value: vehicle?.taxDueDate },
    { label: "MOT Status", value: vehicle?.motStatus },
    { label: "MOT Expiry", value: vehicle?.motExpiryDate },
    { label: "CO2 Emissions", value: vehicle?.co2Emissions },
    {
      label: "Engine Capacity",
      value: vehicle?.engineCapacity
        ? `${vehicle.engineCapacity}cc`
        : undefined,
    },
  ].filter(
    (detail) =>
      detail.value !== undefined && detail.value !== null && detail.value !== ""
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 max-h-[80vh] flex flex-col",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1609465397944-be1ce3ebda61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTkyMzg1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Luxury car interior"
          className="w-full h-full object-cover opacity-20"
          style={{ filter: "blur(4px)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/95 via-[#1E293B]/90 to-[#0F172A]/95" />
      </div>
      <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 flex-1 flex flex-col overflow-hidden">
        {(title || subtitle) && (
          <div className="text-center mb-6">
            {title && (
              <h1
                className="font-['Inter'] font-bold text-white/80"
                style={{ fontSize: "32px", lineHeight: "1.2" }}
              >
                {title}
              </h1>
            )}
          </div>
        )}

        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E293B]/60 to-[#0F172A]/70 backdrop-blur-xl rounded-2xl p-4 sm:p-8 border border-white/5 flex-1 flex flex-col">
          <div className="relative z-10 text-center mb-6">
            <h2 className="font-['Inter'] font-bold text-white/80 text-[22px] sm:text-[28px] leading-tight px-4">
              {vehicleTitle}
            </h2>
          </div>

          <div className="flex-1 overflow-auto pr-2 sm:pr-4 custom-scrollbar space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {baseDetails.map((detail) => (
                <div key={detail.label} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative p-4 sm:p-5 bg-[#0F172A]/45 backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-primary/40 transition-all min-h-[120px] flex flex-col justify-center text-left shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 border border-primary/40">
                        <Car className="h-3.5 w-3.5 text-primary/70" />
                      </span>
                      <p className="font-['Roboto'] text-[11px] sm:text-xs text-white/40 uppercase tracking-[0.2em]">
                        {detail.label}
                      </p>
                    </div>
                    <p className="font-['Inter'] font-bold text-white/70 text-base sm:text-lg">
                      {formatValue(detail.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extendedDetails.map((detail) => (
                <div key={detail.label} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative py-3 px-4 sm:p-4 bg-[#0F172A]/30 backdrop-blur-sm rounded-2xl border border-white/[0.04] hover:border-primary/20 transition-all text-left shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
                    <p className="font-['Roboto'] text-[11px] sm:text-xs text-white/40 uppercase tracking-wider mb-1">
                      {detail.label}
                    </p>
                    <p className="font-['Inter'] font-semibold text-white/80 text-sm sm:text-base">
                      {formatValue(detail.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {vehicleExtras.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicleExtras.map((detail) => (
                  <div key={detail.label} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <div className="relative py-3 px-4 sm:p-4 bg-[#0F172A]/20 backdrop-blur-sm rounded-2xl border border-white/[0.04] hover-border-primary/20 transition-all text-left shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
                      <p className="font-['Roboto'] text-[11px] sm:text-xs text-white/40 uppercase tracking-wider mb-1">
                        {detail.label}
                      </p>
                      <p className="font-['Inter'] font-semibold text-white/80 text-sm sm:text-base">
                        {formatValue(detail.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
