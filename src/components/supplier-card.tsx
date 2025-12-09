import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Star, MapPin, Check, Clock } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  distance: number;
  verified?: boolean;
  responseTime?: string;
  specialties?: string[];
}

interface SupplierCardProps {
  supplier: Supplier;
  variant?: "compact" | "full";
  onViewProfile?: (supplierId: string) => void;
  onRequestQuote?: (supplierId: string) => void;
}

export function SupplierCard({
  supplier,
  variant = "compact",
  onViewProfile,
  onRequestQuote
}: SupplierCardProps) {
  if (variant === "full") {
    return (
      <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex gap-4 mb-4">
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
              {supplier.logo ? (
                <img src={supplier.logo} alt={supplier.name} className="h-12 w-12 object-contain" />
              ) : (
                <span className="font-semibold text-2xl">{supplier.name[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{supplier.name}</h3>
                {supplier.verified && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span>{supplier.rating}</span>
                  <span>({supplier.reviewCount})</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{supplier.distance} miles away</span>
                </div>
              </div>
              {supplier.responseTime && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Usually responds in {supplier.responseTime}</span>
                </div>
              )}
            </div>
          </div>

          {supplier.specialties && supplier.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {supplier.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="border-border">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewProfile?.(supplier.id)}
            >
              View Profile
            </Button>
            <Button
              className="flex-1"
              onClick={() => onRequestQuote?.(supplier.id)}
            >
              Request Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {supplier.logo ? (
          <img src={supplier.logo} alt={supplier.name} className="h-8 w-8 object-contain" />
        ) : (
          <span className="font-semibold text-lg">{supplier.name[0]}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate">{supplier.name}</h4>
          {supplier.verified && (
            <Check className="h-4 w-4 text-primary shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span>{supplier.rating}</span>
          </div>
          <span>•</span>
          <span>{supplier.distance} miles</span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onViewProfile?.(supplier.id)}
      >
        View
      </Button>
    </div>
  );
}
