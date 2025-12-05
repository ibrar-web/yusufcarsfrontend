'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import {
  adminAbuseReports,
  adminInquiries,
  adminPendingSuppliers,
  adminStats,
} from "@/page-components/admin-dashboard/data";
import {
  Building2,
  FileWarning,
  LayoutDashboard,
  MessageSquare,
  Users,
} from "lucide-react";
import { cn } from "@/components/ui/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { id: "overview", label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { id: "users", label: "Users", href: "/admin/users", icon: Users },
  { id: "suppliers", label: "Suppliers", href: "/admin/suppliers", icon: Building2 },
  { id: "inquiries", label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: FileWarning },
] as const;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navBadges: Record<string, number | undefined> = {
    suppliers: adminPendingSuppliers.length || undefined,
    inquiries: adminInquiries.filter((i) => i.status === "New").length || undefined,
    reports: adminAbuseReports.filter((r) => r.status === "Under Review").length || undefined,
    users: adminStats.totalUsers,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF3F2] via-white to-[#FEF3F2]">
      <Header />
      <div className="flex mt-[72px]">
        <aside className="w-64 border-r border-[#E5E7EB] min-h-[calc(100vh-72px)] bg-gradient-to-b from-[#FEF3F2] to-[#FEE2E2]/50 sticky top-[72px] h-[calc(100vh-72px)]">
          <div className="p-6">
            <h2 className="font-['Inter'] text-[#0F172A] mb-1">Admin Dashboard</h2>
            <p className="text-sm text-[#475569] font-['Roboto']">Platform management</p>
          </div>
          <nav className="px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all font-['Roboto']",
                    isActive ? "bg-[#F02801] text-white" : "text-[#475569] hover:bg-white/60",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span className="flex-1">{item.label}</span>
                  {navBadges[item.id] && navBadges[item.id]! > 0 && (
                    <span
                      className={cn(
                        "text-xs font-semibold min-w-[24px] h-5 px-2 rounded-full flex items-center justify-center",
                        item.id === "reports" ? "bg-[#FEE2E2] text-[#7F1D1D]" : "bg-[#F02801] text-white",
                      )}
                    >
                      {navBadges[item.id]}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-8 pt-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
