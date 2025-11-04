"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { SignupDialog } from "@/components/signup-dialog";
import { SignInDialog } from "@/components/signin-dialog";
import { ProfileDialog } from "@/components/profile-dialog";
import { NotificationDialog } from "@/components/notification-dialog";
import { OrderConfirmationDialog } from "@/components/order-confirmation-dialog";
import { TrackOrderDialog } from "@/components/track-order-dialog";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);
  const [signinDialogOpen, setSigninDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [orderConfirmationDialogOpen, setOrderConfirmationDialogOpen] =
    useState(false);
  const [trackOrderDialogOpen, setTrackOrderDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignOut = () => {
    setIsAuthenticated(false);
    // Clear cookies
    document.cookie = "is_authenticated=; path=/; max-age=0";
    document.cookie = "user_role=; path=/; max-age=0";
  };

  const handleAuthSuccess = (role?: string) => {
    try {
      console.log("succes calling");
      setIsAuthenticated(true);
      // Set cookies (in production, this would be handled server-side)
      document.cookie = `is_authenticated=true; path=/; max-age=86400`;
      if (role) {
        document.cookie = `user_role=${role}; path=/; max-age=86400`;
      }
    } catch (error) {}
  };

  return (
    <>
      <Header
        onSignupClick={() => setSignupDialogOpen(true)}
        onSignInClick={() => setSigninDialogOpen(true)}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        onProfileClick={() => setProfileDialogOpen(true)}
        onNotificationClick={() => setNotificationDialogOpen(true)}
        onTrackOrderClick={() => setTrackOrderDialogOpen(true)}
      />

      {children}

      <Footer />

      {/* Global Dialogs */}
      <SignupDialog
        open={signupDialogOpen}
        onOpenChange={setSignupDialogOpen}
        onSignInClick={() => {
          setSignupDialogOpen(false);
          setSigninDialogOpen(true);
        }}
        onSuccess={handleAuthSuccess}
      />

      <SignInDialog
        open={signinDialogOpen}
        onOpenChange={setSigninDialogOpen}
        onSignUpClick={() => {
          setSigninDialogOpen(false);
          setSignupDialogOpen(true);
        }}
        onSuccess={handleAuthSuccess}
      />

      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />

      <NotificationDialog
        open={notificationDialogOpen}
        onOpenChange={setNotificationDialogOpen}
        quoteNotifications={null}
        onNavigate={() => {}}
      />

      <OrderConfirmationDialog
        open={orderConfirmationDialogOpen}
        onOpenChange={setOrderConfirmationDialogOpen}
        orderDetails={null}
        onNavigate={() => {}}
        onTrackOrder={() => {
          setOrderConfirmationDialogOpen(false);
          setTrackOrderDialogOpen(true);
        }}
      />

      <TrackOrderDialog
        open={trackOrderDialogOpen}
        onOpenChange={setTrackOrderDialogOpen}
        orderDetails={null}
        onNavigate={() => {}}
      />
    </>
  );
}
