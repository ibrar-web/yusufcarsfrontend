import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { fetchServiceCategories } from "@/actions/categories";
import { environment } from "@/utils/environment";

export default async function WebsiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Fetch categories on the server and pass down via props/context as needed.
  const categories = await fetchServiceCategories();
  if (environment.isDevelopment) {
    console.log("Loaded service categories", {
      count: categories.length,
      categories,
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
