'use client';

import type { ReactNode } from "react";
import { Header } from "@/components/header";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
