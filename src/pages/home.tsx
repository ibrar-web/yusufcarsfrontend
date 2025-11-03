import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { NumberPlateInput } from "../components/number-plate-input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { CurvedDivider } from "../components/curved-divider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { RoleSelectionDialog } from "../components/role-selection-dialog";
import {
  Search,
  FileText,
  MessageSquare,
  CheckCircle,
  Shield,
  Clock,
  Award,
  Star,
  MapPin,
  ArrowRight,
  Wrench,
  Settings,
  Zap,
  Package,
  Truck,
  BadgeCheck,
  ChevronDown,
  ShoppingCart,
  X,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner@2.0.3";

interface HomePageProps {
  onNavigate: (page: string, id?: string, vehicleInfo?: any, partData?: any, category?: string, quoteData?: any) => void;
  onSignupClick?: () => void;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onTrackOrderClick?: () => void;
  quoteNotifications?: {
    productName: string;
    productImage: string;
    quotes: Array<{
      id: string;
      supplierName: string;
      price: number;
      eta: string;
    }>;
  } | null;
  onDismissNotifications?: () => void;
}

export function HomePage({ onNavigate, onSignupClick, isAuthenticated, onSignOut, onProfileClick, onNotificationClick, onTrackOrderClick, quoteNotifications, onDismissNotifications }: HomePageProps) {
  const [numberPlate, setNumberPlate] = useState("");
  const [scrollY, setScrollY] = useState(0);
  
  // Dual input system state
  const [inputMode, setInputMode] = useState<"registration" | "manual">("registration");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [postcode, setPostcode] = useState("");
  
  // Filter options dialog state
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [localRequest, setLocalRequest] = useState(false);
  
  // Product detail dialog state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  
  // Vehicle lookup dialog state
  const [vehicleLookupOpen, setVehicleLookupOpen] = useState(false);
  const [lookupMode, setLookupMode] = useState<"registration" | "manual">("registration");
  const [lookupRegistration, setLookupRegistration] = useState("");
  const [lookupPostcode, setLookupPostcode] = useState("");
  const [lookupMake, setLookupMake] = useState("");
  const [lookupModel, setLookupModel] = useState("");
  const [lookupYear, setLookupYear] = useState("");
  const [lookupFuelType, setLookupFuelType] = useState("");
  const [lookupEngineSize, setLookupEngineSize] = useState("");
  
  // Role selection dialog state
  const [roleSelectionOpen, setRoleSelectionOpen] = useState(false);

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

  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];

  const engineSizes = [
    "1.0L",
    "1.2L",
    "1.4L",
    "1.6L",
    "1.8L",
    "2.0L",
    "2.2L",
    "2.5L",
    "3.0L",
    "3.5L",
    "4.0L",
    "5.0L+",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { name: "Engine", icon: Settings, count: "2,450+" },
    { name: "Brakes", icon: Zap, count: "1,890+" },
    { name: "Suspension", icon: Wrench, count: "1,230+" },
    { name: "Electrical", icon: Package, count: "3,120+" },
    { name: "Bodywork", icon: Truck, count: "980+" },
    { name: "Interior", icon: BadgeCheck, count: "1,560+" },
  ];

  const featuredParts = [
    {
      id: "1",
      name: "Front Brake Disc & Pad Set",
      category: "Brakes",
      price: 85.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1758563920433-027318cc48a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBicmFrZSUyMHN5c3RlbXxlbnwxfHx8fDE3NTkyMTg4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviews: 124,
      inStock: true,
    },
    {
      id: "2",
      name: "Engine Oil Filter Kit",
      category: "Engine",
      price: 24.99,
      originalPrice: 34.99,
      image: "https://images.unsplash.com/photo-1734530901192-4b7217b00724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMGVuZ2luZXxlbnwxfHx8fDE3NTkxNDkwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviews: 256,
      inStock: true,
    },
    {
      id: "3",
      name: "Shock Absorber Set",
      category: "Suspension",
      price: 149.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1669136048337-5daa3adef7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdXNwZW5zaW9ufGVufDF8fHx8MTc1OTIxODgwNXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.7,
      reviews: 89,
      inStock: true,
    },
    {
      id: "4",
      name: "Headlight Assembly",
      category: "Electrical",
      price: 89.99,
      originalPrice: 119.99,
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHN8ZW58MXx8fHwxNzU5MTY0MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.6,
      reviews: 67,
      inStock: true,
    },
  ];

  const steps = [
    {
      icon: Search,
      title: "Enter Your Registration",
      description: "Simply enter your vehicle's number plate and we'll identify your car automatically.",
    },
    {
      icon: FileText,
      title: "Request the Part",
      description: "Select the part you need and provide details to help suppliers quote accurately.",
    },
    {
      icon: MessageSquare,
      title: "Compare Quotes",
      description: "Receive quotes from verified local suppliers and compare prices and delivery times.",
    },
    {
      icon: CheckCircle,
      title: "Choose & Purchase",
      description: "Select your preferred quote, chat with the supplier, and arrange delivery.",
    },
  ];

  const featuredSuppliers = [
    {
      id: "1",
      name: "AutoParts Direct",
      rating: 4.8,
      reviews: 256,
      location: "Birmingham",
      responseTime: "2 hours",
      image: "https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3b3Jrc2hvcCUyMG1lY2hhbmljfGVufDF8fHx8MTc1OTIxODgwNnww&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
    {
      id: "2",
      name: "Midlands Motor Parts",
      rating: 4.9,
      reviews: 412,
      location: "Manchester",
      responseTime: "1 hour",
      image: "https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3b3Jrc2hvcCUyMG1lY2hhbmljfGVufDF8fHx8MTc1OTIxODgwNnww&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
    {
      id: "3",
      name: "Quick Fix Parts",
      rating: 4.7,
      reviews: 189,
      location: "London",
      responseTime: "3 hours",
      image: "https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3b3Jrc2hvcCUyMG1lY2hhbmljfGVufDF8fHx8MTc1OTIxODgwNnww&ixlib=rb-4.1.0&q=80&w=1080",
      verified: true,
    },
  ];

  const handleLookup = () => {
    if (inputMode === "registration" && registrationNumber.length >= 6) {
      setFilterDialogOpen(true);
    } else if (inputMode === "manual" && vehicleMake && vehicleModel && vehicleYear && fuelType && engineSize) {
      setFilterDialogOpen(true);
    }
  };
  
  const handleRoleSelection = (role: "user" | "supplier" | "admin") => {
    // Navigate to auth page or appropriate signup page based on role
    if (role === "user") {
      onNavigate("auth");
    } else if (role === "supplier") {
      onNavigate("supplier-onboarding");
    } else if (role === "admin") {
      onNavigate("auth");
    }
  };

  const handleConfirmFilter = () => {
    setFilterDialogOpen(false);
    
    if (inputMode === "registration" && registrationNumber.length >= 6) {
      onNavigate("request-flow", undefined, { 
        registrationNumber,
        postcode,
        localRequest
      });
    } else if (inputMode === "manual" && vehicleMake && vehicleModel && vehicleYear && fuelType && engineSize) {
      onNavigate("request-flow", undefined, { 
        make: vehicleMake, 
        model: vehicleModel, 
        year: vehicleYear,
        fuelType: fuelType,
        engineSize: engineSize,
        postcode,
        localRequest
      });
    }
  };

  // Validation for button state
  const isSearchDisabled = inputMode === "registration" 
    ? registrationNumber.length < 6 
    : !vehicleMake || !vehicleModel || !vehicleYear || !fuelType || !engineSize;

  const handleViewDetail = (product: any) => {
    setSelectedProduct(product);
    setProductDetailOpen(true);
  };

  const isLookupDisabled = lookupMode === "registration" 
    ? lookupRegistration.length < 6 
    : !lookupMake || !lookupModel || !lookupYear;

  const handleVehicleLookupSubmit = () => {
    const vehicleInfo = lookupMode === "registration" 
      ? { registration: lookupRegistration, postcode: lookupPostcode }
      : { 
          make: lookupMake, 
          model: lookupModel, 
          year: lookupYear,
          fuelType: lookupFuelType,
          engineSize: lookupEngineSize,
          postcode: lookupPostcode
        };
    
    setVehicleLookupOpen(false);
    onNavigate("products", undefined, vehicleInfo, undefined, "engine");
    
    // Show success message
    if (lookupMode === "registration") {
      toast.success("Vehicle identified! Showing all parts.");
    } else {
      toast.success(`${lookupMake} ${lookupModel} ${lookupYear} confirmed! Showing all parts.`);
    }
    
    // Reset form
    setLookupRegistration("");
    setLookupPostcode("");
    setLookupMake("");
    setLookupModel("");
    setLookupYear("");
    setLookupFuelType("");
    setLookupEngineSize("");
  };

  const handleAddToBasket = () => {
    if (selectedProduct) {
      toast.success(`Added ${selectedProduct.name} to your basket`);
      setProductDetailOpen(false);
      onNavigate("vehicle-confirmation");
    }
  };

  const handleFindSuppliers = (product: any) => {
    onNavigate("suppliers-list", undefined, undefined, {
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="min-h-screen">
      <Header 
        onNavigate={onNavigate} 
        currentPage="home" 
        onSignupClick={onSignupClick}
        isAuthenticated={isAuthenticated}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
        onNotificationClick={onNotificationClick}
        onTrackOrderClick={onTrackOrderClick}
      />

      {/* Quote Notifications Banner */}
      {quoteNotifications && (
        <div className="fixed top-20 right-6 left-6 lg:left-auto lg:w-[480px] z-50 animate-scale-in">
          <div className="bg-white border-2 border-[#22C55E] rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-white" />
                <h3 className="font-['Inter'] font-semibold text-white" style={{ fontSize: "16px" }}>
                  Request Sent Successfully!
                </h3>
              </div>
              <button
                onClick={onDismissNotifications}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#E5E7EB]">
                <div className="h-12 w-12 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <ImageWithFallback
                    src={quoteNotifications.productImage}
                    alt={quoteNotifications.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "14px" }}>
                    {quoteNotifications.productName}
                  </p>
                  <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "12px" }}>
                    {quoteNotifications.quotes.length} suppliers are preparing quotes
                  </p>
                </div>
              </div>

              {/* Quote List */}
              <div className="space-y-2 mb-3">
                <p className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "13px" }}>
                  Quotes Received:
                </p>
                {quoteNotifications.quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB] hover:border-[#F02801] transition-colors cursor-pointer"
                    onClick={() => {
                      onDismissNotifications?.();
                      onNavigate("quotes");
                    }}
                  >
                    <div className="flex-1">
                      <p className="font-['Roboto'] font-medium text-[#0F172A]" style={{ fontSize: "13px" }}>
                        {quote.supplierName}
                      </p>
                      <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "11px" }}>
                        Delivery: {quote.eta}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-['Inter'] font-bold text-[#F02801]" style={{ fontSize: "16px" }}>
                        £{quote.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Button
                onClick={() => {
                  onDismissNotifications?.();
                  onNavigate("quotes");
                }}
                className="w-full h-10 rounded-lg bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
                style={{ fontSize: "14px" }}
              >
                View All Quotes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Automotive showcase with background image */}
      <section className="relative overflow-hidden min-h-[450px] lg:min-h-[500px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1753899762863-af6e21e86438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwc3BvcnRzJTIwY2FyfGVufDF8fHx8MTc1OTIyNjI4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Blue sports car"
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            
            {/* Left Side - Search Form */}
            <div className="fade-in-up order-2 lg:order-1">
              {/* Frosted Glass Card */}
              <div className="relative max-w-lg mx-auto lg:mx-0 w-full">
                {/* Overlapping Pill Tabs */}
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
                    onClick={() => setInputMode("manual")}
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

                {/* Frosted Glass Container */}
                <div 
                  className="relative backdrop-blur-xl rounded-[24px] p-8 lg:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.16)] border border-white/40"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.85)"
                  }}
                >
                  {/* Form Header - Dynamic based on tab */}
                  <div className="mb-10">
                    <h2 className="font-['Inter'] font-bold text-[#0F172A] leading-tight" style={{ fontSize: "26px" }}>
                      {inputMode === "registration" 
                        ? "Add Your Registration Number" 
                        : "Select Your Vehicle"}
                    </h2>
                  </div>

                  {/* Registration Tab Content */}
                  {inputMode === "registration" && (
                    <div className="space-y-6">
                      {/* Registration Number Input */}
                      <div>
                        <label className="block mb-3 font-['Roboto'] text-[#475569] text-sm">
                          Vehicle Registration Number
                        </label>
                        <Input
                          type="text"
                          value={registrationNumber}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                            setRegistrationNumber(value);
                          }}
                          placeholder="E.G. AB12 CDE"
                          maxLength={8}
                          className="h-14 text-[18px] text-center rounded-2xl border-2 border-[#CBD5E1] bg-white hover:border-[#94A3B8] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] font-semibold tracking-wider text-[#0F172A] uppercase placeholder:text-[#94A3B8]"
                          style={{ letterSpacing: '0.2em' }}
                        />
                      </div>

                      {/* Postcode Input */}
                      <div>
                        <label className="block mb-3 font-['Roboto'] text-[#475569] text-sm">
                          Your Postcode
                        </label>
                        <Input
                          type="text"
                          value={postcode}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
                            setPostcode(value);
                          }}
                          placeholder="E.G. SW1A 1AA"
                          maxLength={8}
                          className="h-14 text-[16px] text-center rounded-2xl border-2 border-[#CBD5E1] bg-white hover:border-[#94A3B8] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A] uppercase placeholder:text-[#94A3B8]"
                        />
                      </div>

                      {/* CTA Button */}
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

                  {/* Manual Tab Content */}
                  {inputMode === "manual" && (
                    <div className="space-y-6">
                      {/* Make */}
                      <div>
                        <Select value={vehicleMake} onValueChange={(value) => {
                          setVehicleMake(value);
                          setVehicleModel("");
                        }}>
                          <SelectTrigger className="h-20 text-[18px] rounded-2xl border-2 border-[#FECACA] bg-white hover:border-[#FCA5A5] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A]">
                            <SelectValue placeholder="Select Maker" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto']">
                            {carMakes.map((make) => (
                              <SelectItem key={make} value={make} className="text-[18px]">
                                {make}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Model */}
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
                            {vehicleMake && carModels[vehicleMake]?.map((model) => (
                              <SelectItem key={model} value={model} className="text-[18px]">
                                {model}
                              </SelectItem>
                            ))}
                            {vehicleMake && !carModels[vehicleMake] && (
                              <SelectItem value="other" className="text-[18px]">Other Models</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Year */}
                      <div>
                        <Select value={vehicleYear} onValueChange={setVehicleYear}>
                          <SelectTrigger className="h-20 text-[18px] rounded-2xl border-2 border-[#FECACA] bg-white hover:border-[#FCA5A5] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A]">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto'] max-h-[300px]">
                            {carYears.map((year) => (
                              <SelectItem key={year} value={year} className="text-[18px]">
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Fuel Type */}
                      <div>
                        <Select value={fuelType} onValueChange={setFuelType}>
                          <SelectTrigger className="h-20 text-[18px] rounded-2xl border-2 border-[#FECACA] bg-white hover:border-[#FCA5A5] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A]">
                            <SelectValue placeholder="Select Fuel Type" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto']">
                            {fuelTypes.map((fuel) => (
                              <SelectItem key={fuel} value={fuel} className="text-[18px]">
                                {fuel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Engine Size */}
                      <div>
                        <Select value={engineSize} onValueChange={setEngineSize}>
                          <SelectTrigger className="h-20 text-[18px] rounded-2xl border-2 border-[#FECACA] bg-white hover:border-[#FCA5A5] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A]">
                            <SelectValue placeholder="Select Engine Size" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto']">
                            {engineSizes.map((size) => (
                              <SelectItem key={size} value={size} className="text-[18px]">
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* CTA Button */}
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

            {/* Filter Options Dialog */}
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
                  {/* Local Request Toggle */}
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

            {/* Right Side - Promotional Content */}
            <div className="relative fade-in-up order-1 lg:order-2 bg-white/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none rounded-2xl lg:rounded-none p-8 lg:p-0" style={{ animationDelay: "0.2s" }}>
              <div className="text-left lg:text-left flex flex-col justify-center h-full py-12 lg:py-16">
                <h1 className="font-['Inter'] text-[42px] sm:text-[56px] lg:text-[72px] font-black text-white leading-[1.1] tracking-tight italic mb-4 lg:mb-6">
                  Fix It Fast.<br />Drive Happy.
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

      {/* Lowest Prices Of The Season */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="mb-12">
            <h2 className="font-['Inter'] text-[32px] lg:text-[42px] font-bold text-[#0F172A] mb-3">
              Category
            </h2>
            <p className="font-['Roboto'] text-[#64748B] max-w-2xl" style={{ fontSize: "18px", lineHeight: 1.5 }}>
              Browse our comprehensive range of quality car parts across all major categories. Find exactly what you need for your vehicle.
            </p>
          </div>

          {/* Horizontal Scrollable Cards */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {/* Engine */}
            <div 
              onClick={() => onNavigate("products", undefined, undefined, undefined, "engine")}
              className="relative flex-shrink-0 w-[280px] lg:w-[380px] h-[240px] rounded-2xl overflow-hidden cursor-pointer group snap-start"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NTkyMTg0NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Engine parts"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-['Inter'] text-[22px] font-bold text-white mb-3">
                  Engine
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setVehicleLookupOpen(true);
                  }}
                  className="flex items-center gap-2 bg-[#F02801] text-white px-5 py-2.5 rounded-full font-['Roboto'] font-medium text-[14px] hover:bg-[#D22301] transition-colors"
                >
                  <span>View Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Brakes */}
            <div 
              onClick={() => onNavigate("products", undefined, undefined, undefined, "brakes")}
              className="relative flex-shrink-0 w-[280px] lg:w-[380px] h-[240px] rounded-2xl overflow-hidden cursor-pointer group snap-start"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758563920433-027318cc48a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBicmFrZSUyMHN5c3RlbXxlbnwxfHx8fDE3NTkyMTg4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Brake system"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-['Inter'] text-[22px] font-bold text-white mb-3">
                  Brakes
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setVehicleLookupOpen(true);
                  }}
                  className="flex items-center gap-2 bg-[#F02801] text-white px-5 py-2.5 rounded-full font-['Roboto'] font-medium text-[14px] hover:bg-[#D22301] transition-colors"
                >
                  <span>View Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Suspension */}
            <div 
              onClick={() => onNavigate("products", undefined, undefined, undefined, "suspension")}
              className="relative flex-shrink-0 w-[280px] lg:w-[380px] h-[240px] rounded-2xl overflow-hidden cursor-pointer group snap-start"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1669136048337-5daa3adef7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdXNwZW5zaW9ufGVufDF8fHx8MTc1OTIxODgwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Suspension system"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-['Inter'] text-[22px] font-bold text-white mb-3">
                  Suspension
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("products", undefined, undefined, undefined, "suspension");
                  }}
                  className="flex items-center gap-2 bg-[#F02801] text-white px-5 py-2.5 rounded-full font-['Roboto'] font-medium text-[14px] hover:bg-[#D22301] transition-colors"
                >
                  <span>View Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Electrical */}
            <div 
              onClick={() => onNavigate("products", undefined, undefined, undefined, "electrical")}
              className="relative flex-shrink-0 w-[280px] lg:w-[380px] h-[240px] rounded-2xl overflow-hidden cursor-pointer group snap-start"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1564912139097-6e35a037c77f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbGVjdHJpY2FsJTIwc3lzdGVtfGVufDF8fHx8MTc1OTE5MDg1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Electrical system"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-['Inter'] text-[22px] font-bold text-white mb-3">
                  Electrical
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("products", undefined, undefined, undefined, "electrical");
                  }}
                  className="flex items-center gap-2 bg-[#F02801] text-white px-5 py-2.5 rounded-full font-['Roboto'] font-medium text-[14px] hover:bg-[#D22301] transition-colors"
                >
                  <span>View Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bodywork */}
            <div 
              onClick={() => onNavigate("products", undefined, undefined, undefined, "all")}
              className="relative flex-shrink-0 w-[280px] lg:w-[380px] h-[240px] rounded-2xl overflow-hidden cursor-pointer group snap-start"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1651932219275-2e726fd2204c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBib2R5d29yayUyMHBhaW50fGVufDF8fHx8MTc1OTIyNzcyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Bodywork"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-['Inter'] text-[22px] font-bold text-white mb-3">
                  Bodywork
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("products", undefined, undefined, undefined, "all");
                  }}
                  className="flex items-center gap-2 bg-[#F02801] text-white px-5 py-2.5 rounded-full font-['Roboto'] font-medium text-[14px] hover:bg-[#D22301] transition-colors"
                >
                  <span>View Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Interior */}
            <div 
              onClick={() => onNavigate("products", undefined, undefined, undefined, "all")}
              className="relative flex-shrink-0 w-[280px] lg:w-[380px] h-[240px] rounded-2xl overflow-hidden cursor-pointer group snap-start"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1648799833118-c989da6907d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTkxNDk1ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Interior"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-['Inter'] text-[22px] font-bold text-white mb-3">
                  Interior
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("products", undefined, undefined, undefined, "all");
                  }}
                  className="flex items-center gap-2 bg-[#F02801] text-white px-5 py-2.5 rounded-full font-['Roboto'] font-medium text-[14px] hover:bg-[#D22301] transition-colors"
                >
                  <span>View Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Featured Listings - Dark Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="secondary" className="mb-4 bg-primary/20 text-white border-primary/30">
                Featured Listings
              </Badge>
              <h2 className="font-['Inter'] text-4xl lg:text-5xl font-bold mb-3">
                Popular Car Parts
              </h2>
              <p className="font-['Roboto'] text-lg text-gray-300">
                Top-rated parts from verified suppliers
              </p>
            </div>
            <Button 
              className="hidden md:flex bg-[#F02801] text-white hover:bg-[#D22301] rounded-full"
              onClick={() => onNavigate("products")}
            >
              All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredParts.map((part, index) => (
              <Card 
                key={part.id} 
                className="group bg-[#111827] border-gray-700 hover:border-primary overflow-hidden card-hover cursor-pointer fade-in-up"
                onClick={() => onNavigate("request-flow")}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square overflow-hidden relative image-zoom-container shine-effect">
                  <ImageWithFallback
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover image-zoom"
                  />
                  {part.inStock && (
                    <Badge className="absolute top-3 right-3 bg-success text-white border-0">
                      In Stock
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 flex flex-col">
                  <Badge variant="secondary" className="mb-2 bg-primary/20 text-white border-primary/30 font-['Roboto'] text-[14px]">
                    {part.category}
                  </Badge>
                  <h3 className="font-['Inter'] font-semibold text-white mb-2 line-clamp-2 text-[16px]">
                    {part.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-['Roboto'] text-sm text-gray-300">{part.rating}</span>
                    </div>
                    <span className="font-['Roboto'] text-sm text-gray-500">({part.reviews} reviews)</span>
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-[#F02801] text-white hover:bg-[#D22301] font-['Roboto'] rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVehicleLookupOpen(true);
                    }}
                  >
                    Find Suppliers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => onNavigate("request-flow")}
            >
              View All Parts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Side - Heading & Image */}
            <div className="relative fade-in-up order-2 lg:order-1">
              <div className="mb-8">
                <h2 className="font-['Inter'] text-4xl lg:text-5xl text-[#0F172A] mb-4">
                  How It Works
                </h2>
                <p className="font-['Roboto'] text-lg text-[#475569]">
                  Get the best deal on car parts in four simple steps
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1618783129985-dd97dbe4ad99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtZWNoYW5pYyUyMHdvcmtzaG9wfGVufDF8fHx8MTc1OTIyMjUyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="How it works - Car parts quote process"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </div>

            {/* Right Side - Service Cards Grid */}
            <div className="space-y-6 fade-in-up order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Auto Repairing - Featured (Red Background) */}
                <div className="bg-[#F02801] rounded-xl px-6 py-10 group hover:shadow-primary-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="font-['Inter'] text-white mb-3">
                    Enter your registration
                  </h3>
                  <p className="font-['Roboto'] text-sm text-white/90 leading-relaxed">
                    Simply enter your vehicle registration number and we'll automatically identify your car make, model, and year.
                  </p>
                </div>

                {/* Transmission Checkup */}
                <div className="bg-white border-2 border-[#E2E8F0] rounded-xl px-6 py-10 group hover:border-[#F02801] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-[#FEF2F2] rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#F02801]" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="font-['Inter'] text-[#0F172A] mb-3">
                    Request the part
                  </h3>
                  <p className="font-['Roboto'] text-sm text-[#475569] leading-relaxed">
                    Describe the part you need with photos and details. Our verified suppliers will respond with competitive quotes.
                  </p>
                </div>

                {/* Vehicle Inspection */}
                <div className="bg-white border-2 border-[#E2E8F0] rounded-xl px-6 py-10 group hover:border-[#F02801] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-[#FEF2F2] rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-[#F02801]" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="font-['Inter'] text-[#0F172A] mb-3">
                    Compare quotes
                  </h3>
                  <p className="font-['Roboto'] text-sm text-[#475569] leading-relaxed">
                    Review quotes from multiple suppliers side-by-side. Compare prices, delivery times, and ratings to find the best deal.
                  </p>
                </div>

                {/* Auto Car Dealer */}
                <div className="bg-white border-2 border-[#E2E8F0] rounded-xl px-6 py-10 group hover:border-[#F02801] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-[#FEF2F2] rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-[#F02801]" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="font-['Inter'] text-[#0F172A] mb-3">
                    Choose & purchase
                  </h3>
                  <p className="font-['Roboto'] text-sm text-[#475569] leading-relaxed">
                    Select your preferred supplier and complete your purchase securely. Arrange delivery or collection at your convenience.
                  </p>
                </div>
              </div>

              {/* Read More Button */}

            </div>
          </div>
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="py-32 bg-[#1A1A1A] relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1718824331840-399943ff5c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBnYXJhZ2UlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NTkzMTgyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Car garage workshop"
            className="w-full h-full object-cover opacity-10"
            style={{ filter: 'blur(2px)' }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/90 via-[#1A1A1A]/85 to-[#1A1A1A]/90"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Side - Trust Indicators */}
            <div className="fade-in-up">
              <h2 className="font-['Inter'] text-5xl lg:text-6xl text-white mb-6">
                Featured Suppliers
              </h2>
              <p className="font-['Roboto'] text-xl text-gray-400 mb-12">
                Connect with verified local suppliers ready to provide competitive quotes
              </p>

              {/* Customer Avatars & Rating Display in One Row */}
              <div className="flex items-center gap-10">
                {/* Customer Avatars */}
                <div className="flex -space-x-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#1A1A1A] overflow-hidden bg-gray-700">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1425421669292-0c3da3b8f529?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbnxlbnwxfHx8fDE3NTkxODE4NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-16 h-16 rounded-full border-2 border-[#1A1A1A] overflow-hidden bg-gray-700">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbnxlbnwxfHx8fDE3NTkxNzIzMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-16 h-16 rounded-full border-2 border-[#1A1A1A] overflow-hidden bg-gray-700">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTkyMjk1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-16 h-16 rounded-full border-2 border-[#1A1A1A] overflow-hidden bg-gray-700">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTIzMDYyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-16 h-16 rounded-full border-2 border-[#1A1A1A] bg-[#F02801] flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">+</span>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="h-16 w-px bg-gray-700"></div>

                {/* Rating Display */}
                <div className="flex items-center gap-10">
                  <div>
                    <p className="font-['Roboto'] text-base text-gray-400 mb-3">Average Rating</p>
                    <div className="flex items-center gap-4">
                      <span className="font-['Inter'] text-4xl text-white">4.6</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-6 w-6 fill-[#F59E0B] text-[#F59E0B]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-16 w-px bg-gray-700"></div>
                  <div>
                    <p className="font-['Roboto'] text-xl text-[#F02801] font-semibold">50K+</p>
                    <p className="font-['Roboto'] text-base text-gray-400">new review</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Partner Logos Grid */}
            <div className="grid grid-cols-3 gap-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-[#2A2A2A] border-2 border-gray-800 rounded-lg p-8 flex items-center justify-center h-32 hover:bg-[#F02801] hover:border-[#F02801] hover:shadow-lg hover:shadow-[#F02801]/50 transition-all duration-300 cursor-pointer group">
                <span className="font-['Roboto'] text-white text-center font-medium transition-colors duration-300" style={{ fontSize: '20px' }}>Halfords</span>
              </div>
              <div className="bg-[#2A2A2A] border border-gray-800 rounded-lg p-8 flex items-center justify-center h-32 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                <span className="font-['Roboto'] text-white text-center font-medium" style={{ fontSize: '20px' }}>Euro Car Parts</span>
              </div>
              <div className="bg-[#2A2A2A] border border-gray-800 rounded-lg p-8 flex items-center justify-center h-32 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                <span className="font-['Roboto'] text-white text-center font-medium" style={{ fontSize: '20px' }}>GSF Car Parts</span>
              </div>
              <div className="bg-[#2A2A2A] border border-gray-800 rounded-lg p-8 flex items-center justify-center h-32 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                <span className="font-['Roboto'] text-white text-center font-medium" style={{ fontSize: '20px' }}>Andrew Page</span>
              </div>
              <div className="bg-[#2A2A2A] border border-gray-800 rounded-lg p-8 flex items-center justify-center h-32 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                <span className="font-['Roboto'] text-white text-center font-medium" style={{ fontSize: '20px' }}>LKQ Euro Parts</span>
              </div>
              <div className="bg-[#2A2A2A] border border-gray-800 rounded-lg p-8 flex items-center justify-center h-32 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                <span className="font-['Roboto'] text-white text-center font-medium" style={{ fontSize: '20px' }}>Autoparts UK</span>
              </div>
              <div className="bg-[#2A2A2A] border border-gray-800 rounded-lg p-8 flex items-center justify-center h-32 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                <span className="font-['Roboto'] text-white text-center font-medium" style={{ fontSize: '20px' }}>Motorparts Direct</span>
              </div>
              <div className="bg-[#2A2A2A] border border-gray-800 rounded-lg p-8 flex items-center justify-center h-32 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                <span className="font-['Roboto'] text-white text-center font-medium" style={{ fontSize: '20px' }}>Parts Alliance</span>
              </div>
              <div className="bg-[#2A2A2A] border border-gray-800 rounded-lg p-8 flex items-center justify-center h-32 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                <span className="font-['Roboto'] text-white text-center font-medium" style={{ fontSize: '20px' }}>PartsGateway</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-left mb-16">
            <h2 className="font-['Inter'] text-[#0F172A] mb-4" style={{ fontSize: '40px', fontWeight: '700' }}>
              Popular Brands
            </h2>
            <p className="font-['Roboto'] text-[#64748B] max-w-3xl" style={{ fontSize: '16px', lineHeight: 1.6 }}>
              Get quotes for parts from the most trusted automotive brands in the UK
            </p>
          </div>

          {/* Brands Single Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center justify-center h-48 hover:shadow-md transition-all duration-300 gap-5 animate-in fade-in slide-in-from-left-8" style={{ animationDelay: '0ms', animationDuration: '600ms', animationFillMode: 'both' }}>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1644166186783-35d911470ff0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBdWRpJTIwbG9nbyUyMGJyYW5kfGVufDF8fHx8MTc2MDk2MjY2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Audi Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="font-['Roboto'] text-[#94A3B8] text-center" style={{ fontSize: '16px', fontWeight: '400' }}>Audi</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center justify-center h-48 hover:shadow-md transition-all duration-300 gap-5 animate-in fade-in slide-in-from-left-8" style={{ animationDelay: '100ms', animationDuration: '600ms', animationFillMode: 'both' }}>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1645400975800-d3c387cb7fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCcmVtYm8lMjBsb2dvJTIwYnJhbmR8ZW58MXx8fHwxNzYwOTYxOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Brembo Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="font-['Roboto'] text-[#94A3B8] text-center" style={{ fontSize: '16px', fontWeight: '400' }}>Brembo</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center justify-center h-48 hover:shadow-md transition-all duration-300 gap-5 animate-in fade-in slide-in-from-left-8" style={{ animationDelay: '200ms', animationDuration: '600ms', animationFillMode: 'both' }}>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1739055547874-4fe440a2bfea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYXN0cm9sJTIwb2lsJTIwbG9nb3xlbnwxfHx8fDE3NTk3NDc4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Castrol Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="font-['Roboto'] text-[#94A3B8] text-center" style={{ fontSize: '16px', fontWeight: '400' }}>Castrol</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center justify-center h-48 hover:shadow-md transition-all duration-300 gap-5 animate-in fade-in slide-in-from-left-8" style={{ animationDelay: '300ms', animationDuration: '600ms', animationFillMode: 'both' }}>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1701336843410-31897aea08a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNaWNoZWxpbiUyMHRpcmUlMjBsb2dvfGVufDF8fHx8MTc1OTc0Nzg1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Michelin Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="font-['Roboto'] text-[#94A3B8] text-center" style={{ fontSize: '16px', fontWeight: '400' }}>Michelin</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center justify-center h-48 hover:shadow-md transition-all duration-300 gap-5 animate-in fade-in slide-in-from-left-8" style={{ animationDelay: '400ms', animationDuration: '600ms', animationFillMode: 'both' }}>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1755079602701-561aece51f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdW5sb3AlMjB0aXJlJTIwbG9nb3xlbnwxfHx8fDE3NTk3NDc4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Dunlop Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="font-['Roboto'] text-[#94A3B8] text-center" style={{ fontSize: '16px', fontWeight: '400' }}>Dunlop</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center justify-center h-48 hover:shadow-md transition-all duration-300 gap-5 animate-in fade-in slide-in-from-left-8" style={{ animationDelay: '500ms', animationDuration: '600ms', animationFillMode: 'both' }}>
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1635755088057-a0d3898d3618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOR0slMjBzcGFyayUyMHBsdWclMjBsb2dvfGVufDF8fHx8MTc1OTc0Nzg1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="NGK Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="font-['Roboto'] text-[#94A3B8] text-center" style={{ fontSize: '16px', fontWeight: '400' }}>NGK</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {/* Why Choose Us Section */}
      <section className="py-24 bg-[#1A1F2E]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Image with Play Button */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1675034743126-0f250a5fee51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtZWNoYW5pY3MlMjB0ZWFtJTIwd29ya3Nob3B8ZW58MXx8fHwxNzU5MjM5NDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="PartsQuote Team"
                  className="w-full h-[500px] object-cover"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-primary border-b-[12px] border-b-transparent ml-1"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-12 h-[2px] bg-primary"></div>
                <span className="font-['Roboto'] text-primary tracking-wider" style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.1em' }}>
                  ABOUT OUR COMPANY
                </span>
              </div>

              <h2 className="font-['Inter'] text-white mb-12" style={{ fontSize: '40px', fontWeight: '700', lineHeight: 1.2 }}>
                Why Choose PartsQuote?
              </h2>

              {/* Numbered List Items */}
              <div className="space-y-8">
                {/* Item 01 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                      <span className="font-['Inter'] text-primary" style={{ fontSize: '20px', fontWeight: '700' }}>01</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Inter'] text-white mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>
                      Save Time & Money
                    </h3>
                    <p className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                      Compare multiple quotes instantly without calling around suppliers
                    </p>
                  </div>
                </div>

                {/* Item 02 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#2D3548] flex items-center justify-center">
                      <span className="font-['Inter'] text-primary" style={{ fontSize: '20px', fontWeight: '700' }}>02</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Inter'] text-white mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>
                      Verified Suppliers
                    </h3>
                    <p className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                      All suppliers are verified and rated by real customers
                    </p>
                  </div>
                </div>

                {/* Item 03 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#2D3548] flex items-center justify-center">
                      <span className="font-['Inter'] text-primary" style={{ fontSize: '20px', fontWeight: '700' }}>03</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Inter'] text-white mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>
                      Secure Platform
                    </h3>
                    <p className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                      Safe and secure payment options for your peace of mind
                    </p>
                  </div>
                </div>

                {/* Item 04 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#2D3548] flex items-center justify-center">
                      <span className="font-['Inter'] text-primary" style={{ fontSize: '20px', fontWeight: '700' }}>04</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Inter'] text-white mb-2" style={{ fontSize: '20px', fontWeight: '600' }}>
                      UK-Wide Coverage
                    </h3>
                    <p className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                      Access to suppliers across the entire United Kingdom
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Requests Section */}


      {/* Testimonials Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Header */}
          <div className="text-left mb-12">
            <Badge className="mb-4 bg-[#64748B]/10 text-[#64748B] border border-[#64748B]/20 rounded-full px-4 py-1.5">
              Customer Reviews
            </Badge>
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: '44px', lineHeight: '1.2' }}>
              What Our Customers Say
            </h2>
            <p className="font-['Inter'] text-[#64748B] max-w-2xl" style={{ fontSize: '16px' }}>
              Real stories from drivers who compared quotes and saved.
            </p>
          </div>

          {/* Featured Testimonial + KPI Panel */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Featured Testimonial */}
            <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] overflow-hidden">
              <CardContent className="p-5">
                {/* Header Row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F8FAFC] flex-shrink-0">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1724414768978-21ee5420b925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbGV8ZW58MXx8fHwxNzU5MjM5NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="James Mitchell"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: '15px' }}>
                        James Mitchell
                      </h4>
                      <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-0 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span className="font-['Roboto'] text-xs">Verified Purchase</span>
                      </Badge>
                    </div>
                    <p className="font-['Roboto'] text-xs text-[#64748B]">Birmingham</p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                    <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" style={{ clipPath: 'inset(0 20% 0 0)' }} />
                  </div>
                  <span className="font-['Roboto'] font-medium text-[#0F172A]" style={{ fontSize: '13px' }}>4.8/5</span>
                </div>

                {/* Quote */}
                <p className="font-['Roboto'] text-[#0F172A] mb-3" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                  "Found the perfect brake pads at 30% less than dealership prices. The comparison feature saved me hours of research, and I got 8 quotes within an hour!"
                </p>

                {/* Savings Badge */}
                <div className="mb-3">
                  <Badge className="bg-[#EF4444] text-white border-0 rounded-full px-3 py-1 font-['Roboto'] font-semibold" style={{ fontSize: '12px' }}>
                    Saved £230
                  </Badge>
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-1 text-xs text-[#64748B]">
                    <Package className="h-3 w-3" />
                    <span className="font-['Roboto']" style={{ fontSize: '12px' }}>Front Brake Pads • VW Golf 2019</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#64748B]">
                    <Truck className="h-3 w-3" />
                    <span className="font-['Roboto']" style={{ fontSize: '12px' }}>Next-day delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Stats Panel */}
            <Card className="bg-black border border-[#2A2A2A] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
              <CardContent className="p-5 bg-black rounded-2xl">
                <h3 className="font-['Inter'] font-semibold text-white mb-4" style={{ fontSize: '18px' }}>
                  Platform Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* NPS Score */}
                  <div className="text-center p-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                    <div className="font-['Inter'] font-bold text-[#EF4444] mb-0.5" style={{ fontSize: '32px', lineHeight: '1' }}>
                      87
                    </div>
                    <div className="font-['Roboto'] text-xs text-[#A0A0A0]">NPS Score</div>
                  </div>

                  {/* Avg Rating */}
                  <div className="text-center p-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                    <div className="font-['Inter'] font-bold text-[#EF4444] mb-0.5" style={{ fontSize: '32px', lineHeight: '1' }}>
                      4.8
                    </div>
                    <div className="font-['Roboto'] text-xs text-[#A0A0A0]">Avg Rating</div>
                  </div>

                  {/* Response Time */}
                  <div className="text-center p-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Clock className="h-4 w-4 text-[#EF4444]" />
                      <div className="font-['Inter'] font-bold text-[#EF4444]" style={{ fontSize: '20px', lineHeight: '1' }}>
                        9 min
                      </div>
                    </div>
                    <div className="font-['Roboto'] text-xs text-[#A0A0A0]">First Quote</div>
                  </div>

                  {/* Total Quotes */}
                  <div className="text-center p-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                    <div className="font-['Inter'] font-bold text-[#EF4444] mb-0.5" style={{ fontSize: '24px', lineHeight: '1' }}>
                      200k+
                    </div>
                    <div className="font-['Roboto'] text-xs text-[#A0A0A0]">Quotes Compared</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: "Sarah Thompson",
                location: "Manchester",
                date: "Aug 2025",
                rating: 5,
                ratingLabel: "Excellent",
                quote: "The comparison feature saved me so much time! Got quotes from trusted suppliers within minutes. The quality of parts exceeded expectations.",
                part: "Alternator",
                vehicle: "2018 Audi A4",
                image: "https://images.unsplash.com/photo-1629507313712-f21468afdf2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZlbWFsZXxlbnwxfHx8fDE3NTkzMjA2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              },
              {
                name: "David Roberts",
                location: "London",
                date: "Sept 2025",
                rating: 4.5,
                ratingLabel: "Great",
                quote: "Brilliant service! The suppliers were responsive and professional. Saved over £180 on my clutch replacement with same-day collection.",
                part: "Clutch Kit",
                vehicle: "2017 Ford Focus",
                image: "https://images.unsplash.com/photo-1758518727077-ffb66ffccced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU5MjU1MTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              },
              {
                name: "Emma Wilson",
                location: "Leeds",
                date: "Sept 2025",
                rating: 5,
                ratingLabel: "Excellent",
                quote: "Made finding car parts so easy! Clear quotes, verified suppliers, and the parts arrived next day. Will definitely use again for future repairs.",
                part: "Wing Mirror",
                vehicle: "2019 VW Golf",
                image: "https://images.unsplash.com/photo-1629507313712-f21468afdf2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZlbWFsZXxlbnwxfHx8fDE3NTkzMjA2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              },
            ].map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-white border border-[#E5E7EB] rounded-2xl hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-300"
              >
                <CardContent className={`p-5 rounded-2xl ${index === 0 ? 'bg-gradient-to-br from-[#EF4444] to-[#DC2626]' : 'bg-white'}`}>
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ${index === 0 ? 'bg-white/20 border-2 border-white/30' : 'bg-[#F8FAFC]'}`}>
                        <ImageWithFallback
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className={`font-['Inter'] font-semibold ${index === 0 ? 'text-white' : 'text-[#0F172A]'}`} style={{ fontSize: '14px' }}>
                          {testimonial.name}
                        </h4>
                        <p className={`font-['Roboto'] ${index === 0 ? 'text-white/80' : 'text-[#64748B]'}`} style={{ fontSize: '11px' }}>{testimonial.location}</p>
                      </div>
                    </div>
                    <p className={`font-['Roboto'] ${index === 0 ? 'text-white/70' : 'text-[#64748B]'}`} style={{ fontSize: '11px' }}>{testimonial.date}</p>
                  </div>

                  {/* Stars + Label */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        if (star <= Math.floor(testimonial.rating)) {
                          return <Star key={star} className={`h-3.5 w-3.5 ${index === 0 ? 'fill-white text-white' : 'fill-[#F59E0B] text-[#F59E0B]'}`} />;
                        } else if (star === Math.ceil(testimonial.rating) && testimonial.rating % 1 !== 0) {
                          return <Star key={star} className={`h-3.5 w-3.5 ${index === 0 ? 'fill-white text-white' : 'fill-[#F59E0B] text-[#F59E0B]'}`} style={{ clipPath: 'inset(0 50% 0 0)' }} />;
                        } else {
                          return <Star key={star} className={`h-3.5 w-3.5 ${index === 0 ? 'fill-white/30 text-white/30' : 'fill-[#E2E8F0] text-[#E2E8F0]'}`} />;
                        }
                      })}
                    </div>
                    <span className={`font-['Roboto'] font-medium ${index === 0 ? 'text-white' : 'text-[#0F172A]'}`} style={{ fontSize: '12px' }}>{testimonial.ratingLabel}</span>
                  </div>

                  {/* Quote */}
                  <p className={`font-['Roboto'] mb-3 ${index === 0 ? 'text-white' : 'text-[#0F172A]'}`} style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    "{testimonial.quote}"
                  </p>

                  {/* Footer */}
                  <div className={`flex items-center justify-between pt-3 ${index === 0 ? 'border-t border-white/20' : 'border-t border-[#E5E7EB]'}`}>
                    <Badge className={`rounded-full px-2.5 py-0.5 ${index === 0 ? 'bg-white/20 text-white border border-white/30 backdrop-blur-sm' : 'bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]'}`}>
                      <span className="font-['Roboto']" style={{ fontSize: '11px' }}>{testimonial.part} • {testimonial.vehicle}</span>
                    </Badge>
                    <button className={`font-['Roboto'] font-medium transition-colors ${index === 0 ? 'text-white hover:text-white/80 font-semibold underline underline-offset-2' : 'text-[#EF4444] hover:text-[#DC2626]'}`} style={{ fontSize: '11px' }}>
                      Read full story
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trusted By Banner */}
          <div className="text-center py-12 bg-gradient-to-r from-black to-[#1A1A1A] -mx-6 px-6 shadow-xl">
            <p className="font-['Roboto'] font-semibold text-white mb-8" style={{ fontSize: '18px', letterSpacing: '0.5px' }}>TRUSTED REVIEW SOURCES</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {[
                { name: 'Trustpilot', icon: '⭐' },
                { name: 'Google Reviews', icon: '🔍' },
                { name: 'Reviews.io', icon: '✓' }
              ].map((source) => (
                <Badge 
                  key={source.name}
                  className="bg-white/95 hover:bg-white text-[#0F172A] border-0 rounded-full px-8 py-4 transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:scale-110 backdrop-blur-sm"
                >
                  <span className="font-['Roboto'] font-bold flex items-center gap-2" style={{ fontSize: '16px' }}>
                    <span>{source.icon}</span>
                    {source.name}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Section Header */}
          <div className="mb-10">
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: '36px', lineHeight: 1.2 }}>
              Trusted by Thousands
            </h2>
            <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              Join the UK's fastest-growing car parts marketplace
            </p>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* KPI Card 1: Happy Customers - Red/Orange */}
            <Card className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] rounded-[14px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition-all duration-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/30 flex items-center justify-center mx-auto mb-4">
                    <Badge className="h-7 w-7 text-[#EF4444]" />
                  </div>
                  <p className="font-['Roboto'] text-sm text-[#94A3B8] mb-3">Happy customers</p>
                  <div className="font-['Inter'] font-bold text-white" style={{ fontSize: '40px', lineHeight: '1' }}>
                    50K+
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Card 2: Verified Suppliers - Green */}
            <Card className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] rounded-[14px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition-all duration-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/30 flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck className="h-7 w-7 text-[#22C55E]" />
                  </div>
                  <p className="font-['Roboto'] text-sm text-[#94A3B8] mb-3">Verified suppliers</p>
                  <div className="font-['Inter'] font-bold text-white" style={{ fontSize: '40px', lineHeight: '1' }}>
                    2,500+
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Card 3: Parts Quoted - Blue */}
            <Card className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] rounded-[14px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition-all duration-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center mx-auto mb-4">
                    <Package className="h-7 w-7 text-[#3B82F6]" />
                  </div>
                  <p className="font-['Roboto'] text-sm text-[#94A3B8] mb-3">Parts quoted</p>
                  <div className="font-['Inter'] font-bold text-white" style={{ fontSize: '40px', lineHeight: '1' }}>
                    100K+
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Card 4: Average Rating - Amber */}
            <Card className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] rounded-[14px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition-all duration-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-7 w-7 fill-[#F59E0B] text-[#F59E0B]" />
                  </div>
                  <p className="font-['Roboto'] text-sm text-[#94A3B8] mb-3">Average rating</p>
                  <div className="font-['Inter'] font-bold text-white flex items-center justify-center gap-2" style={{ fontSize: '40px', lineHeight: '1' }}>
                    4.9
                    <Star className="h-8 w-8 fill-[#F59E0B] text-[#F59E0B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* CTA Section - Supplier */}
      <section className="py-20 bg-[#F8FAFC] relative overflow-hidden">
        {/* Soft red mesh gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F02801]/12 via-[#F02801]/8 to-[#D22301]/10"></div>
        
        <div className="relative max-w-[1200px] mx-auto px-6">
          {/* 2-Column Layout: 56% / 44% */}
          <div className="grid lg:grid-cols-[56fr,44fr] gap-12 items-start">
            
            {/* LEFT COLUMN - Value + Proof + Steps */}
            <div className="space-y-8">
              {/* Eyebrow */}
              <Badge className="bg-white border border-[#E5E7EB] text-[#0F172A] rounded-full px-4 py-1.5 shadow-sm">
                <span className="font-['Roboto'] font-medium" style={{ fontSize: '14px' }}>For Suppliers</span>
              </Badge>

              {/* H2 + Subcopy */}
              <div>
                <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-4" style={{ fontSize: '52px', lineHeight: 1.1 }}>
                  Are You a Car Parts Supplier?
                </h2>
                <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '18px', lineHeight: 1.6 }}>
                  Join trusted suppliers and receive qualified part requests from nearby drivers.
                </p>
              </div>

              {/* Supplier Benefits - Grid Layout */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* Benefit 1 - Red */}
                <div className="bg-white/80 backdrop-blur-sm border-2 border-[#E5E7EB] rounded-xl p-5 hover:border-[#EF4444] hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="h-6 w-6 text-[#EF4444]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: '16px' }}>
                        Qualified Local Leads
                      </h4>
                      <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                        Targeted requests from nearby drivers actively seeking your parts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefit 2 - Blue */}
                <div className="bg-white/80 backdrop-blur-sm border-2 border-[#E5E7EB] rounded-xl p-5 hover:border-[#3B82F6] hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-[#3B82F6]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: '16px' }}>
                        Pay Per Lead Only
                      </h4>
                      <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                        £3.50 per accepted lead. No subscriptions or upfront costs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefit 3 - Green */}
                <div className="bg-white/80 backdrop-blur-sm border-2 border-[#E5E7EB] rounded-xl p-5 hover:border-[#22C55E] hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-[#22C55E]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: '16px' }}>
                        Secure Messaging
                      </h4>
                      <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                        Chat, quote, and schedule directly with customers in-platform
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefit 4 - Amber */}
                <div className="bg-white/80 backdrop-blur-sm border-2 border-[#E5E7EB] rounded-xl p-5 hover:border-[#F59E0B] hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-[#F59E0B]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: '16px' }}>
                        Verified & Trusted
                      </h4>
                      <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                        Build your reputation with reviews and verified badge
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN - Join Card */}
            <Card className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.3)] sticky top-24">
              <CardContent className="py-5 px-0">
                <div className="px-5">
                  <h3 className="font-['Inter'] font-semibold text-white mb-3" style={{ fontSize: '22px' }}>
                    Become a Supplier
                  </h3>

                  <p className="font-['Roboto'] text-[#94A3B8] mb-5" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                    Join our network of verified suppliers and start receiving qualified part requests from drivers in your area.
                  </p>
                </div>

                {/* Benefits Cards */}
                <div className="grid grid-cols-3 gap-6 mb-6 px-6">
                  <Card className="bg-[#1E293B]/50 border border-[#334155] backdrop-blur-sm">
                    <CardContent className="p-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-['Roboto'] font-medium text-white" style={{ fontSize: '12px' }}>
                          Pay per lead only
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1E293B]/50 border border-[#334155] backdrop-blur-sm">
                    <CardContent className="p-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-['Roboto'] font-medium text-white" style={{ fontSize: '12px' }}>
                          Local customers seeking parts
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#1E293B]/50 border border-[#334155] backdrop-blur-sm">
                    <CardContent className="p-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-['Roboto'] font-medium text-white" style={{ fontSize: '12px' }}>
                          Start in minutes
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="px-5">
                  {/* Primary CTA */}
                  <Button
                    onClick={() => onNavigate("supplier-onboarding")}
                    className="w-auto px-40 h-14 bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold rounded-full shadow-lg shadow-[#EF4444]/30 transition-all mb-2 mx-auto flex items-center justify-center text-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {/* Footnote */}
                  <p className="font-['Roboto'] text-xs text-[#94A3B8] text-center">
                    Free to join. Start receiving requests today.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* Supplier Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Section Header */}
          <div className="mb-12">
            <Badge className="bg-[#F02801]/10 text-[#F02801] border-0 rounded-full px-4 py-1.5 mb-4">
              <span className="font-['Roboto'] font-medium" style={{ fontSize: '14px' }}>Supplier Reviews</span>
            </Badge>
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-4" style={{ fontSize: '40px', lineHeight: 1.2 }}>
              Trusted by UK Suppliers
            </h2>
            <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              Hear what our verified suppliers have to say about growing their business with PartsQuote
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth">
            {/* Testimonial 1 - Sarah Mitchell */}
            <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-lg transition-all flex-shrink-0 w-[380px] snap-start">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '16px' }}>
                    SM
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-['Roboto'] font-semibold text-[#0F172A]" style={{ fontSize: '15px' }}>Sarah Mitchell</h5>
                    </div>
                    <p className="font-['Roboto'] text-xs text-[#64748B]">Manchester</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                </div>
                <p className="font-['Roboto'] text-[#0F172A] mb-3" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  "PartsQuote brings us 3–5 qualified jobs weekly. Game changer for our business."
                </p>
                <div className="text-xs text-[#64748B] font-['Roboto']">
                  AutoParts Direct Ltd
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 - James Turner */}
            <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-lg transition-all flex-shrink-0 w-[380px] snap-start">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '16px' }}>
                    JT
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-['Roboto'] font-semibold text-[#0F172A]" style={{ fontSize: '15px' }}>James Turner</h5>
                    </div>
                    <p className="font-['Roboto'] text-xs text-[#64748B]">Birmingham</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                </div>
                <p className="font-['Roboto'] text-[#0F172A] mb-3" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  "We've increased our monthly revenue by 40% since joining. The platform is incredibly easy to use and the leads are high quality."
                </p>
                <div className="text-xs text-[#64748B] font-['Roboto']">
                  Motor Factor UK
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 - Priya Patel */}
            <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-lg transition-all flex-shrink-0 w-[380px] snap-start">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '16px' }}>
                    PP
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-['Roboto'] font-semibold text-[#0F172A]" style={{ fontSize: '15px' }}>Priya Patel</h5>
                    </div>
                    <p className="font-['Roboto'] text-xs text-[#64748B]">London</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                    <Star className="h-4 w-4 fill-[#E5E7EB] text-[#E5E7EB]" />
                  </div>
                </div>
                <p className="font-['Roboto'] text-[#0F172A] mb-3" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  "The customer messaging system makes communication seamless. Payment processing is quick and reliable. Highly recommend!"
                </p>
                <div className="text-xs text-[#64748B] font-['Roboto']">
                  Quick Fix Parts
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 4 - Michael Chen */}
            <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-lg transition-all flex-shrink-0 w-[380px] snap-start">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '16px' }}>
                    MC
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-['Roboto'] font-semibold text-[#0F172A]" style={{ fontSize: '15px' }}>Michael Chen</h5>
                    </div>
                    <p className="font-['Roboto'] text-xs text-[#64748B]">Leeds</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                </div>
                <p className="font-['Roboto'] text-[#0F172A] mb-3" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  "Best decision we made this year. No more cold calling - customers come to us. The ROI is fantastic!"
                </p>
                <div className="text-xs text-[#64748B] font-['Roboto']">
                  PartsPlus
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 5 - Emma Wilson */}
            <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-lg transition-all flex-shrink-0 w-[380px] snap-start">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '16px' }}>
                    EW
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-['Roboto'] font-semibold text-[#0F172A]" style={{ fontSize: '15px' }}>Emma Wilson</h5>
                    </div>
                    <p className="font-['Roboto'] text-xs text-[#64748B]">Bristol</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                </div>
                <p className="font-['Roboto'] text-[#0F172A] mb-3" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  "Simple onboarding, fair pricing, and consistent quality leads. PartsQuote has transformed how we find new customers."
                </p>
                <div className="text-xs text-[#64748B] font-['Roboto']">
                  Bristol Auto Supplies
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 6 - David Brown */}
            <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-lg transition-all flex-shrink-0 w-[380px] snap-start">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '16px' }}>
                    DB
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-['Roboto'] font-semibold text-[#0F172A]" style={{ fontSize: '15px' }}>David Brown</h5>
                    </div>
                    <p className="font-['Roboto'] text-xs text-[#64748B]">Glasgow</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                    <Star className="h-4 w-4 fill-[#E5E7EB] text-[#E5E7EB]" />
                  </div>
                </div>
                <p className="font-['Roboto'] text-[#0F172A] mb-3" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  "Great support team and the verification process gives customers confidence. We've seen a steady stream of new business."
                </p>
                <div className="text-xs text-[#64748B] font-['Roboto']">
                  Motorparts Direct
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="text-center mt-12">
            <p className="font-['Roboto'] text-[#64748B] mb-4" style={{ fontSize: '16px' }}>
              Join 2,500+ verified suppliers growing their business
            </p>
            <Button
              onClick={() => onNavigate("supplier-onboarding")}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-8 py-3 rounded-xl shadow-lg shadow-[#EF4444]/30 transition-all gap-2"
            >
              Become a Supplier
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
      
      {/* Role Selection Dialog */}
      <RoleSelectionDialog 
        open={roleSelectionOpen}
        onOpenChange={setRoleSelectionOpen}
        onSelectRole={handleRoleSelection}
        onNavigate={onNavigate}
      />

      {/* Product Detail Dialog */}
      <Dialog open={productDetailOpen} onOpenChange={setProductDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]" style={{ fontSize: "28px" }}>
              Product Details
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "15px" }}>
              View complete product information and add to your basket
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="mt-6">
              {/* Product Image */}
              <div className="mb-6">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#F1F5F9] border-2 border-[#E5E7EB]">
                  <ImageWithFallback
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <Badge className="absolute top-4 right-4 bg-[#F02801] text-white font-semibold px-4 py-2">
                      -{Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                  {!selectedProduct.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge className="bg-white text-[#0F172A] font-semibold text-lg px-6 py-3">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                {/* Category Badge */}
                <Badge className="bg-[#F1F5F9] text-[#64748B]" style={{ fontSize: "14px" }}>
                  {selectedProduct.category}
                </Badge>

                {/* Product Name */}
                <h3 className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: "28px", lineHeight: 1.3 }}>
                  {selectedProduct.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(selectedProduct.rating)
                            ? "text-[#F59E0B] fill-current"
                            : "text-[#E5E7EB] fill-current"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "16px" }}>
                    {selectedProduct.rating} out of 5
                  </span>
                  <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "14px" }}>
                    ({selectedProduct.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 pb-4 border-b border-[#E5E7EB]">
                  <span className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: "36px" }}>
                    £{selectedProduct.price.toFixed(2)}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <>
                      <span className="font-['Roboto'] text-[#94A3B8] line-through" style={{ fontSize: "20px" }}>
                        £{selectedProduct.originalPrice.toFixed(2)}
                      </span>
                      <Badge className="bg-[#22C55E] text-white font-semibold">
                        Save £{(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}
                      </Badge>
                    </>
                  )}
                </div>

                {/* Product Description */}
                <div>
                  <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: "18px" }}>
                    Description
                  </h4>
                  <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "15px", lineHeight: 1.6 }}>
                    High-quality {selectedProduct.name.toLowerCase()} compatible with most UK vehicles. 
                    Premium materials and rigorous testing ensure reliable performance and durability. 
                    Backed by manufacturer warranty and excellent customer reviews.
                  </p>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: "18px" }}>
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "OEM quality standards",
                      "12-month warranty included",
                      "Free UK delivery on orders over £50",
                      "Easy installation with included instructions",
                      "Compatible with multiple vehicle models"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-[#22C55E] flex-shrink-0" />
                        <span className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "15px" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stock Status */}
                <div className={`p-4 rounded-xl ${selectedProduct.inStock ? 'bg-[#F0FDF4] border border-[#86EFAC]' : 'bg-[#FEF2F2] border border-[#FECACA]'}`}>
                  <div className="flex items-center gap-2">
                    {selectedProduct.inStock ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                        <span className="font-['Roboto'] font-medium text-[#166534]" style={{ fontSize: "15px" }}>
                          In Stock - Ready to ship
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-[#F02801]" />
                        <span className="font-['Roboto'] font-medium text-[#991B1B]" style={{ fontSize: "15px" }}>
                          Currently Out of Stock
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-[#E5E7EB]">
                <Button
                  variant="outline"
                  onClick={() => setProductDetailOpen(false)}
                  className="flex-1 h-14 rounded-xl border-2 border-[#E5E7EB] hover:border-[#94A3B8] font-['Roboto'] font-medium"
                  style={{ fontSize: "16px" }}
                >
                  Close
                </Button>
                <Button
                  onClick={handleAddToBasket}
                  disabled={!selectedProduct.inStock}
                  className="flex-1 h-14 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontSize: "16px" }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Basket
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Vehicle Lookup Dialog */}
      <Dialog open={vehicleLookupOpen} onOpenChange={setVehicleLookupOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#0F172A] border-[#334155]">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-white" style={{ fontSize: "28px" }}>
              Enter Your Vehicle Details
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: "15px" }}>
              Tell us about your car to see all available parts
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {/* Tab Switcher */}
            <Tabs value={lookupMode} onValueChange={(value) => setLookupMode(value as "registration" | "manual")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 mb-8 bg-[#1E293B] border border-[#334155]">
                <TabsTrigger value="registration" className="font-['Roboto'] font-medium data-[state=active]:bg-[#F02801] data-[state=active]:text-white text-[#94A3B8]" style={{ fontSize: "15px" }}>
                  Registration Number
                </TabsTrigger>
                <TabsTrigger value="manual" className="font-['Roboto'] font-medium data-[state=active]:bg-[#F02801] data-[state=active]:text-white text-[#94A3B8]" style={{ fontSize: "15px" }}>
                  Manual Entry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registration" className="space-y-6">
                <div>
                  <Input
                    type="text"
                    value={lookupRegistration}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      setLookupRegistration(value);
                    }}
                    placeholder="E.G. AB12 CDE"
                    maxLength={8}
                    className="h-20 text-[20px] text-center rounded-2xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] font-semibold tracking-wider text-white uppercase placeholder:text-[#64748B]"
                    style={{ letterSpacing: '0.2em' }}
                  />
                </div>
                
                <div>
                  <Input
                    type="text"
                    value={lookupPostcode}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
                      setLookupPostcode(value);
                    }}
                    placeholder="Postcode (e.g. SW1A 1AA)"
                    maxLength={8}
                    className="h-20 text-[16px] text-center rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white placeholder:text-[#64748B]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-5">
                <div>
                  <Select value={lookupMake} onValueChange={(value) => {
                    setLookupMake(value);
                    setLookupModel("");
                  }}>
                    <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                      <SelectValue placeholder="Select Make" />
                    </SelectTrigger>
                    <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155]">
                      {carMakes.map((make) => (
                        <SelectItem key={make} value={make} className="text-[16px] text-white focus:bg-[#334155] focus:text-white">
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select 
                    value={lookupModel} 
                    onValueChange={setLookupModel}
                    disabled={!lookupMake}
                  >
                    <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#0F172A]">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155]">
                      {lookupMake && carModels[lookupMake]?.map((model) => (
                        <SelectItem key={model} value={model} className="text-[16px] text-white focus:bg-[#334155] focus:text-white">
                          {model}
                        </SelectItem>
                      ))}
                      {lookupMake && !carModels[lookupMake] && (
                        <SelectItem value="other" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Other Models</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={lookupYear} onValueChange={setLookupYear}>
                    <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155] max-h-[300px]">
                      {carYears.map((year) => (
                        <SelectItem key={year} value={year} className="text-[16px] text-white focus:bg-[#334155] focus:text-white">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={lookupFuelType} onValueChange={setLookupFuelType}>
                    <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                      <SelectValue placeholder="Fuel Type (Optional)" />
                    </SelectTrigger>
                    <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155]">
                      {fuelTypes.map((fuel) => (
                        <SelectItem key={fuel} value={fuel} className="text-[16px] text-white focus:bg-[#334155] focus:text-white">
                          {fuel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={lookupEngineSize} onValueChange={setLookupEngineSize}>
                    <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                      <SelectValue placeholder="Engine Size (Optional)" />
                    </SelectTrigger>
                    <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155] max-h-[300px]">
                      {engineSizes.map((size) => (
                        <SelectItem key={size} value={size} className="text-[16px] text-white focus:bg-[#334155] focus:text-white">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => setVehicleLookupOpen(false)}
                className="flex-1 h-14 rounded-full border-2 border-[#334155] hover:border-[#475569] font-['Roboto'] font-medium bg-[#1E293B] text-white hover:bg-[#334155]"
                style={{ fontSize: "16px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVehicleLookupSubmit}
                disabled={isLookupDisabled}
                className="flex-1 h-14 rounded-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F02801]/30"
                style={{ fontSize: "16px" }}
              >
                View All Parts
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}