"use client";

import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "@/context/cart-context";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { mockProducts, mockCategories, mockStores } from "@/lib/mockData";
import { 
  Flame, Shirt, Briefcase, Scissors, ShoppingBag, Footprints, Watch, Crown, Grid,
  Zap, ArrowLeft, ArrowRight, CheckCircle2
} from "lucide-react";

const FlashSaleTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 17,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 font-sans font-black text-xs text-white">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500 shadow-sm shadow-rose-500/10">
        {formatNum(timeLeft.hours)}
      </span>
      <span className="text-rose-500 font-bold">:</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500 shadow-sm shadow-rose-500/10">
        {formatNum(timeLeft.minutes)}
      </span>
      <span className="text-rose-500 font-bold">:</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500 shadow-sm shadow-rose-500/10">
        {formatNum(timeLeft.seconds)}
      </span>
    </div>
  );
};

const StorefrontContent: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useCart();

  const [activeTab, setActiveTab] = useState("Best Seller");

  // Helper function to resolve category icons dynamically
  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case "Shirt": return <Shirt className="h-5 w-5" />;
      case "Flame": return <Flame className="h-5 w-5" />;
      case "Briefcase": return <Briefcase className="h-5 w-5" />;
      case "Scissors": return <Scissors className="h-5 w-5" />;
      case "ShoppingBag": return <ShoppingBag className="h-5 w-5" />;
      case "Footprints": return <Footprints className="h-5 w-5" />;
      case "Watch": return <Watch className="h-5 w-5" />;
      case "Crown": return <Crown className="h-5 w-5" />;
      default: return <Grid className="h-5 w-5" />;
    }
  };

  // Filter products for Flash Sale
  const flashSaleProducts = mockProducts.filter(p => p.isFlashSale);

  // Filter products for "Today's For You" grid based on category selection, search queries, and tabs
  const filteredProducts = mockProducts.filter((product) => {
    if (product.isFlashSale) return false; // Exclude flash sale items

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

  const formatRp = (value: number) => {
    return `Rp${value.toLocaleString("id-ID")}`;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
      
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Hero Section Banner */}
      <Hero />

      {/* 3. Category Horizontal Circular Grid */}
      <section className="py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center justify-between overflow-x-auto pb-4 gap-6 scrollbar-none">
          {/* All Category Circle */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery("");
            }}
            className="flex flex-col items-center gap-2 group shrink-0"
          >
            <div className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
              !selectedCategory 
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" 
                : "bg-[#F0F2F5] hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}>
              <Grid className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold tracking-tight text-zinc-650 dark:text-zinc-400 group-hover:text-rose-500 transition-colors">
              All Category
            </span>
          </button>

          {/* Individual Categories Circles */}
          {mockCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setSearchQuery("");
                }}
                className="flex flex-col items-center gap-2 group shrink-0"
              >
                <div className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
                  isSelected 
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" 
                    : "bg-[#F0F2F5] hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}>
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="text-[10px] font-extrabold tracking-tight text-zinc-650 dark:text-zinc-400 group-hover:text-rose-500 transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Flash Sale Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Zap className="h-5 w-5 text-zinc-900 fill-zinc-900 dark:text-white dark:fill-white shrink-0 animate-pulse" />
              <h2 className="font-sans font-black text-lg sm:text-xl text-zinc-900 dark:text-white uppercase tracking-tight">
                Flash Sale
              </h2>
            </div>
            <FlashSaleTimer />
          </div>
          {/* Arrow Buttons Mock */}
          <div className="flex gap-1.5">
            <button className="flex h-7 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850">
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-7 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white hover:bg-zinc-850 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Product Cards Slider Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Today's For You Grid Section */}
      <section id="products-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="font-sans font-black text-lg sm:text-xl text-zinc-900 dark:text-white tracking-tight">
            Todays For You!
          </h2>

          {/* Navigation Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {["Best Seller", "Keep Stylish", "Special Discount", "Official Store", "Coveted Product"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-tight transition-all shrink-0 border ${
                    isActive 
                      ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white" 
                      : "bg-white border-zinc-200 text-zinc-550 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl bg-white/20">
            <h3 className="font-sans text-sm font-black text-zinc-800 dark:text-zinc-250">No products found</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-[240px]">Try clearing search queries or switching tags to display inventory.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className="mt-4 flex h-9 items-center justify-center px-4 rounded-xl bg-zinc-900 text-white text-[11px] font-bold dark:bg-white dark:text-zinc-950"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Best Selling Store Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-100 dark:border-zinc-900">
        <h2 className="text-center font-sans font-black text-lg sm:text-xl text-zinc-900 dark:text-white tracking-tight mb-8">
          Best Selling Store
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Brand Promo Visual Card */}
          <div className="lg:col-span-3 rounded-2xl bg-[#EFF1F4] dark:bg-zinc-900/60 p-6 flex flex-col justify-between min-h-[300px] border border-zinc-200/40 dark:border-zinc-850">
            <div className="flex-1 flex flex-col items-center justify-center text-center pb-4">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80"
                alt="Mall shopping bags visual"
                className="w-32 aspect-square object-cover rounded-xl shadow-md border border-white/50"
              />
              <h3 className="mt-5 font-sans font-black text-base text-zinc-900 dark:text-white leading-tight">
                Ponchomukh Mall
              </h3>
              <p className="mt-2 text-[10px] font-bold text-zinc-450 dark:text-zinc-400 max-w-[180px]">
                Shop, Explore, Delight and Experience Mall Magic!
              </p>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="w-full flex h-10 items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs transition-all dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
            >
              Explore Store
            </button>
          </div>

          {/* Right Column: Grid of 4 Shop cards */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mockStores.map((store) => (
              <div 
                key={store.id}
                className="rounded-2xl border border-zinc-150 bg-white p-5 dark:border-zinc-850 dark:bg-zinc-950 flex flex-col justify-between gap-4"
              >
                {/* Header details */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                    <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <h4 className="font-sans text-xs font-black text-zinc-850 dark:text-zinc-200">
                        {store.name}
                      </h4>
                      {store.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10 shrink-0" />
                      )}
                    </div>
                    <p className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5">
                      &ldquo;{store.tagline}&rdquo;
                    </p>
                  </div>
                </div>

                {/* 3 product previews strip */}
                <div className="grid grid-cols-3 gap-2.5">
                  {store.products.map((p) => (
                    <div key={p.id} className="flex flex-col gap-1.5 group/preview cursor-pointer">
                      <div className="aspect-square rounded-xl bg-[#EFF1F4] dark:bg-zinc-900 flex items-center justify-center p-2 border border-zinc-200/30 overflow-hidden">
                        <img 
                          src={p.imageUrl} 
                          alt={p.name} 
                          className="h-full w-full object-cover rounded-lg group-hover/preview:scale-103 transition-transform" 
                        />
                      </div>
                      <span className="font-mono text-[9px] font-extrabold text-zinc-800 dark:text-zinc-300 text-center">
                        {formatRp(p.price)}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Quote/Rack Banner */}
      <section className="relative overflow-hidden w-full h-[220px] flex items-center justify-center bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80"
          alt="Hanging clothing rack"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        <div className="relative z-10 text-center px-4">
          <h2 className="font-sans font-extrabold text-xl sm:text-2xl lg:text-3xl italic tracking-wide text-white leading-relaxed">
            &ldquo;Let&apos;s Shop Beyond Boundaries&rdquo;
          </h2>
        </div>
      </section>

      {/* 8. Overlay drawers and product modals */}
      <CartDrawer />
      <ProductModal />

      {/* 9. Dark Branding Footer */}
      <footer className="bg-[#181C24] dark:bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          
          {/* Brand info */}
          <div className="col-span-2 flex flex-col gap-4 text-left">
            <span className="font-sans font-black text-xl tracking-tight text-white">
              Ponchomukh<span className="text-rose-500">.com</span>
            </span>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold max-w-[200px]">
              &ldquo;Let&apos;s Shop Beyond Boundaries&rdquo;
            </p>
            <div className="flex gap-3 text-zinc-500 mt-2">
              <a href="#" className="hover:text-white transition-colors">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3 text-[11px] text-left">
            <h4 className="font-extrabold text-zinc-500 uppercase tracking-wider text-[10px]">Ponchomukh</h4>
            <a href="#" className="hover:text-white transition-colors font-medium">About Ponchomukh</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Careers</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Mitra Blog</a>
            <a href="#" className="hover:text-white transition-colors font-medium">BDB Digital</a>
          </div>

          <div className="flex flex-col gap-3 text-[11px] text-left">
            <h4 className="font-extrabold text-zinc-500 uppercase tracking-wider text-[10px]">Buy</h4>
            <a href="#" className="hover:text-white transition-colors font-medium">Bill & Top Up</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Ponchomukh COD</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Mitra Blog</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Promo</a>
          </div>

          <div className="flex flex-col gap-3 text-[11px] text-left">
            <h4 className="font-extrabold text-zinc-500 uppercase tracking-wider text-[10px]">Sell</h4>
            <a href="#" className="hover:text-white transition-colors font-medium">Seller Education Center</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Brand Index</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Register Official Store</a>
          </div>

          <div className="flex flex-col gap-3 text-[11px] text-left">
            <h4 className="font-extrabold text-zinc-500 uppercase tracking-wider text-[10px]">Guide and Help</h4>
            <a href="#" className="hover:text-white transition-colors font-medium">Ponchomukh Care</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Terms and Conditions</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Privacy</a>
            <a href="#" className="hover:text-white transition-colors font-medium">Mitra</a>
          </div>

        </div>

        {/* Copyright banner */}
        <div className="border-t border-zinc-800/60 mt-12 pt-6 text-[10px] font-bold text-zinc-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            © 2021 - 2026 Ponchomukh.com. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function Home() {
  return (
    <CartProvider>
      <StorefrontContent />
    </CartProvider>
  );
}
