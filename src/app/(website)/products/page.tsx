"use client";

import { useCallback, useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, ShoppingCart, Package, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { vehicle_product } from "@/data/vehicle-products";
import { useAppState } from "@/hooks/use-app-state";

// Category filter options
const categories = [
  { id: "all", name: "All", icon: Package },
  { id: "brakes", name: "Brakes", icon: Package },
  { id: "engine", name: "Engine", icon: Package },
  { id: "suspension", name: "Suspension", icon: Package },
  { id: "electrical", name: "Electrical", icon: Package },
];

export default function ProductsPage() {
  const {
    handleNavigate,
    handleBack,
    openSignupDialog,
    isAuthenticated,
    vehicleData,
    selectedCategory: globalCategory,
    setSelectedCategory: persistSelectedCategory,
  } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    globalCategory || "all"
  );
  const [requestSuccessDialogOpen, setRequestSuccessDialogOpen] =
    useState(false);
  const [requestedProduct, setRequestedProduct] = useState<any>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [quoteConfirmDialogOpen, setQuoteConfirmDialogOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(globalCategory || "all");
  }, [globalCategory]);

  const ensureVehicleSelected = useCallback(() => {
    if (!vehicleData) {
      toast.error("Please select your vehicle before browsing parts.");
      handleNavigate("home");
      return false;
    }
    return true;
  }, [vehicleData, handleNavigate]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    persistSelectedCategory(categoryId === "all" ? null : categoryId);
  };

  const filteredProducts = vehicle_product.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <section className="bg-white border-b border-[#E5E7EB] pt-24 pb-8">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton
              onBack={handleBack || (() => handleNavigate("home"))}
              label="Back"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Title */}
            <div>
              <h1
                className="font-['Inter'] font-bold text-[#0F172A]"
                style={{ fontSize: "40px", lineHeight: 1.2 }}
              >
                Browse All Parts
              </h1>
              <p
                className="font-['Roboto'] text-[#64748B] mt-2"
                style={{ fontSize: "18px", lineHeight: 1.6 }}
              >
                Find the perfect parts for your vehicle
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full sm:w-auto sm:min-w-[400px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  type="text"
                  placeholder="Search parts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto'] bg-white"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Category Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`group flex items-center gap-2 px-5 py-2.5 rounded-full font-['Roboto'] font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-[#F02801] text-white shadow-lg shadow-[#F02801]/30"
                      : "bg-white text-[#64748B] border-2 border-[#E5E7EB] hover:border-[#F02801] hover:text-[#F02801]"
                  }`}
                  style={{ fontSize: "14px" }}
                >
                  <category.icon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      selectedCategory === category.id
                        ? ""
                        : "group-hover:scale-110"
                    }`}
                  />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p
              className="font-['Roboto'] text-[#64748B]"
              style={{ fontSize: "16px" }}
            >
              Showing{" "}
              <span className="font-semibold text-[#0F172A]">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
              {selectedCategory !== "all" && (
                <span className="ml-2">
                  in{" "}
                  <span className="font-semibold text-[#F02801]">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  if (!ensureVehicleSelected()) {
                    return;
                  }
                  setSelectedProduct(product);
                  setProductDetailOpen(true);
                }}
                className="bg-white border-2 border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#F02801] hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden bg-[#F1F5F9]">
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
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  {/* Category */}
                  <Badge className="bg-[#F1F5F9] text-[#64748B] mb-2">
                    {product.category}
                  </Badge>

                  <h3
                    className="font-['Inter'] font-semibold text-[#0F172A] mb-4"
                    style={{ fontSize: "16px", lineHeight: 1.3 }}
                  >
                    {product.name}
                  </h3>

                  {/* Request Quote Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!ensureVehicleSelected()) {
                        return;
                      }
                      setRequestedProduct(product);
                      if (isAuthenticated) {
                        setQuoteConfirmDialogOpen(true);
                      } else {
                        openSignupDialog();
                      }
                    }}
                    disabled={!product.inStock}
                    className="w-full h-11 rounded-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ fontSize: "14px" }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Request Quote
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <Package className="h-20 w-20 text-[#E5E7EB] mx-auto mb-4" />
              <h3
                className="font-['Inter'] font-semibold text-[#0F172A] mb-2"
                style={{ fontSize: "24px" }}
              >
                No products found
              </h3>
              <p
                className="font-['Roboto'] text-[#64748B]"
                style={{ fontSize: "16px" }}
              >
                Try adjusting your search query
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer onNavigate={handleNavigate} />

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle
              className="font-['Inter'] text-[#0F172A]"
              style={{ fontSize: "24px" }}
            >
              Add to Basket
            </DialogTitle>
            <DialogDescription
              className="font-['Roboto'] text-[#64748B]"
              style={{ fontSize: "15px" }}
            >
              Confirm you want to add this part to your request
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="mt-6">
              {/* Product Details */}
              <div className="flex gap-4 mb-6">
                {/* Product Image */}
                <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-[#F1F5F9] border-2 border-[#E5E7EB]">
                  <ImageWithFallback
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <Badge className="bg-[#F1F5F9] text-[#64748B] mb-2">
                    {selectedProduct.category}
                  </Badge>
                  <h3
                    className="font-['Inter'] font-semibold text-[#0F172A] mb-2"
                    style={{ fontSize: "18px", lineHeight: 1.3 }}
                  >
                    {selectedProduct.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedProduct.rating)
                              ? "text-[#F59E0B] fill-current"
                              : "text-[#E5E7EB] fill-current"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span
                      className="font-['Roboto'] text-[#64748B]"
                      style={{ fontSize: "13px" }}
                    >
                      {selectedProduct.rating}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-['Inter'] font-bold text-[#0F172A]"
                      style={{ fontSize: "24px" }}
                    >
                      £{selectedProduct.price.toFixed(2)}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span
                        className="font-['Roboto'] text-[#94A3B8] line-through"
                        style={{ fontSize: "14px" }}
                      >
                        £{selectedProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Confirmation Message */}
              <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#F02801] flex-shrink-0 mt-0.5" />
                  <div>
                    <p
                      className="font-['Roboto'] font-medium text-[#0F172A]"
                      style={{ fontSize: "14px" }}
                    >
                      Ready to request quotes?
                    </p>
                    <p
                      className="font-['Roboto'] text-[#64748B] mt-1"
                      style={{ fontSize: "13px" }}
                    >
                      Add this part to your basket and we'll help you find the
                      best suppliers with competitive quotes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDialogOpen(false)}
                  className="flex-1 h-12 rounded-xl border-2 border-[#E5E7EB] hover:border-[#94A3B8] font-['Roboto'] font-medium"
                  style={{ fontSize: "15px" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleNavigate("chat");
                    toast.success(
                      "Order placed! Contact the supplier for details."
                    );
                  }}
                  className="flex-1 h-12 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
                  style={{ fontSize: "15px" }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quote Request Confirmation Dialog */}
      <Dialog
        open={quoteConfirmDialogOpen}
        onOpenChange={setQuoteConfirmDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle
              className="font-['Inter'] text-[#0F172A]"
              style={{ fontSize: "24px" }}
            >
              Confirm Quote Request
            </DialogTitle>
            <DialogDescription
              className="font-['Roboto'] text-[#64748B]"
              style={{ fontSize: "15px" }}
            >
              Are you sure you want to request a quote for this part?
            </DialogDescription>
          </DialogHeader>

          {requestedProduct && (
            <div className="mt-6">
              {/* Product Details */}
              <div className="flex gap-4 mb-6">
                {/* Product Image */}
                <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-[#F1F5F9] border-2 border-[#E5E7EB]">
                  <ImageWithFallback
                    src={requestedProduct.image}
                    alt={requestedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <Badge className="bg-[#F1F5F9] text-[#64748B] mb-2">
                    {requestedProduct.category}
                  </Badge>
                  <h3
                    className="font-['Inter'] font-semibold text-[#0F172A] mb-2"
                    style={{ fontSize: "18px", lineHeight: 1.3 }}
                  >
                    {requestedProduct.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(requestedProduct.rating)
                              ? "text-[#F59E0B] fill-current"
                              : "text-[#E5E7EB] fill-current"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span
                      className="font-['Roboto'] text-[#64748B]"
                      style={{ fontSize: "13px" }}
                    >
                      {requestedProduct.rating}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-['Inter'] font-bold text-[#0F172A]"
                      style={{ fontSize: "24px" }}
                    >
                      £{requestedProduct.price.toFixed(2)}
                    </span>
                    {requestedProduct.originalPrice >
                      requestedProduct.price && (
                      <span
                        className="font-['Roboto'] text-[#94A3B8] line-through"
                        style={{ fontSize: "14px" }}
                      >
                        £{requestedProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Message */}
              <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <ShoppingCart className="h-5 w-5 text-[#F02801] flex-shrink-0 mt-0.5" />
                  <div>
                    <p
                      className="font-['Roboto'] font-medium text-[#0F172A]"
                      style={{ fontSize: "14px" }}
                    >
                      Quote Request
                    </p>
                    <p
                      className="font-['Roboto'] text-[#64748B] mt-1"
                      style={{ fontSize: "13px" }}
                    >
                      Your request will be sent to multiple verified suppliers
                      who will provide competitive quotes within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setQuoteConfirmDialogOpen(false)}
                  className="flex-1 h-12 rounded-xl border-2 border-[#E5E7EB] hover:border-[#94A3B8] font-['Roboto'] font-medium"
                  style={{ fontSize: "15px" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setQuoteConfirmDialogOpen(false);
                    setRequestSuccessDialogOpen(true);
                  }}
                  className="flex-1 h-12 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
                  style={{ fontSize: "15px" }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Confirm Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Success Dialog */}
      <Dialog
        open={requestSuccessDialogOpen}
        onOpenChange={setRequestSuccessDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex flex-col items-center text-center mb-4">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-[#22C55E]/10 border-2 border-[#22C55E] flex items-center justify-center mb-4 animate-scale-in">
                <CheckCircle
                  className="h-10 w-10 text-[#22C55E]"
                  strokeWidth={2.5}
                />
              </div>

              <DialogTitle
                className="font-['Inter'] font-bold text-[#0F172A] mb-2"
                style={{ fontSize: "28px" }}
              >
                Request Sent Successfully!
              </DialogTitle>

              <DialogDescription
                className="font-['Roboto'] text-[#64748B]"
                style={{ fontSize: "16px", lineHeight: 1.6 }}
              >
                Your quote request for{" "}
                <span className="font-semibold text-[#0F172A]">
                  {requestedProduct?.name}
                </span>{" "}
                has been sent to our verified suppliers.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {/* What Happens Next */}
            <div className="bg-[#F8FAFC] border-2 border-[#E5E7EB] rounded-xl p-5">
              <h4
                className="font-['Inter'] font-semibold text-[#0F172A] mb-3"
                style={{ fontSize: "16px" }}
              >
                What happens next?
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <span
                    className="font-['Roboto'] text-[#64748B]"
                    style={{ fontSize: "14px", lineHeight: 1.6 }}
                  >
                    Multiple verified suppliers will review your request
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <span
                    className="font-['Roboto'] text-[#64748B]"
                    style={{ fontSize: "14px", lineHeight: 1.6 }}
                  >
                    You'll receive competitive quotes within 24 hours
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <span
                    className="font-['Roboto'] text-[#64748B]"
                    style={{ fontSize: "14px", lineHeight: 1.6 }}
                  >
                    Compare prices, ratings, and delivery times
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <span
                    className="font-['Roboto'] text-[#64748B]"
                    style={{ fontSize: "14px", lineHeight: 1.6 }}
                  >
                    Choose the best supplier and complete your purchase
                  </span>
                </li>
              </ul>
            </div>

            {/* Request ID */}
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg">
              <Package className="h-4 w-4 text-[#F02801]" />
              <span
                className="font-['Roboto'] text-[#64748B]"
                style={{ fontSize: "13px" }}
              >
                Request ID:{" "}
                <span className="font-semibold text-[#F02801]">
                  #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={() => {
                setRequestSuccessDialogOpen(false);
                if (!isAuthenticated) {
                  openSignupDialog();
                } else {
                  handleNavigate("vehicle-confirmation");
                }
              }}
              className="flex-1 h-12 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
              style={{ fontSize: "15px" }}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog */}
      <Dialog open={productDetailOpen} onOpenChange={setProductDetailOpen}>
        <DialogContent className="sm:max-w-[450px]">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle
                  className="font-['Inter'] text-[#0F172A]"
                  style={{ fontSize: "20px" }}
                >
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription
                  className="font-['Roboto'] text-[#64748B]"
                  style={{ fontSize: "13px" }}
                >
                  Review details and request a quote
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3 space-y-2.5">
                {/* Product Image */}
                <div className="relative h-36 rounded-lg overflow-hidden bg-[#F1F5F9]">
                  <ImageWithFallback
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <Badge
                      className="absolute top-2 right-2 bg-[#F02801] text-white"
                      style={{ fontSize: "10px" }}
                    >
                      -
                      {Math.round(
                        ((selectedProduct.originalPrice -
                          selectedProduct.price) /
                          selectedProduct.originalPrice) *
                          100
                      )}
                      % OFF
                    </Badge>
                  )}
                </div>

                {/* Category & Features */}
                <div className="space-y-2">
                  <Badge
                    className="bg-[#F1F5F9] text-[#64748B]"
                    style={{ fontSize: "11px" }}
                  >
                    {selectedProduct.category}
                  </Badge>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      "OEM quality",
                      "12-mo warranty",
                      "Multi-vehicle",
                      "Easy install",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle className="h-3 w-3 text-[#22C55E] flex-shrink-0" />
                        <span
                          className="font-['Roboto'] text-[#64748B]"
                          style={{ fontSize: "11px" }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Stock Status */}
                  <div
                    className={`p-2 rounded-lg ${
                      selectedProduct.inStock
                        ? "bg-[#F0FDF4] border border-[#86EFAC]"
                        : "bg-[#FEF2F2] border border-[#FECACA]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {selectedProduct.inStock ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-[#22C55E]" />
                          <span
                            className="font-['Roboto'] font-medium text-[#166534]"
                            style={{ fontSize: "12px" }}
                          >
                            In Stock
                          </span>
                        </>
                      ) : (
                        <>
                          <Package className="h-3.5 w-3.5 text-[#F02801]" />
                          <span
                            className="font-['Roboto'] font-medium text-[#991B1B]"
                            style={{ fontSize: "12px" }}
                          >
                            Out of Stock
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
                  <Button
                    variant="outline"
                    onClick={() => setProductDetailOpen(false)}
                    className="flex-1 h-9 rounded-lg border-2 border-[#E5E7EB] hover:border-[#94A3B8] font-['Roboto'] font-medium"
                    style={{ fontSize: "13px" }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      if (!ensureVehicleSelected()) {
                        return;
                      }
                      setProductDetailOpen(false);
                      setRequestedProduct(selectedProduct);
                      if (isAuthenticated) {
                        setRequestSuccessDialogOpen(true);
                      } else {
                        openSignupDialog();
                      }
                    }}
                    disabled={!selectedProduct.inStock}
                    className="flex-1 h-9 rounded-lg bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30 disabled:opacity-50 cursor-pointer"
                    style={{ fontSize: "13px" }}
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
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
