"use client";

import { ContactPage } from "@/page-components/contact";
import { useAppState } from "@/app/providers/app-state";

export default function Contact() {
  const { handleNavigate, openSignupDialog } = useAppState();

  return (
    <ContactPage
      onNavigate={handleNavigate}
      onSignupClick={openSignupDialog}
    />
  );
}
