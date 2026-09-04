"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Warehouse,
  FolderTree,
  Tag,
  ClipboardList,
  Users,
  MessageSquare,
  Percent,
  Image as ImageIcon,
  Sliders,
  Settings,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Bell,
  Sparkles
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Dashboard (ড্যাশবোর্ড)", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products (পণ্যসমূহ)", Icon: ShoppingBag },
  { href: "/admin/inventory", label: "Inventory (মজুত স্টক)", Icon: Warehouse },
  { href: "/admin/categories", label: "Categories (ক্যাটাগরি)", Icon: FolderTree },
  { href: "/admin/brands", label: "Brands (ব্র্যান্ড)", Icon: Tag },
  { href: "/admin/orders", label: "Orders (অর্ডারসমূহ)", Icon: ClipboardList },
  { href: "/admin/customers", label: "Customers (গ্রাহকবৃন্দ)", Icon: Users },
  { href: "/admin/reviews", label: "Reviews (রিভিউ নিয়ন্ত্রণ)", Icon: MessageSquare },
  { href: "/admin/coupons", label: "Coupons (কুপন ডিসকাউন্ট)", Icon: Percent },
  { href: "/admin/banners", label: "Banners (ব্যানার)", Icon: ImageIcon },
  { href: "/admin/homepage", label: "Homepage Control (হোম পেজ)", Icon: Sliders },
  { href: "/admin/settings", label: "Settings (সেটিংস)", Icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-[#F8FAF9] font-sans text-[#2B160F] antialiased overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#E8DCD2] flex-col justify-between py-5 px-4 shrink-0 overflow-y-auto">
        <div className="space-y-6">
          {/* Admin Logo */}
          <Link href="/admin" className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-lg shadow-sm">
              প
            </div>
            <div>
              <span className="font-black text-base text-[#3B0C04] tracking-tight block">
                PONCHOMUKH
              </span>
              <span className="text-[10px] text-[#8C7B72] font-bold uppercase tracking-wider block">
                Admin Control Center
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold">
            {adminNavItems.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    active
                      ? "bg-[#3B0C04] text-[#FFC40E] shadow-xs"
                      : "text-[#6B5A52] hover:bg-[#FFF7EE] hover:text-[#3B0C04]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? "text-[#FFC40E]" : "text-[#8C7B72]"}`} />
                    <span>{label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#FFC40E]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#E8DCD2] pt-4 px-2 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs font-bold text-[#3B0C04] hover:underline"
          >
            <span>গ্রাহক ওয়েবসাইট দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="text-[10px] text-[#8C7B72]">
            Version 2.0 (Ponchomukh E-Com)
          </div>
        </div>
      </aside>

      {/* MOBILE SIDEBAR MODAL */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-base">
                    প
                  </div>
                  <span className="font-bold text-sm text-[#3B0C04]">Admin Panel</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-[#8C7B72]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 text-xs font-bold">
                {adminNavItems.map(({ href, label, Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                        active
                          ? "bg-[#3B0C04] text-[#FFC40E]"
                          : "text-[#6B5A52] hover:bg-[#FFF7EE]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E8DCD2]">
              <Link
                href="/"
                className="block text-center text-xs font-bold text-[#3B0C04] py-2 bg-[#FFF7EE] rounded-lg"
              >
                গ্রাহক ওয়েবসাইটে যান →
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Top Header */}
        <header className="h-16 bg-white border-b border-[#E8DCD2] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 -ml-2 text-[#3B0C04] hover:bg-[#FFF7EE] rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm md:text-base font-bold text-[#2B160F] truncate">
              পঞ্চমুখ ই-কমার্স ম্যানেজমেন্ট পোর্টাল
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF7EE] border border-[#E8DCD2] text-xs font-bold text-[#3B0C04] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>লাইভ স্টোর ভিজিট</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E8DCD2]">
              <div className="w-8 h-8 rounded-full bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-xs">
                অ্যা
              </div>
              <span className="text-xs font-bold text-[#2B160F] hidden md:inline">
                Super Admin
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAF9]">
          {children}
        </main>
      </div>
    </div>
  );
}
