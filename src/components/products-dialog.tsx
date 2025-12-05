import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Search, X, Package, Truck, BadgeCheck, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestPart: (product: any) => void;
}

const products = [
  {
    id: "1",
    name: "Front Brake Disc & Pad Set",
    category: "brakes",
    price: 85.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1758563920433-027318cc48a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBicmFrZSUyMHN5c3RlbXxlbnwxfHx8fDE3NTkyMTg4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "2",
    name: "Engine Oil Filter Kit",
    category: "engine",
    price: 24.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1734530901192-4b7217b00724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMGVuZ2luZXxlbnwxfHx8fDE3NTkxNDkwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    inStock: true,
  },
  {
    id: "3",
    name: "Shock Absorber Set",
    category: "suspension",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1669136048337-5daa3adef7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdXNwZW5zaW9ufGVufDF8fHx8MTc1OTIxODgwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "4",
    name: "Headlight Assembly",
    category: "electrical",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHN8ZW58MXx8fHwxNzU5MTY0MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    inStock: true,
  },
  {
    id: "5",
    name: "Timing Belt Kit",
    category: "engine",
    price: 65.00,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1734530901192-4b7217b00724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMGVuZ2luZXxlbnwxfHx8fDE3NTkxNDkwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "6",
    name: "Air Filter Element",
    category: "engine",
    price: 18.50,
    originalPrice: 25.99,
    image: "https://images.unsplash.com/photo-1734530901192-4b7217b00724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMGVuZ2luZXxlbnwxfHx8fDE3NTkxNDkwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "7",
    name: "Rear Brake Pads",
    category: "brakes",
    price: 45.00,
    originalPrice: 62.99,
    image: "https://images.unsplash.com/photo-1758563920433-027318cc48a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBicmFrZSUyMHN5c3RlbXxlbnwxfHx8fDE3NTkyMTg4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "8",
    name: "Coil Spring Set",
    category: "suspension",
    price: 120.00,
    originalPrice: 160.00,
    image: "https://images.unsplash.com/photo-1669136048337-5daa3adef7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzdXNwZW5zaW9ufGVufDF8fHx8MTc1OTIxODgwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    inStock: false,
  },
];

export function ProductsDialog({ open, onOpenChange, onRequestPart }: ProductsDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRequestQuote = (product: any) => {
    toast.success(`Added ${product.name} to your request`);
    onRequestPart(product);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-screen max-h-[90vh] p-0 gap-0">
        {/* Accessible Dialog Header (for screen readers) */}
        <DialogHeader className="sr-only">
          <DialogTitle>Browse All Parts</DialogTitle>
          <DialogDescription>
            Find the perfect parts for your vehicle. Search and filter through our catalog of car parts.
          </DialogDescription>
        </DialogHeader>

        {/* Visual Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] px-6 py-4 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex-shrink-0">
              <h2 className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: "24px" }}>
                Browse All Parts
              </h2>
              <p className="font-['Roboto'] text-[#64748B] mt-1" style={{ fontSize: "14px" }}>
                Find the perfect parts for your vehicle
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 w-full sm:w-auto sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  type="text"
                  placeholder="Search parts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                />
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="h-10 w-10 rounded-full p-0 flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
          <div className="px-6 py-6">
            <div className="w-full">
              {/* Products Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "14px" }}>
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border-2 border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#F02801] hover:shadow-lg transition-all duration-300 group"
                    >
                      {/* Product Image */}
                      <div className="relative h-40 overflow-hidden bg-[#F1F5F9]">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge className="bg-white text-[#0F172A] font-semibold">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                        {product.originalPrice > product.price && (
                          <Badge className="absolute top-3 right-3 bg-[#F02801] text-white font-semibold">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: "15px" }}>
                          {product.name}
                        </h4>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-[#F59E0B] fill-current"
                                    : "text-[#E5E7EB] fill-current"
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "13px" }}>
                            {product.rating}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: "20px" }}>
                            £{product.price.toFixed(2)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="font-['Roboto'] text-[#94A3B8] line-through" style={{ fontSize: "13px" }}>
                              £{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Request Quote Button */}
                        <Button
                          onClick={() => handleRequestQuote(product)}
                          disabled={!product.inStock}
                          className="w-full h-10 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontSize: "13px" }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Request Quote
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <Package className="h-16 w-16 text-[#E5E7EB] mx-auto mb-4" />
                    <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: "20px" }}>
                      No products found
                    </h3>
                    <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "15px" }}>
                      Try adjusting your search or category filter
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
