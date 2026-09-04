"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User, Store } from "lucide-react";
import { useCart } from "@/context/cart-context";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, wishlistCount, setIsCartOpen } = useCart();

  // Don't show bottom nav inside admin panel
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8DCD2] shadow-lg lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
            pathname === "/" ? "text-[#3B0C04] font-bold" : "text-[#6B5A52]"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>হোম</span>
        </Link>

        {/* Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
            pathname.startsWith("/shop") || pathname.startsWith("/category")
              ? "text-[#3B0C04] font-bold"
              : "text-[#6B5A52]"
          }`}
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span>শপ</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
            pathname === "/wishlist" ? "text-[#3B0C04] font-bold" : "text-[#6B5A52]"
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5 mb-0.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#D64545] text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>উইশলিস্ট</span>
        </Link>

        {/* Account */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
            pathname.startsWith("/account") || pathname.startsWith("/login")
              ? "text-[#3B0C04] font-bold"
              : "text-[#6B5A52]"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>প্রোফাইল</span>
        </Link>

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-[#3B0C04]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#FFC40E] text-[#260700] text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>কার্ট</span>
        </button>
      </div>
    </nav>
  );
};
