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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, Mail, Phone, Camera, Save } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [formData, setFormData] = useState({
    name: "John Smith",
    email: "john@example.com",
    phone: "07123 456789",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Profile updated successfully!");
      onOpenChange(false);
    }, 1500);
  };

  const handleAvatarChange = () => {
    toast.info("Avatar upload coming soon!");
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
          <div className="flex flex-col items-center mb-8">
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
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px" }}>
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="profile-name"
                  type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="profile-phone" className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: "14px" }}>
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="profile-phone"
                  type="tel"
                  placeholder="07123 456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
