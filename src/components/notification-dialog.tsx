import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, CheckCircle } from "lucide-react";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteNotifications: {
    productName: string;
    productImage: string;
    quotes: Array<{
      id: string;
      supplierName: string;
      price: number;
      eta: string;
    }>;
  } | null;
  onNavigate: (page: string) => void;
}

export function NotificationDialog({
  open,
  onOpenChange,
  quoteNotifications,
  onNavigate,
}: NotificationDialogProps) {
  if (!quoteNotifications) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-[#22C55E]" />
            </div>
            <div>
              <DialogTitle className="font-['Inter'] text-[#0F172A]" style={{ fontSize: "20px" }}>
                Request Sent Successfully!
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "14px" }}>
            Suppliers are preparing quotes for your request
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
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
                  onOpenChange(false);
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
              onOpenChange(false);
              onNavigate("quotes");
            }}
            className="w-full h-10 rounded-lg bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
            style={{ fontSize: "14px" }}
          >
            View All Quotes
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
