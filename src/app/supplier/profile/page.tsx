"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SupplierProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    tradingAs: "",
    businessType: "",
    vatNumber: "",
    description: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    companyRegDoc: null as File | null,
    insuranceDoc: null as File | null,
  });

  useEffect(() => {
    try{
      
    }
    catch(err) {
      console.log("err is as: ", err);
      
    }
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  return (
    <div className="space-y-6">
      <Card className="border border-[#E5E7EB] shadow-sm bg-gradient-to-br from-[#FEF2F2] to-[#FFFFFF]">
        <CardContent className="p-6">
          <h1 className="font-['Inter'] text-[#0F172A] mb-1 text-3xl">Profile & Settings</h1>
          <p className="text-[#475569] font-['Roboto']">Manage your business profile and preferences</p>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader className="border-b border-[#E5E7EB]">
          <CardTitle className="font-['Inter'] text-[#0F172A]">Contact Information</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Update your supplier contact details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">First Name *</Label>
                <Input 
                  value={formData?.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Last Name *</Label>
                <Input 
                  value={formData?.lastName} 
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Email *</Label>
                <Input value={formData?.email} 
                onChange={(e) =>
                  handleInputChange("email", e.target.value)
                } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Phone *</Label>
                <Input value={formData?.phone} 
                onChange={(e) =>
                  handleInputChange("phone", e.target.value)
                } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Address Line 1 *</Label>
                <Input value={formData?.addressLine1} onChange={(e) =>
                  handleInputChange("addressLine1", e.target.value)
                } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Address Line 2 *</Label>
                <Input value={formData?.addressLine2} onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Town/City *</Label>
                <Input value={formData?.addressLine2} onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">PostCode *</Label>
                <Input value={formData?.addressLine2} onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                } className="font-['Roboto']" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader className="border-b border-[#E5E7EB]">
          <CardTitle className="font-['Inter'] text-[#0F172A]">Verification Documents</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Update your supplier document details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Label htmlFor="companyReg">
              Company Registration Document{" "}
              <span className="text-danger">*</span>
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
                  handleFileUpload(
                    "companyRegDoc",
                    e.target.files?.[0] || null
                  )
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
                    <p className="font-medium mb-1">
                      Click to upload document
                    </p>
                    <p className="text-sm text-subtle-ink">
                      PDF, JPG or PNG (max 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <Label htmlFor="insurance">
              Public Liability Insurance{" "}
              {/* <span className="text-danger">*</span> */}
            </Label>
            <p className="text-sm text-subtle-ink">
              Proof of current public liability insurance (minimum £1M
              cover)
            </p>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                id="insurance"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileUpload(
                    "insuranceDoc",
                    e.target.files?.[0] || null
                  )
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
                    <p className="font-medium mb-1">
                      Click to upload document
                    </p>
                    <p className="text-sm text-subtle-ink">
                      PDF, JPG or PNG (max 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader className="border-b border-[#E5E7EB]">
          <CardTitle className="font-['Inter'] text-[#0F172A]">Business Information</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Update your supplier profile details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Trading As (if different) *</Label>
                <Input 
                  value={formData?.tradingAs}
                  onChange={(e) =>
                    handleInputChange("tradingAs", e.target.value)
                  } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Business Name *</Label>
                <Input 
                  value={formData?.businessName} 
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="businessType">
                    Business Type <span className="text-danger">*</span>
                  </Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) =>
                      handleInputChange("businessType", value)
                    }
                  >
                    <SelectTrigger id="businessType">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole-trader">Sole Trader</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="limited">Limited Company</SelectItem>
                      <SelectItem value="plc">
                        Public Limited Company
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">VAT Number</Label>
                <Input value={formData?.vatNumber} 
                onChange={(e) =>
                  handleInputChange("vatNumber", e.target.value)
                } className="font-['Roboto']" />
              </div>
              <div>
                <Label className="font-['Roboto'] text-[#475569]">Business Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell customers about your business, experience, and what makes you stand out..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
            </div>
              <Button className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']">
                Save Changes
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
