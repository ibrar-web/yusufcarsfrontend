"use client";

import { useState } from "react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { enquiryVehicle } from "@/actions/dvla";
import {
  carMakes,
  carModels,
  carYears,
  engineSizes,
  fuelTypes,
} from "@/data/vehicle-options";
import type { VehicleData } from "@/stores/app-store";
import type { VehicleEnquiryResponse } from "@/types/dvla";

type VehicleSelectionProps = {
  onNavigate: (
    page: string,
    id?: string,
    vehicleInfo?: any,
    partData?: any,
    category?: string,
    quoteData?: any
  ) => void;
};

export function VehicleSelection({ onNavigate }: VehicleSelectionProps) {
  const [inputMode, setInputMode] = useState<"registration" | "manual">(
    "registration"
  );
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [postcode, setPostcode] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [localRequest, setLocalRequest] = useState(false);
  const [lookupDetails, setLookupDetails] =
    useState<VehicleEnquiryResponse | null>(null);

  const isSearchDisabled =
    inputMode === "registration"
      ? registrationNumber.length < 6
      : !vehicleMake ||
        !vehicleModel ||
        !vehicleYear ||
        !fuelType ||
        !engineSize;

  const handleLookup = async () => {
    if (inputMode === "registration") {
      if (registrationNumber.length < 6) {
        toast.error("Enter a valid registration number.");
        return;
      }

      try {
        const data = await enquiryVehicle(registrationNumber);
        setLookupDetails(data);
        setFilterDialogOpen(true);
      } catch (error) {
        setLookupDetails(null);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to lookup vehicle details."
        );
      }
      return;
    }

    if (
      !vehicleMake ||
      !vehicleModel ||
      !vehicleYear ||
      !fuelType ||
      !engineSize
    ) {
      toast.error("Select your vehicle details first.");
      return;
    }

    setFilterDialogOpen(true);
  };

  const buildVehiclePayload = (): VehicleData => {
    const isRegistration = inputMode === "registration";
    const lookupYear = lookupDetails?.yearOfManufacture
      ? String(lookupDetails.yearOfManufacture)
      : undefined;
    const lookupEngine =
      lookupDetails?.engineCapacity !== undefined
        ? `${lookupDetails.engineCapacity}cc`
        : undefined;

    return {
      inputMode,
      registrationNumber:
        registrationNumber || lookupDetails?.registrationNumber || undefined,
      postcode: postcode || undefined,
      localRequest,
      make: isRegistration
        ? lookupDetails?.make || undefined
        : vehicleMake || undefined,
      model: isRegistration ? undefined : vehicleModel || undefined,
      yearOfManufacture: isRegistration ? lookupYear : vehicleYear || undefined,
      fuelType: isRegistration
        ? lookupDetails?.fuelType || undefined
        : fuelType || undefined,
      engineSize: isRegistration ? lookupEngine : engineSize || undefined,
      engineCapacity: lookupDetails?.engineCapacity,
      co2Emissions: lookupDetails?.co2Emissions,
      colour: lookupDetails?.colour,
      wheelplan: lookupDetails?.wheelplan,
      taxStatus: lookupDetails?.taxStatus,
      taxDueDate: lookupDetails?.taxDueDate,
      motStatus: lookupDetails?.motStatus,
      motExpiryDate: lookupDetails?.motExpiryDate,
      markedForExport: lookupDetails?.markedForExport,
      typeApproval: lookupDetails?.typeApproval,
      revenueWeight: lookupDetails?.revenueWeight,
      dateOfLastV5CIssued: lookupDetails?.dateOfLastV5CIssued,
      monthOfFirstRegistration: lookupDetails?.monthOfFirstRegistration,
    };
  };

  const handleConfirmFilter = () => {
    if (inputMode === "registration") {
      if (registrationNumber.length < 6) {
        toast.error("Enter a valid registration number.");
        return;
      }

      setFilterDialogOpen(false);
      onNavigate("request-flow", undefined, buildVehiclePayload());
      return;
    }

    if (
      !vehicleMake ||
      !vehicleModel ||
      !vehicleYear ||
      !fuelType ||
      !engineSize
    ) {
      toast.error("Select your vehicle details first.");
      return;
    }

    setFilterDialogOpen(false);
    onNavigate("request-flow", undefined, buildVehiclePayload());
  };

  return (
    <section className="relative overflow-hidden min-h-[450px] lg:min-h-[500px]">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1753899762863-af6e21e86438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwc3BvcnRzJTIwY2FyfGVufDF8fHx8MTc1OTIyNjI4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Blue sports car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent" />
      </div>
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          <div className="fade-in-up order-2 lg:order-1">
            <div className="relative max-w-lg mx-auto lg:mx-0 w-full">
              <div className="absolute -top-3 left-8 z-20 flex gap-2">
                <button
                  onClick={() => setInputMode("registration")}
                  className={`px-6 py-3 rounded-full font-['Roboto'] font-semibold transition-all duration-300 ${
                    inputMode === "registration"
                      ? "bg-[#F02801] text-white shadow-lg shadow-[#F02801]/30"
                      : "bg-[#94A3B8] text-white shadow-md"
                  }`}
                  style={{ fontSize: "15px" }}
                >
                  Registration
                </button>
                <button
                  onClick={() => {
                    setInputMode("manual");
                    setLookupDetails(null);
                  }}
                  className={`px-6 py-3 rounded-full font-['Roboto'] font-semibold transition-all duration-300 ${
                    inputMode === "manual"
                      ? "bg-[#F02801] text-white shadow-lg shadow-[#F02801]/30"
                      : "bg-[#94A3B8] text-white shadow-md"
                  }`}
                  style={{ fontSize: "15px" }}
                >
                  Manual
                </button>
              </div>
              <div
                className="relative backdrop-blur-xl rounded-[24px] p-8 lg:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.16)] border border-white/40"
                style={{ background: "rgba(255, 255, 255, 0.85)" }}
              >
                <div className="mb-10">
                  <h2
                    className="font-['Inter'] font-bold text-[#0F172A] leading-tight"
                    style={{ fontSize: "26px" }}
                  >
                    {inputMode === "registration"
                      ? "Add Your Registration Number"
                      : "Select Your Vehicle"}
                  </h2>
                </div>
                {inputMode === "registration" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-3 font-['Roboto'] text-[#475569] text-sm">
                        Vehicle Registration Number
                      </label>
                      <Input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "");
                          setRegistrationNumber(value);
                          setLookupDetails(null);
                        }}
                        placeholder="E.G. AB12 CDE"
                        maxLength={8}
                        className="h-14 text-[18px] text-center rounded-2xl border-2 border-[#CBD5E1] bg-white hover:border-[#94A3B8] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] font-semibold tracking-wider text-[#0F172A] uppercase placeholder:text-[#94A3B8]"
                        style={{ letterSpacing: "0.2em" }}
                      />
                    </div>
                    <div>
                      <label className="block mb-3 font-['Roboto'] text-[#475569] text-sm">
                        Your Postcode
                      </label>
                      <Input
                        type="text"
                        value={postcode}
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9\s]/g, "");
                          setPostcode(value);
                        }}
                        placeholder="E.G. SW1A 1AA"
                        maxLength={8}
                        className="h-14 text-[16px] text-center rounded-2xl border-2 border-[#CBD5E1] bg-white hover:border-[#94A3B8] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A] uppercase placeholder:text-[#94A3B8]"
                      />
                    </div>
                    <Button
                      onClick={handleLookup}
                      disabled={isSearchDisabled}
                      className="w-full h-16 rounded-full font-['Roboto'] font-bold bg-gradient-to-r from-[#F02801] to-[#FF5C39] hover:from-[#D22301] hover:to-[#F02801] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-lg shadow-[#F02801]/30 hover:shadow-xl hover:shadow-[#F02801]/40"
                      style={{ fontSize: "16px" }}
                    >
                      FILTER
                    </Button>
                  </div>
                )}
                {inputMode === "manual" && (
                  <div className="space-y-6">
                    <div>
                      <Select
                        value={vehicleMake}
                        onValueChange={(value) => {
                          setVehicleMake(value);
                          setVehicleModel("");
                        }}
                      >
                        <SelectTrigger className="h-20 text-[18px] rounded-2xl border-2 border-[#FECACA] bg-white hover:border-[#FCA5A5] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A]">
                          <SelectValue placeholder="Select Maker" />
                        </SelectTrigger>
                        <SelectContent className="font-['Roboto']">
                          {carMakes.map((make) => (
                            <SelectItem
                              key={make}
                              value={make}
                              className="text-[18px]"
                            >
                              {make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select
                        value={vehicleModel}
                        onValueChange={setVehicleModel}
                        disabled={!vehicleMake}
                      >
                        <SelectTrigger className="h-20 text-[18px] rounded-2xl border-2 border-[#FECACA] bg-white hover:border-[#FCA5A5] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100">
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent className="font-['Roboto']">
                          {vehicleMake &&
                            carModels[vehicleMake]?.map((model) => (
                              <SelectItem
                                key={model}
                                value={model}
                                className="text-[18px]"
                              >
                                {model}
                              </SelectItem>
                            ))}
                          {vehicleMake && !carModels[vehicleMake] && (
                            <SelectItem value="other" className="text-[18px]">
                              Other Models
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select
                        value={vehicleYear}
                        onValueChange={setVehicleYear}
                      >
                        <SelectTrigger className="h-20 text-[18px] rounded-2xl border-2 border-[#FECACA] bg-white hover:border-[#FCA5A5] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A]">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent className="font-['Roboto'] max-h-[300px]">
                          {carYears.map((year) => (
                            <SelectItem
                              key={year}
                              value={year}
                              className="text-[18px]"
                            >
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger className="h-20 text-[18px] rounded-2xl border-2 border-[#FECACA] bg-white hover:border-[#FCA5A5] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A]">
                          <SelectValue placeholder="Select Fuel Type" />
                        </SelectTrigger>
                        <SelectContent className="font-['Roboto']">
                          {fuelTypes.map((fuel) => (
                            <SelectItem
                              key={fuel}
                              value={fuel}
                              className="text-[18px]"
                            >
                              {fuel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select value={engineSize} onValueChange={setEngineSize}>
                        <SelectTrigger className="h-20 text-[18px] rounded-2xl border-2 border-[#FECACA] bg-white hover:border-[#FCA5A5] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A]">
                          <SelectValue placeholder="Select Engine Size" />
                        </SelectTrigger>
                        <SelectContent className="font-['Roboto']">
                          {engineSizes.map((size) => (
                            <SelectItem
                              key={size}
                              value={size}
                              className="text-[18px]"
                            >
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleLookup}
                      disabled={isSearchDisabled}
                      className="w-full h-16 rounded-full font-['Roboto'] font-bold bg-gradient-to-r from-[#F02801] to-[#FF5C39] hover:from-[#D22301] hover:to-[#F02801] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-lg shadow-[#F02801]/30 hover:shadow-xl hover:shadow-[#F02801]/40"
                      style={{ fontSize: "16px" }}
                    >
                      FILTER
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogContent className="sm:max-w-[500px] bg-white border-2 border-[#F1F5F9] rounded-[24px] p-8">
              <DialogHeader>
                <DialogTitle className="font-['Inter'] text-[#0F172A] text-[24px]">
                  Filter Options
                </DialogTitle>
                <DialogDescription className="font-['Roboto'] text-[#475569] text-[16px]">
                  Customise your supplier search preferences
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1E293B] border-2 border-[#334155] hover:border-[#F02801] transition-colors duration-200">
                  <div className="flex-1 pr-4">
                    <Label
                      htmlFor="local-request"
                      className="font-['Roboto'] text-[16px] text-[#F1F5F9] cursor-pointer"
                    >
                      Local Request
                    </Label>
                    <p className="font-['Roboto'] text-[14px] text-[#CBD5E1] mt-1">
                      Only show nearby suppliers in your area
                    </p>
                  </div>
                  <Switch
                    id="local-request"
                    checked={localRequest}
                    onCheckedChange={setLocalRequest}
                    className="data-[state=checked]:bg-[#F02801]"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setFilterDialogOpen(false)}
                  className="flex-1 h-12 rounded-full font-['Roboto'] border-2 border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] hover:border-[#94A3B8] transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmFilter}
                  className="flex-1 h-12 rounded-full font-['Roboto'] bg-gradient-to-r from-[#F02801] to-[#FF5C39] hover:from-[#D22301] hover:to-[#F02801] text-white transition-all duration-300 shadow-lg shadow-[#F02801]/30 hover:shadow-xl hover:shadow-[#F02801]/40"
                >
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div
            className="relative fade-in-up order-1 lg:order-2 bg-white/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none rounded-2xl lg:rounded-none p-8 lg:p-0"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-left lg:text-left flex flex-col justify-center h-full py-12 lg:py-16">
              <h1 className="font-['Inter'] text-[42px] sm:text-[56px] lg:text-[72px] font-black text-white leading-[1.1] tracking-tight italic mb-4 lg:mb-6">
                Fix It Fast.
                <br />
                Drive Happy.
              </h1>
              <p className="font-['Roboto'] text-[16px] lg:text-[22px] text-white font-medium mb-8 lg:mb-10 tracking-wide leading-relaxed">
                From bolt-ons to full builds — tune your ride the smart way.
              </p>
              <Button
                onClick={() => onNavigate("supplier-onboarding")}
                className="h-14 w-[140px] font-['Roboto'] font-bold bg-[#F02801] hover:bg-[#D22301] text-white rounded-full transition-all duration-300 shadow-[0_8px_24px_rgba(240,40,1,0.5)] hover:shadow-[0_12px_32px_rgba(240,40,1,0.6)] hover:scale-105 uppercase tracking-wider"
                style={{ fontSize: "15px" }}
              >
                APPLY NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
