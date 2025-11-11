'use client';

import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { usePathname } from "next/navigation";

const PATH_TO_PAGE: Array<{ match: (pathname: string) => boolean; page: string }> = [
  { match: (path) => path === "/", page: "home" },
  { match: (path) => path.startsWith("/how-it-works"), page: "how-it-works" },
  { match: (path) => path.startsWith("/suppliers"), page: "suppliers" },
  { match: (path) => path.startsWith("/contact"), page: "contact" },
  { match: (path) => path.startsWith("/about"), page: "about" },
  { match: (path) => path.startsWith("/products"), page: "products" },
  { match: (path) => path.startsWith("/parts-selection"), page: "parts-selection" },
  { match: (path) => path.startsWith("/request-flow"), page: "request-flow" },
  { match: (path) => path.startsWith("/vehicle-confirmation"), page: "vehicle-confirmation" },
];

function resolveCurrentPage(pathname: string) {
  const entry = PATH_TO_PAGE.find(({ match }) => match(pathname));
  return entry?.page;
}

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPage = resolveCurrentPage(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
