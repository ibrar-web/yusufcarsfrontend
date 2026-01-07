"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRoutes } from "@/utils/apiroutes";
import { apiGet, apiPut } from "@/utils/apiconfig/http";
import { toast } from "sonner";
// import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type SupplierProfileApiResponse = {
  data?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    postCode?: string;
    profileImageUrl?: string;
    supplier?: {
      businessName?: string;
      tradingAs?: string;
      businessType?: string;
      vatNumber?: string;
      description?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      postCode?: string;
      phone?: string;
    };
  };
};

type SupplierFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  tradingAs: string;
  businessType: string;
  vatNumber: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postCode: string;
  image?: File | null;
};

export default function SupplierProfilePage() {
  const [formData, setFormData] = useState<SupplierFormData>({
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
    postCode: "",
    image: undefined,
    // companyRegDoc: null as File | null,
    // insuranceDoc: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarScale, setAvatarScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);
    
  useEffect(() => {
    let ignore = false;
    const fetchProfile = async () => {
      try {
        const response = await apiGet<SupplierProfileApiResponse>(
          apiRoutes.supplier.profile.get
        );
        const payload = response?.data;
        if (!payload || ignore) return;
        const supplier = payload.supplier ?? {};

        setFormData((prev) => ({
          ...prev,
          firstName: payload.firstName ?? "",
          lastName: payload.lastName ?? "",
          email: payload.email ?? "",
          phone: supplier.phone ?? payload.phone ?? "",
          businessName: supplier.businessName ?? "",
          tradingAs: supplier.tradingAs ?? "",
          businessType: supplier.businessType ?? "",
          vatNumber: supplier.vatNumber ?? "",
          description: supplier.description ?? "",
          addressLine1: supplier.addressLine1 ?? "",
          addressLine2: supplier.addressLine2 ?? "",
          city: supplier.city ?? "",
          postCode: supplier.postCode ?? payload.postCode ?? "",
        }));
        if (payload?.profileImageUrl) {
          setImagePreview(payload?.profileImageUrl);
        }
      } catch (err) {
        if (ignore) return;
        console.error("Failed to load supplier profile", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to load profile data"
        );
      }
    };

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleFileUpload = (field: string, file: File | null) => {
  //   setFormData((prev) => ({ ...prev, [field]: file }));
  // };

  const handleSave = async() => {
    try{
      setIsLoading(true);
      const isMultipart = Boolean(formData.image);
      const payload = isMultipart
        ? buildMultipartPayload()
        : (({ image, ...rest }) => rest)(formData);
      const response =  await apiPut<any>(
        apiRoutes?.supplier?.profile?.update,
        payload,
        isMultipart ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
      );
      if (response?.statusCode === 200) {
        toast.success("Data updated successfully");
      }
    }
    catch(err) {
      console.log("err is as:  ", err);
    }
    finally{ 
      setIsLoading(false);
    }
  }

  const buildMultipartPayload = () => {
    const form = new FormData();
    const { image, ...rest } = formData;
    Object.entries(rest).forEach(([key, value]) => {
      form.append(key, value ?? "");
    });
    if (image) {
      form.append("image", image);
    }
    return form;
  };

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    setAvatarScale(1);
    const url = URL.createObjectURL(file);
    setImagePreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
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
          <CardTitle className="font-['Inter'] text-[#0F172A]">Profile Photo</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">
            Upload a professional profile image for your supplier listing
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20 rounded-full ring-2 ring-[#F02801]/60 shadow-lg overflow-hidden bg-white">
              <AvatarImage
                src={imagePreview ?? undefined}
                alt={formData.firstName}
                className="h-full w-full object-cover"
                style={{ transform: `scale(${avatarScale})` }}
              />
              {!imagePreview && (
                <AvatarFallback className="bg-[#F02801] text-white text-2xl font-['Inter'] font-semibold">
                  {formData.firstName?.[0] ?? "S"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm text-[#475569]">
                {formData.image?.name}
              </p>
              <p className="text-xs text-[#94A3B8]">
                JPG or PNG up to 5MB.
              </p>
            </div>
            <Button
              variant="outline"
              className="font-['Roboto'] text-[#0F172A]"
              onClick={handleAvatarChange}
            >
              {formData.image ? "Change photo" : "Upload photo"}
            </Button>
          </div>
          <div>
            <Label className="text-xs text-[#475569]">Adjust zoom</Label>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.05"
              value={avatarScale}
              onChange={(event) => setAvatarScale(Number(event.target.value))}
              className="w-full h-1 rounded-full accent-[#F02801]"
            />
          </div>
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
                } className="font-['Roboto']" disabled={true}/>
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
                <Label className="font-['Roboto'] text-[#475569]">Address Line 2</Label>
                <Input value={formData?.addressLine2} onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Town/City *</Label>
                <Input value={formData?.city} onChange={(e) =>
                  handleInputChange("city", e.target.value)
                } className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">PostCode *</Label>
                <Input value={formData?.postCode} onChange={(e) =>
                  handleInputChange("postCode", e.target.value)
                } className="font-['Roboto']" />
              </div>
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
          </div>
          <Button className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] mt-8 cursor-pointer" onClick={() => handleSave()} disabled={isLoading}>
            {isLoading ? "Saving ..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* <Card className="border border-[#E5E7EB] shadow-sm">
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
          <Button className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] mt-8">
            Save Changes
          </Button>
        </CardContent>
      </Card> */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarInputChange}
      />
    </div>
  );
}
