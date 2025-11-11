"use client";
import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAppState } from "@/hooks/use-app-state";

export default function SupplierOnboardingPage() {
  const { handleNavigate } = useAppState();
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    contactPostcode: "",
    businessName: "",
    tradingAs: "",
    businessType: "",
    vatNumber: "",
    description: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    serviceRadius: "10",
    categories: [] as string[],
    companyRegDoc: null as File | null,
    insuranceDoc: null as File | null,
    termsAccepted: false,
    gdprConsent: false,
  });

  const steps = [
    {
      id: 0,
      title: "Contact Information",
      description: "How we can reach you",
    },
    {
      id: 1,
      title: "Business Information",
      description: "Tell us about your business",
    },
    {
      id: 2,
      title: "Address & Service Area",
      description: "Where you're based and areas you serve",
    },
    {
      id: 3,
      title: "Verification Documents",
      description: "Upload required documentation",
    },
    {
      id: 4,
      title: "Review & Submit",
      description: "Review your information and submit",
    },
  ];

  const categories = [
    "Engine Parts",
    "Brakes",
    "Suspension",
    "Electrical",
    "Bodywork",
    "Interior",
    "Exhaust",
    "Cooling System",
    "Transmission",
    "Steering",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    toast.success("Application submitted successfully! We'll review your details within 2-3 business days.");
    setTimeout(() => {
      handleNavigate("supplier-dashboard");
    }, 2000);
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-muted/30">
      <Header currentPage="supplier-onboarding" />

      <div className="max-w-[800px] mx-auto px-6 py-12">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl mb-2">Become a Supplier</h1>
              <p className="text-subtle-ink">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </p>
            </div>
            <Badge variant="secondary" className="px-4 py-2">
              {Math.round(progressPercentage)}% Complete
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
            >
              <div className="flex flex-col items-center min-w-[120px]">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    index < currentStep
                      ? "bg-success text-white"
                      : index === currentStep
                      ? "bg-primary text-white"
                      : "bg-muted text-subtle-ink"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="text-xs text-center hidden md:block">
                  <div className={index <= currentStep ? "font-medium" : "text-subtle-ink"}>
                    {step.title}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    index < currentStep ? "bg-success" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 0: Contact Information */}
            {currentStep === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">
                    Business Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Your business name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07XXX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPostcode">
                    Postcode <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="contactPostcode"
                    placeholder="SW1A 1AA"
                    value={formData.contactPostcode}
                    onChange={(e) => handleInputChange("contactPostcode", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Categories you supply <span className="text-danger">*</span>
                  </Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Engine', 'Brakes', 'Suspension', 'Electrical', 'Bodywork', 'Interior'].map((cat) => (
                      <Badge
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`rounded-full px-3 py-1.5 cursor-pointer transition-all ${
                          formData.categories.includes(cat)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-muted text-subtle-ink border-muted hover:bg-primary/10 hover:border-primary/50'
                        }`}
                      >
                        <span className="font-['Roboto']" style={{ fontSize: '13px' }}>{cat}</span>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-subtle-ink">Select all categories that apply</p>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="gdpr-consent"
                    checked={formData.gdprConsent}
                    onCheckedChange={(checked) => handleInputChange("gdprConsent", checked)}
                  />
                  <label htmlFor="gdpr-consent" className="text-sm text-subtle-ink leading-relaxed cursor-pointer">
                    I agree to be contacted about becoming a supplier and accept the Terms of Service and Privacy Policy.
                  </label>
                </div>
              </>
            )}

            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tradingAs">Trading As (if different)</Label>
                  <Input
                    id="tradingAs"
                    placeholder="e.g. AutoParts Direct"
                    value={formData.tradingAs}
                    onChange={(e) => handleInputChange("tradingAs", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">
                    Business Type <span className="text-danger">*</span>
                  </Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleInputChange("businessType", value)}
                  >
                    <SelectTrigger id="businessType">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole-trader">Sole Trader</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="limited">Limited Company</SelectItem>
                      <SelectItem value="plc">Public Limited Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input
                    id="vatNumber"
                    placeholder="GB123456789"
                    value={formData.vatNumber}
                    onChange={(e) => handleInputChange("vatNumber", e.target.value)}
                  />
                  <p className="text-xs text-subtle-ink">Optional if not VAT registered</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Business Description <span className="text-danger">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell customers about your business, experience, and what makes you stand out..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                  <p className="text-xs text-subtle-ink">This will appear on your profile page</p>
                </div>
              </>
            )}

            {/* Step 2: Address & Service Area */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">
                    Address Line 1 <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="addressLine1"
                    placeholder="Street address"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Apartment, suite, etc."
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      Town/City <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g. Birmingham"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postcode">
                      Postcode <span className="text-danger">*</span>
                    </Label>
                    <Input
                      id="postcode"
                      placeholder="e.g. B1 1AA"
                      value={formData.postcode}
                      onChange={(e) => handleInputChange("postcode", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceRadius">
                    Service Radius <span className="text-danger">*</span>
                  </Label>
                  <Select
                    value={formData.serviceRadius}
                    onValueChange={(value) => handleInputChange("serviceRadius", value)}
                  >
                    <SelectTrigger id="serviceRadius">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Within 5 miles</SelectItem>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="20">Within 20 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                      <SelectItem value="nationwide">Nationwide</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-subtle-ink">
                    Maximum distance you're willing to deliver or serve
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>
                    Parts Categories <span className="text-danger">*</span>
                  </Label>
                  <p className="text-sm text-subtle-ink">
                    Select all categories where you can supply parts
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={formData.categories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label
                          htmlFor={category}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Verification Documents */}
            {currentStep === 3 && (
              <>
                <div className="space-y-3">
                  <Label htmlFor="companyReg">
                    Company Registration Document <span className="text-danger">*</span>
                  </Label>
                  <p className="text-sm text-subtle-ink">
                    Certificate of incorporation or business registration
                  </p>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="companyReg"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileUpload("companyRegDoc", e.target.files?.[0] || null)
                      }
                    />
                    <label htmlFor="companyReg" className="cursor-pointer">
                      <Upload className="h-10 w-10 text-subtle-ink mx-auto mb-3" />
                      {formData.companyRegDoc ? (
                        <p className="text-sm font-medium text-success">
                          {formData.companyRegDoc.name}
                        </p>
                      ) : (
                        <>
                          <p className="font-medium mb-1">Click to upload document</p>
                          <p className="text-sm text-subtle-ink">PDF, JPG or PNG (max 5MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="insurance">
                    Public Liability Insurance <span className="text-danger">*</span>
                  </Label>
                  <p className="text-sm text-subtle-ink">
                    Proof of current public liability insurance (minimum £1M cover)
                  </p>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="insurance"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileUpload("insuranceDoc", e.target.files?.[0] || null)
                      }
                    />
                    <label htmlFor="insurance" className="cursor-pointer">
                      <Upload className="h-10 w-10 text-subtle-ink mx-auto mb-3" />
                      {formData.insuranceDoc ? (
                        <p className="text-sm font-medium text-success">
                          {formData.insuranceDoc.name}
                        </p>
                      ) : (
                        <>
                          <p className="font-medium mb-1">Click to upload document</p>
                          <p className="text-sm text-subtle-ink">PDF, JPG or PNG (max 5MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-subtle-ink">
                    <strong className="text-ink">Note:</strong> All documents will be reviewed by
                    our team within 2-3 business days. We may contact you if additional
                    verification is needed.
                  </p>
                </div>
              </>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-subtle-ink">Business Name:</span>
                        <span className="font-medium">{formData.businessName || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-subtle-ink">Email:</span>
                        <span className="font-medium">{formData.email || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-subtle-ink">Phone:</span>
                        <span className="font-medium">{formData.phone || "Not provided"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-subtle-ink">Postcode:</span>
                        <span className="font-medium">{formData.contactPostcode || "Not provided"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Business Details</h3>
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-subtle-ink">Business Type:</span>
                        <span className="font-medium">{formData.businessType || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-subtle-ink">VAT Number:</span>
                        <span className="font-medium">{formData.vatNumber || "Not provided"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Service Area</h3>
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-subtle-ink">Location:</span>
                        <span className="font-medium">
                          {formData.city}, {formData.postcode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-subtle-ink">Service Radius:</span>
                        <span className="font-medium">
                          {formData.serviceRadius === "nationwide"
                            ? "Nationwide"
                            : `Within ${formData.serviceRadius} miles`}
                        </span>
                      </div>
                      <div>
                        <span className="text-subtle-ink block mb-2">Categories:</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.categories.map((cat) => (
                            <Badge key={cat} variant="secondary">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Documents</h3>
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-subtle-ink">Company Registration:</span>
                        <span className="font-medium flex items-center gap-2">
                          {formData.companyRegDoc ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-success" />
                              Uploaded
                            </>
                          ) : (
                            "Not uploaded"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-subtle-ink">Insurance:</span>
                        <span className="font-medium flex items-center gap-2">
                          {formData.insuranceDoc ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-success" />
                              Uploaded
                            </>
                          ) : (
                            "Not uploaded"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-xl">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) =>
                      handleInputChange("termsAccepted", checked === true)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                    I confirm that all information provided is accurate and I agree to the{" "}
                    <button className="text-primary hover:underline">Terms & Conditions</button> and{" "}
                    <button className="text-primary hover:underline">Supplier Agreement</button>.
                  </Label>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={() => {
                if (currentStep === 0) {
                  setShowWelcomeDialog(true);
                } else {
                  handleNext();
                }
              }} 
              className="gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!formData.termsAccepted}
              className="gap-2"
            >
              Submit Application
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Welcome Dialog */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '24px' }}>
              Become a Supplier
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>
              Join 2,500+ verified suppliers across the UK
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Registration Steps */}
            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F02801] text-white flex items-center justify-center flex-shrink-0 font-['Inter'] font-semibold" style={{ fontSize: '12px' }}>1</div>
                <span className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: '14px' }}>Contact Information</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E5E7EB] text-[#64748B] flex items-center justify-center flex-shrink-0 font-['Inter'] font-semibold" style={{ fontSize: '12px' }}>2</div>
                <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>Business Details</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E5E7EB] text-[#64748B] flex items-center justify-center flex-shrink-0 font-['Inter'] font-semibold" style={{ fontSize: '12px' }}>3</div>
                <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>Service Area</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E5E7EB] text-[#64748B] flex items-center justify-center flex-shrink-0 font-['Inter'] font-semibold" style={{ fontSize: '12px' }}>4</div>
                <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>Documents</span>
              </div>
            </div>

            {/* Time estimate */}
            <p className="font-['Roboto'] text-[#64748B] text-center py-3" style={{ fontSize: '13px' }}>
              ⏱️ Takes 8-12 minutes
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWelcomeDialog(false)}
              className="font-['Roboto'] flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowWelcomeDialog(false);
                handleNext();
              }}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold gap-2 shadow-lg shadow-[#EF4444]/30 flex-1"
            >
              Start
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
