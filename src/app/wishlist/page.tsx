"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductModal } from "@/components/product-modal";
import { CartProvider } from "@/context/cart-context";
import { Heart } from "lucide-react";

function WishlistContent() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-left">
        <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04] dark:text-white mb-6">
          My Wishlist
        </h1>

        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[#E8DCD2] rounded-3xl bg-[#FFF7EE]/30 text-center">
          <div className="h-16 w-16 rounded-full bg-[#FFF7EE] border border-[#E8DCD2] flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-rose-500" />
          </div>
          <h3 className="font-sans text-base font-black text-[#3B0C04]">আপনার wishlist এখনো খালি।</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs">Explore our shop and tap the heart icon to save products to your wishlist.</p>
          <a
            href="/shop"
            className="mt-6 flex h-10 items-center justify-center px-6 rounded-xl bg-[#3B0C04] text-white text-xs font-bold shadow-md"
          >
            Explore Shop
          </a>
        </div>
      </main>

      <CartDrawer />
      <ProductModal />
    </div>
  );
}

export default function WishlistPage() {
  return (
    <CartProvider>
      <WishlistContent />
    </CartProvider>
  );
}
