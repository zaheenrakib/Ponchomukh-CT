"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";

export default function ReturnPolicyPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 text-left space-y-6">
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04]">Return & Refund Policy</h1>
          <div className="bg-white p-8 rounded-3xl border border-[#E8DCD2] text-xs sm:text-sm font-medium space-y-4 leading-relaxed">
            <h2 className="font-bold text-base text-[#3B0C04]">7-Day Easy Returns</h2>
            <p>If you receive a damaged, defective, or incorrect product, you can request a return or replacement within 7 days of delivery.</p>
            <h2 className="font-bold text-base text-[#3B0C04]">Return Conditions</h2>
            <p>Products must be unused, unwashed, and in original packaging with tags attached.</p>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
