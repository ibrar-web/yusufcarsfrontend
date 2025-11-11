import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { User, Building2, Shield } from "lucide-react";
interface RoleSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRole: (role: "user" | "supplier" | "admin") => void;
  onNavigate?: (page: string) => void;
}

export function RoleSelectionDialog({
  open,
  onOpenChange,
  onSelectRole,
}: RoleSelectionDialogProps) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[420px] bg-[#0F172A] border-[#334155]">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-xl text-white">
              Who are you?
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#94A3B8]">
              Choose your role to get started with PartsQuote
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-2">
            {/* User Option */}
            <button
              onClick={() => {
                onSelectRole("user");
                onOpenChange(false);
              }}
              className="group relative overflow-hidden rounded-lg border border-[#334155] bg-[#1E293B] p-4 text-left transition-all hover:border-[#F02801] hover:bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F02801] focus:ring-offset-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F172A] group-hover:bg-[#F02801] transition-all">
                  <User
                    className="h-5 w-5 text-[#94A3B8] group-hover:text-white transition-all"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Inter'] text-white text-sm mb-0.5">
                    I'm a User
                  </h3>
                  <p className="text-xs font-['Roboto'] text-[#94A3B8]">
                    Get quotes for car parts from verified suppliers
                  </p>
                </div>
              </div>
            </button>

            {/* Supplier Option */}
            <button
              onClick={() => {
                onOpenChange(false);
                onSelectRole("supplier");
              }}
              className="group relative overflow-hidden rounded-lg border border-[#334155] bg-[#1E293B] p-4 text-left transition-all hover:border-[#F02801] hover:bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F02801] focus:ring-offset-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F172A] group-hover:bg-[#F02801] transition-all">
                  <Building2
                    className="h-5 w-5 text-[#94A3B8] group-hover:text-white transition-all"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Inter'] text-white text-sm mb-0.5">
                    I'm a Supplier
                  </h3>
                  <p className="text-xs font-['Roboto'] text-[#94A3B8]">
                    Join our marketplace and connect with customers
                  </p>
                </div>
              </div>
            </button>

            {/* Admin Option */}
            <button
              onClick={() => {
                onSelectRole("admin");
                onOpenChange(false);
              }}
              className="group relative overflow-hidden rounded-lg border border-[#334155] bg-[#1E293B] p-4 text-left transition-all hover:border-[#F02801] hover:bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#F02801] focus:ring-offset-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F172A] group-hover:bg-[#F02801] transition-all">
                  <Shield
                    className="h-5 w-5 text-[#94A3B8] group-hover:text-white transition-all"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Inter'] text-white text-sm mb-0.5">
                    I'm an Admin
                  </h3>
                  <p className="text-xs font-['Roboto'] text-[#94A3B8]">
                    Manage the platform, suppliers, and user accounts
                  </p>
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
