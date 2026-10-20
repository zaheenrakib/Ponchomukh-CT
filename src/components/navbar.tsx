"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { mockCategories, mockProducts } from "@/lib/mockData";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  MessageCircle,
  ShieldCheck,
  PackageCheck,
  Sparkles
} from "lucide-react";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, wishlistCount, setIsCartOpen, searchQuery, setSearchQuery } = useCart();
  const { t, formatPrice } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || "");

  const searchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsAccountDropdownOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      router.push(`/search?q=${encodeURIComponent(localSearch.trim())}`);
      setSearchFocused(false);
    }
  };

  const searchSuggestions = localSearch.trim()
    ? mockProducts.filter((p) =>
        p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        p.category.name.toLowerCase().includes(localSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E8DCD2] shadow-xs">
      {/* DESKTOP HEADER (72px) */}
      <div className="hidden lg:block border-b border-[#E8DCD2]/60">
        <div className="container-custom h-[72px] flex items-center justify-between gap-6">
          {/* Brand Logo (Left) */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-xl shadow-sm border border-[#FFC40E]/30 group-hover:scale-105 transition-transform">
              প
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#3B0C04] leading-none">
                PONCHOMUKH
              </span>
              <span className="text-[11px] font-medium text-[#6B5A52] tracking-wide mt-0.5">
                পঞ্চমুখ • পছন্দে, প্রয়োজনে, প্রাপ্তিতে
              </span>
            </div>
          </Link>

          {/* Search Bar (Center 440px) */}
          <div ref={searchRef} className="relative flex-1 max-w-[480px]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t("nav.searchPlaceholder")}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full h-11 pl-11 pr-24 rounded-lg bg-[#FFFDF9] border border-[#E8DCD2] text-sm text-[#2B160F] placeholder-[#8C7B72] focus:outline-none focus:border-[#3B0C04] focus:ring-1 focus:ring-[#3B0C04] transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B72]" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3.5 bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-semibold rounded-md transition-colors"
              >
                {t("nav.searchBtn")}
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {searchFocused && localSearch.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E8DCD2] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 duration-150">
                <div className="p-2 border-b border-[#E8DCD2] bg-[#FFF7EE] text-xs font-semibold text-[#3B0C04] flex items-center justify-between">
                  <span>{t("nav.searchResults")} ({searchSuggestions.length})</span>
                  <span className="text-[11px] text-[#6B5A52]">{t("nav.pressEnter")}</span>
                </div>
                {searchSuggestions.length > 0 ? (
                  <div className="divide-y divide-[#E8DCD2]/40 max-h-72 overflow-y-auto">
                    {searchSuggestions.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={() => setSearchFocused(false)}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#FFF7EE] transition-colors"
                      >
                        <img
                          src={item.images[0]?.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-md bg-[#FFFDF9] shrink-0 border border-[#E8DCD2]/50"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#2B160F] truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#3B0C04] font-bold mt-0.5">
                            {formatPrice(item.salePrice || item.basePrice)}
                            {item.salePrice && (
                              <span className="text-[#8C7B72] line-through font-normal ml-1.5">
                                {formatPrice(item.basePrice)}
                              </span>
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#8C7B72]">
                    {t("nav.noResults")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Actions (Right) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher variant="pill" />

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg text-[#2B160F] hover:text-[#3B0C04] hover:bg-[#FFF7EE] transition-colors flex items-center gap-1.5"
              title={t("nav.wishlist")}
            >
              <div className="relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#D64545] text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium hidden xl:inline">{t("nav.wishlist")}</span>
            </Link>

            {/* Account Dropdown */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="p-2 rounded-lg text-[#2B160F] hover:text-[#3B0C04] hover:bg-[#FFF7EE] transition-colors flex items-center gap-1.5"
              >
                <User className="w-5 h-5" />
                <span className="text-xs font-medium hidden xl:inline">{t("nav.account")}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C7B72]" />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#E8DCD2] rounded-xl shadow-xl py-2 z-50 animate-in fade-in-50 duration-150">
                  <div className="px-4 py-2 border-b border-[#E8DCD2]/60 mb-1">
                    <p className="text-xs font-bold text-[#3B0C04]">{t("nav.welcome")}</p>
                    <p className="text-[11px] text-[#6B5A52]">{t("nav.manageAccount")}</p>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2B160F] hover:bg-[#FFF7EE] hover:text-[#3B0C04]"
                  >
                    <User className="w-4 h-4 text-[#8C7B72]" />
                    <span>{t("nav.myAccount")}</span>
                  </Link>
                  <Link
                    href="/account?tab=orders"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2B160F] hover:bg-[#FFF7EE] hover:text-[#3B0C04]"
                  >
                    <PackageCheck className="w-4 h-4 text-[#8C7B72]" />
                    <span>{t("nav.myOrders")}</span>
                  </Link>
                  <Link
                    href="/order-tracking"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2B160F] hover:bg-[#FFF7EE] hover:text-[#3B0C04]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#8C7B72]" />
                    <span>{t("nav.orderTracking")}</span>
                  </Link>
                  <div className="border-t border-[#E8DCD2]/60 my-1 pt-1">
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#3B0C04] font-semibold hover:bg-[#FFF7EE]"
                    >
                      <Sparkles className="w-4 h-4 text-[#FFC40E]" />
                      <span>{t("nav.adminPanel")}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 h-11 px-4 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] transition-colors shadow-xs"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#FFC40E] text-[#260700] text-[11px] font-black flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-wide">
                {t("nav.cart")} {cartCount > 0 && `(${cartCount})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP NAVIGATION BAR (48px) */}
      <div className="hidden lg:block bg-white">
        <div className="container-custom h-12 flex items-center justify-between">
          <nav className="flex items-center gap-7 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-[#3B0C04] ${
                pathname === "/" ? "text-[#3B0C04] font-bold" : "text-[#2B160F]"
              }`}
            >
              {t("nav.home")}
            </Link>

            {/* Categories Mega Dropdown */}
            <div ref={categoryRef} className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`flex items-center gap-1.5 transition-colors hover:text-[#3B0C04] ${
                  pathname.startsWith("/category") || pathname.startsWith("/shop")
                    ? "text-[#3B0C04] font-bold"
                    : "text-[#2B160F]"
                }`}
              >
                <span>{t("nav.categories")}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#E8DCD2] rounded-xl shadow-xl py-2 z-50 animate-in fade-in-50 duration-150">
                  <div className="px-3 py-1.5 text-xs font-bold text-[#6B5A52] uppercase tracking-wider border-b border-[#E8DCD2]/40 mb-1">
                    {t("nav.allCategories")}
                  </div>
                  {mockCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-xs text-[#2B160F] hover:bg-[#FFF7EE] hover:text-[#3B0C04] transition-colors"
                    >
                      <span className="font-semibold">{cat.name}</span>
                      <span className="text-[10px] text-[#8C7B72]">{cat.subcategories?.length || 0} {t("nav.subcategoriesCount")}</span>
                    </Link>
                  ))}
                  <div className="border-t border-[#E8DCD2]/60 mt-1 pt-1 px-3">
                    <Link
                      href="/shop"
                      className="block text-center text-xs font-bold text-[#3B0C04] py-1.5 hover:underline"
                    >
                      {t("nav.viewAllProducts")}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/shop"
              className={`transition-colors hover:text-[#3B0C04] ${
                pathname === "/shop" ? "text-[#3B0C04] font-bold" : "text-[#2B160F]"
              }`}
            >
              {t("nav.allProducts")}
            </Link>

            <Link
              href="/shop?filter=new"
              className="transition-colors hover:text-[#3B0C04] text-[#2B160F] flex items-center gap-1.5"
            >
              <span>{t("nav.newArrivals")}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FFC40E] text-[#3B0C04]">
                New
              </span>
            </Link>

            <Link
              href="/shop?filter=bestseller"
              className="transition-colors hover:text-[#3B0C04] text-[#2B160F]"
            >
              {t("nav.bestSellers")}
            </Link>

            <Link
              href="/shop?filter=offers"
              className="transition-colors hover:text-[#3B0C04] text-[#D64545] font-semibold flex items-center gap-1"
            >
              <span>{t("nav.specialOffers")}</span>
              <span className="w-2 h-2 rounded-full bg-[#D64545] animate-pulse"></span>
            </Link>

            <Link
              href="/about"
              className={`transition-colors hover:text-[#3B0C04] ${
                pathname === "/about" ? "text-[#3B0C04] font-bold" : "text-[#2B160F]"
              }`}
            >
              {t("nav.about")}
            </Link>

            <Link
              href="/contact"
              className={`transition-colors hover:text-[#3B0C04] ${
                pathname === "/contact" ? "text-[#3B0C04] font-bold" : "text-[#2B160F]"
              }`}
            >
              {t("nav.contact")}
            </Link>
          </nav>

          {/* Hotline / Quick Help */}
          <div className="flex items-center gap-4 text-xs font-medium text-[#6B5A52]">
            <a
              href="tel:+8801700000000"
              className="flex items-center gap-1.5 hover:text-[#3B0C04] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#3B0C04]" />
              <span>{t("nav.hotline")}</span>
            </a>
          </div>
        </div>
      </div>

      {/* MOBILE HEADER (56px row + 44px sticky search) */}
      <div className="lg:hidden">
        {/* First Row (56px) */}
        <div className="container-custom h-14 flex items-center justify-between border-b border-[#E8DCD2]">
          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[#3B0C04] hover:bg-[#FFF7EE] rounded-lg transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo Center */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-base shadow-xs">
              প
            </div>
            <span className="text-lg font-black tracking-tight text-[#3B0C04]">
              PONCHOMUKH
            </span>
          </Link>

          {/* Right Mobile Actions: Language Switcher + Cart */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="compact" />

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 -mr-1 text-[#3B0C04] hover:bg-[#FFF7EE] rounded-lg transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FFC40E] text-[#260700] text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Second Row: Full Width Sticky Search Bar (44px) */}
        <div className="container-custom py-2 bg-white border-b border-[#E8DCD2]/60">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={t("nav.searchPlaceholder")}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-14 rounded-lg bg-[#FFFDF9] border border-[#E8DCD2] text-xs text-[#2B160F] placeholder-[#8C7B72] focus:outline-none focus:border-[#3B0C04]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B72]" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2.5 bg-[#3B0C04] text-[#FFC40E] text-[11px] font-semibold rounded-md"
            >
              {t("nav.searchBtn")}
            </button>
          </form>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 bg-[#3B0C04] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFC40E] text-[#260700] flex items-center justify-center font-bold text-sm">
                  প
                </div>
                <span className="font-bold text-base text-[#FFC40E]">{t("common.brandName")}</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links & Language Switcher */}
            <div className="p-4 flex-1 divide-y divide-[#E8DCD2]/60">
              {/* Language Switcher in Drawer */}
              <div className="pb-3">
                <LanguageSwitcher variant="drawer" />
              </div>

              <div className="py-2 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#2B160F] hover:bg-[#FFF7EE]"
                >
                  {t("nav.home")}
                </Link>
                <Link
                  href="/shop"
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#2B160F] hover:bg-[#FFF7EE]"
                >
                  {t("nav.allProducts")}
                </Link>
                <Link
                  href="/shop?filter=new"
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#2B160F] hover:bg-[#FFF7EE]"
                >
                  {t("nav.newArrivals")}
                </Link>
                <Link
                  href="/shop?filter=bestseller"
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#2B160F] hover:bg-[#FFF7EE]"
                >
                  {t("nav.bestSellers")}
                </Link>
              </div>

              {/* Category Section */}
              <div className="py-3">
                <p className="px-3 text-xs font-bold text-[#6B5A52] uppercase mb-2">
                  {t("nav.categories")}
                </p>
                <div className="space-y-1">
                  {mockCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block px-3 py-1.5 text-xs text-[#2B160F] hover:text-[#3B0C04]"
                    >
                      • {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Customer Account & Orders */}
              <div className="py-3 space-y-1">
                <Link
                  href="/account"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#2B160F] hover:bg-[#FFF7EE]"
                >
                  <User className="w-4 h-4 text-[#3B0C04]" />
                  <span>{t("nav.myAccount")}</span>
                </Link>
                <Link
                  href="/order-tracking"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#2B160F] hover:bg-[#FFF7EE]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#3B0C04]" />
                  <span>{t("nav.orderTracking")}</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#2B160F] hover:bg-[#FFF7EE]"
                >
                  <Heart className="w-4 h-4 text-[#D64545]" />
                  <span>{t("nav.wishlist")} ({wishlistCount})</span>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#3B0C04] hover:bg-[#FFF7EE]"
                >
                  <Sparkles className="w-4 h-4 text-[#FFC40E]" />
                  <span>{t("nav.adminPanel")}</span>
                </Link>
              </div>

              {/* Support Hotline */}
              <div className="pt-4 pb-2 text-xs text-[#6B5A52] space-y-2">
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFF7EE] text-[#3B0C04] font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t("nav.hotline")}</span>
                </a>
                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#075E54] font-semibold"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>{t("common.whatsapp")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
