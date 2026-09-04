"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck, CreditCard } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF7EE] via-[#FFFDF9] to-[#F3F7F5] border-b border-[#E8DCD2]">
      <div className="container-custom">
        <div className="min-h-[440px] md:min-h-[480px] lg:h-[480px] py-8 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text Content (50%) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-5 text-center lg:text-left z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B0C04]/10 border border-[#3B0C04]/20 text-xs font-bold text-[#3B0C04] w-fit mx-auto lg:mx-0 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC40E]" />
              <span>বাংলাদেশের নির্ভরযোগ্য অনলাইন স্টোর</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3B0C04] tracking-tight leading-[1.15]">
              আপনার পছন্দের পণ্য, <br className="hidden sm:inline" />
              <span className="text-[#3B0C04] underline decoration-[#FFC40E] decoration-wavy decoration-2">
                এখন এক ঠিকানায়।
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-[#6B5A52] max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              দৈনন্দিন জীবনের প্রয়োজনীয় গ্যাজেট, ইলেকট্রনিক্স ও লাইফস্টাইল পণ্য নির্বাচন করুন পঞ্চমুখ থেকে। বিশ্বস্ত সেবা ও দ্রুততম হোম ডেলিভারি।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto h-11 md:h-12 px-7 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?filter=new"
                className="w-full sm:w-auto h-11 md:h-12 px-6 rounded-lg bg-white hover:bg-[#FFF7EE] text-[#3B0C04] border border-[#3B0C04] font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Explore Products</span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-[#6B5A52]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#3B0C04]" />
                <span>সারা দেশে হোম ডেলিভারি</span>
              </div>
              <span className="hidden sm:inline text-[#E8DCD2]">•</span>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#3B0C04]" />
                <span>ক্যাশ অন ডেলিভারি</span>
              </div>
              <span className="hidden sm:inline text-[#E8DCD2]">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16834A]" />
                <span>১০০% অরিজিনাল পণ্য</span>
              </div>
            </div>
          </div>

          {/* Right Visual / Image Area (50%) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative">
            {/* Soft decorative background circles */}
            <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#FFC40E]/20 blur-2xl -z-0" />
            <div className="absolute w-60 h-60 rounded-full bg-[#3B0C04]/10 blur-xl -z-0" />

            {/* Featured Product Composition Card */}
            <div className="relative z-10 w-full max-w-md aspect-4/3 md:aspect-square rounded-2xl bg-white/80 backdrop-blur-md border border-[#E8DCD2] shadow-xl p-4 flex flex-col items-center justify-center overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80"
                alt="Ponchomukh Featured Smart Gadget"
                className="w-4/5 h-4/5 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Highlight Pill */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 border border-[#E8DCD2] shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#2B160F]">Hoco Y12 Ultra Smartwatch</p>
                  <p className="text-xs text-[#3B0C04] font-black">৳1,999 <span className="text-[10px] text-[#8C7B72] line-through">৳2,899</span></p>
                </div>
                <Link
                  href="/shop"
                  className="px-3 py-1.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700]"
                >
                  দেখুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
