import { useEffect, useRef, useState } from "react";
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
import { User, Mail, MapPin, Camera, Phone } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPut } from "@/utils/apiconfig/http";
import { apiRoutes } from "@/utils/apiroutes";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postCode: string;
  image?: File | null;
};

type UserProfileApiResponse = {
  data?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    postCode?: string;
    profileImageUrl?: string;
  };
};

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "John",
    lastName: "Smith",
    email: "john@example.com",
    phone: "",
    postCode: "B1 1BD",
    image: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarScale, setAvatarScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          phone: payload.phone ?? "",
          postCode: payload.postCode ?? "",
        }));
        if (payload.profileImageUrl) {
          setAvatarPreview(payload.profileImageUrl);
        }
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
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isMultipart = Boolean(formData.image);
      const payload = isMultipart
        ? buildMultipartPayload()
        : (({ image, ...rest }) => rest)(formData);
      const response = await apiPut<any>(
        apiRoutes?.user?.profile?.update,
        payload,
        isMultipart
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined
      );
      if (response?.statusCode === 200) {
        toast.success("Profile updated successfully!");
        onOpenChange(false);
      }
    } catch (err) {
      console.log("err is as:  ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildMultipartPayload = () => {
    const multipart = new FormData();
    const { image, ...rest } = formData;
    Object.entries(rest).forEach(([key, value]) => {
      multipart.append(key, value ?? "");
    });
    if (image) {
      multipart.append("image", image);
    }
    return multipart;
  };

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    const url = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return url;
    });
  };

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const getInitials = () => {
    const parts = [formData.firstName, formData.lastName]
      .filter(Boolean)
      .map((part) => part?.[0] ?? "");
    return parts.join("").toUpperCase().slice(0, 2) || "?";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle
            className="font-['Inter'] text-[#0F172A]"
            style={{ fontSize: "28px" }}
          >
            My Profile
          </DialogTitle>
          <DialogDescription
            className="font-['Roboto'] text-[#64748B]"
            style={{ fontSize: "15px" }}
          >
            Update your personal information and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-3">
            <p className="text-sm font-['Inter'] text-[#0F172A] font-semibold">
              Profile photo
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 rounded-full ring-2 ring-[#F02801]/60 shadow-lg overflow-hidden bg-white">
                  <AvatarImage
                    src={avatarPreview ?? undefined}
                    alt={formData.firstName}
                    className="h-full w-full object-cover"
                    style={{ transform: `scale(${avatarScale})` }}
                  />
                  {!avatarPreview && (
                    <AvatarFallback className="bg-[#F02801] text-white text-2xl font-['Inter'] font-semibold">
                      {getInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="text-xs text-[#94A3B8]">JPG, PNG up to 5MB</p>
                </div>
                <button
                  type="button"
                  onClick={handleAvatarChange}
                  className="h-10 w-10 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[#F02801] hover:bg-[#F02801] hover:text-white transition"
                  aria-label="Edit profile photo"
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <div>
                <label className="text-xs font-['Roboto'] text-[#475569]">
                  Adjust zoom
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={avatarScale}
                  onChange={(event) =>
                    setAvatarScale(Number(event.target.value))
                  }
                  className="w-full h-1 rounded-full accent-[#F02801] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarInputChange}
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="font-['Roboto'] text-[#0F172A]"
                  style={{ fontSize: "14px" }}
                >
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="font-['Roboto'] text-[#0F172A]"
                  style={{ fontSize: "14px" }}
                >
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="profile-email"
                className="font-['Roboto'] text-[#0F172A]"
                style={{ fontSize: "14px" }}
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="profile-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  disabled
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="profile-phone"
                className="font-['Roboto'] text-[#0F172A]"
                style={{ fontSize: "14px" }}
              >
                Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="profile-phone"
                  type="tel"
                  placeholder="07123 456789"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="profile-postcode"
                className="font-['Roboto'] text-[#0F172A]"
                style={{ fontSize: "14px" }}
              >
                Postcode
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <Input
                  id="profile-postcode"
                  type="text"
                  placeholder="B1 1BD"
                  value={formData.postCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postCode: e.target.value })
                  }
                  className="pl-10 h-12 rounded-xl border-2 border-[#E5E7EB] focus:border-[#F02801] font-['Roboto']"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-3xl bg-[#F02801] text-white font-['Roboto'] h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
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
