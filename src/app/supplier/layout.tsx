'use client';

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, BarChart3, Proportions, FileText, Menu, MessageSquare, Send, Settings, Blocks, LogOut } from "lucide-react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supplierMessages, supplierQuotes, supplierRequests } from "@/page-components/supplier-dashboard/data";
import { useAppState } from "@/hooks/use-app-state";
import { SignOutDialog } from "@/components/signout-dialog";

interface SupplierLayoutProps {
  children: ReactNode;
}

export default function SupplierLayout({ children }: SupplierLayoutProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { handleSignOut } = useAppState();
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const navItems = useMemo(
    () => [
      {
        id: "requests",
        label: "New Requests",
        href: "/supplier/requests",
        icon: AlertCircle,
        badge: supplierRequests.filter((request) => request.status === "new").length,
      },
      {
        id: "quotes",
        label: "My Quotes",
        href: "/supplier/quotes",
        icon: Send,
        badge: supplierQuotes.length,
      },
      {
        id: "orders",
        label: "My Orders",
        href: "/supplier/orders",
        icon: Blocks,
        // badge: supplierQuotes.length,
      },
      {
        id: "analytics",
        label: "Analytics",
        href: "/supplier/analytics",
        icon: BarChart3,
      },
      {
        id: "reports",
        label: "Reports",
        href: "/supplier/reports",
        icon: Proportions,
      },
      {
        id: "blogs",
        label: "Blog Posts",
        href: "/supplier/blogs",
        icon: FileText,
      },
      {
        id: "messages",
        label: "Messages",
        href: "/supplier/messages",
        icon: MessageSquare,
        badge: supplierMessages.filter((message) => message.unread > 0).length,
      },
      {
        id: "profile",
        label: "Profile & Settings",
        href: "/supplier/profile",
        icon: Settings,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />

      <div className="flex pt-20">
        <aside
          className={`${
            sidebarCollapsed ? "w-20" : "w-72"
          } bg-[#FFFFFF] min-h-[calc(100vh-5rem)] fixed left-0 top-20 transition-all duration-300 flex flex-col border-r border-[#E5E7EB]`}
        >
          <div className="p-6 border-b border-[#E5E7EB] bg-[#FEF2F2] flex items-center justify-between">
            {!sidebarCollapsed ? (
              <div>
                <h1 className="font-['Inter'] text-[#0F172A]">PartsQuote</h1>
                <p className="text-xs text-[#475569] font-['Roboto']">Supplier Portal</p>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <span className="font-['Inter'] text-[#F02801]">PQ</span>
              </div>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="text-[#475569] hover:text-[#F02801]"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1 bg-[#FEF2F2]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-['Roboto'] ${
                    isActive
                      ? "bg-[#F02801] text-white shadow-md"
                      : "text-[#475569] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge className="bg-[#F59E0B] text-white border-0 h-5 min-w-[20px] px-1.5 flex items-center justify-center font-['Roboto'] text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-[#FBD5D5] bg-[#FEF2F2]">
            <Button
              variant="outline"
              className={`w-full ${sidebarCollapsed ? "justify-center" : "justify-center gap-2"} rounded-xl border-[#FBD5D5] text-[#B91C1C] hover:bg-white cursor-pointer`}
              onClick={() => setSignOutDialogOpen(true)}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </aside>

        <main
          className={`flex-1 ${
            sidebarCollapsed ? "ml-20" : "ml-72"
          } transition-all duration-300 bg-[#FFFFFF] `}
        >
          <div className="p-6 overflow-hidden">{children}</div>
        </main>
      </div>
      <SignOutDialog
        open={signOutDialogOpen}
        onOpenChange={setSignOutDialogOpen}
        onConfirm={handleSignOut}
      />
    </div>
  );
}
