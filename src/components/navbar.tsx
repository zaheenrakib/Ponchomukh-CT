"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Search, ShoppingBag, Bell, ChevronDown, Smartphone } from "lucide-react";
import { mockCategories } from "@/lib/mockData";

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useCart();

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  return (
    <header className="w-full border-b border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950 transition-colors">
      
      {/* 1. Top Mini Bar */}
      <div className="border-b border-zinc-50 bg-zinc-50/50 py-1.5 text-zinc-500 dark:border-zinc-900 dark:bg-zinc-900/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-[11px] font-medium">
          <div className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-white cursor-pointer transition-colors">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Download Ponchomukh App</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-800 dark:hover:text-white transition-colors">Mitra Ponchomukh</a>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-white transition-colors">About Ponchomukh</a>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-white transition-colors">Ponchomukh Care</a>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-white transition-colors">Promo</a>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <a href="#" className="font-bold text-zinc-700 hover:text-rose-500 dark:text-zinc-300 dark:hover:text-rose-450 transition-colors">Sign Up</a>
            <a href="#" className="font-bold text-zinc-700 hover:text-rose-500 dark:text-zinc-300 dark:hover:text-rose-450 transition-colors">Login</a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row */}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        
        {/* Brand Logo - matching BeliBeli.com visual structure */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setSelectedCategory(null);
            setSearchQuery("");
          }}
          className="flex items-center gap-1 shrink-0 group"
        >
          <span className="font-sans font-black text-2xl tracking-tight text-zinc-900 dark:text-white">
            Ponchomukh<span className="text-rose-500 font-extrabold text-lg">.com</span>
          </span>
        </a>

        {/* Category Dropdown & Search Bar Combined */}
        <div className="flex flex-1 max-w-2xl items-center gap-2 relative">
          
          {/* Category Selector Dropdown Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-700 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850"
            >
              <span>{selectedCategory ? mockCategories.find(c => c.slug === selectedCategory)?.name : "All Category"}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${isCategoryDropdownOpen ? "rotate-185" : ""}`} />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 z-50 mt-1.5 w-48 rounded-xl border border-zinc-150 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in-50 slide-in-from-top-1">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-350 dark:hover:bg-zinc-800/60 dark:hover:text-white transition-colors"
                >
                  All Category
                </button>
                {mockCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-350 dark:hover:bg-zinc-800/60 dark:hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products or brand here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold transition-all outline-none focus:border-zinc-300 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>

        {/* User Utilities & Cart */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Notification icon */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-zinc-550 hover:bg-zinc-50 hover:text-zinc-850 dark:text-zinc-405 dark:hover:bg-zinc-900 transition-colors">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-750 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-all shadow-sm active:scale-95"
            title="Open Cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[9.5px] font-black text-white ring-2 ring-white dark:ring-zinc-950">
                {cartCount}
              </span>
            )}
          </button>

          {/* User profile capsule */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 cursor-pointer overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 transition-colors">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
              alt="User profile"
              className="h-full w-full object-cover"
            />
          </div>

        </div>
      </div>
      
    </header>
  );
};
