import { useState } from "react";
import { Header } from "@/components/header";
import { QuoteCard } from "@/components/quote-card";
import { OrderPlacedDialog } from "@/components/order-placed-dialog";
import { SupplierDetailsDialog } from "@/components/supplier-details-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Grid, List, Search, X, Check, Star, MapPin, Clock, Shield } from "lucide-react";

interface QuotesPageProps {
  onNavigate: (page: string, supplierId?: string) => void;
  onBack?: () => void;
  onStartChat?: (quoteId: string, supplierId: string) => void;
  onSignupClick?: () => void;
  onOrderConfirmed?: (orderDetails: {
    orderNumber: string;
    supplierName: string;
    partName: string;
    price: number;
    eta: string;
  }) => void;
}

export function QuotesPage({ onNavigate, onBack, onStartChat, onSignupClick, onOrderConfirmed }: QuotesPageProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    supplierName: string;
    partName: string;
    price: number;
    eta: string;
    orderNumber: string;
  } | null>(null);
  const [supplierDetailsOpen, setSupplierDetailsOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  const mockQuotes = [
    {
      id: "1",
      supplierId: "1",
      supplierName: "AutoParts Direct",
      price: 125.99,
      originalPrice: 149.99,
      rating: 4.8,
      reviewCount: 256,
      distance: 2.3,
      eta: "1-2 days",
      warranty: "12 months",
      partCondition: "new" as const,
      deliveryOption: "Free collection or £5 delivery",
      verified: true,
    },
    {
      id: "2",
      supplierId: "2",
      supplierName: "Midlands Motor Parts",
      price: 98.50,
      rating: 4.9,
      reviewCount: 412,
      distance: 5.1,
      eta: "Same day",
      warranty: "6 months",
      partCondition: "refurbished" as const,
      deliveryOption: "Collection only",
      verified: true,
    },
    {
      id: "3",
      supplierId: "3",
      supplierName: "Quick Fix Parts",
      price: 145.00,
      rating: 4.7,
      reviewCount: 189,
      distance: 3.8,
      eta: "2-3 days",
      warranty: "24 months",
      partCondition: "new" as const,
      deliveryOption: "Free delivery",
      verified: true,
    },
    {
      id: "4",
      supplierId: "4",
      supplierName: "Budget Auto Spares",
      price: 79.99,
      rating: 4.5,
      reviewCount: 98,
      distance: 8.2,
      eta: "3-5 days",
      partCondition: "used" as const,
      deliveryOption: "£8 delivery",
      verified: false,
    },
    {
      id: "5",
      supplierId: "5",
      supplierName: "CarParts4Less",
      price: 89.95,
      originalPrice: 109.95,
      rating: 4.6,
      reviewCount: 324,
      distance: 4.5,
      eta: "1-3 days",
      warranty: "12 months",
      partCondition: "new" as const,
      deliveryOption: "Free delivery over £50",
      verified: true,
    },
    {
      id: "6",
      supplierId: "6",
      supplierName: "Motor Factor UK",
      price: 135.00,
      rating: 4.9,
      reviewCount: 567,
      distance: 6.7,
      eta: "Next day",
      warranty: "18 months",
      partCondition: "new" as const,
      deliveryOption: "Free next-day delivery",
      verified: true,
    },
  ];

  // Mock supplier details data
  const mockSuppliers: Record<string, any> = {
    "1": {
      id: "1",
      name: "AutoParts Direct",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      rating: 4.8,
      reviews: 256,
      location: "Birmingham",
      distance: "2.3 miles",
      responseTime: "< 2 hours",
      verified: true,
      deliveryTime: "1-2 days",
      completionRate: 98,
      yearsInBusiness: 15,
      totalOrders: 5420,
      description: "AutoParts Direct is a leading supplier of genuine and OEM car parts across the Midlands. With over 15 years of experience, we pride ourselves on fast delivery, competitive prices, and exceptional customer service.",
      specialties: ["Brake Systems", "Engine Parts", "Suspension", "Electrical Components"],
      certifications: ["ISO 9001 Certified", "Trading Standards Approved", "Motor Codes Accredited", "GDPR Compliant"],
      contact: {
        phone: "0121 456 7890",
        email: "sales@autopartsdirect.co.uk"
      },
      ratingBreakdown: {
        quality: 4.9,
        communication: 4.8,
        delivery: 4.7,
        value: 4.8
      },
      recentReviews: [
        {
          id: "r1",
          author: "John Smith",
          rating: 5,
          date: "2 days ago",
          comment: "Excellent service! Part arrived next day as promised. Quality is top-notch and fits perfectly. Will definitely order again.",
          verified: true
        },
        {
          id: "r2",
          author: "Sarah Williams",
          rating: 5,
          date: "1 week ago",
          comment: "Very impressed with the quick response and competitive pricing. The brake pads I ordered were genuine OEM parts at a great price.",
          verified: true
        },
        {
          id: "r3",
          author: "Michael Brown",
          rating: 4,
          date: "2 weeks ago",
          comment: "Good quality parts and fast delivery. Slightly more expensive than some competitors but worth it for the peace of mind.",
          verified: true
        }
      ]
    },
    "2": {
      id: "2",
      name: "Midlands Motor Parts",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      rating: 4.9,
      reviews: 412,
      location: "Coventry",
      distance: "5.1 miles",
      responseTime: "< 1 hour",
      verified: true,
      deliveryTime: "Same day",
      completionRate: 99,
      yearsInBusiness: 22,
      totalOrders: 8750,
      description: "Family-run business specialising in quality refurbished and new car parts. We offer same-day collection and delivery services across the Midlands region.",
      specialties: ["Refurbished Parts", "Engine Rebuilds", "Transmission", "Fast Delivery"],
      certifications: ["ISO 14001 Certified", "RAC Approved", "AA Trusted Garage Network"],
      contact: {
        phone: "024 7612 3456",
        email: "info@midlandsmotorparts.co.uk"
      },
      ratingBreakdown: {
        quality: 5.0,
        communication: 4.9,
        delivery: 4.8,
        value: 4.9
      },
      recentReviews: [
        {
          id: "r4",
          author: "David Jones",
          rating: 5,
          date: "3 days ago",
          comment: "Outstanding service! Same day delivery and the refurbished alternator works perfectly. Saved me hundreds compared to buying new.",
          verified: true
        }
      ]
    },
    "3": {
      id: "3",
      name: "Quick Fix Parts",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      rating: 4.7,
      reviews: 189,
      location: "Leicester",
      distance: "3.8 miles",
      responseTime: "< 3 hours",
      verified: true,
      deliveryTime: "2-3 days",
      completionRate: 96,
      yearsInBusiness: 8,
      totalOrders: 3200,
      description: "Quick Fix Parts specialises in providing high-quality car parts with extended warranties. We stock a wide range of parts for European and Japanese vehicles.",
      specialties: ["European Cars", "Japanese Cars", "Extended Warranties", "Free Delivery"],
      certifications: ["Trading Standards Approved", "UK Warranty Provider"],
      contact: {
        phone: "0116 234 5678",
        email: "support@quickfixparts.co.uk"
      },
      ratingBreakdown: {
        quality: 4.8,
        communication: 4.7,
        delivery: 4.6,
        value: 4.7
      },
      recentReviews: []
    },
    "4": {
      id: "4",
      name: "Budget Auto Spares",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      rating: 4.5,
      reviews: 98,
      location: "Nottingham",
      distance: "8.2 miles",
      responseTime: "< 4 hours",
      verified: false,
      deliveryTime: "3-5 days",
      completionRate: 92,
      yearsInBusiness: 5,
      totalOrders: 1500,
      description: "Budget-friendly car parts supplier offering competitive prices on used and reconditioned parts. Great for older vehicles.",
      specialties: ["Used Parts", "Budget-Friendly", "Older Vehicles"],
      certifications: [],
      contact: {
        phone: "0115 789 0123",
        email: "sales@budgetautospares.co.uk"
      },
      ratingBreakdown: {
        quality: 4.3,
        communication: 4.5,
        delivery: 4.4,
        value: 4.8
      },
      recentReviews: []
    },
    "5": {
      id: "5",
      name: "CarParts4Less",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      rating: 4.6,
      reviews: 324,
      location: "Derby",
      distance: "4.5 miles",
      responseTime: "< 2 hours",
      verified: true,
      deliveryTime: "1-3 days",
      completionRate: 95,
      yearsInBusiness: 10,
      totalOrders: 4800,
      description: "Online car parts retailer with competitive prices and free delivery on orders over £50. Wide selection of parts for all makes and models.",
      specialties: ["Online Ordering", "Free Delivery", "Wide Selection", "Price Match"],
      certifications: ["E-commerce Trust Certified", "Secure Payment Provider"],
      contact: {
        phone: "01332 654 321",
        email: "orders@carparts4less.co.uk"
      },
      ratingBreakdown: {
        quality: 4.7,
        communication: 4.6,
        delivery: 4.5,
        value: 4.7
      },
      recentReviews: []
    },
    "6": {
      id: "6",
      name: "Motor Factor UK",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      rating: 4.9,
      reviews: 567,
      location: "Wolverhampton",
      distance: "6.7 miles",
      responseTime: "< 1 hour",
      verified: true,
      deliveryTime: "Next day",
      completionRate: 99,
      yearsInBusiness: 18,
      totalOrders: 12500,
      description: "Premium car parts supplier with next-day delivery service. We specialise in genuine OEM parts and offer industry-leading warranties on all products.",
      specialties: ["Genuine OEM Parts", "Next Day Delivery", "Premium Quality", "Extended Warranties"],
      certifications: ["OEM Approved Distributor", "ISO 9001:2015", "Motor Codes Member", "Trust Pilot 5-Star"],
      contact: {
        phone: "01902 345 678",
        email: "enquiries@motorfactoruk.com"
      },
      ratingBreakdown: {
        quality: 5.0,
        communication: 4.9,
        delivery: 4.9,
        value: 4.8
      },
      recentReviews: [
        {
          id: "r5",
          author: "Emma Taylor",
          rating: 5,
          date: "1 day ago",
          comment: "Absolutely brilliant service. Ordered brake discs and pads at 3pm, delivered by 10am next morning. Quality is exceptional.",
          verified: true
        }
      ]
    }
  };

  const handleSupplierClick = (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setSupplierDetailsOpen(true);
  };

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes((prev) => {
      if (prev.includes(quoteId)) {
        return prev.filter((id) => id !== quoteId);
      }
      if (prev.length < 3) {
        return [...prev, quoteId];
      }
      return prev;
    });
  };

  const selectedQuoteData = mockQuotes.filter((q) => selectedQuotes.includes(q.id));

  return (
    <div className="min-h-screen bg-muted/20">
      <Header onNavigate={onNavigate} currentPage="quotes" onSignupClick={onSignupClick} />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Your Quotes</h1>
          <p className="text-muted-foreground">
            Received {mockQuotes.length} quotes for 2018 Volkswagen Golf - Front Brake Pads
          </p>
        </div>

        <div>
          {/* Main Content */}
          <div>
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: '28px', lineHeight: '1.2' }}>
                    Available Quotes
                  </h2>
                  <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '15px' }}>
                    {mockQuotes.length} suppliers ready to help
                  </p>
                </div>
                
                {/* View Mode Toggle */}
                <div className="hidden sm:flex gap-2 bg-[#F8FAFC] p-1 rounded-xl border border-[#E5E7EB]">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`h-9 px-4 ${viewMode === "list" ? "bg-white shadow-sm text-[#0F172A]" : "hover:bg-white/50 text-[#475569]"}`}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`h-9 px-4 ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                </div>
              </div>

              {/* Search and Sort Bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
                  <Input 
                    placeholder="Search by supplier name or location..." 
                    className="h-12 pl-12 pr-4 bg-white border border-[#E5E7EB] focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl font-['Roboto']"
                    style={{ fontSize: '15px' }}
                  />
                </div>
                
                <Select defaultValue="price-low">
                  <SelectTrigger className="w-full sm:w-[220px] h-12 bg-white border-[#E5E7EB] rounded-xl font-['Roboto']">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="distance">Distance: Nearest</SelectItem>
                    <SelectItem value="rating">Rating: Highest</SelectItem>
                    <SelectItem value="eta">ETA: Fastest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Compare Selection Bar */}
            {selectedQuotes.length > 0 && (
              <div className="mb-6 p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-['Roboto'] font-semibold text-[#0F172A]" style={{ fontSize: '15px' }}>
                        {selectedQuotes.length} quote{selectedQuotes.length > 1 ? "s" : ""} selected
                      </p>
                      {selectedQuotes.length < 3 && (
                        <p className="font-['Roboto'] text-[#64748B] text-sm">
                          Select up to 3 quotes to compare
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedQuotes([])}
                      className="h-10 text-[#64748B] hover:text-[#0F172A]"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    {selectedQuotes.length >= 2 && (
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button size="sm" className="h-10 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30">
                            Compare {selectedQuotes.length} Quotes
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[85vh] bg-white">
                          <div className="max-w-[1400px] mx-auto">
                            <SheetHeader className="mb-6">
                              <SheetTitle className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: '28px' }}>
                                Compare Quotes
                              </SheetTitle>
                              <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '15px' }}>
                                Side-by-side comparison of {selectedQuotes.length} selected quotes
                              </p>
                            </SheetHeader>
                            <div className="overflow-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow className="border-b-2 border-[#E5E7EB]">
                                    <TableHead className="w-[180px] font-['Inter'] font-semibold text-[#0F172A]">
                                      Feature
                                    </TableHead>
                                    {selectedQuoteData.map((quote) => (
                                      <TableHead key={quote.id} className="text-center">
                                        <div className="flex flex-col items-center gap-2 py-2">
                                          <p className="font-['Inter'] font-semibold text-[#0F172A]">
                                            {quote.supplierName}
                                          </p>
                                          {quote.verified && (
                                            <Badge className="bg-primary/10 text-primary border-primary/20">
                                              <Shield className="h-3 w-3 mr-1" />
                                              Verified
                                            </Badge>
                                          )}
                                        </div>
                                      </TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow className="bg-[#F8FAFC]">
                                    <TableCell className="font-['Inter'] font-semibold text-[#0F172A]">
                                      Price
                                    </TableCell>
                                    {selectedQuoteData.map((quote) => (
                                      <TableCell key={quote.id} className="text-center">
                                        <p className="font-['Inter'] font-bold text-primary" style={{ fontSize: '24px' }}>
                                          £{quote.price.toFixed(2)}
                                        </p>
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-['Inter'] font-medium text-[#0F172A]">
                                      <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-[#F59E0B]" />
                                        Rating
                                      </div>
                                    </TableCell>
                                    {selectedQuoteData.map((quote) => (
                                      <TableCell key={quote.id} className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          <Star className="h-5 w-5 fill-[#F59E0B] text-[#F59E0B]" />
                                          <span className="font-['Roboto'] font-semibold text-[#0F172A]">
                                            {quote.rating}
                                          </span>
                                        </div>
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                  <TableRow className="bg-[#F8FAFC]">
                                    <TableCell className="font-['Inter'] font-medium text-[#0F172A]">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-[#64748B]" />
                                        Distance
                                      </div>
                                    </TableCell>
                                    {selectedQuoteData.map((quote) => (
                                      <TableCell key={quote.id} className="text-center font-['Roboto'] text-[#0F172A]">
                                        {quote.distance} miles
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-['Inter'] font-medium text-[#0F172A]">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-[#64748B]" />
                                        ETA
                                      </div>
                                    </TableCell>
                                    {selectedQuoteData.map((quote) => (
                                      <TableCell key={quote.id} className="text-center font-['Roboto'] text-[#0F172A]">
                                        {quote.eta}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                  <TableRow className="bg-[#F8FAFC]">
                                    <TableCell className="font-['Inter'] font-medium text-[#0F172A]">
                                      Part Condition
                                    </TableCell>
                                    {selectedQuoteData.map((quote) => (
                                      <TableCell key={quote.id} className="text-center">
                                        <Badge className="capitalize bg-white border-[#E5E7EB]">
                                          {quote.partCondition}
                                        </Badge>
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-['Inter'] font-medium text-[#0F172A]">
                                      Warranty
                                    </TableCell>
                                    {selectedQuoteData.map((quote) => (
                                      <TableCell key={quote.id} className="text-center font-['Roboto'] text-[#0F172A]">
                                        {quote.warranty || "-"}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                  <TableRow className="bg-[#F8FAFC]">
                                    <TableCell className="font-['Inter'] font-medium text-[#0F172A]">
                                      Verified Supplier
                                    </TableCell>
                                    {selectedQuoteData.map((quote) => (
                                      <TableCell key={quote.id} className="text-center">
                                        {quote.verified ? (
                                          <div className="flex items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
                                              <Check className="h-5 w-5 text-[#22C55E]" />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                                              <X className="h-5 w-5 text-[#64748B]" />
                                            </div>
                                          </div>
                                        )}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-['Inter'] font-semibold text-[#0F172A]">
                                      Action
                                    </TableCell>
                                    {selectedQuoteData.map((quote) => (
                                      <TableCell key={quote.id} className="text-center py-4">
                                        <Button
                                          onClick={() => onNavigate("chat", quote.supplierId)}
                                          className="w-full bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30"
                                        >
                                          Accept Quote
                                        </Button>
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quotes Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  variant={viewMode}
                  onAccept={() => {
                    // Generate order confirmation number
                    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
                    setOrderDetails({
                      supplierName: quote.supplierName,
                      partName: "Front Brake Disc & Pad Set", // In real app, would come from quote data
                      price: quote.price,
                      eta: quote.eta,
                      orderNumber: orderNumber
                    });
                    setOrderDialogOpen(true);
                  }}
                  onMessage={(supplierId) => onNavigate("chat", supplierId)}
                  onViewProfile={(id) => onNavigate("supplier-profile", id)}
                  selected={selectedQuotes.includes(quote.id)}
                  onSelect={handleSelectQuote}
                  showCompare={true}
                  onSupplierClick={handleSupplierClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Placed Dialog */}
      <OrderPlacedDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        orderDetails={orderDetails}
        onNavigate={onNavigate}
        onOrderConfirmed={onOrderConfirmed}
      />

      {/* Supplier Details Dialog */}
      {selectedSupplier && mockSuppliers[selectedSupplier] && (
        <SupplierDetailsDialog
          open={supplierDetailsOpen}
          onOpenChange={setSupplierDetailsOpen}
          supplier={mockSuppliers[selectedSupplier]}
          onMessageClick={() => onNavigate("chat", selectedSupplier)}
        />
      )}
    </div>
  );
}

function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-card rounded-lg border shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}