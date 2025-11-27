import Link from "next/link";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, MapPin, Clock, Shield } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Quote {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierLogo?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  distance: number;
  eta: string;
  warranty?: string;
  partCondition: "new" | "used" | "refurbished";
  deliveryOption: string;
  verified?: boolean;
  partImage?: string;
  serviceLabels?: string[];
}

interface QuoteCardProps {
  quote: Quote;
  variant?: "list" | "grid";
  onAccept?: (quoteId: string) => void;
  onViewProfile?: (supplierId: string) => void;
  selected?: boolean;
  onSelect?: (quoteId: string) => void;
  showCompare?: boolean;
  onSupplierClick?: (supplierId: string) => void;
}

// Default part images based on quote ID for variety
const defaultPartImages = [
  "https://images.unsplash.com/photo-1595444276957-9efea46598d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBicmFrZSUyMHBhZHMlMjBwYXJ0c3xlbnwxfHx8fDE3NTkzMTI2MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NTkzMTAxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1561338800-3aca39ac913e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdXNwZW5zaW9uJTIwcGFydHN8ZW58MXx8fHwxNzU5MzEyNjA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHN8ZW58MXx8fHwxNzU5MjY4NDYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
];

export function QuoteCard({
  quote,
  variant = "list",
  onAccept,
  onViewProfile,
  selected,
  onSelect,
  showCompare,
  onSupplierClick,
}: QuoteCardProps) {
  // Get product image - use provided image or default based on ID
  const partImage =
    quote.partImage ||
    defaultPartImages[parseInt(quote.id) % defaultPartImages.length];

  // Both variants now use the same square card design with grid layout
  return (
    <div
      className={cn(
        "relative bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 group flex flex-col min-h-[520px]",
        selected
          ? "border-primary shadow-[0_8px_32px_rgba(239,68,68,0.2)]"
          : "border-[#E5E7EB]"
      )}
    >
      {/* Product Image */}
      <div className="relative h-36 overflow-hidden bg-[#F8FAFC]">
        <ImageWithFallback
          src={partImage}
          alt="Car part"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80 cursor-pointer"
          onClick={() => onSupplierClick?.(quote.supplierId)}
        ></div>

        {/* Compare Checkbox */}
        {showCompare && (
          <div className="absolute top-2 right-2 z-10">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onSelect?.(quote.id)}
                className="w-4 h-4 rounded border-2 border-[#E5E7EB] bg-white/90 backdrop-blur-sm text-primary focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all"
              />
            </label>
          </div>
        )}

        {/* Part Condition Badge */}
        <div className="absolute top-2 left-2">
          <Badge
            className={cn(
              "capitalize font-['Roboto'] px-2 py-0.5 backdrop-blur-sm",
              quote.partCondition === "new"
                ? "bg-[#22C55E]/90 text-white border-[#22C55E]"
                : quote.partCondition === "refurbished"
                ? "bg-[#F59E0B]/90 text-white border-[#F59E0B]"
                : "bg-white/90 text-[#0F172A] border-white"
            )}
            style={{ fontSize: "10px" }}
          >
            {quote.partCondition}
          </Badge>
        </div>

        {/* Price Badge - Top Right Corner */}
        <div className="absolute bottom-2 right-2">
          <div className="bg-primary/95 backdrop-blur-sm px-2 py-1 rounded-lg border border-primary shadow-lg shadow-primary/40">
            <div className="flex items-baseline gap-1">
              <span
                className="font-['Inter'] font-bold text-white"
                style={{ fontSize: "15px", lineHeight: "1" }}
              >
                £{quote.price.toFixed(2)}
              </span>
              {quote.originalPrice && (
                <span
                  className="font-['Roboto'] text-white/70 line-through"
                  style={{ fontSize: "10px" }}
                >
                  £{quote.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Supplier Header */}
        <div className="flex items-start gap-2 mb-3">
          <div className="h-10 w-10 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
            {quote.supplierLogo ? (
              <img
                src={quote.supplierLogo}
                alt={quote.supplierName}
                className="h-6 w-6 object-contain"
              />
            ) : (
              <span
                className="font-['Inter'] font-semibold text-[#0F172A]"
                style={{ fontSize: "14px" }}
              >
                {quote.supplierName[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3
                className="font-['Inter'] font-semibold text-[#0F172A] truncate"
                style={{ fontSize: "14px", lineHeight: "1.3" }}
              >
                {quote.supplierName}
              </h3>
              {quote.verified && (
                <Badge className="shrink-0 bg-primary/10 text-primary border border-primary/20 px-1.5 py-0 gap-0.5">
                  <Shield className="h-2.5 w-2.5" />
                  <span style={{ fontSize: "10px" }}>Verified</span>
                </Badge>
              )}
            </div>
            <div
              className="flex items-center gap-1.5 text-[#64748B]"
              style={{ fontSize: "12px" }}
            >
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="font-['Roboto'] font-medium text-[#0F172A]">
                  {quote.rating}
                </span>
                <span className="font-['Roboto']">({quote.reviewCount})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                <span className="font-['Roboto']">{quote.distance} mi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Indicator */}
        {quote.originalPrice && (
          <div className="mb-2 px-2 py-1 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg">
            <p
              className="font-['Roboto'] text-[#22C55E] font-medium"
              style={{ fontSize: "11px" }}
            >
              💰 Save £{(quote.originalPrice - quote.price).toFixed(2)}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-1.5 mb-3 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#64748B]" />
            <span
              className="font-['Roboto'] text-[#64748B]"
              style={{ fontSize: "12px" }}
            >
              Delivery:{" "}
              <span className="font-medium text-[#0F172A]">{quote.eta}</span>
            </span>
          </div>
          {quote.warranty && (
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#22C55E]" />
              <span
                className="font-['Roboto'] text-[#64748B]"
                style={{ fontSize: "12px" }}
              >
                Warranty:{" "}
                <span className="font-medium text-[#22C55E]">
                  {quote.warranty}
                </span>
              </span>
            </div>
          )}
          <p
            className="font-['Roboto'] text-[#64748B]"
            style={{ fontSize: "11px" }}
          >
            {quote.deliveryOption}
          </p>
          {quote.serviceLabels && quote.serviceLabels.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {quote.serviceLabels.map((service) => (
                <Badge
                  key={service}
                  className="bg-[#F1F5F9] text-[#0F172A] border border-[#E5E7EB] px-2 py-0.5 font-['Roboto']"
                  style={{ fontSize: "10px" }}
                >
                  {service}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-9 border-2 border-primary text-primary hover:bg-primary hover:text-white font-['Roboto'] font-semibold rounded-full transition-all hover:scale-[1.02] group flex items-center justify-center whitespace-nowrap"
              style={{ fontSize: "13px" }}
              asChild
            >
              <Link href={`/user/chat?supplier=${quote.supplierId}&quote=${quote.id}`}>
                Message
              </Link>
            </Button>
            <Button
              className="flex-1 h-9 bg-primary hover:bg-primary-hover text-white font-['Roboto'] font-semibold rounded-full shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 transition-all hover:scale-[1.02] group flex items-center justify-center whitespace-nowrap"
              onClick={() => onAccept?.(quote.id)}
              style={{ fontSize: "13px" }}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
