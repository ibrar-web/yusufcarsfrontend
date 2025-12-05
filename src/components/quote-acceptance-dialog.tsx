import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  CheckCircle,
  Package,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface QuoteAcceptanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: {
    name: string;
    logo: string;
    location: string;
    deliveryTime?: string;
  };
  quote?: {
    partName: string;
    price: number;
    deliveryTime: string;
    warranty?: string;
  };
  onConfirm: () => void;
}

export function QuoteAcceptanceDialog({
  open,
  onOpenChange,
  supplier,
  quote,
  onConfirm,
}: QuoteAcceptanceDialogProps) {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleConfirm = () => {
    if (acceptedTerms) {
      onConfirm();
      onOpenChange(false);
    }
  };

  // Default quote data if not provided
  const quoteData = quote || {
    partName: "Front Brake Pads Set",
    price: 85.99,
    deliveryTime: "2-3 working days",
    warranty: "12 months",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 bg-[#111827] border-[#374151]">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 md:p-8">
            {/* Hidden Dialog Description for Accessibility */}
            <DialogDescription className="sr-only">
              Review and confirm your quote acceptance from {supplier.name}
            </DialogDescription>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-[#22C55E]" />
              </div>
              <DialogTitle className="font-['Inter'] text-white mb-2" style={{ fontSize: "28px" }}>
                Accept Quote
              </DialogTitle>
              <p className="font-['Roboto'] text-gray-400 text-[15px]">
                Review the details before confirming your order
              </p>
            </div>

            <Separator className="my-6 bg-[#374151]" />

            {/* Quote Summary */}
            <div className="mb-6">
              <h3 className="font-['Inter'] text-white mb-4" style={{ fontSize: "18px" }}>
                Quote Summary
              </h3>
              
              <div className="bg-[#1F2937] rounded-xl p-5 border border-[#374151] space-y-4">
                {/* Part Details */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#F02801]/20 flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-[#F02801]" />
                    </div>
                    <div>
                      <p className="font-['Inter'] text-white text-[16px] mb-1">
                        {quoteData.partName}
                      </p>
                      <p className="font-['Roboto'] text-gray-400 text-[13px]">
                        From {supplier.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-['Inter'] text-white" style={{ fontSize: "20px" }}>
                      £{quoteData.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Separator className="bg-[#374151]" />

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#F02801]" />
                    <div>
                      <p className="font-['Roboto'] text-gray-400 text-[12px]">Delivery</p>
                      <p className="font-['Roboto'] text-white text-[14px]">{quoteData.deliveryTime}</p>
                    </div>
                  </div>

                  {quoteData.warranty && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#F02801]" />
                      <div>
                        <p className="font-['Roboto'] text-gray-400 text-[12px]">Warranty</p>
                        <p className="font-['Roboto'] text-white text-[14px]">{quoteData.warranty}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#F02801]" />
                    <div>
                      <p className="font-['Roboto'] text-gray-400 text-[12px]">Supplier Location</p>
                      <p className="font-['Roboto'] text-white text-[14px]">{supplier.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-6">
              <Label htmlFor="delivery-address" className="font-['Roboto'] text-white text-[14px] mb-2 block">
                Delivery Address
              </Label>
              <Input
                id="delivery-address"
                placeholder="Enter your full delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="h-11 bg-[#1F2937] border-[#374151] text-white placeholder:text-gray-500 font-['Roboto'] text-[15px] focus:border-[#F02801] focus:ring-[#F02801]"
              />
            </div>

            {/* Additional Notes */}
            <div className="mb-6">
              <Label htmlFor="notes" className="font-['Roboto'] text-white text-[14px] mb-2 block">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any special delivery instructions or requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="bg-[#1F2937] border-[#374151] text-white placeholder:text-gray-500 font-['Roboto'] text-[15px] focus:border-[#F02801] focus:ring-[#F02801] resize-none"
              />
            </div>

            {/* Payment Information */}
            <div className="mb-6">
              <div className="bg-[#1F2937] rounded-xl p-4 border border-[#374151]">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-[#F02801] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-['Inter'] text-white text-[15px] mb-1">Payment Method</p>
                    <p className="font-['Roboto'] text-gray-400 text-[13px]">
                      Payment will be processed securely after supplier confirms availability
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-6">
              <div className="bg-[#1F2937] rounded-xl p-4 border border-[#374151]">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#374151] bg-[#111827] text-[#F02801] focus:ring-[#F02801] focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="terms" className="font-['Roboto'] text-gray-300 text-[14px] leading-relaxed cursor-pointer">
                    I agree to the <span className="text-[#F02801]">terms and conditions</span> and understand that by accepting this quote, I'm entering into an agreement with the supplier. The supplier will confirm availability before payment is processed.
                  </label>
                </div>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="mb-6">
              <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-['Inter'] text-[#F59E0B] text-[14px] mb-1">
                      Important Information
                    </p>
                    <p className="font-['Roboto'] text-gray-300 text-[13px] leading-relaxed">
                      Once accepted, the supplier will be notified and will confirm part availability. You can track your order progress in the notifications section.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 rounded-xl border-2 border-[#374151] hover:border-[#4B5563] font-['Roboto'] font-medium bg-transparent text-white hover:bg-[#1F2937]"
                style={{ fontSize: "15px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!acceptedTerms}
                className="flex-1 h-12 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#F02801]"
                style={{ fontSize: "15px" }}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Confirm Order
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
