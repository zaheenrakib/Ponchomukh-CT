"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { mockCategories, mockProducts } from "@/lib/mockData";
import { ChevronRight, Filter, ArrowLeft, PackageOpen } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");

  const currentCategory = mockCategories.find((c) => c.slug === slug) || mockCategories[0];

  // Filter products by category
  const categoryProducts = mockProducts.filter((p) => p.category.slug === slug || p.categoryId.includes(slug));

  // Sorting
  if (sortBy === "price-low") {
    categoryProducts.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice));
  } else if (sortBy === "price-high") {
    categoryProducts.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice));
  } else if (sortBy === "rating") {
    categoryProducts.sort((a, b) => b.averageRating - a.averageRating);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Category Hero Banner */}
        <div className="bg-gradient-to-r from-[#FFF7EE] via-[#FFFDF9] to-[#F3F7F5] border-b border-[#E8DCD2] py-8 md:py-12">
          <div className="container-custom">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#8C7B72] mb-3">
              <Link href="/" className="hover:text-[#3B0C04]">হোম</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/shop" className="hover:text-[#3B0C04]">ক্যাটাগরি</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3B0C04] font-semibold">{currentCategory.name}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl space-y-2">
                <h1 className="text-2xl sm:text-4xl font-black text-[#3B0C04]">
                  {currentCategory.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#6B5A52] leading-relaxed">
                  {currentCategory.description || "সকল প্রিমিয়াম কোয়ালিটি এবং আকর্ষণীয় পণ্যের বিশাল কালেকশন।"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#3B0C04] text-[#FFC40E]">
                  {categoryProducts.length} টি পণ্য পাওয়া গেছে
                </span>
              </div>
            </div>

            {/* Subcategories Filter Pills */}
            {currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
              <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    selectedSubcategory === null
                      ? "bg-[#3B0C04] text-[#FFC40E]"
                      : "bg-white text-[#2B160F] border border-[#E8DCD2] hover:bg-[#FFF7EE]"
                  }`}
                >
                  সব ({categoryProducts.length})
                </button>
                {currentCategory.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.slug)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      selectedSubcategory === sub.slug
                        ? "bg-[#3B0C04] text-[#FFC40E]"
                        : "bg-white text-[#2B160F] border border-[#E8DCD2] hover:bg-[#FFF7EE]"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid & Sort Controls */}
        <div className="container-custom py-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8DCD2]">
            <p className="text-xs text-[#6B5A52]">
              দেখাচ্ছে <span className="font-bold text-[#2B160F]">{categoryProducts.length}</span> টি পণ্য
            </p>

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
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white border border-[#E8DCD2] space-y-4">
              <PackageOpen className="w-12 h-12 text-[#8C7B72] mx-auto" />
              <h3 className="text-base font-bold text-[#2B160F]">
                এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই
              </h3>
              <p className="text-xs text-[#8C7B72]">
                শীঘ্রই নতুন কালেকশন যুক্ত করা হবে।
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold"
              >
                অন্যান্য পণ্য দেখুন
              </Link>
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
