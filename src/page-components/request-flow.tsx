import { useState } from "react";
import { Header } from "../components/header";
import { Stepper } from "../components/stepper";
import { NumberPlateInput } from "../components/number-plate-input";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Wrench,
  Disc,
  Settings,
  Zap,
  Car,
  Armchair,
  Upload,
  Check,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface RequestFlowPageProps {
  onNavigate: (page: string) => void;
}

export function RequestFlowPage({ onNavigate }: RequestFlowPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputMode, setInputMode] = useState<"registration" | "manual">("registration");
  const [numberPlate, setNumberPlate] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState({
    make: "Volkswagen",
    model: "Golf",
    year: "2018",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [radius, setRadius] = useState([25]);
  const [notes, setNotes] = useState("");

  const steps = [
    { title: "Vehicle", description: "Enter registration" },
    { title: "Part", description: "Select category" },
    { title: "Details", description: "Add information" },
  ];

  const partCategories = [
    { id: "engine", label: "Engine", icon: Settings },
    { id: "brakes", label: "Brakes", icon: Disc },
    { id: "suspension", label: "Suspension", icon: Wrench },
    { id: "electrical", label: "Electrical", icon: Zap },
    { id: "bodywork", label: "Bodywork", icon: Car },
    { id: "interior", label: "Interior", icon: Armchair },
  ];

  // UK Car Makes Data
  const carMakes = [
    "Audi",
    "BMW",
    "Ford",
    "Mercedes-Benz",
    "Vauxhall",
    "Volkswagen",
    "Nissan",
    "Toyota",
    "Honda",
    "Peugeot",
    "Renault",
    "Citroën",
    "Mazda",
    "Hyundai",
    "Kia",
    "Volvo",
    "Jaguar",
    "Land Rover",
    "Mini",
    "Skoda",
  ];

  const carModels: Record<string, string[]> = {
    "Audi": ["A1", "A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "TT"],
    "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "X1", "X3", "X5"],
    "Ford": ["Fiesta", "Focus", "Mondeo", "Kuga", "Puma", "Mustang"],
    "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "GLA", "GLC", "GLE"],
    "Vauxhall": ["Corsa", "Astra", "Insignia", "Mokka", "Grandland"],
    "Volkswagen": ["Polo", "Golf", "Passat", "Tiguan", "T-Roc", "Touareg"],
    "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf"],
    "Toyota": ["Yaris", "Corolla", "Camry", "RAV4", "C-HR", "Prius"],
    "Honda": ["Jazz", "Civic", "Accord", "CR-V", "HR-V"],
    "Peugeot": ["108", "208", "308", "2008", "3008", "5008"],
  };

  const carYears = Array.from({ length: 25 }, (_, i) => (2025 - i).toString());

  const handleNext = () => {
    if (currentStep === 0) {
      // Populate vehicle details from either mode
      if (inputMode === "registration" && numberPlate.length >= 6) {
        setVehicleDetails({
          make: "Volkswagen",
          model: "Golf",
          year: "2018",
        });
      } else if (inputMode === "manual" && vehicleMake && vehicleModel && vehicleYear) {
        setVehicleDetails({
          make: vehicleMake,
          model: vehicleModel,
          year: vehicleYear,
        });
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNavigate("quotes");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onNavigate("home");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Only shown on Step 1 */}
      {currentStep === 0 && (
        <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#0F172A] flex items-center justify-center py-12 px-6">
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1666542061805-817deaf22f3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbSUyMGRhcmt8ZW58MXx8fHwxNzU5MzAwNzg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Luxury car showroom"
              className="w-full h-full object-cover opacity-40"
              style={{ filter: 'blur(8px)' }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 via-[#0F172A]/70 to-[#0F172A]/90" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-[1200px] mx-auto">
            {/* Heading */}
            <div className="text-center mb-12 fade-in-up">
              <h1 className="font-['Inter'] font-semibold text-white mb-4" style={{ fontSize: '56px', lineHeight: '1.1' }}>
                Find Your Car Part in Minutes
              </h1>
              <p className="font-['Roboto'] text-[#E2E8F0] opacity-80" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                Enter your reg or choose vehicle details to compare quotes nearby.
              </p>
            </div>

            {/* Glass Card */}
            <div 
              className="max-w-[600px] mx-auto rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] fade-in-up" 
              style={{ 
                animationDelay: '0.2s',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Segmented Tabs */}
              <div className="p-2 border-b border-[#E2E8F0]">
                <div className="flex gap-2 bg-[#F1F5F9] rounded-xl p-1">
                  <button
                    onClick={() => setInputMode("registration")}
                    className={`flex-1 py-3 px-6 rounded-[10px] font-['Roboto'] font-medium transition-all duration-180 ${
                      inputMode === "registration"
                        ? "bg-[#EF4444] text-white shadow-md"
                        : "bg-transparent text-[#475569] hover:text-[#0F172A] border border-[#E5E7EB]"
                    }`}
                    style={{ fontSize: '15px' }}
                  >
                    Registration
                  </button>
                  <button
                    onClick={() => setInputMode("manual")}
                    className={`flex-1 py-3 px-6 rounded-[10px] font-['Roboto'] font-medium transition-all duration-180 ${
                      inputMode === "manual"
                        ? "bg-[#EF4444] text-white shadow-md"
                        : "bg-transparent text-[#475569] hover:text-[#0F172A] border border-[#E5E7EB]"
                    }`}
                    style={{ fontSize: '15px' }}
                  >
                    Manual details
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {inputMode === "registration" ? (
                  <div className="space-y-4 fade-in-up">
                    <div>
                      <Label htmlFor="plate" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                        UK Number Plate
                      </Label>
                      <NumberPlateInput
                        id="plate"
                        value={numberPlate}
                        onChange={(e) => setNumberPlate(e.target.value)}
                        className="h-14 text-[16px] border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444] focus:border-[#EF4444]"
                        placeholder="AB12 CDE"
                      />
                      <p className="font-['Roboto'] text-sm text-[#475569] mt-2">
                        We'll auto-detect make, model, year.
                      </p>
                    </div>

                    {numberPlate.length >= 6 && (
                      <div className="p-4 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl">
                        <div className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-[#22C55E] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-['Roboto'] font-medium text-[#22C55E] mb-1">
                              Vehicle Found
                            </p>
                            <p className="font-['Roboto'] text-sm text-[#0F172A]">
                              2018 Volkswagen Golf
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleNext}
                      disabled={numberPlate.length < 6}
                      className="w-full h-14 bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2"
                      style={{ fontSize: '16px' }}
                    >
                      Search parts
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 fade-in-up">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="make" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                          Make
                        </Label>
                        <Select value={vehicleMake} onValueChange={(value) => {
                          setVehicleMake(value);
                          setVehicleModel("");
                        }}>
                          <SelectTrigger 
                            id="make"
                            className="h-12 border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444] focus:border-[#EF4444] font-['Roboto']"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto']">
                            {carMakes.map((make) => (
                              <SelectItem key={make} value={make}>
                                {make}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="model" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                          Model
                        </Label>
                        <Select 
                          value={vehicleModel} 
                          onValueChange={setVehicleModel}
                          disabled={!vehicleMake}
                        >
                          <SelectTrigger 
                            id="model"
                            className="h-12 border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444] focus:border-[#EF4444] font-['Roboto'] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto']">
                            {vehicleMake && carModels[vehicleMake]?.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                            {vehicleMake && !carModels[vehicleMake] && (
                              <SelectItem value="other">Other Models</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="year" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                          Year
                        </Label>
                        <Select value={vehicleYear} onValueChange={setVehicleYear}>
                          <SelectTrigger 
                            id="year"
                            className="h-12 border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444] focus:border-[#EF4444] font-['Roboto']"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto'] max-h-[300px]">
                            {carYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={!vehicleMake || !vehicleModel || !vehicleYear}
                      className="w-full h-14 bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2"
                      style={{ fontSize: '16px' }}
                    >
                      Search parts
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Chips */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <ShieldCheck className="h-4 w-4 text-white" />
                <span className="font-['Roboto'] text-sm text-white">
                  200+ Verified suppliers
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Star className="h-4 w-4 text-white" />
                <span className="font-['Roboto'] text-sm text-white">
                  4.8/5 Rating
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Clock className="h-4 w-4 text-white" />
                <span className="font-['Roboto'] text-sm text-white">
                  First quote in 10 min
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Standard Layout for Steps 2 & 3 */}
      {currentStep > 0 && (
        <div className="max-w-[900px] mx-auto px-6 py-12">
          {/* Progress Stepper */}
          <div className="mb-12">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>

          {/* Step 2: Part Category */}
          {currentStep === 1 && (
            <div className="space-y-8 fade-in-up">
              <div className="text-center">
                <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: '32px' }}>
                  Select Part Category
                </h2>
                <p className="font-['Roboto'] text-[#475569]" style={{ fontSize: '16px' }}>
                  Choose the category of the part you're looking for
                </p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {partCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group p-8 rounded-2xl border-2 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "border-[#F02801] bg-[#F02801]/5 shadow-lg"
                        : "border-[#E2E8F0] hover:border-[#F02801]/50 hover:shadow-md"
                    }`}
                  >
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-br from-[#F02801] to-[#D22301] shadow-lg"
                        : "bg-[#F1F5F9] group-hover:bg-[#F02801]/10"
                    }`}>
                      <category.icon
                        className={`h-8 w-8 ${
                          selectedCategory === category.id
                            ? "text-white"
                            : "text-[#475569] group-hover:text-[#F02801]"
                        }`}
                      />
                    </div>
                    <p
                      className={`font-['Inter'] font-medium text-center ${
                        selectedCategory === category.id
                          ? "text-[#F02801]"
                          : "text-[#0F172A]"
                      }`}
                      style={{ fontSize: '18px' }}
                    >
                      {category.label}
                    </p>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="max-w-md mx-auto fade-in-up">
                  <Label htmlFor="part-name" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                    Part Name (Optional)
                  </Label>
                  <Input
                    id="part-name"
                    placeholder="e.g., Front brake pads"
                    className="h-12 border-[#E2E8F0] focus:ring-2 focus:ring-[#F02801] focus:border-[#F02801] font-['Roboto']"
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 max-w-md mx-auto pt-6">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  className="flex-1 h-12 border-2 border-[#E2E8F0] hover:bg-[#F1F5F9] font-['Roboto']"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!selectedCategory}
                  className="flex-1 h-12 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] disabled:opacity-40"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 2 && (
            <div className="space-y-8 fade-in-up">
              <div className="text-center">
                <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: '32px' }}>
                  Provide Additional Details
                </h2>
                <p className="font-['Roboto'] text-[#475569]" style={{ fontSize: '16px' }}>
                  Help suppliers provide accurate quotes
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* Additional Information */}
                <div>
                  <Label htmlFor="notes" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                    Additional Information
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide any specific details about the part you need, such as part number, condition preference, or specific requirements..."
                    rows={4}
                    className="border-[#E2E8F0] focus:ring-2 focus:ring-[#F02801] focus:border-[#F02801] font-['Roboto']"
                  />
                </div>

                {/* Upload Photos */}
                <div>
                  <Label htmlFor="photos" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                    Upload Photos (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-[#E2E8F0] rounded-2xl p-12 text-center hover:border-[#F02801]/50 transition-colors cursor-pointer bg-[#F1F5F9]/50">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-[#475569]" />
                    <p className="font-['Roboto'] text-[#0F172A] mb-1">
                      Drop images here or click to browse
                    </p>
                    <p className="font-['Roboto'] text-sm text-[#475569]">
                      Supports: JPG, PNG (max 5MB each)
                    </p>
                  </div>
                </div>

                {/* Search Radius */}
                <div className="bg-[#F1F5F9] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="font-['Roboto'] text-[#0F172A]">
                      Search Radius
                    </Label>
                    <Badge variant="secondary" className="font-['Roboto'] bg-[#F02801] text-white border-0">
                      {radius[0]} miles
                    </Badge>
                  </div>
                  <Slider
                    value={radius}
                    onValueChange={setRadius}
                    max={100}
                    min={5}
                    step={5}
                    className="mb-3"
                  />
                  <div className="flex justify-between">
                    <span className="font-['Roboto'] text-xs text-[#475569]">5 miles</span>
                    <span className="font-['Roboto'] text-xs text-[#475569]">100 miles</span>
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <Label htmlFor="urgency" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                    Urgency
                  </Label>
                  <Select defaultValue="normal">
                    <SelectTrigger 
                      id="urgency" 
                      className="h-12 border-[#E2E8F0] focus:ring-2 focus:ring-[#F02801] focus:border-[#F02801] font-['Roboto']"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="font-['Roboto']">
                      <SelectItem value="low">Low - Can wait a week</SelectItem>
                      <SelectItem value="normal">Normal - Within a few days</SelectItem>
                      <SelectItem value="high">High - Need ASAP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Request Summary */}
                <div className="bg-gradient-to-br from-[#F02801]/5 to-[#D22301]/5 border-2 border-[#F02801]/20 rounded-2xl p-6">
                  <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-4" style={{ fontSize: '18px' }}>
                    Request Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Car className="h-5 w-5 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-['Roboto'] text-sm text-[#475569]">Vehicle</p>
                        <p className="font-['Roboto'] font-medium text-[#0F172A]">
                          {vehicleDetails.year} {vehicleDetails.make} {vehicleDetails.model}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Wrench className="h-5 w-5 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-['Roboto'] text-sm text-[#475569]">Part</p>
                        <p className="font-['Roboto'] font-medium text-[#0F172A]">
                          {partCategories.find((c) => c.id === selectedCategory)?.label || "Not selected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-['Roboto'] text-sm text-[#475569]">Search radius</p>
                        <p className="font-['Roboto'] font-medium text-[#0F172A]">
                          {radius[0]} miles
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button 
                    variant="outline" 
                    onClick={handleBack} 
                    className="flex-1 h-12 border-2 border-[#E2E8F0] hover:bg-[#F1F5F9] font-['Roboto']"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 h-12 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']"
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
