"use client";

import { ContactPage } from "@/page-components/contact";
import { useAppState } from "@/hooks/use-app-state";

export default function Contact() {
  const { handleNavigate, openSignupDialog } = useAppState();

  return (
    <ContactPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
    />
  );
}
