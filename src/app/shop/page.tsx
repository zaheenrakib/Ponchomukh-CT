"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductModal } from "@/components/product-modal";
import { CartProvider } from "@/context/cart-context";
import { Filter, X, ChevronRight, RefreshCcw } from "lucide-react";
import { mockCategories, mockBrands } from "@/lib/mockData";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialFilter = searchParams.get("filter");

  const [products, setProducts] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCat, setSelectedCat] = useState<string | null>(initialCategory || null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    let url = "/api/products?";
    if (selectedCat) url += `category=${encodeURIComponent(selectedCat)}&`;
    if (initialFilter === "new") url += `sort=newest&`;
    if (initialFilter === "bestseller") url += `sort=rating&`;
    if (sortBy) url += `sort=${encodeURIComponent(sortBy)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Failed to load shop products:", err))
      .finally(() => setLoading(false));
  }, [selectedCat, sortBy, initialFilter]);

  const resetFilters = () => {
    setSelectedCat(null);
    setSelectedBrand(null);
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold mb-4">
          <Link href="/" className="hover:text-[#3B0C04]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#3B0C04] font-bold">Shop</span>
        </div>

        {/* Header & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DCD2] dark:border-zinc-800">
          <div>
            <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04] dark:text-white tracking-tight">
              {selectedCat ? mockCategories.find((c) => c.slug === selectedCat)?.name || "Shop All" : "All Products"}
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Showing {products.length} products
            </p>
          </div>

          {/* Desktop & Mobile Sort Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex h-9 items-center gap-1.5 px-3.5 rounded-xl border border-[#E8DCD2] bg-white text-xs font-bold text-[#3B0C04] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 rounded-xl border border-[#E8DCD2] bg-white text-xs font-bold text-zinc-800 outline-none focus:border-[#3B0C04] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Best Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8DCD2]">
              <h3 className="font-sans font-black text-sm text-[#3B0C04] uppercase tracking-wider">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RefreshCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="text-xs font-black uppercase text-zinc-500 mb-2">Category</h4>
              <div className="space-y-1.5 text-xs font-bold">
                <button
                  onClick={() => setSelectedCat(null)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    !selectedCat ? "bg-[#3B0C04] text-white" : "hover:bg-[#FFF7EE] text-zinc-700"
                  }`}
                >
                  All Categories
                </button>
                {mockCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                      selectedCat === cat.slug ? "bg-[#3B0C04] text-white" : "hover:bg-[#FFF7EE] text-zinc-700"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="pt-4 border-t border-[#E8DCD2]">
              <h4 className="text-xs font-black uppercase text-zinc-500 mb-2">Brand</h4>
              <div className="space-y-1.5 text-xs font-bold">
                {mockBrands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(selectedBrand === b.slug ? null : b.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                      selectedBrand === b.slug ? "bg-[#3B0C04] text-white" : "hover:bg-[#FFF7EE] text-zinc-700"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Product Grid Area (4 cols Desktop, 3 Tablet, 2 Mobile) */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-64 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[#E8DCD2] rounded-2xl bg-[#FFF7EE]/30">
                <h3 className="font-sans text-base font-black text-[#3B0C04]">দুঃখিত, কোনো পণ্য পাওয়া যায়নি।</h3>
                <p className="text-xs text-zinc-500 mt-1">Try clearing filters to explore inventory.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 flex h-9 items-center justify-center px-4 rounded-xl bg-[#3B0C04] text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* MOBILE BOTTOM SHEET FILTER DRAWER (PART 25 Blueprint) */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-950 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto space-y-6 text-left border-t border-[#E8DCD2]">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-150">
              <h3 className="font-sans font-black text-lg text-[#3B0C04]">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            {/* Mobile Categories list */}
            <div>
              <h4 className="text-xs font-black uppercase text-zinc-500 mb-2">Category</h4>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button
                  onClick={() => setSelectedCat(null)}
                  className={`px-3 py-1.5 rounded-lg border ${
                    !selectedCat ? "bg-[#3B0C04] text-white border-[#3B0C04]" : "border-zinc-200 text-zinc-700"
                  }`}
                >
                  All
                </button>
                {mockCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.slug)}
                    className={`px-3 py-1.5 rounded-lg border ${
                      selectedCat === cat.slug ? "bg-[#3B0C04] text-white border-[#3B0C04]" : "border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  resetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 h-11 rounded-xl border border-[#E8DCD2] font-bold text-xs text-zinc-700"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 h-11 rounded-xl bg-[#3B0C04] text-white font-bold text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
      <ProductModal />
    </div>
  );
}

export default function ShopPage() {
  return (
    <CartProvider>
      <Suspense fallback={<div className="p-10 text-center">Loading shop...</div>}>
        <ShopContent />
      </Suspense>
    </CartProvider>
  );
}
