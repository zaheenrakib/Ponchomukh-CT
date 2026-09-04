"use client";

import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ShieldCheck, Truck, Heart, Target, Sparkles, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-12 md:py-16 text-center">
          <div className="container-custom max-w-3xl space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-[#3B0C04]/10 text-[#3B0C04] text-xs font-bold uppercase tracking-wider">
              আমাদের গল্প ও লক্ষ্য
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#3B0C04]">
              পঞ্চমুখ — আপনার দৈনন্দিন পছন্দের বিশ্বস্ত ঠিকানা।
            </h1>
            <p className="text-sm md:text-base text-[#6B5A52] leading-relaxed">
              “পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ।” এই মূলমন্ত্রকে সামনে রেখে আধুনিক ও ব্যস্ত জীবনকে সহজ করতে দরকারি সব গ্যাজেট ও লাইফস্টাইল পণ্য পৌঁছে দিচ্ছি আপনার হাতে।
            </p>
          </div>
        </div>

        <div className="container-custom py-12 space-y-16 max-w-4xl">
          {/* Story & Mission Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF7EE] text-[#3B0C04] flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-[#3B0C04]" />
              </div>
              <h2 className="text-xl font-bold text-[#3B0C04]">আমাদের মিশন (Our Mission)</h2>
              <p className="text-xs sm:text-sm text-[#6B5A52] leading-relaxed">
                বাংলাদেশের প্রতিটি প্রান্তে সাশ্রয়ী মূল্যে ১০০% মানসম্মত ও যাচাইকৃত পণ্য পৌঁছে দেওয়া। অনলাইন কেনাকাটায় গ্রাহকের বিশ্বাস এবং স্বাচ্ছন্দ্য অর্জনই আমাদের মূল লক্ষ্য।
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF7EE] text-[#3B0C04] flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-[#D64545]" />
              </div>
              <h2 className="text-xl font-bold text-[#3B0C04]">আমাদের ভিশন (Our Vision)</h2>
              <p className="text-xs sm:text-sm text-[#6B5A52] leading-relaxed">
                একটি গ্রাহককেন্দ্রিক ই-কমার্স প্রতিষ্ঠান হিসেবে পঞ্চমুখকে প্রতিষ্ঠিত করা, যেখানে প্রতিটি অর্ডার হবে নির্ভরযোগ্য এবং ডেলিভারি অভিজ্ঞতা হবে আনন্দদায়ক।
              </p>
            </div>
          </div>

          {/* Why Ponchomukh */}
          <div className="p-8 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-6">
            <h2 className="text-2xl font-black text-[#3B0C04] text-center">
              কেন পঞ্চমুখ থেকে কেনাকাটা করবেন?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-[#6B5A52]">
              <div className="space-y-2">
                <h3 className="font-bold text-[#2B160F] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16834A]" />
                  <span>যাচাইকৃত পণ্য সামগ্রী</span>
                </h3>
                <p className="leading-relaxed">
                  প্রতিটি পণ্য শিপমেন্টের আগে আমাদের কোয়ালিটি চেকিং টিমের মাধ্যমে নিখুঁতভাবে পরীক্ষা করা হয়।
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#2B160F] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#3B0C04]" />
                  <span>দ্রুততম হোম ডেলিভারি</span>
                </h3>
                <p className="leading-relaxed">
                  ঢাকায় ২৪-৪৮ ঘণ্টা এবং সারাদেশে ২-৩ কার্যদিবসের মধ্যে আপনার দোরগোড়ায় পৌঁছে দেওয়া হয়।
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#2B160F] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFC40E]" />
                  <span>সহজ রিটার্ন পলিসি</span>
                </h3>
                <p className="leading-relaxed">
                  পণ্যে কোনো ত্রুটি থাকলে ৭ দিনের মধ্যে সহজে রিটার্ন বা রিপ্লেসমেন্ট পাওয়ার নিশ্চয়তা।
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 rounded-2xl bg-[#3B0C04] text-white text-center space-y-4 shadow-lg">
            <h3 className="text-2xl font-black text-[#FFC40E]">
              আজই ঘুরে আসুন আমাদের শোরুমে বা অনলাইন স্টোরে
            </h3>
            <p className="text-xs sm:text-sm text-[#E8DCD2]/80 max-w-lg mx-auto">
              আপনার পছন্দের পণ্য নির্বাচন করুন এবং কোনো অগ্রিম চার্জ ছাড়াই ক্যাশ অন ডেলিভারিতে অর্ডার করুন।
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[#FFC40E] hover:bg-[#D99E00] text-[#260700] font-bold text-xs sm:text-sm transition-colors shadow-xs"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
