import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Settings,
  Disc,
  Wrench,
  Zap,
  Car,
  Armchair,
  Search,
  Check,
  ChevronRight,
  ArrowLeft,
  Flame,
  Wind,
  Gauge,
  Lightbulb,
  Cog,
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

interface PartsSelectionPageProps {
  onNavigate: (page: string) => void;
  onSignupClick?: () => void;
}

interface PartCategory {
  id: string;
  name: string;
  icon: any;
  image: string;
  count?: string;
  subparts: string[];
}

export function PartsSelectionPage({
  onNavigate,
}: PartsSelectionPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubparts, setSelectedSubparts] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories: PartCategory[] = [
    {
      id: "engine",
      name: "Engine",
      icon: Settings,
      image: "https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NTkzMTAxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "124k",
      subparts: ["Alternator", "Starter Motor", "Coil Pack", "Spark Plugs", "Timing Belt", "Water Pump", "Head Gasket", "Oil Filter"],
    },
    {
      id: "brakes",
      name: "Brakes",
      icon: Disc,
      image: "https://images.unsplash.com/photo-1613214150384-14921ff659b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBicmFrZSUyMGRpc2N8ZW58MXx8fHwxNzU5MzEwMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "98k",
      subparts: ["Front Brake Pads", "Rear Brake Pads", "Brake Discs", "Brake Fluid", "Brake Calipers", "Handbrake Cable"],
    },
    {
      id: "suspension",
      name: "Suspension",
      icon: Wrench,
      image: "https://images.unsplash.com/photo-1669136048337-5daa3adef7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdXNwZW5zaW9ufGVufDF8fHx8MTc1OTIxODgwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "76k",
      subparts: ["Shock Absorbers", "Coil Springs", "Suspension Arms", "Anti-Roll Bar", "Suspension Bushes", "Ball Joints"],
    },
    {
      id: "electrical",
      name: "Electrical",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1660594161026-d084068e9787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBiYXR0ZXJ5JTIwZWxlY3RyaWNhbHxlbnwxfHx8fDE3NTkyMDM1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "112k",
      subparts: ["Battery", "Alternator", "Headlight Bulbs", "Fuses", "Wiring Harness", "Ignition Coil"],
    },
    {
      id: "cooling",
      name: "Cooling & Heating",
      icon: Wind,
      image: "https://images.unsplash.com/photo-1730461747568-7250e49eb50c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjByYWRpYXRvciUyMGNvb2xpbmd8ZW58MXx8fHwxNzU5MzEwMTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "54k",
      subparts: ["Radiator", "Thermostat", "Coolant", "Fan Belt", "Heater Core", "AC Compressor"],
    },
    {
      id: "transmission",
      name: "Transmission",
      icon: Gauge,
      image: "https://images.unsplash.com/photo-1616992515884-9f645b0fbb5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0cmFuc21pc3Npb24lMjBnZWFyYm94fGVufDF8fHx8MTc1OTIyOTM1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "42k",
      subparts: ["Clutch Kit", "Flywheel", "Gearbox Oil", "Drive Shaft", "CV Joint", "Transmission Filter"],
    },
    {
      id: "exhaust",
      name: "Exhaust",
      icon: Flame,
      image: "https://images.unsplash.com/photo-1680674049247-6526e152c694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBleGhhdXN0JTIwcGlwZXxlbnwxfHx8fDE3NTkyMjQ4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "38k",
      subparts: ["Exhaust Manifold", "Catalytic Converter", "Silencer", "Exhaust Pipe", "Lambda Sensor", "DPF Filter"],
    },
    {
      id: "bodywork",
      name: "Bodywork",
      icon: Car,
      image: "https://images.unsplash.com/photo-1733534816908-650eaf9271f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBib2R5JTIwcGFuZWx8ZW58MXx8fHwxNzU5MzEwMTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "156k",
      subparts: ["Wing Mirror", "Front Bumper", "Rear Bumper", "Bonnet", "Door Panel", "Windscreen"],
    },
    {
      id: "interior",
      name: "Interior",
      icon: Armchair,
      image: "https://images.unsplash.com/photo-1682858110563-3f609263d418?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMHNlYXR8ZW58MXx8fHwxNzU5MzEwMTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "89k",
      subparts: ["Seats", "Dashboard", "Steering Wheel", "Floor Mats", "Door Handles", "Gear Knob"],
    },
    {
      id: "steering",
      name: "Steering",
      icon: Cog,
      image: "https://images.unsplash.com/photo-1687652076061-2525c077da08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdGVlcmluZyUyMHdoZWVsfGVufDF8fHx8MTc1OTIyNDgzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "32k",
      subparts: ["Power Steering Pump", "Steering Rack", "Track Rod End", "Steering Column", "Wheel Alignment"],
    },
    {
      id: "wheels",
      name: "Wheels & Tyres",
      icon: Disc,
      image: "https://images.unsplash.com/photo-1684073889639-1eb56d8b0545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aGVlbCUyMHR5cmV8ZW58MXx8fHwxNzU5MzEwMTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "102k",
      subparts: ["Alloy Wheels", "Steel Wheels", "Tyres", "Wheel Nuts", "Hub Caps", "Wheel Bearings"],
    },
    {
      id: "lighting",
      name: "Lighting",
      icon: Lightbulb,
      image: "https://images.unsplash.com/photo-1598586958772-8bf368215c2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBoZWFkbGlnaHR8ZW58MXx8fHwxNzU5MzEwMTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: "67k",
      subparts: ["Headlights", "Tail Lights", "Indicator Bulbs", "Fog Lights", "Interior Lights", "LED Strips"],
    },
  ];

  const filterOptions = [
    "All",
    "Popular",
    "Engine",
    "Brakes",
    "Suspension",
    "Electrical",
    "Bodywork",
    "Interior",
    "Lighting",
    "Cooling",
    "Transmission",
    "Steering",
    "Wheels & Tyres",
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setDrawerOpen(true);
  };

  const toggleSubpart = (subpart: string) => {
    setSelectedSubparts((prev) =>
      prev.includes(subpart) ? prev.filter((s) => s !== subpart) : [...prev, subpart]
    );
  };

  const slugifyServiceId = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

  const buildCartServicesPayload = (): CartServiceItem[] => {
    if (selectedSubparts.length === 0) {
      if (!selectedCategoryData) {
        return [];
      }
      return [
        {
          id: slugifyServiceId(selectedCategoryData.id || selectedCategoryData.name),
          label: selectedCategoryData.name,
          category: selectedCategoryData.name,
        },
      ];
    }

    return selectedSubparts.map((label) => ({
      id: slugifyServiceId(
        `${selectedCategoryData?.id ?? selectedCategory ?? "service"}-${label}`,
      ),
      label,
      category: selectedCategoryData?.name ?? undefined,
    }));
  };

  const handleContinue = () => {
    const services = buildCartServicesPayload();
    persistServicesSelection(services);
    onNavigate("quotes");
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subparts.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter =
      activeFilter === "All" ||
      activeFilter === "Popular" ||
      category.name === activeFilter;
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
          <h1 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: '32px', lineHeight: '1.3' }}>
            Select Your Parts
          </h1>
          <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '16px', lineHeight: '1.5' }}>
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
              style={{ fontSize: '16px' }}
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
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Light gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/30 to-transparent"></div>
                </div>

                {/* Badge */}
                {category.count && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-white/90 backdrop-blur-sm text-[#64748B] border border-[#E5E7EB] font-['Roboto'] text-xs px-2.5 py-1">
                      {category.count}
                    </Badge>
                  </div>
                )}

                {/* Selected Check */}
                {selectedCategory === category.id && (
                  <div className="absolute top-4 left-4 z-10 w-7 h-7 bg-[#EF4444] rounded-full flex items-center justify-center shadow-lg shadow-primary/50">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Title Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3 className="font-['Inter'] font-semibold text-white" style={{ fontSize: '18px', lineHeight: '1.3' }}>
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
            <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: '20px' }}>
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
                  {selectedCategoryData && (
                    <selectedCategoryData.icon className="h-7 w-7 text-[#EF4444]" strokeWidth={2} />
                  )}
                </div>
                <div>
                  <DrawerTitle className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: '28px', lineHeight: '1.2' }}>
                    {selectedCategoryData?.name} Parts
                  </DrawerTitle>
                  <DrawerDescription className="font-['Roboto'] text-[#64748B] mt-1" style={{ fontSize: '15px' }}>
                    Select specific parts or continue to view all options
                  </DrawerDescription>
                </div>
              </div>
            </DrawerHeader>

            {/* Selected Counter */}
            {selectedSubparts.length > 0 && (
              <div className="mb-6 px-4 py-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
                <p className="font-['Roboto'] text-sm text-[#EF4444] font-medium">
                  {selectedSubparts.length} part{selectedSubparts.length > 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {/* Subpart Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {selectedCategoryData?.subparts.map((subpart, index) => (
                <button
                  key={subpart}
                  onClick={() => toggleSubpart(subpart)}
                  className={`relative px-4 py-4 rounded-xl font-['Roboto'] text-sm transition-all duration-200 text-left group ${
                    selectedSubparts.includes(subpart)
                      ? "bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/25"
                      : "bg-[#F8FAFC] text-[#0F172A] border border-[#E5E7EB] hover:border-[#EF4444]/50 hover:bg-white"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium ${selectedSubparts.includes(subpart) ? 'text-white' : 'text-[#0F172A]'}`}>
                      {subpart}
                    </span>
                    {selectedSubparts.includes(subpart) && (
                      <Check className="h-4 w-4 text-white flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* View All Link */}
            <div className="flex items-center justify-center mb-8">
              <button className="font-['Roboto'] text-[#EF4444] hover:text-[#DC2626] text-sm font-semibold flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-[#EF4444]/5 transition-all">
                View all {selectedCategoryData?.name.toLowerCase()} subparts
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
                  style={{ fontSize: '15px' }}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Close
                </Button>
                <Button
                  onClick={handleContinue}
                  className="flex-1 h-14 bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold rounded-xl shadow-lg shadow-[#EF4444]/30 hover:shadow-xl hover:shadow-[#EF4444]/40 transition-all hover:scale-[1.02]"
                  style={{ fontSize: '15px' }}
                >
                  Continue with {selectedSubparts.length > 0 ? `${selectedSubparts.length} part${selectedSubparts.length > 1 ? 's' : ''}` : 'category'}
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
