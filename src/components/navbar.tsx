"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Search, ShoppingBag, User, Heart, X, Menu } from "lucide-react";
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/85 transition-colors duration-250">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory(null);
              setSearchQuery("");
            }}
            className="flex items-center gap-2 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/10 group-hover:scale-105 transition-transform duration-300">
              <span className="font-sans font-black text-xl tracking-tighter">P</span>
            </div>
            <span className="hidden sm:inline-block font-sans font-black text-2xl tracking-tight bg-gradient-to-r from-zinc-900 via-rose-600 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:via-rose-400 dark:to-indigo-400">
              Ponchomukh
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !selectedCategory
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              All Products
            </button>
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setSearchQuery("");
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md mx-6 relative">
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search items, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-10 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium transition-all outline-none focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:bg-zinc-950 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-0.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-3">
          {/* Wishlist Button (Mock) */}
          <button className="relative hidden md:flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 hover:scale-102 active:scale-98 transition-all">
            <Heart className="h-5 w-5" />
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 hover:scale-102 active:scale-98 transition-all shadow-md shadow-zinc-900/10"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-zinc-950 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile (Mock) */}
          <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 hover:scale-102 active:scale-98 transition-all">
            <User className="h-5 w-5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-all"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search & Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white p-4 dark:border-zinc-850 dark:bg-zinc-950 transition-all duration-300">
          {/* Mobile Search */}
          <div className="relative mb-4 w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-10 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium transition-all outline-none focus:border-zinc-400 focus:bg-white dark:border-zinc-850 dark:bg-zinc-900 dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-0.5 rounded-md hover:bg-zinc-250 dark:hover:bg-zinc-850 text-zinc-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-1.5 font-semibold text-sm">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${
                !selectedCategory
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-850 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              All Products
            </button>
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setSearchQuery("");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-850 dark:text-white"
                    : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
