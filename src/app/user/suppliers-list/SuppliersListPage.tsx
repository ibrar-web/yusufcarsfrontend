import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  MapPin, 
  Clock, 
  Truck, 
  MessageSquare,
  Award,
  Shield,
  Package
} from "lucide-react";
import { toast } from "sonner";
interface SuppliersListPageProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
  onSignupClick?: () => void;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onTrackOrderClick?: () => void;
  partData?: {
    name: string;
    category: string;
    price: number;
    image: string;
  };
}

export function SuppliersListPage({ 
  onNavigate, 
  onSignupClick, 
  isAuthenticated, 
  onSignOut, 
  onProfileClick,
  onNotificationClick,
  onTrackOrderClick,
  partData 
}: SuppliersListPageProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [supplierDetailOpen, setSupplierDetailOpen] = useState(false);

  const handleContactSupplier = (supplierName: string) => {
    toast.success(`Contacting ${supplierName}...`);
    onNavigate("chat");
  };

  const handleSupplierClick = (supplier: any) => {
    setSelectedSupplier(supplier);
    setSupplierDetailOpen(true);
  };

  const handleRequestQuote = () => {
    setSupplierDetailOpen(false);
    toast.success(`Quote request sent to ${selectedSupplier?.name}!`);
    setTimeout(() => {
      onNavigate("chat");
    }, 500);
  };

  const suppliers = partData ? [
    {
      id: "1",
      name: "AutoParts Direct",
      location: "Birmingham",
      distance: "2.3 miles",
      rating: 4.8,
      reviews: 256,
      responseTime: "2 hours",
      verified: true,
      price: partData.price * 0.95,
      delivery: "Next day",
      image: "https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3b3Jrc2hvcCUyMG1lY2hhbmljfGVufDF8fHx8MTc1OTIxODgwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "2",
      name: "Midlands Motor Parts",
      location: "Manchester",
      distance: "4.1 miles",
      rating: 4.9,
      reviews: 412,
      responseTime: "1 hour",
      verified: true,
      price: partData.price * 0.92,
      delivery: "Same day",
      image: "https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3b3Jrc2hvcCUyMG1lY2hhbmljfGVufDF8fHx8MTc1OTIxODgwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "3",
      name: "Quick Fix Parts",
      location: "London",
      distance: "5.8 miles",
      rating: 4.7,
      reviews: 189,
      responseTime: "3 hours",
      verified: true,
      price: partData.price,
      delivery: "Next day",
      image: "https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3b3Jrc2hvcCUyMG1lY2hhbmljfGVufDF8fHx8MTc1OTIxODgwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "4",
      name: "Premier Auto Supply",
      location: "Leeds",
      distance: "6.2 miles",
      rating: 4.6,
      reviews: 98,
      responseTime: "4 hours",
      verified: true,
      price: partData.price * 1.05,
      delivery: "2-3 days",
      image: "https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3b3Jrc2hvcCUyMG1lY2hhbmljfGVufDF8fHx8MTc1OTIxODgwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "5",
      name: "Elite Car Components",
      location: "Bristol",
      distance: "7.5 miles",
      rating: 4.9,
      reviews: 324,
      responseTime: "1 hour",
      verified: true,
      price: partData.price * 0.89,
      delivery: "Same day",
      image: "https://images.unsplash.com/photo-1730453075684-2ad6232ab451?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3b3Jrc2hvcCUyMG1lY2hhbmljfGVufDF8fHx8MTc1OTIxODgwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ] : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header 
        onNavigate={onNavigate} 
        currentPage="suppliers-list"
        onSignupClick={onSignupClick}
        isAuthenticated={isAuthenticated}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
        onNotificationClick={onNotificationClick}
        onTrackOrderClick={onTrackOrderClick}
      />

      {/* Page Header */}
      <section className="bg-white border-b border-[#E5E7EB] pt-24 pb-8">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Back Button */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#F02801] transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="font-['Roboto'] font-medium" style={{ fontSize: '15px' }}>
              Back to Home
            </span>
          </button>

          <div className="flex items-center justify-between gap-6">
            {/* Title */}
            <div>
              <h1 className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: "40px", lineHeight: 1.2 }}>
                Available Suppliers
              </h1>
              <p className="font-['Roboto'] text-[#64748B] mt-2" style={{ fontSize: "18px", lineHeight: 1.6 }}>
                {partData ? `Compare quotes from verified suppliers for ${partData.name}` : 'Find the best suppliers for your parts'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          {partData ? (
            <>
              {/* Part Summary */}
              <div className="bg-white border-2 border-[#E5E7EB] rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F1F5F9] border-2 border-[#E5E7EB] flex-shrink-0">
                    <ImageWithFallback
                      src={partData.image}
                      alt={partData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-[#F1F5F9] text-[#64748B] mb-2">
                      {partData.category}
                    </Badge>
                    <h2 className="font-['Inter'] font-bold text-[#0F172A] mb-2" style={{ fontSize: "24px" }}>
                      {partData.name}
                    </h2>
                    <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "16px" }}>
                      Showing <span className="font-semibold text-[#0F172A]">{suppliers.length}</span> verified suppliers in your area
                    </p>
                  </div>
                </div>
              </div>

              {/* Suppliers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {suppliers.map((supplier, index) => (
                  <div
                    key={supplier.id}
                    onClick={() => handleSupplierClick(supplier)}
                    className={`group bg-gradient-to-br from-[#1E293B] to-[#0F172A] border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#F02801]/20 hover:-translate-y-2 card-hover shine-effect flex flex-col h-full cursor-pointer ${
                      index === 0 ? "border-[#F02801] shadow-xl shadow-[#F02801]/30 ring-2 ring-[#F02801]/40" : "border-[#334155] hover:border-[#F02801]"
                    }`}
                  >
                    {/* Supplier Image - LARGER */}
                    <div className="relative h-48 bg-gradient-to-br from-[#334155] to-[#1E293B] overflow-hidden image-zoom-container flex-shrink-0">
                      <ImageWithFallback
                        src={supplier.image}
                        alt={supplier.name}
                        className="w-full h-full object-cover image-zoom opacity-90"
                      />
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent"></div>
                      
                      {/* Best Price Badge - Top Right */}
                      {index === 0 && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className="bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white font-bold shadow-lg text-[10px] px-2 py-0.5 border border-white/20">
                            Best Price
                          </Badge>
                        </div>
                      )}
                      {/* Verified Badge - Top Left */}
                      {supplier.verified && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-[#22C55E]/90 backdrop-blur-sm text-white shadow-lg text-[10px] px-2 py-0.5 border border-white/20">
                            <CheckCircle className="h-2 w-2 mr-0.5" />
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Card Content - COMPACT with Flexbox */}
                    <div className="p-3 flex flex-col flex-1">
                      {/* Header: Name & Price */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-['Inter'] font-bold text-white line-clamp-1 flex-1" style={{ fontSize: "15px" }}>
                          {supplier.name}
                        </h3>
                        <div className="text-right flex-shrink-0">
                          <div className="font-['Inter'] font-bold text-white" style={{ fontSize: "18px", lineHeight: "1.1" }}>
                            £{supplier.price.toFixed(2)}
                          </div>
                          {supplier.price < partData.price && (
                            <p className="font-['Roboto'] font-semibold text-[#22C55E]" style={{ fontSize: "10px" }}>
                              Save £{(partData.price - supplier.price).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-2.5 w-2.5 ${
                                i < Math.floor(supplier.rating)
                                  ? "text-[#F59E0B] fill-current"
                                  : "text-[#475569] fill-current"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: "11px" }}>
                          {supplier.rating} ({supplier.reviews})
                        </span>
                      </div>

                      {/* Details - Flexible space */}
                      <div className="space-y-1 mb-auto">
                        <div className="flex items-center gap-1 text-[#CBD5E1]">
                          <MapPin className="h-2.5 w-2.5 flex-shrink-0 text-[#F02801]" />
                          <span className="font-['Roboto'] line-clamp-1" style={{ fontSize: "11px" }}>
                            {supplier.location} · {supplier.distance}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#CBD5E1]">
                          <Clock className="h-2.5 w-2.5 flex-shrink-0 text-[#F02801]" />
                          <span className="font-['Roboto']" style={{ fontSize: "11px" }}>
                            {supplier.responseTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#CBD5E1]">
                          <Truck className="h-2.5 w-2.5 flex-shrink-0 text-[#F02801]" />
                          <span className="font-['Roboto']" style={{ fontSize: "11px" }}>
                            {supplier.delivery}
                          </span>
                        </div>
                      </div>

                      {/* Contact Button - Always at bottom */}
                      <Button
                        onClick={() => handleContactSupplier(supplier.name)}
                        className="w-full h-8 rounded-lg bg-gradient-to-r from-[#F02801] to-[#D22301] hover:from-[#D22301] hover:to-[#B91C01] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/40 hover:shadow-xl hover:shadow-[#F02801]/60 btn-hover-scale border border-[#F02801]/30 mt-3"
                        style={{ fontSize: "12px" }}
                      >
                        <MessageSquare className="h-2.5 w-2.5 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Message */}
              <div className="mt-8 p-5 bg-[#F0FDF4] border-2 border-[#86EFAC] rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-['Roboto'] font-semibold text-[#166534] mb-1" style={{ fontSize: "16px" }}>
                      All suppliers are verified and trusted
                    </p>
                    <p className="font-['Roboto'] text-[#166534]" style={{ fontSize: "14px" }}>
                      Compare quotes, read reviews, and contact suppliers directly to get the best deal on your parts.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "18px" }}>
                No part selected. Please go back and select a part.
              </p>
              <Button
                onClick={() => onNavigate("home")}
                className="mt-6 bg-[#F02801] hover:bg-[#D22301] text-white rounded-xl"
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />

      {/* Supplier Detail Dialog */}
      <Dialog open={supplierDetailOpen} onOpenChange={setSupplierDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedSupplier && partData && (
            <>
              <DialogHeader>
                <DialogTitle className="font-['Inter'] text-[#0F172A]" style={{ fontSize: "28px" }}>
                  Supplier Details
                </DialogTitle>
                <DialogDescription className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "15px" }}>
                  Review supplier information and request a quote
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* Supplier Header */}
                <div className="flex items-start gap-5">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F1F5F9] border-2 border-[#E5E7EB] flex-shrink-0">
                    <ImageWithFallback
                      src={selectedSupplier.image}
                      alt={selectedSupplier.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: "24px" }}>
                        {selectedSupplier.name}
                      </h3>
                      {selectedSupplier.verified && (
                        <Badge className="bg-[#22C55E] text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedSupplier.rating)
                                ? "text-[#F59E0B] fill-current"
                                : "text-[#E5E7EB] fill-current"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "14px" }}>
                        {selectedSupplier.rating} ({selectedSupplier.reviews} reviews)
                      </span>
                    </div>

                    {/* Location & Details */}
                    <div className="space-y-2 text-[#64748B]">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#F02801]" />
                        <span className="font-['Roboto']" style={{ fontSize: "14px" }}>
                          {selectedSupplier.location} · {selectedSupplier.distance}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#F02801]" />
                        <span className="font-['Roboto']" style={{ fontSize: "14px" }}>
                          Response time: {selectedSupplier.responseTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#F02801]" />
                        <span className="font-['Roboto']" style={{ fontSize: "14px" }}>
                          Delivery: {selectedSupplier.delivery}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Part Information */}
                <div className="bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl p-5">
                  <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: "18px" }}>
                    Requested Part
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-[#E5E7EB]">
                      <ImageWithFallback
                        src={partData.image}
                        alt={partData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Badge className="bg-[#F1F5F9] text-[#64748B] mb-1">
                        {partData.category}
                      </Badge>
                      <p className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "16px" }}>
                        {partData.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quote Price */}
                <div className="bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2] border-2 border-[#FCA5A5] rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-['Roboto'] text-[#991B1B] mb-1" style={{ fontSize: "14px" }}>
                        Quoted Price
                      </p>
                      <div className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: "36px", lineHeight: "1.2" }}>
                        £{selectedSupplier.price.toFixed(2)}
                      </div>
                      {selectedSupplier.price < partData.price && (
                        <p className="font-['Roboto'] font-semibold text-[#22C55E] mt-1" style={{ fontSize: "14px" }}>
                          You save £{(partData.price - selectedSupplier.price).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <Award className="h-16 w-16 text-[#F02801] opacity-20" />
                  </div>
                </div>

                {/* Supplier Benefits */}
                <div className="space-y-3">
                  <h4 className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "16px" }}>
                    Why choose this supplier?
                  </h4>
                  <div className="grid gap-2">
                    {[
                      "Verified and trusted supplier",
                      "Competitive pricing and quotes",
                      "Fast response and delivery times",
                      "Secure payment and buyer protection"
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#22C55E] flex-shrink-0" />
                        <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "14px" }}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                  <Button
                    variant="outline"
                    onClick={() => setSupplierDetailOpen(false)}
                    className="flex-1 h-12 rounded-xl border-2 border-[#E5E7EB] hover:border-[#94A3B8] font-['Roboto'] font-medium"
                    style={{ fontSize: "15px" }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleRequestQuote}
                    className="flex-1 h-12 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
                    style={{ fontSize: "15px" }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Quote
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
