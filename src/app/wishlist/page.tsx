"use client";

import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/context/cart-context";
import { Heart, ChevronRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, wishlistCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header Breadcrumb */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-6">
          <div className="container-custom">
            <div className="flex items-center gap-1.5 text-xs text-[#8C7B72] mb-2">
              <Link href="/" className="hover:text-[#3B0C04]">হোম</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3B0C04] font-semibold">উইশলিস্ট (Wishlist)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3B0C04]">
              আমার পছন্দের তালিকা ({wishlistCount})
            </h1>
          </div>
        </div>

        <div className="container-custom py-8">
          {wishlist.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center rounded-2xl bg-white border border-[#E8DCD2] max-w-lg mx-auto space-y-4 shadow-xs">
              <div className="w-20 h-20 rounded-full bg-[#FFF7EE] text-[#D64545] mx-auto flex items-center justify-center">
                <Heart className="w-10 h-10 text-[#D64545]" />
              </div>
              <h2 className="text-xl font-bold text-[#2B160F]">
                আপনার wishlist এখনো খালি।
              </h2>
              <p className="text-xs text-[#8C7B72]">
                পণ্য ব্রাউজ করার সময় হার্ট আইকনে ক্লিক করে পছন্দের পণ্য সংরক্ষণ করুন।
              </p>
              <div className="pt-3">
                <Link
                  href="/shop"
                  className="inline-block px-7 py-3 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700]"
                >
                  Shop Now (শপিং শুরু করুন)
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
