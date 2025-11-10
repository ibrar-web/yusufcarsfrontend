"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, CheckCircle, Star } from "lucide-react";
import { toast } from "sonner";

export default function SupplierProfilePage() {
  const [businessName, setBusinessName] = useState("AutoParts Direct Ltd");
  const [contactEmail, setContactEmail] = useState("supplier@autoparts.uk");
  const [phoneNumber, setPhoneNumber] = useState("020 1234 5678");
  const [businessAddress, setBusinessAddress] = useState("45 High Street, London, E1 6AN");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editBusinessName, setEditBusinessName] = useState(businessName);
  const [editContactEmail, setEditContactEmail] = useState(contactEmail);
  const [editPhoneNumber, setEditPhoneNumber] = useState(phoneNumber);
  const [editBusinessAddress, setEditBusinessAddress] = useState(businessAddress);

  const handleOpenEditProfile = () => {
    setEditBusinessName(businessName);
    setEditContactEmail(contactEmail);
    setEditPhoneNumber(phoneNumber);
    setEditBusinessAddress(businessAddress);
    setEditProfileOpen(true);
  };

  const handleSaveProfile = () => {
    setBusinessName(editBusinessName);
    setContactEmail(editContactEmail);
    setPhoneNumber(editPhoneNumber);
    setBusinessAddress(editBusinessAddress);
    setEditProfileOpen(false);
    toast.success("Profile updated successfully");
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
          <CardTitle className="font-['Inter'] text-[#0F172A]">Business Information</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Update your supplier profile details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Business Name</Label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Contact Email</Label>
                <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Phone Number</Label>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="font-['Roboto']" />
              </div>
              <div className="space-y-2">
                <Label className="font-['Roboto'] text-[#475569]">Business Address</Label>
                <Input value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} className="font-['Roboto']" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']" onClick={handleOpenEditProfile}>
                    Save Changes
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="font-['Inter'] text-[#0F172A]">Edit Business Information</DialogTitle>
                    <DialogDescription className="font-['Roboto'] text-[#475569]">
                      Update your supplier profile details. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-business-name" className="font-['Roboto'] text-[#475569]">
                          Business Name
                        </Label>
                        <Input
                          id="edit-business-name"
                          value={editBusinessName}
                          onChange={(e) => setEditBusinessName(e.target.value)}
                          className="font-['Roboto']"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-email" className="font-['Roboto'] text-[#475569]">
                          Contact Email
                        </Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editContactEmail}
                          onChange={(e) => setEditContactEmail(e.target.value)}
                          className="font-['Roboto']"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-phone" className="font-['Roboto'] text-[#475569]">
                          Phone Number
                        </Label>
                        <Input
                          id="edit-phone"
                          type="tel"
                          value={editPhoneNumber}
                          onChange={(e) => setEditPhoneNumber(e.target.value)}
                          className="font-['Roboto']"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-address" className="font-['Roboto'] text-[#475569]">
                          Business Address
                        </Label>
                        <Input
                          id="edit-address"
                          value={editBusinessAddress}
                          onChange={(e) => setEditBusinessAddress(e.target.value)}
                          className="font-['Roboto']"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setEditProfileOpen(false)}
                      className="font-['Roboto'] border-[#E5E7EB] hover:bg-[#F1F5F9]"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB] shadow-sm">
        <CardHeader className="border-b border-[#E5E7EB]">
          <CardTitle className="font-['Inter'] text-[#0F172A]">Performance Stats</CardTitle>
          <CardDescription className="font-['Roboto'] text-[#475569]">Your supplier ratings and metrics</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-[#1E293B] rounded-xl border border-[#334155]">
              <div className="h-12 w-12 rounded-full bg-[#92400E] flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-[#FCD34D]" />
              </div>
              <p className="font-['Inter'] text-[#F8FAFC] mb-1">4.8</p>
              <p className="text-sm text-[#94A3B8] font-['Roboto']">Average Rating</p>
            </div>
            <div className="text-center p-6 bg-[#1E293B] rounded-xl border border-[#334155]">
              <div className="h-12 w-12 rounded-full bg-[#065F46] flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-[#34D399]" />
              </div>
              <p className="font-['Inter'] text-[#F8FAFC] mb-1">234</p>
              <p className="text-sm text-[#94A3B8] font-['Roboto']">Total Quotes</p>
            </div>
            <div className="text-center p-6 bg-[#1E293B] rounded-xl border border-[#334155]">
              <div className="h-12 w-12 rounded-full bg-[#7F1D1D] flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-[#FCA5A5]" />
              </div>
              <p className="font-['Inter'] text-[#F8FAFC] mb-1">Active</p>
              <p className="text-sm text-[#94A3B8] font-['Roboto']">Account Status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
