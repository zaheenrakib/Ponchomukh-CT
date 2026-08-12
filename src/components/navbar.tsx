"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import {
  Search, ShoppingBag, Heart, User, ChevronDown, Menu, X, Home, Grid
} from "lucide-react";
import { mockCategories } from "@/lib/mockData";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory
  } = useCart();

  const [announcementText, setAnnouncementText] = useState("🚚 সারা বাংলাদেশে হোম ডেলিভারি | Cash on Delivery Available");
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch Announcement Bar settings
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.announcement_text) {
          setAnnouncementText(data.settings.announcement_text);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-850 shadow-xs transition-colors">
      
      {/* 1. TOP ANNOUNCEMENT BAR (PART 05 Blueprint: 36px Desktop) */}
      {showAnnouncement && (
        <div className="bg-[#3B0C04] text-[#FFF7EE] py-2 px-4 text-xs font-semibold tracking-wide border-b border-[#260700]">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex-1 text-center sm:text-left text-[11px] sm:text-xs">
              {announcementText}
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="text-[#FFF7EE]/70 hover:text-white ml-2 text-xs"
              aria-label="Dismiss Announcement"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. MAIN HEADER (PART 06 Blueprint: 72px Height Desktop) */}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => {
            setSelectedCategory(null);
            setSearchQuery("");
          }}
          className="flex items-center gap-1.5 shrink-0 group"
        >
          <div className="flex flex-col text-left">
            <span className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-[#3B0C04] dark:text-white">
              পঞ্চমুখ<span className="text-[#FFC40E] font-extrabold text-xl sm:text-2xl">.com</span>
            </span>
            <span className="text-[9px] font-bold text-[#8C7B72] dark:text-zinc-400 -mt-1 hidden sm:inline">
              পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ।
            </span>
          </div>
        </Link>

        {/* Search Bar Container (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-xl items-center gap-2 relative">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="আপনি কী খুঁজছেন? (Product, SKU, Category...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/50 text-xs font-semibold transition-all outline-none focus:border-[#3B0C04] focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="hidden sm:flex flex-col items-center gap-0.5 p-2 text-zinc-700 hover:text-[#3B0C04] dark:text-zinc-300 dark:hover:text-white transition-colors"
            title="Wishlist"
          >
            <Heart className="h-5 w-5" />
            <span className="text-[10px] font-extrabold">Wishlist</span>
          </Link>

          {/* Account Icon */}
          <Link
            href="/account"
            className="flex flex-col items-center gap-0.5 p-2 text-zinc-700 hover:text-[#3B0C04] dark:text-zinc-300 dark:hover:text-white transition-colors"
            title="Account"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-extrabold hidden sm:inline">Account</span>
          </Link>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#3B0C04] text-white hover:bg-[#260700] transition-all active:scale-95 shadow-sm"
            title="Cart"
          >
            <ShoppingBag className="h-5 w-5 text-[#FFC40E]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFC40E] text-[10px] font-black text-[#3B0C04] ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH ROW (PART 08 Blueprint: 44px Search Row) */}
      <div className="lg:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="🔍  আপনি কী খুঁজছেন? Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/60 text-xs font-semibold outline-none focus:border-[#3B0C04] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION BAR (PART 07 Blueprint: 48px Height) */}
      <div className="hidden lg:block border-t border-[#E8DCD2]/50 bg-[#FFF7EE]/40 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-8 text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
          
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`hover:text-[#3B0C04] transition-colors ${pathname === "/" ? "text-[#3B0C04] font-black" : ""}`}
            >
              Home
            </Link>

            <Link
              href="/shop"
              className={`hover:text-[#3B0C04] transition-colors ${pathname === "/shop" ? "text-[#3B0C04] font-black" : ""}`}
            >
              Shop
            </Link>

            {/* Categories Mega Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-1 hover:text-[#3B0C04] transition-colors py-3"
              >
                <span>Categories</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {isCategoryDropdownOpen && (
                <div
                  className="absolute top-full left-0 z-50 w-56 rounded-xl border border-[#E8DCD2] bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in-50"
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                >
                  {mockCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setIsCategoryDropdownOpen(false)}
                      className="block px-3 py-2 rounded-lg text-xs font-bold text-zinc-700 hover:bg-[#FFF7EE] hover:text-[#3B0C04] dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/shop?filter=new" className="hover:text-[#3B0C04] transition-colors">
              New Arrivals
            </Link>

            <Link href="/shop?filter=bestseller" className="hover:text-[#3B0C04] transition-colors">
              Best Sellers
            </Link>

            <Link href="/shop?filter=offers" className="text-rose-600 font-black hover:text-rose-700 transition-colors">
              🔥 Offers
            </Link>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-zinc-600 dark:text-zinc-400">
            <Link href="/about" className="hover:text-[#3B0C04] transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-[#3B0C04] transition-colors">Contact</Link>
            <Link href="/order-tracking" className="font-bold text-[#3B0C04] dark:text-white hover:underline">Track Order</Link>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white dark:bg-zinc-950 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                <span className="font-black text-xl text-[#3B0C04] dark:text-white">পঞ্চমুখ</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5 text-zinc-500" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-3 font-bold text-sm">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-zinc-100">Home</Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-zinc-100">Shop All</Link>
                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-zinc-100">Wishlist</Link>
                <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-zinc-100">My Orders</Link>
                <Link href="/order-tracking" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-zinc-100">Track Order</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-zinc-100">About Us</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2">Contact Us</Link>
              </nav>
            </div>

            <div className="pt-4 border-t border-zinc-150 text-xs font-semibold text-zinc-500">
              📞 +880 1700-000000
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* MOBILE STICKY BOTTOM NAVIGATION (PART 01 Blueprint) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-950 border-t border-[#E8DCD2] dark:border-zinc-800 py-2 px-4 flex justify-around items-center shadow-lg">
        <Link href="/" className="flex flex-col items-center gap-0.5 text-zinc-700 dark:text-zinc-300">
          <Home className="h-5 w-5" />
          <span className="text-[9px] font-bold">Home</span>
        </Link>

        <Link href="/shop" className="flex flex-col items-center gap-0.5 text-zinc-700 dark:text-zinc-300">
          <Grid className="h-5 w-5" />
          <span className="text-[9px] font-bold">Shop</span>
        </Link>

        <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-zinc-700 dark:text-zinc-300">
          <Heart className="h-5 w-5" />
          <span className="text-[9px] font-bold">Wishlist</span>
        </Link>

        <Link href="/account" className="flex flex-col items-center gap-0.5 text-zinc-700 dark:text-zinc-300">
          <User className="h-5 w-5" />
          <span className="text-[9px] font-bold">Account</span>
        </Link>

        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-0.5 text-[#3B0C04] relative">
          <ShoppingBag className="h-5 w-5 text-[#3B0C04]" />
          <span className="text-[9px] font-bold">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC40E] text-[8px] font-black text-[#3B0C04]">
              {cartCount}
            </span>
          )}
        </button>
      </div>

    </header>
  );
};
