import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import { authApi, type LoginUser, type UserRole } from "@/utils/api";
import { useGoogleIdToken } from "@/hooks/use-google-id-token";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUpClick?: () => void;
  onSuccess?: (payload?: LoginUser | UserRole) => void;
  selectedRole: UserRole;
  setSelectedRole: Dispatch<SetStateAction<UserRole>>;
}

export function SignInDialog({
  open,
  onOpenChange,
  onSignUpClick,
  onSuccess,
  selectedRole,
  // setSelectedRole,
}: SignInDialogProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const { isReady: googleReady, requestIdToken } = useGoogleIdToken();

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // console.log("user Clicked", formData);
      const user = await authApi.login({ ...formData });
      // console.log("response :", response);
      toast.success("Signed in successfully!");
      setFormData({ email: "", password: "" });
      onOpenChange(false);
      onSuccess?.(user);
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

  const handleGoogleSignIn = async () => {
    if (!googleReady) {
      toast.error("Google Sign In is not ready yet. Please try again.");
      return;
    }
    try {
      setIsGoogleSubmitting(true);
      const idToken = await requestIdToken();
      const user = await authApi.loginWithGoogle({
        idToken,
        role: selectedRole,
      });
      toast.success("Signed in with Google!");
      onOpenChange(false);
      onSuccess?.(user);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign you in with Google.";
      toast.error(message);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle
            className="font-['Inter'] text-[#0F172A]"
            style={{ fontSize: "28px" }}
          >
            Welcome Back
          </DialogTitle>
          <DialogDescription
            className="font-['Roboto'] text-[#64748B]"
            style={{ fontSize: "15px" }}
          >
            Sign in to your PartsQuote account
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Google Sign In Button */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-xl bg-[#1F1F1F] hover:bg-[#2D2D2D] text-white border-2 border-[#2D2D2D] hover:border-[#3D3D3D] transition-all duration-200 font-['Roboto'] font-medium"
            style={{ fontSize: "15px" }}
            disabled={!googleReady || isGoogleSubmitting}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleSubmitting ? "Connecting..." : "Continue with Google"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="bg-white px-4 font-['Roboto'] text-[#94A3B8]"
                style={{ fontSize: "13px" }}
              >
                OR
              </span>
            </div>
          </div>

          {/* Account Type */}
          {/* <div className="space-y-2">
            <Label
              className="font-['Roboto'] text-[#0F172A]"
              style={{ fontSize: "14px" }}
            >
              Account Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(["user", "supplier"] as Array<UserRole>).map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-['Roboto'] transition-all ${
                    selectedRole === role
                      ? "border-[#F02801] bg-[#FFF1ED] text-[#0F172A]"
                      : "border-[#E5E7EB] text-[#64748B] hover:border-[#F02801]"
                  }`}
                >
                  {role === "user" ? "Customer" : "Supplier"}
                </button>
              ))}
            </div>
          </div> */}

          {/* Sign In Form */}
          <form onSubmit={loginUser} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="signin-email"
                className="font-['Roboto'] text-[#0F172A]"
                style={{ fontSize: "14px" }}
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="signin-password"
                  className="font-['Roboto'] text-[#0F172A]"
                  style={{ fontSize: "14px" }}
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="font-['Roboto'] text-[#F02801] hover:underline"
                  style={{ fontSize: "13px" }}
                  onClick={() =>
                    toast.info(
                      "Password reset link would be sent to your email"
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30 mt-6"
              style={{ fontSize: "16px" }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </span>
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-[#E5E7EB]">
              <p
                className="font-['Roboto'] text-[#64748B]"
                style={{ fontSize: "14px" }}
              >
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onSignUpClick?.();
                  }}
                  className="text-[#F02801] hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
