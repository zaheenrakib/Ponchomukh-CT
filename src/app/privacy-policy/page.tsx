"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";

export default function PrivacyPolicyPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 text-left space-y-6">
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04]">Privacy Policy</h1>
          <div className="bg-white p-8 rounded-3xl border border-[#E8DCD2] text-xs sm:text-sm font-medium space-y-4 leading-relaxed">
            <p>At Ponchomukh, accessible from ponchomukh.com, we prioritize the privacy of our visitors and customers.</p>
            <h2 className="font-bold text-base text-[#3B0C04]">1. Information We Collect</h2>
            <p>When you place an order or create an account, we collect your name, phone number, email address, and shipping address.</p>
            <h2 className="font-bold text-base text-[#3B0C04]">2. How We Use Information</h2>
            <p>We use your details strictly to process cash-on-delivery orders, arrange home delivery, and deliver customer support updates.</p>
            <h2 className="font-bold text-base text-[#3B0C04]">3. Data Security</h2>
            <p>Your details are protected using secure server authentication and encrypted connections.</p>
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
