import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Shield, Mail, Lock, Key } from "lucide-react";
import { cn } from "../ui/utils";
import { authApi } from "@/utils/api/auth";
import { toast } from "sonner";

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z"
      fill="#4285F4"
    />
    <path
      d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
      fill="#34A853"
    />
    <path
      d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
      fill="#EA4335"
    />
  </svg>
);

interface AdminSignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminSignInDialog({
  open,
  onOpenChange,
  onSuccess,
}: AdminSignupDialogProps) {
  // Sign In Form Data
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    accessCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await authApi.login({ ...signInData });
      console.log("response :", response);
      toast.success("Signed in successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign you in right now.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInChange = (field: string, value: string) => {
    setSignInData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);

    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-slate-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#F02801]/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-[#F02801]" />
            </div>
            <div>
              <DialogTitle
                className="font-['Inter'] text-slate-900"
                style={{ fontSize: "24px" }}
              >
                Admin Portal Access
              </DialogTitle>
              <DialogDescription className="font-['Roboto'] text-slate-600 text-[14px]">
                Sign in to your admin account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Google Sign In Button */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            variant="outline"
            className="w-full h-12 bg-[#0F172A] border-2 border-[#0F172A] hover:bg-[#1E293B] hover:border-[#1E293B] font-['Roboto'] rounded-xl flex items-center justify-center gap-3"
            style={{ fontSize: "15px" }}
          >
            <GoogleIcon />
            <span className="text-white">Sign in with Google</span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-slate-500 font-['Roboto'] text-[14px]">
                OR
              </span>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="signin-email"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="admin@partsquote.co.uk"
                  value={signInData.email}
                  onChange={(e) => handleSignInChange("email", e.target.value)}
                  className={cn(
                    "h-11 pl-10 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                    errors.email && "border-[#F02801]"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-[#F02801] text-[13px] font-['Roboto']">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="signin-password"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={signInData.password}
                  onChange={(e) =>
                    handleSignInChange("password", e.target.value)
                  }
                  className={cn(
                    "h-11 pl-10 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                    errors.password && "border-[#F02801]"
                  )}
                />
              </div>
              {errors.password && (
                <p className="text-[#F02801] text-[13px] font-['Roboto']">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Access Code */}
            <div className="space-y-2">
              <Label
                htmlFor="signin-accessCode"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Admin Access Code *
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="signin-accessCode"
                  type="text"
                  placeholder="Enter admin access code"
                  value={signInData.accessCode}
                  onChange={(e) =>
                    handleSignInChange("accessCode", e.target.value)
                  }
                  className={cn(
                    "h-11 pl-10 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                    errors.accessCode && "border-[#F02801]"
                  )}
                />
              </div>
              {errors.accessCode && (
                <p className="text-[#F02801] text-[13px] font-['Roboto']">
                  {errors.accessCode}
                </p>
              )}
              <p className="text-slate-500 text-[12px] font-['Roboto']">
                Contact your system administrator for the access code
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1 border-2 border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50 font-['Roboto'] rounded-full h-12"
                style={{ fontSize: "15px" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-12"
                style={{ fontSize: "15px" }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
