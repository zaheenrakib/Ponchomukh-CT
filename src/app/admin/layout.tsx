"use client";

import React, { useState, useEffect } from "react";
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
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  CreditCard,
  FileSpreadsheet,
  Wallet,
  Store,
  Layers,
  BarChart3,
  PlusCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  Bell
} from "lucide-react";

interface SubNavItem {
  href: string;
  label: string;
  badge?: string;
}

interface NavModule {
  id: string;
  label: string;
  Icon: any;
  subItems?: SubNavItem[];
  href?: string;
  badge?: string;
}

const erpNavModules: NavModule[] = [
  {
    id: "dashboard",
    label: "ERP Dashboard",
    href: "/admin",
    Icon: LayoutDashboard,
  },
  {
    id: "pos",
    label: "POS Terminal",
    href: "/admin/pos",
    Icon: Store,
    badge: "LIVE POS",
  },
  {
    id: "master-data",
    label: "Master Data",
    Icon: Layers,
    subItems: [
      { href: "/admin/categories", label: "Categories & Taxonomies" },
      { href: "/admin/brands", label: "Brand Management" },
      { href: "/admin/products", label: "Product Catalog" },
      { href: "/admin/products/add", label: "New Item Onboarding" },
    ],
  },
  {
    id: "sales-orders",
    label: "Sales & Orders",
    Icon: ClipboardList,
    subItems: [
      { href: "/admin/orders", label: "All Sales Orders" },
      { href: "/admin/orders?channel=ECOMMERCE", label: "E-Commerce Orders", badge: "Online" },
      { href: "/admin/orders?channel=POS", label: "POS In-Store Sales", badge: "Counter" },
      { href: "/admin/orders?channel=LANDING_PAGE", label: "Landing Page Funnels" },
    ],
  },
  {
    id: "inventory",
    label: "Inventory & Stock",
    Icon: Warehouse,
    subItems: [
      { href: "/admin/inventory", label: "Stock Warehouse & Alert" },
    ],
  },
  {
    id: "finance-accounts",
    label: "Finance & Accounts",
    Icon: Wallet,
    subItems: [
      { href: "/admin/accounts", label: "Ledger & Operating Expenses" },
    ],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    Icon: FileSpreadsheet,
    subItems: [
      { href: "/admin/reports", label: "Sales & P&L Reports" },
      { href: "/admin/reports", label: "Product Buyer Directory" },
    ],
  },
  {
    id: "crm",
    label: "CRM & Customers",
    Icon: Users,
    subItems: [
      { href: "/admin/customers", label: "Customer Accounts" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & CMS",
    Icon: Sparkles,
    subItems: [
      { href: "/admin/banners", label: "Hero & Promo Banners" },
      { href: "/admin/coupons", label: "Discount Coupons" },
      { href: "/admin/reviews", label: "Customer Reviews" },
      { href: "/admin/homepage", label: "Storefront Homepage" },
    ],
  },
  {
    id: "settings",
    label: "System Settings",
    href: "/admin/settings",
    Icon: Settings,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    "master-data": true,
    "sales-orders": true,
  });

  // Keep active module expanded based on URL
  useEffect(() => {
    erpNavModules.forEach((mod) => {
      if (mod.subItems?.some((sub) => pathname === sub.href.split("?")[0])) {
        setOpenModules((prev) => ({ ...prev, [mod.id]: true }));
      }
    });
  }, [pathname]);

  const toggleModule = (id: string) => {
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // If on login page, render children without sidebar & admin header
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isLinkActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    const cleanHref = href.split("?")[0];
    return pathname === cleanHref;
  };

  return (
    <div className="flex h-screen bg-[#F8FAF9] font-sans text-[#2B160F] antialiased overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#E8DCD2] flex-col justify-between shrink-0 overflow-y-auto">
        <div className="py-5 px-4 space-y-5">
          {/* Admin ERP Brand Header */}
          <Link href="/admin" className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              P
            </div>
            <div className="min-w-0">
              <span className="font-black text-base text-[#3B0C04] tracking-tight block leading-tight">
                PONCHOMUKH
              </span>
              <span className="text-[10px] text-[#8C7B72] font-bold uppercase tracking-wider block">
                Enterprise ERP v3.0
              </span>
            </div>
          </Link>

          {/* Quick POS Terminal Button */}
          <div className="px-1">
            <Link
              href="/admin/pos"
              className="w-full h-11 px-3.5 rounded-xl bg-gradient-to-r from-[#3B0C04] to-[#260700] hover:from-[#4C1005] hover:to-[#3B0C04] text-[#FFC40E] font-bold text-xs flex items-center justify-between shadow-md transition-all active:scale-98 group"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-[#FFC40E] group-hover:scale-110 transition-transform" />
                <span>Launch POS Terminal</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFC40E] text-[#3B0C04] font-black uppercase tracking-wider">
                Sale
              </span>
            </Link>
          </div>

          {/* ERP Module Navigation */}
          <nav className="space-y-1 text-xs font-semibold">
            <div className="px-2 pb-1.5 text-[10px] font-black text-[#8C7B72] uppercase tracking-wider">
              Core ERP Modules
            </div>

            {erpNavModules.map((module) => {
              if (module.subItems) {
                const isOpen = !!openModules[module.id];
                const hasActiveChild = module.subItems.some((s) => isLinkActive(s.href));

                return (
                  <div key={module.id} className="space-y-1">
                    {/* Collapsible Module Header */}
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                        hasActiveChild
                          ? "bg-[#FFF7EE] text-[#3B0C04] font-bold"
                          : "text-[#6B5A52] hover:bg-[#FFFDF9] hover:text-[#3B0C04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <module.Icon className={`w-4 h-4 ${hasActiveChild ? "text-[#3B0C04]" : "text-[#8C7B72]"}`} />
                        <span>{module.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#8C7B72] transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Sub-items list */}
                    {isOpen && (
                      <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-[#E8DCD2] ml-4">
                        {module.subItems.map((sub) => {
                          const active = isLinkActive(sub.href);
                          return (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-medium transition-all ${
                                active
                                  ? "bg-[#3B0C04] text-[#FFC40E] font-bold shadow-2xs"
                                  : "text-[#6B5A52] hover:bg-[#FFF7EE] hover:text-[#3B0C04]"
                              }`}
                            >
                              <span className="truncate">{sub.label}</span>
                              {sub.badge && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                                    active
                                      ? "bg-[#FFC40E] text-[#3B0C04]"
                                      : "bg-[#E8DCD2] text-[#3B0C04]"
                                  }`}
                                >
                                  {sub.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Single direct link module
              const active = isLinkActive(module.href || "");
              return (
                <Link
                  key={module.id}
                  href={module.href || "#"}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    active
                      ? "bg-[#3B0C04] text-[#FFC40E] font-bold shadow-2xs"
                      : "text-[#6B5A52] hover:bg-[#FFF7EE] hover:text-[#3B0C04]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <module.Icon className={`w-4 h-4 ${active ? "text-[#FFC40E]" : "text-[#8C7B72]"}`} />
                    <span>{module.label}</span>
                  </div>
                  {module.badge ? (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#16834A] text-white font-bold uppercase">
                      {module.badge}
                    </span>
                  ) : active ? (
                    <ChevronRight className="w-3.5 h-3.5 text-[#FFC40E]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#E8DCD2] p-4 bg-white space-y-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FFF7EE] text-xs font-bold text-[#3B0C04] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-colors"
          >
            <span>Live Web Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center justify-between text-[11px] text-[#8C7B72] px-1">
            <span>Terminal: Register #01</span>
            <span className="font-semibold text-[#16834A] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16834A] animate-pulse" />
              Online
            </span>
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
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-base">
                    P
                  </div>
                  <div>
                    <span className="font-black text-sm text-[#3B0C04] block">PONCHOMUKH</span>
                    <span className="text-[10px] text-[#8C7B72] font-bold">Enterprise ERP</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-[#8C7B72]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* POS quick button */}
              <Link
                href="/admin/pos"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#3B0C04] text-[#FFC40E] font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <Store className="w-4 h-4" />
                <span>Open POS Terminal</span>
              </Link>

              {/* Mobile Module Navigation */}
              <nav className="space-y-1 text-xs">
                {erpNavModules.map((module) => {
                  if (module.subItems) {
                    return (
                      <div key={module.id} className="space-y-1">
                        <div className="px-3 pt-2 text-[10px] font-black text-[#8C7B72] uppercase tracking-wider">
                          {module.label}
                        </div>
                        {module.subItems.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`flex items-center justify-between px-3.5 py-2 rounded-lg ${
                              isLinkActive(sub.href)
                                ? "bg-[#3B0C04] text-[#FFC40E] font-bold"
                                : "text-[#6B5A52] hover:bg-[#FFF7EE]"
                            }`}
                          >
                            <span>{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={module.id}
                      href={module.href || "#"}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl ${
                        isLinkActive(module.href || "")
                          ? "bg-[#3B0C04] text-[#FFC40E] font-bold"
                          : "text-[#6B5A52] hover:bg-[#FFF7EE]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <module.Icon className="w-4 h-4" />
                        <span>{module.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E8DCD2]">
              <Link
                href="/"
                target="_blank"
                className="block text-center text-xs font-bold text-[#3B0C04] py-2 bg-[#FFF7EE] rounded-lg"
              >
                Open Online Storefront →
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Top Header */}
        <header className="h-16 bg-white border-b border-[#E8DCD2] px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-[#3B0C04] hover:bg-[#FFF7EE] rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-sm md:text-base font-black text-[#3B0C04] tracking-tight">
                Enterprise Resource Planning (ERP) Hub
              </h1>
              <p className="text-[11px] text-[#8C7B72] hidden sm:block">
                Unified Sales, POS, Master Data, Inventory & Financial Accounting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick POS Launch Button in Header */}
            <Link
              href="/admin/pos"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span>POS Terminal</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF7EE] border border-[#E8DCD2] text-xs font-bold text-[#3B0C04] hover:bg-[#3B0C04] hover:text-[#FFC40E] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E8DCD2]">
              <div className="w-9 h-9 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-xs shadow-2xs">
                SA
              </div>
              <div className="hidden md:block leading-tight text-left">
                <span className="text-xs font-bold text-[#2B160F] block">
                  Super Administrator
                </span>
                <span className="text-[10px] text-[#16834A] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16834A]" />
                  Active Session
                </span>
              </div>
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
