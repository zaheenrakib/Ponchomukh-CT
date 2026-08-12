"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BarChart2, ShoppingBag, Percent, Warehouse,
  ClipboardList, TrendingUp, Users, Mail, Settings, ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin",           label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics",  Icon: BarChart2 },
  { href: "/admin/products",  label: "Products",   Icon: ShoppingBag },
  { href: "/admin/offers",    label: "Offers",     Icon: Percent },
  { href: "/admin/inventory", label: "Inventory",  Icon: Warehouse },
  { href: "/admin/orders",    label: "Orders",     Icon: ClipboardList },
  { href: "/admin/sales",     label: "Sales",      Icon: TrendingUp },
  { href: "/admin/customers", label: "Customer",   Icon: Users },
  { href: "/admin/newsletter",label: "Newsletter", Icon: Mail },
  { href: "/admin/settings",  label: "Settings",   Icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-[#F4F6F8] font-sans text-zinc-800 antialiased overflow-hidden">

      {/* Persistent Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E6E8EC] flex flex-col justify-between py-6 px-5 shrink-0 text-left">
        <div className="flex flex-col gap-8">

          {/* Logo */}
          <div className="flex items-center gap-3 px-1">
            <div className="h-10 w-10 rounded-2xl bg-[#E6F9F2] flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#2CD49F]" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div>
              <span className="font-sans font-black text-base text-zinc-900 tracking-tight block">
                Pixel Commerce
              </span>
              <span className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase block">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1.5 text-xs font-bold">
            {navItems.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-[#E6F9F2] text-[#1FA67A]"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                  {active && <ChevronRight className="h-3.5 w-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-zinc-100 pt-4 px-2 space-y-2">
          <Link
            href="/"
            className="text-[10px] font-black text-zinc-500 hover:text-[#3B0C04] tracking-wide uppercase flex items-center gap-1.5"
          >
            ← View Customer Web
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="w-full text-left text-[10px] font-black text-rose-600 hover:underline tracking-wide uppercase"
          >
            🔒 Sign Out
          </button>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
