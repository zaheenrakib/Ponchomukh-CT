"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { ShieldCheck, Truck, Heart } from "lucide-react";

function AboutContent() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12 text-left space-y-10">
        
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">About Ponchomukh</span>
          <h1 className="font-sans font-black text-2xl sm:text-4xl text-[#3B0C04] dark:text-white leading-tight">
            পঞ্চমুখ — আপনার দৈনন্দিন পছন্দের বিশ্বস্ত ঠিকানা।
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-zinc-500 max-w-xl mx-auto">
            পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ।
          </p>
        </div>

        {/* Our Story & Mission */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-[#E8DCD2] space-y-6 text-xs sm:text-sm font-medium leading-relaxed">
          <div>
            <h2 className="font-sans font-black text-lg text-[#3B0C04] mb-2">Our Story</h2>
            <p>
              পঞ্চমুখ একটি Bangladesh-focused modern e-commerce platform। গ্রাহকদের দৈনন্দিন প্রয়োজনীয় সেরা মানের পণ্য এক ঠিকানায় পৌঁছে দেওয়াই আমাদের লক্ষ্য।
            </p>
          </div>

          <div>
            <h2 className="font-sans font-black text-lg text-[#3B0C04] mb-2">Our Mission</h2>
            <p>
              খুব সহজে পণ্য নির্বাচন, স্বচ্ছ মূল্য তালিকা, দ্রুততম ডেলিভারি এবং ক্যাশ অন ডেলিভারির মাধ্যমে নিরবচ্ছিন্ন কেনাকাটার অভিজ্ঞতা প্রদান করা।
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] space-y-2">
            <ShieldCheck className="h-8 w-8 text-[#3B0C04] mx-auto" />
            <h3 className="font-bold text-sm text-[#3B0C04]">বিশ্বস্ত পণ্য</h3>
            <p className="text-xs text-zinc-500">১০০% যাচাইকৃত ও মানসম্মত পণ্য।</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] space-y-2">
            <Truck className="h-8 w-8 text-[#3B0C04] mx-auto" />
            <h3 className="font-bold text-sm text-[#3B0C04]">দ্রুত ডেলিভারি</h3>
            <p className="text-xs text-zinc-500">সারা বাংলাদেশে হোম ডেলিভারি।</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] space-y-2">
            <Heart className="h-8 w-8 text-[#3B0C04] mx-auto" />
            <h3 className="font-bold text-sm text-[#3B0C04]">Customer Support</h3>
            <p className="text-xs text-zinc-500">সার্বক্ষণিক কাস্টমার সাপোর্ট।</p>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function AboutPage() {
  return (
    <CartProvider>
      <AboutContent />
    </CartProvider>
  );
}
