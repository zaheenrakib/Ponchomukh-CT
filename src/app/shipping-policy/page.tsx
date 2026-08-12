"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";

export default function ShippingPolicyPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 text-left space-y-6">
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04]">Shipping Policy</h1>
          <div className="bg-white p-8 rounded-3xl border border-[#E8DCD2] text-xs sm:text-sm font-medium space-y-4 leading-relaxed">
            <h2 className="font-bold text-base text-[#3B0C04]">Delivery Zones & Charges</h2>
            <p><strong>Inside Dhaka:</strong> Delivery charge is ৳60. Estimated delivery within 24 to 48 hours.</p>
            <p><strong>Outside Dhaka:</strong> Delivery charge is ৳120. Estimated delivery within 2 to 4 days.</p>
            <h2 className="font-bold text-base text-[#3B0C04]">Cash on Delivery</h2>
            <p>We provide 100% Cash on Delivery across all 64 districts of Bangladesh.</p>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
