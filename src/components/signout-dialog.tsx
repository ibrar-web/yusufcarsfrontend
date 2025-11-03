import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { LogOut, AlertCircle } from "lucide-react";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function SignOutDialog({
  open,
  onOpenChange,
  onConfirm,
}: SignOutDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-white border-[#E5E7EB]">
        <DialogHeader>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="h-16 w-16 rounded-full bg-[#F02801]/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-[#F02801]" />
            </div>
            <DialogTitle className="font-['Inter'] text-[#0F172A]" style={{ fontSize: "24px" }}>
              Sign Out?
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569] mt-2" style={{ fontSize: "15px" }}>
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info Box */}
          <div className="bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl p-4">
            <p className="font-['Roboto'] text-[#475569] text-center" style={{ fontSize: "14px" }}>
              You'll need to sign in again to access your quotes, orders, and messages.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 rounded-xl font-['Roboto'] border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]"
              style={{ fontSize: "14px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 h-11 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300"
              style={{ fontSize: "14px" }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
