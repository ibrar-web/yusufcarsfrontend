import { useEffect, useState } from "react";
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
import { User, Mail, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPut } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UserProfileApiResponse = {
  data?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    postCode?: string;
  };
};

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john@example.com",
    postCode: "B1 1BD",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    let ignore = false;
    const fetchProfile = async () => {
      try {
        if (!open) {
          return;
        }
        const response = await apiGet<UserProfileApiResponse>(
          apiRoutes.user.profile.get
        );
        
        const payload = response?.data;
        if (!payload || ignore) return;
      
        setFormData((prev) => ({
          ...prev,
          firstName: payload.firstName ?? "",
          lastName: payload.lastName ?? "",
          email: payload.email ?? "",
          postCode: payload.postCode ?? "",
        }));
      } catch (err) {
        if (ignore) return;
        console.error("Failed to load user profile", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to load profile data"
        );
      }
    };
      
    fetchProfile();
    return () => {
      ignore = true;
    };
  }, [open])
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiPut<any>(apiRoutes?.user?.profile?.update, formData);
      if (response?.statusCode === 200) {
        setIsSubmitting(false);
        toast.success("Profile updated successfully!");
        onOpenChange(false);
      }
    }
    catch(err) {
      console.log("err is as:  ", err);
    }
    // Simulate API call
    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   toast.success("Profile updated successfully!");
    //   onOpenChange(false);
    // }, 1500);
  };

  // const handleAvatarChange = () => {
  //   toast.info("Avatar upload coming soon!");
  // };

  // // Get initials for avatar fallback
  // const getInitials = (name: string) => {
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 2);
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-['Inter'] text-[#0F172A]" style={{ fontSize: "28px" }}>
            My Profile
          </DialogTitle>
          <DialogDescription className="font-['Roboto'] text-[#64748B]" style={{ fontSize: "15px" }}>
            Update your personal information and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {/* Avatar Section */}
          {/* <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={formData.name} />
                <AvatarFallback className="bg-[#F02801] text-white text-2xl font-['Inter'] font-semibold">
                  {getInitials(formData.name)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#F02801] hover:bg-[#D22301] text-white flex items-center justify-center transition-all shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 font-['Roboto'] text-[#64748B]" style={{ fontSize: "13px" }}>
              Click the camera icon to change your photo
            </p>
          </div> */}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px" }}>
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px" }}>
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="profile-email" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px" }}>
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="profile-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  disabled={true}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                  required
                />
              </div>
            </div>

            {/* Post Code */}
            <div className="space-y-2">
              <Label htmlFor="postCode" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px" }}>
                Post Code
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="postCode"
                  type="tel"
                  placeholder="07123 456789"
                  value={formData.postCode}
                  onChange={(e) => setFormData({ ...formData, postCode: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 rounded-xl border-2 border-[#E5E7EB] hover:border-[#94A3B8] font-['Roboto'] font-medium"
                style={{ fontSize: "15px" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-xl bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
                style={{ fontSize: "15px" }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Account Actions */}
          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toast.info("Password change coming soon!")}
                className="text-left font-['Roboto'] text-[#F02801] hover:underline"
                style={{ fontSize: "14px" }}
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => toast.info("Privacy settings coming soon!")}
                className="text-left font-['Roboto'] text-[#64748B] hover:text-[#0F172A]"
                style={{ fontSize: "14px" }}
              >
                Privacy Settings
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
