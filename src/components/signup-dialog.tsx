import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { User, Mail, Phone, CheckCircle, Lock, MapPin, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import { authApi, type UserRole } from "@/utils/api";

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignInClick?: () => void;
  onSuccess?: (role?: UserRole) => void;
}

export function SignupDialog({ open, onOpenChange, onSignInClick, onSuccess }: SignupDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accountType, setAccountType] = useState<UserRole>("user");

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.match(/^(\+44|0)[0-9]{10}$/)) {
      newErrors.phone = "Please enter a valid UK phone number";
    }

    if (!formData.postcode.match(/^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i)) {
      newErrors.postcode = "Please enter a valid UK postcode";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      postcode: "",
      password: "",
      confirmPassword: "",
    });
    setAcceptTerms(false);
    setAcceptMarketing(false);
    setErrors({});
    setAccountType("user");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.signup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        postcode: formData.postcode.trim().toUpperCase(),
        password: formData.password,
        role: accountType,
        marketingOptIn: acceptMarketing,
      });
      toast.success("Account created successfully! Welcome to PartsQuote.");
      onOpenChange(false);
      onSuccess?.(accountType);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create your account right now.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.success("Redirecting to Google Sign In...");
    // In production, this would redirect to Google OAuth
    setTimeout(() => {
      toast.success("Account created with Google!");
      onOpenChange(false);
      onSuccess?.(accountType);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "24px", lineHeight: "1.3" }}>
            Create Your Account
          </DialogTitle>
          <DialogDescription className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "16px", lineHeight: "1.5" }}>
            Join PartsQuote to get the best deals on car parts
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Google Sign Up Button */}
          <Button
            type="button"
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-[#334155] bg-[#1E293B] text-white hover:border-[#475569] hover:bg-[#334155] transition-all duration-200 font-['Roboto'] font-medium"
            style={{ fontSize: "16px", lineHeight: "1.5" }}
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
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 font-['Roboto'] text-[#94A3B8]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                OR
              </span>
            </div>
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
              Account Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(["user", "supplier"] as Array<UserRole>).map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setAccountType(role)}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-['Roboto'] transition-all ${
                    accountType === role
                      ? "border-[#F02801] bg-[#FFF1ED] text-[#0F172A]"
                      : "border-[#E5E7EB] text-[#64748B] hover:border-[#F02801]"
                  }`}
                >
                  {role === "user" ? "Customer" : "Supplier"}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
              Full Name <span className="text-[#F02801]">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
              <Input
                id="name"
                type="text"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                className={`pl-10 h-12 rounded-xl border-2 ${
                  errors.name ? "border-[#F02801]" : "border-[#E5E7EB]"
                } focus:border-[#F02801] font-['Roboto']`}
                style={{ fontSize: "16px", lineHeight: "1.5" }}
                required
              />
            </div>
            {errors.name && (
              <p className="font-['Roboto'] text-[#F02801] flex items-center gap-1" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                <X className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
              Email Address <span className="text-[#F02801]">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`pl-10 h-12 rounded-xl border-2 ${
                  errors.email ? "border-[#F02801]" : "border-[#E5E7EB]"
                } focus:border-[#F02801] font-['Roboto']`}
                style={{ fontSize: "16px", lineHeight: "1.5" }}
                required
              />
            </div>
            {errors.email && (
              <p className="font-['Roboto'] text-[#F02801] flex items-center gap-1" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                <X className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone and Postcode Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                Phone Number <span className="text-[#F02801]">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07123 456789"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  className={`pl-10 h-12 rounded-xl border-2 ${
                    errors.phone ? "border-[#F02801]" : "border-[#E5E7EB]"
                  } focus:border-[#F02801] font-['Roboto']`}
                  style={{ fontSize: "16px", lineHeight: "1.5" }}
                  required
                />
              </div>
              {errors.phone && (
                <p className="font-['Roboto'] text-[#F02801] flex items-center gap-1" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  <X className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Postcode */}
            <div className="space-y-2">
              <Label htmlFor="postcode" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                Postcode <span className="text-[#F02801]">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="postcode"
                  type="text"
                  placeholder="SW1A 1AA"
                  value={formData.postcode}
                  onChange={(e) => {
                    setFormData({ ...formData, postcode: e.target.value.toUpperCase() });
                    if (errors.postcode) setErrors({ ...errors, postcode: "" });
                  }}
                  className={`pl-10 h-12 rounded-xl border-2 ${
                    errors.postcode ? "border-[#F02801]" : "border-[#E5E7EB]"
                  } focus:border-[#F02801] font-['Roboto']`}
                  style={{ fontSize: "16px", lineHeight: "1.5" }}
                  required
                />
              </div>
              {errors.postcode && (
                <p className="font-['Roboto'] text-[#F02801] flex items-center gap-1" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  <X className="h-3 w-3" />
                  {errors.postcode}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
              Password <span className="text-[#F02801]">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`pl-10 pr-10 h-12 rounded-xl border-2 ${
                  errors.password ? "border-[#F02801]" : "border-[#E5E7EB]"
                } focus:border-[#F02801] font-['Roboto']`}
                style={{ fontSize: "16px", lineHeight: "1.5" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formData.password && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength === 1
                        ? "w-1/4 bg-[#F02801]"
                        : passwordStrength === 2
                        ? "w-2/4 bg-[#F59E0B]"
                        : passwordStrength === 3
                        ? "w-3/4 bg-[#3B82F6]"
                        : passwordStrength === 4
                        ? "w-full bg-[#22C55E]"
                        : "w-0"
                    }`}
                  />
                </div>
                <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  {passwordStrength === 1
                    ? "Weak"
                    : passwordStrength === 2
                    ? "Fair"
                    : passwordStrength === 3
                    ? "Good"
                    : passwordStrength === 4
                    ? "Strong"
                    : ""}
                </span>
              </div>
            )}
            {errors.password && (
              <p className="font-['Roboto'] text-[#F02801] flex items-center gap-1" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                <X className="h-3 w-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
              Confirm Password <span className="text-[#F02801]">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                }}
                className={`pl-10 pr-10 h-12 rounded-xl border-2 ${
                  errors.confirmPassword ? "border-[#F02801]" : "border-[#E5E7EB]"
                } focus:border-[#F02801] font-['Roboto']`}
                style={{ fontSize: "16px", lineHeight: "1.5" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="font-['Roboto'] text-[#22C55E] flex items-center gap-1" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                <Check className="h-3 w-3" />
                Passwords match
              </p>
            )}
            {errors.confirmPassword && (
              <p className="font-['Roboto'] text-[#F02801] flex items-center gap-1" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                <X className="h-3 w-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => {
                  setAcceptTerms(checked as boolean);
                  if (errors.terms) setErrors({ ...errors, terms: "" });
                }}
                className="mt-1"
              />
              <Label
                htmlFor="terms"
                className="font-['Roboto'] text-[#475569] cursor-pointer"
                style={{ fontSize: "14px", lineHeight: "1.5" }}
              >
                I agree to the{" "}
                <a href="#" className="text-[#F02801] hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#F02801] hover:underline">
                  Privacy Policy
                </a>
                <span className="text-[#F02801]"> *</span>
              </Label>
            </div>
            {errors.terms && (
              <p className="font-['Roboto'] text-[#F02801] flex items-center gap-1 ml-7" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                <X className="h-3 w-3" />
                {errors.terms}
              </p>
            )}

            <div className="flex items-start gap-3">
              <Checkbox
                id="marketing"
                checked={acceptMarketing}
                onCheckedChange={(checked) => setAcceptMarketing(checked as boolean)}
                className="mt-1"
              />
              <Label
                htmlFor="marketing"
                className="font-['Roboto'] text-[#475569] cursor-pointer"
                style={{ fontSize: "14px", lineHeight: "1.5" }}
              >
                Send me updates about special offers and new suppliers
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30 mt-4"
            style={{ fontSize: "16px" }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Create Account
              </span>
            )}
          </Button>

          {/* Privacy Notice */}
          <div className="bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl p-3 mt-4">
            <p className="font-['Roboto'] text-[#475569] text-center" style={{ fontSize: "14px", lineHeight: "1.5" }}>
              🔒 Your data is protected and encrypted. We never share your information with third parties.
            </p>
          </div>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-[#E5E7EB]">
            <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "14px", lineHeight: "1.5" }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onSignInClick?.();
                }}
                className="text-[#F02801] hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
