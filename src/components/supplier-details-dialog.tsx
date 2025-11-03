import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Award,
  Phone,
  Mail,
  Calendar,
  Package,
  ThumbsUp,
  CheckCircle,
  TrendingUp,
  Users,
  MessageSquare,
  Flag,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { QuoteAcceptanceDialog } from "./quote-acceptance-dialog";
import { OrderPlacedDialog } from "./order-placed-dialog";
import { useState } from "react";

interface SupplierDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: {
    id: string;
    name: string;
    logo: string;
    rating: number;
    reviews: number;
    location: string;
    distance?: string;
    responseTime: string;
    verified: boolean;
    deliveryTime?: string;
    completionRate?: number;
    yearsInBusiness?: number;
    totalOrders?: number;
    description?: string;
    specialties?: string[];
    certifications?: string[];
    contact?: {
      phone?: string;
      email?: string;
    };
    ratingBreakdown?: {
      quality: number;
      communication: number;
      delivery: number;
      value: number;
    };
    recentReviews?: Array<{
      id: string;
      author: string;
      rating: number;
      date: string;
      comment: string;
      verified: boolean;
    }>;
  };
  onMessageClick?: () => void;
}

export function SupplierDetailsDialog({
  open,
  onOpenChange,
  supplier,
  onMessageClick,
}: SupplierDetailsDialogProps) {
  const [showAcceptanceDialog, setShowAcceptanceDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    supplierName: string;
    partName: string;
    price: number;
    eta: string;
    orderNumber: string;
  } | null>(null);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-[#F59E0B] text-[#F59E0B]"
                : "fill-gray-600 text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleAcceptClick = () => {
    // Generate order number
    const orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Set order details
    setOrderDetails({
      supplierName: supplier.name,
      partName: "Front Brake Pads Set", // You can make this dynamic based on actual part
      price: 85.99, // You can make this dynamic based on actual quote
      eta: supplier.deliveryTime || "2-3 working days",
      orderNumber: orderNumber,
    });

    // Show success dialog immediately
    setShowSuccessDialog(true);
  };

  const handleConfirmAcceptance = () => {
    // Generate order number
    const orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Set order details
    setOrderDetails({
      supplierName: supplier.name,
      partName: "Front Brake Pads Set", // You can make this dynamic based on actual part
      price: 85.99, // You can make this dynamic based on actual quote
      eta: supplier.deliveryTime || "2-3 working days",
      orderNumber: orderNumber,
    });

    // Close acceptance dialog and show success dialog
    setShowAcceptanceDialog(false);
    setShowSuccessDialog(true);
  };

  const handleOrderConfirmed = () => {
    // Handle post-confirmation actions (e.g., navigate to orders page, etc.)
    console.log("Order confirmed:", orderDetails);
    setShowSuccessDialog(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] p-0 bg-white border-slate-200">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 md:p-8">
            {/* Hidden Dialog Description for Accessibility */}
            <DialogDescription className="sr-only">
              Detailed information about {supplier.name} including ratings, reviews, certifications, and contact details
            </DialogDescription>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white p-3 border-2 border-slate-200">
                  <ImageWithFallback
                    src={supplier.logo}
                    alt={supplier.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Supplier Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <DialogTitle className="font-['Inter'] text-slate-900 mb-2" style={{ fontSize: "28px" }}>
                      {supplier.name}
                    </DialogTitle>
                    <div className="flex items-center gap-3 flex-wrap">
                      {supplier.verified && (
                        <Badge className="bg-[#22C55E] text-white border-0 font-['Roboto']">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified Supplier
                        </Badge>
                      )}
                      {supplier.completionRate && supplier.completionRate >= 95 && (
                        <Badge className="bg-[#F02801] text-white border-0 font-['Roboto']">
                          <Award className="h-3 w-3 mr-1" />
                          Top Rated
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating & Stats */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(supplier.rating)}
                    </div>
                    <span className="font-['Inter'] text-slate-900" style={{ fontSize: "20px" }}>
                      {supplier.rating.toFixed(1)}
                    </span>
                    <span className="font-['Roboto'] text-slate-600 text-[14px]">
                      ({supplier.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-[#F02801]" />
                      <span className="font-['Roboto'] text-slate-600 text-[12px]">Location</span>
                    </div>
                    <p className="font-['Roboto'] text-slate-900 text-[14px]">{supplier.location}</p>
                    {supplier.distance && (
                      <p className="font-['Roboto'] text-slate-500 text-[12px]">{supplier.distance}</p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-[#F02801]" />
                      <span className="font-['Roboto'] text-slate-600 text-[12px]">Response Time</span>
                    </div>
                    <p className="font-['Roboto'] text-slate-900 text-[14px]">{supplier.responseTime}</p>
                  </div>

                  {supplier.deliveryTime && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-[#F02801]" />
                        <span className="font-['Roboto'] text-slate-600 text-[12px]">Delivery</span>
                      </div>
                      <p className="font-['Roboto'] text-slate-900 text-[14px]">{supplier.deliveryTime}</p>
                    </div>
                  )}

                  {supplier.yearsInBusiness && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-[#F02801]" />
                        <span className="font-['Roboto'] text-slate-600 text-[12px]">Experience</span>
                      </div>
                      <p className="font-['Roboto'] text-slate-900 text-[14px]">{supplier.yearsInBusiness} years</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-slate-200" />

            {/* Description */}
            {supplier.description && (
              <div className="mb-6">
                <h3 className="font-['Inter'] text-slate-900 mb-3" style={{ fontSize: "18px" }}>
                  About {supplier.name}
                </h3>
                <p className="font-['Roboto'] text-slate-700 text-[15px] leading-relaxed">
                  {supplier.description}
                </p>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="mb-6">
              <h3 className="font-['Inter'] text-slate-900 mb-4" style={{ fontSize: "18px" }}>
                Performance Metrics
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {supplier.completionRate && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-['Roboto'] text-slate-700 text-[14px]">Completion Rate</span>
                      <span className="font-['Inter'] text-slate-900" style={{ fontSize: "16px" }}>
                        {supplier.completionRate}%
                      </span>
                    </div>
                    <Progress value={supplier.completionRate} className="h-2 bg-slate-200" />
                  </div>
                )}

                {supplier.totalOrders && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F02801]/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-[#F02801]" />
                      </div>
                      <div>
                        <p className="font-['Roboto'] text-slate-700 text-[14px]">Total Orders</p>
                        <p className="font-['Inter'] text-slate-900" style={{ fontSize: "18px" }}>
                          {supplier.totalOrders.toLocaleString()}+
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Breakdown */}
            {supplier.ratingBreakdown && (
              <div className="mb-6">
                <h3 className="font-['Inter'] text-slate-900 mb-4" style={{ fontSize: "18px" }}>
                  Rating Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(supplier.ratingBreakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <span className="font-['Roboto'] text-slate-700 text-[14px] w-32 capitalize">
                        {key}
                      </span>
                      <Progress value={value * 20} className="flex-1 h-2 bg-slate-200" />
                      <span className="font-['Roboto'] text-slate-900 text-[14px] w-8">
                        {value.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {supplier.specialties && supplier.specialties.length > 0 && (
              <div className="mb-6">
                <h3 className="font-['Inter'] text-slate-900 mb-3" style={{ fontSize: "18px" }}>
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {supplier.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-slate-100 text-slate-900 border-slate-200 font-['Roboto']"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {supplier.certifications && supplier.certifications.length > 0 && (
              <div className="mb-6">
                <h3 className="font-['Inter'] text-slate-900 mb-3" style={{ fontSize: "18px" }}>
                  Certifications
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {supplier.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200"
                    >
                      <CheckCircle className="h-5 w-5 text-[#22C55E] flex-shrink-0" />
                      <span className="font-['Roboto'] text-slate-900 text-[14px]">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Reviews */}
            {supplier.recentReviews && supplier.recentReviews.length > 0 && (
              <div className="mb-6">
                <h3 className="font-['Inter'] text-slate-900 mb-4" style={{ fontSize: "18px" }}>
                  Recent Reviews
                </h3>
                <div className="space-y-4">
                  {supplier.recentReviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[#F02801] text-white font-['Inter']">
                              {review.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-['Inter'] text-slate-900 text-[15px]">{review.author}</p>
                              {review.verified && (
                                <Badge className="bg-[#22C55E]/20 text-[#22C55E] border-0 font-['Roboto'] text-[11px] px-2 py-0">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="font-['Roboto'] text-slate-600 text-[12px]">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="font-['Roboto'] text-slate-700 text-[14px] leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {supplier.contact && (
              <div className="mb-6">
                <h3 className="font-['Inter'] text-slate-900 mb-3" style={{ fontSize: "18px" }}>
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {supplier.contact.phone && (
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <Phone className="h-5 w-5 text-[#F02801]" />
                      <div>
                        <p className="font-['Roboto'] text-slate-600 text-[12px]">Phone</p>
                        <p className="font-['Roboto'] text-slate-900 text-[14px]">{supplier.contact.phone}</p>
                      </div>
                    </div>
                  )}
                  {supplier.contact.email && (
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <Mail className="h-5 w-5 text-[#F02801]" />
                      <div>
                        <p className="font-['Roboto'] text-slate-600 text-[12px]">Email</p>
                        <p className="font-['Roboto'] text-slate-900 text-[14px]">{supplier.contact.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                {onMessageClick && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onMessageClick();
                      onOpenChange(false);
                    }}
                    className="flex-1 h-12 rounded-xl border-2 border-slate-300 hover:border-slate-400 font-['Roboto'] font-medium bg-white text-slate-900 hover:bg-slate-50"
                    style={{ fontSize: "15px" }}
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Message Supplier
                  </Button>
                )}
                <Button
                  onClick={handleAcceptClick}
                  className="flex-1 h-12 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
                  style={{ fontSize: "15px" }}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Accept
                </Button>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  // Handle report action
                  onOpenChange(false);
                }}
                className="w-full h-11 rounded-xl border-2 border-slate-200 hover:border-[#F02801] font-['Roboto'] font-medium bg-white text-slate-700 hover:bg-slate-50 hover:text-[#F02801] transition-all duration-200"
                style={{ fontSize: "14px" }}
              >
                <Flag className="h-4 w-4 mr-2" />
                Report Supplier
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>

      {/* Quote Acceptance Detail Popup */}
      <QuoteAcceptanceDialog
        open={showAcceptanceDialog}
        onOpenChange={setShowAcceptanceDialog}
        supplier={{
          name: supplier.name,
          logo: supplier.logo,
          location: supplier.location,
          deliveryTime: supplier.deliveryTime,
        }}
        onConfirm={handleConfirmAcceptance}
      />

      {/* Order Success Popup */}
      <OrderPlacedDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        orderDetails={orderDetails}
        onNavigate={(page) => console.log("Navigate to:", page)}
        onOrderConfirmed={handleOrderConfirmed}
      />
    </Dialog>
  );
}
