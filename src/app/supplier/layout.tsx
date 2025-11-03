'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

const navigation = [
  { name: 'Dashboard', href: '/supplier/dashboard', icon: LayoutDashboard },
  { name: 'Enquiries', href: '/supplier/enquiries', icon: FileText },
  { name: 'Messages', href: '/supplier/messages', icon: MessageSquare, badge: 3 },
  { name: 'Settings', href: '/supplier/settings', icon: Settings },
];

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => {
    document.cookie = 'is_authenticated=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0F172A]/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-[#E2E8F0] transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-[#E2E8F0]">
            <Link href="/supplier/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F02801] flex items-center justify-center">
                <span className="font-['Inter'] text-white">PQ</span>
              </div>
              <span className="font-['Inter'] text-[#0F172A]">Supplier Portal</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2.5 font-[\'Roboto\'] transition-colors',
                    isActive
                      ? 'bg-[#F02801]/10 text-[#F02801]'
                      : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge className="bg-[#F02801] text-white border-none">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Supplier Info */}
          <div className="border-t border-[#E2E8F0] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F02801]/10 flex items-center justify-center">
                <span className="font-['Inter'] text-[#F02801]">AP</span>
              </div>
              <div className="flex-1">
                <p className="font-['Roboto'] font-medium text-[#0F172A]">AutoParts Express</p>
                <p className="font-['Roboto'] text-[#475569]">Verified Supplier</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-['Roboto']">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-['Inter'] text-[#0F172A]">Supplier Portal</h1>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] lg:min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
