import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SupplierContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: {
    name: string;
    logo: string;
    phone?: string;
    email?: string;
    location: string;
    address?: string;
  };
}

export function SupplierContactDialog({
  open,
  onOpenChange,
  supplier,
}: SupplierContactDialogProps) {
  const handleCallClick = () => {
    if (supplier.phone) {
      window.location.href = `tel:${supplier.phone}`;
    }
  };

  const handleEmailClick = () => {
    if (supplier.email) {
      window.location.href = `mailto:${supplier.email}`;
    }
  };

  const handleLocationClick = () => {
    const address = supplier.address || supplier.location;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="font-['Inter'] text-slate-900" style={{ fontSize: "24px" }}>
            Contact Information
          </DialogTitle>
          <DialogDescription className="font-['Roboto'] text-slate-600 text-[15px]">
            Get in touch with {supplier.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Supplier Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border-2 border-slate-200 flex-shrink-0">
              <ImageWithFallback
                src={supplier.logo}
                alt={supplier.name}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <h3 className="font-['Inter'] text-slate-900" style={{ fontSize: "18px" }}>
                {supplier.name}
              </h3>
              <p className="font-['Roboto'] text-slate-600 text-[14px]">
                Verified Supplier
              </p>
            </div>
          </div>

          <Separator className="bg-slate-200" />

          {/* Contact Details */}
          <div className="space-y-3">
            {/* Phone */}
            {supplier.phone && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#F02801]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="h-5 w-5 text-[#F02801]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Roboto'] text-slate-600 text-[12px] mb-1">
                        Phone Number
                      </p>
                      <p className="font-['Roboto'] text-slate-900 text-[15px]">
                        {supplier.phone}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleCallClick}
                    size="sm"
                    className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-lg h-9 px-4"
                    style={{ fontSize: "14px" }}
                  >
                    Call
                  </Button>
                </div>
              </div>
            )}

            {/* Email */}
            {supplier.email && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#F02801]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="h-5 w-5 text-[#F02801]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Roboto'] text-slate-600 text-[12px] mb-1">
                        Email Address
                      </p>
                      <p className="font-['Roboto'] text-slate-900 text-[15px] break-all">
                        {supplier.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleEmailClick}
                    size="sm"
                    variant="outline"
                    className="border-2 border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50 font-['Roboto'] rounded-lg h-9 px-4"
                    style={{ fontSize: "14px" }}
                  >
                    Email
                  </Button>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#F02801]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5 text-[#F02801]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Roboto'] text-slate-600 text-[12px] mb-1">
                      Location
                    </p>
                    <p className="font-['Roboto'] text-slate-900 text-[15px]">
                      {supplier.address || supplier.location}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleLocationClick}
                  size="sm"
                  variant="outline"
                  className="border-2 border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50 font-['Roboto'] rounded-lg h-9 px-4"
                  style={{ fontSize: "14px" }}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Map
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border-2 border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50 font-['Roboto'] rounded-xl h-11 px-6"
            style={{ fontSize: "15px" }}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
