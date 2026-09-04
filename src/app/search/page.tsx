"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { mockProducts } from "@/lib/mockData";
import { Search, ChevronRight, Sparkles } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState<string>("featured");

  // Search logic
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );

    if (sortBy === "price-low") {
      results.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice));
    } else if (sortBy === "price-high") {
      results.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice));
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.averageRating - a.averageRating);
    }

    return results;
  }, [query, sortBy]);

  // Recommended products for empty state
  const recommendedProducts = mockProducts.filter((p) => p.isBestSeller || p.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-8">
          <div className="container-custom">
            <div className="flex items-center gap-1.5 text-xs text-[#8C7B72] mb-2">
              <Link href="/" className="hover:text-[#3B0C04]">হোম</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3B0C04] font-semibold">অনুসন্ধান ফলাফল</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-[#3B0C04]">
                  Search results for: &ldquo;<span className="text-[#D99E00]">{query}</span>&rdquo;
                </h1>
                <p className="text-xs sm:text-sm text-[#6B5A52] mt-0.5">
                  মোট {searchResults.length}টি পণ্য পাওয়া গেছে
                </p>
              </div>

              {searchResults.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#6B5A52] font-semibold">সর্ট করুন:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 px-3 rounded-lg bg-white border border-[#E8DCD2] text-xs font-semibold text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">দাম: কম থেকে বেশি</option>
                    <option value="price-high">দাম: বেশি থেকে কম</option>
                    <option value="rating">সেরা রেটিং</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="container-custom py-8">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Exact Empty State from blueprint */}
              <div className="p-10 md:p-14 text-center rounded-2xl bg-white border border-[#E8DCD2] max-w-xl mx-auto space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#3B0C04]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#2B160F]">
                  দুঃখিত, আপনার অনুসন্ধানের সাথে মিলে কোনো পণ্য পাওয়া যায়নি।
                </h3>
                <p className="text-xs text-[#8C7B72]">
                  বানান সঠিক কিনা তা পরীক্ষা করুন অথবা অন্য কোনো প্রাসঙ্গিক শব্দ দিয়ে অনুসন্ধান করুন।
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-block px-6 py-2.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700]"
                  >
                    সকল পণ্য দেখুন
                  </Link>
                </div>
              </div>

              {/* Recommended Products */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-[#FFC40E]" />
                  <h3 className="text-lg md:text-xl font-bold text-[#2B160F]">
                    আপনার জন্য প্রস্তাবিত জনপ্রিয় পণ্য
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-6">
                  {recommendedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
      <ProductModal />
      <CartDrawer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-8 text-[#3B0C04] font-bold">লোড হচ্ছে...</div>}>
      <SearchContent />
    </Suspense>
  );
}
