import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Store, Mail, Lock, Phone, Building2, MapPin, FileText } from "lucide-react";
import { cn } from "./ui/utils";
import { Checkbox } from "./ui/checkbox";

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
  </svg>
);

interface SupplierSignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SupplierSignupDialog({
  open,
  onOpenChange,
  onSuccess,
}: SupplierSignupDialogProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    businessName: "",
    tradingName: "",
    companyNumber: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    businessType: "",
    partsCategory: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+44|0)[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid UK phone number";
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = "Postcode is required";
    } else if (!/^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i.test(formData.postcode)) {
      newErrors.postcode = "Invalid UK postcode";
    }

    if (!formData.businessType) {
      newErrors.businessType = "Business type is required";
    }

    if (!formData.partsCategory) {
      newErrors.partsCategory = "Parts category is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    onSuccess?.();
    onOpenChange(false);

    // Reset form
    setFormData({
      businessName: "",
      tradingName: "",
      companyNumber: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
      businessType: "",
      partsCategory: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSignInChange = (field: string, value: string) => {
    setSignInData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateSignIn = () => {
    const newErrors: Record<string, string> = {};

    if (!signInData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!signInData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignIn()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    onSuccess?.();
    onOpenChange(false);

    // Reset form
    setSignInData({ email: "", password: "" });
    setErrors({});
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    
    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onSuccess?.();
    onOpenChange(false);
  };

  const handleGoogleSignUp = async () => {
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
              <Store className="h-6 w-6 text-[#F02801]" />
            </div>
            <div>
              <DialogTitle className="font-['Inter'] text-slate-900" style={{ fontSize: "24px" }}>
                Supplier Portal Access
              </DialogTitle>
              <DialogDescription className="font-['Roboto'] text-slate-600 text-[14px]">
                Sign in or register as a parts supplier
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value as "signin" | "signup");
          setErrors({});
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin" className="font-['Roboto']">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="font-['Roboto']">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Form */}
          <TabsContent value="signin">
            <div className="space-y-6 py-2">
              {/* Google Sign In Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                variant="outline"
                className="w-full h-12 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 font-['Roboto'] rounded-xl flex items-center justify-center gap-3"
                style={{ fontSize: "15px" }}
              >
                <GoogleIcon />
                <span className="text-slate-900">Sign in with Google</span>
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
                      placeholder="supplier@autoparts.co.uk"
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
                      onChange={(e) => handleSignInChange("password", e.target.value)}
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
          </TabsContent>

          {/* Sign Up Form */}
          <TabsContent value="signup">
            <div className="space-y-6 py-2">
              {/* Google Sign Up Button */}
              <Button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isSubmitting}
                variant="outline"
                className="w-full h-12 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 font-['Roboto'] rounded-xl flex items-center justify-center gap-3"
                style={{ fontSize: "15px" }}
              >
                <GoogleIcon />
                <span className="text-slate-900">Sign up with Google</span>
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

              <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-slate-600" />
              <h3 className="font-['Inter'] text-slate-900" style={{ fontSize: "16px" }}>
                Business Information
              </h3>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label
                htmlFor="businessName"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Business Name *
              </Label>
              <Input
                id="businessName"
                type="text"
                placeholder="ABC Auto Parts Ltd"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                className={cn(
                  "h-11 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                  errors.businessName && "border-[#F02801]"
                )}
              />
              {errors.businessName && (
                <p className="text-[#F02801] text-[13px] font-['Roboto']">
                  {errors.businessName}
                </p>
              )}
            </div>

            {/* Trading Name */}
            <div className="space-y-2">
              <Label
                htmlFor="tradingName"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Trading Name (Optional)
              </Label>
              <Input
                id="tradingName"
                type="text"
                placeholder="If different from business name"
                value={formData.tradingName}
                onChange={(e) => handleInputChange("tradingName", e.target.value)}
                className="h-11 font-['Roboto'] text-[15px] border-slate-300 bg-white"
              />
            </div>

            {/* Company Registration Number */}
            <div className="space-y-2">
              <Label
                htmlFor="companyNumber"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Company Registration Number (Optional)
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="companyNumber"
                  type="text"
                  placeholder="12345678"
                  value={formData.companyNumber}
                  onChange={(e) => handleInputChange("companyNumber", e.target.value)}
                  className="h-11 pl-10 font-['Roboto'] text-[15px] border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <Label
                htmlFor="businessType"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Business Type *
              </Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleInputChange("businessType", value)}
              >
                <SelectTrigger
                  className={cn(
                    "h-11 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                    errors.businessType && "border-[#F02801]"
                  )}
                >
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="retailer">Retailer</SelectItem>
                  <SelectItem value="breakers">Breakers/Salvage</SelectItem>
                  <SelectItem value="specialist">Specialist Shop</SelectItem>
                </SelectContent>
              </Select>
              {errors.businessType && (
                <p className="text-[#F02801] text-[13px] font-['Roboto']">
                  {errors.businessType}
                </p>
              )}
            </div>

            {/* Parts Category */}
            <div className="space-y-2">
              <Label
                htmlFor="partsCategory"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Primary Parts Category *
              </Label>
              <Select
                value={formData.partsCategory}
                onValueChange={(value) => handleInputChange("partsCategory", value)}
              >
                <SelectTrigger
                  className={cn(
                    "h-11 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                    errors.partsCategory && "border-[#F02801]"
                  )}
                >
                  <SelectValue placeholder="Select primary category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="engine">Engine</SelectItem>
                  <SelectItem value="brakes">Brakes</SelectItem>
                  <SelectItem value="suspension">Suspension</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="bodywork">Bodywork</SelectItem>
                  <SelectItem value="interior">Interior</SelectItem>
                  <SelectItem value="all">All Categories</SelectItem>
                </SelectContent>
              </Select>
              {errors.partsCategory && (
                <p className="text-[#F02801] text-[13px] font-['Roboto']">
                  {errors.partsCategory}
                </p>
              )}
            </div>
          </div>

          <Separator className="bg-slate-200" />

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-4 w-4 text-slate-600" />
              <h3 className="font-['Inter'] text-slate-900" style={{ fontSize: "16px" }}>
                Contact Information
              </h3>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@abcautoparts.co.uk"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 20 1234 5678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={cn(
                    "h-11 pl-10 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                    errors.phone && "border-[#F02801]"
                  )}
                />
              </div>
              {errors.phone && (
                <p className="text-[#F02801] text-[13px] font-['Roboto']">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <Separator className="bg-slate-200" />

          {/* Business Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-slate-600" />
              <h3 className="font-['Inter'] text-slate-900" style={{ fontSize: "16px" }}>
                Business Address
              </h3>
            </div>

            {/* Address Line 1 */}
            <div className="space-y-2">
              <Label
                htmlFor="addressLine1"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Address Line 1 *
              </Label>
              <Input
                id="addressLine1"
                type="text"
                placeholder="123 High Street"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                className={cn(
                  "h-11 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                  errors.addressLine1 && "border-[#F02801]"
                )}
              />
              {errors.addressLine1 && (
                <p className="text-[#F02801] text-[13px] font-['Roboto']">
                  {errors.addressLine1}
                </p>
              )}
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <Label
                htmlFor="addressLine2"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Address Line 2 (Optional)
              </Label>
              <Input
                id="addressLine2"
                type="text"
                placeholder="Unit 5"
                value={formData.addressLine2}
                onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                className="h-11 font-['Roboto'] text-[15px] border-slate-300 bg-white"
              />
            </div>

            {/* City and Postcode */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="font-['Roboto'] text-slate-700 text-[14px]"
                >
                  City *
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="London"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={cn(
                    "h-11 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                    errors.city && "border-[#F02801]"
                  )}
                />
                {errors.city && (
                  <p className="text-[#F02801] text-[13px] font-['Roboto']">
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="postcode"
                  className="font-['Roboto'] text-slate-700 text-[14px]"
                >
                  Postcode *
                </Label>
                <Input
                  id="postcode"
                  type="text"
                  placeholder="SW1A 1AA"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange("postcode", e.target.value.toUpperCase())}
                  className={cn(
                    "h-11 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                    errors.postcode && "border-[#F02801]"
                  )}
                />
                {errors.postcode && (
                  <p className="text-[#F02801] text-[13px] font-['Roboto']">
                    {errors.postcode}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-slate-200" />

          {/* Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-slate-600" />
              <h3 className="font-['Inter'] text-slate-900" style={{ fontSize: "16px" }}>
                Account Security
              </h3>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="font-['Roboto'] text-slate-700 text-[14px]"
              >
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={cn(
                    "h-11 pl-10 font-['Roboto'] text-[15px] border-slate-300 bg-white",
                    errors.confirmPassword && "border-[#F02801]"
                  )}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[#F02801] text-[13px] font-['Roboto']">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("acceptTerms", checked as boolean)
                }
                className={cn(
                  "mt-1",
                  errors.acceptTerms && "border-[#F02801]"
                )}
              />
              <div className="space-y-1">
                <Label
                  htmlFor="acceptTerms"
                  className="font-['Roboto'] text-slate-700 text-[14px] cursor-pointer"
                >
                  I accept the Terms & Conditions and Privacy Policy *
                </Label>
                {errors.acceptTerms && (
                  <p className="text-[#F02801] text-[13px] font-['Roboto']">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-slate-600 text-[13px] font-['Roboto'] leading-relaxed">
              <strong className="text-slate-900">Important:</strong> Your supplier
              account will be reviewed and verified before activation. We'll contact
              you within 2-3 business days to complete the verification process.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1 border-2 border-slate-300 hover:border-slate-400 text-slate-900 hover:bg-slate-50 font-['Roboto'] rounded-xl h-12"
              style={{ fontSize: "15px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-xl h-12"
              style={{ fontSize: "15px" }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Register as Supplier"
              )}
            </Button>
          </div>
        </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
