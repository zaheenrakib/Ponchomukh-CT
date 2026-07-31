"use client";

import React, { useState } from "react";
import { CartProvider, useCart } from "@/context/cart-context";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { mockProducts, mockCategories } from "@/lib/mockData";
import { Filter, ArrowRight, Mail, Sparkles } from "lucide-react";

// Nested content wrapper to access useCart context hooks
const StorefrontContent: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useCart();

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  // Filtering Logic
  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = selectedCategory 
      ? product.category.slug === selectedCategory 
      : true;
      
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      setNewsletterError("Email address is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }
    
    setNewsletterSuccess(true);
    setNewsletterError("");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-zinc-50/30 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-250">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Categories Horizontal Banner */}
      <section className="py-12 border-t border-zinc-200/50 bg-white/50 dark:border-zinc-800/50 dark:bg-zinc-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-sans font-black text-xl tracking-tight text-zinc-850 dark:text-zinc-150">Browse by Category</h2>
              <p className="text-xs text-zinc-450 mt-0.5">Explore our custom curated premium essentials.</p>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all border shrink-0 active:scale-95 ${
                  !selectedCategory
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-350 dark:hover:border-zinc-750"
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
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all border shrink-0 active:scale-95 ${
                    selectedCategory === cat.slug
                      ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950"
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-350 dark:hover:border-zinc-750"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Products Grid Section */}
      <main id="products-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Dynamic header title */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200/60 pb-6 dark:border-zinc-800/60">
          <div>
            <span className="text-[10px] font-black tracking-wider uppercase text-rose-500 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 fill-rose-500" />
              Discover Excellence
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-zinc-900 dark:text-white">
              {selectedCategory
                ? `Category: ${mockCategories.find((c) => c.slug === selectedCategory)?.name}`
                : "Featured Products"}
            </h2>
            {searchQuery && (
              <p className="text-xs text-zinc-450 mt-1">
                Showing results for <span className="font-black text-zinc-700 dark:text-zinc-300">&ldquo;{searchQuery}&rdquo;</span>
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-450 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              {filteredProducts.length} Items Found
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-3xl bg-white/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 mb-4">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="font-sans text-lg font-black text-zinc-800 dark:text-zinc-200">No products found</h3>
            <p className="text-sm text-zinc-400 mt-1 max-w-[280px]">Try clearing your search query or switching categories to find what you want.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className="mt-6 flex h-10 items-center justify-center px-5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-semibold transition-all active:scale-95 text-xs dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer & Product Modal Overlays */}
      <CartDrawer />
      <ProductModal />

      {/* Footer Section */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950 transition-colors duration-250">
        
        {/* Newsletter Banner */}
        <div className="border-b border-zinc-250/60 dark:border-zinc-900/60 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="font-sans font-black text-xl tracking-tight text-zinc-900 dark:text-white">Stay in the Loop</h3>
              <p className="text-sm text-zinc-500 mt-1">Subscribe to receive exclusive offers, new product announcements, and early sales details.</p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium transition-all outline-none focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 h-11 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-semibold transition-all active:scale-95 text-xs dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 shadow-md shadow-zinc-900/5 shrink-0"
              >
                Subscribe
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
          {newsletterError && (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
              <p className="text-xs text-rose-500 font-bold">{newsletterError}</p>
            </div>
          )}
          {newsletterSuccess && (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckIcon /> Success! Thank you for subscribing. Check your inbox for verification!
              </p>
            </div>
          )}
        </div>

        {/* Links & Brand info */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          
          {/* Column 1: Brand block */}
          <div className="col-span-2 flex flex-col gap-4">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 text-white">
                <span className="font-sans font-black text-lg tracking-tighter">P</span>
              </div>
              <span className="font-sans font-black text-xl tracking-tight bg-gradient-to-r from-zinc-900 via-rose-600 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:via-rose-450 dark:to-indigo-400">
                Ponchomukh
              </span>
            </a>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[240px] leading-relaxed font-medium">
              We design and curate products engineered for quality, function, and aesthetic minimal perfection.
            </p>
            <div className="flex gap-3 text-zinc-400 dark:text-zinc-500 mt-2">
              <a href="#" aria-label="Facebook" className="hover:text-zinc-650 dark:hover:text-white transition-colors">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-zinc-650 dark:hover:text-white transition-colors">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-zinc-650 dark:hover:text-white transition-colors">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Youtube" className="hover:text-zinc-650 dark:hover:text-white transition-colors">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Columns 2-5: Shop & Corporate links */}
          <div className="flex flex-col gap-3 text-xs">
            <h4 className="font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Shop</h4>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">All Collections</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Audio Tech</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Leather Goods</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Office Setup</a>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <h4 className="font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Support</h4>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Order Status</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Shipping & returns</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Warranty Policy</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Help Center</a>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <h4 className="font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Corporate</h4>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Our Story</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Sustainability</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Careers</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Press Kit</a>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <h4 className="font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Legal</h4>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Privacy Policy</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Terms of Service</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Refund Policy</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium">Cookie settings</a>
          </div>

        </div>

        {/* Bottom copyright banner */}
        <div className="border-t border-zinc-150 py-6 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
              © {new Date().getFullYear()} Ponchomukh. All rights reserved.
            </span>
            <div className="flex gap-4 text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
              <span>Built with Next.js 15 & Tailwind 4</span>
              <span>•</span>
              <span>Designed in Bangladesh</span>
            </div>
          </div>
        </div>

      </footer>
    </div>
  );
};

// Simple check icon for alerts
const CheckIcon = () => (
  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export default function Home() {
  return (
    <CartProvider>
      <StorefrontContent />
    </CartProvider>
  );
}
