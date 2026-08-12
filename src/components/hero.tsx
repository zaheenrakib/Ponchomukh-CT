"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonUrl: string | null;
}

export const Hero: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/banners?position=HERO")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.banners.length > 0) {
          setBanners(data.banners);
        }
      })
      .catch(() => {});
  }, []);

  const currentBanner = banners[activeIndex] || {
    title: "আপনার পছন্দের পণ্য, এখন এক ঠিকানায়।",
    subtitle: "দৈনন্দিন জীবনের প্রয়োজনীয় পণ্য নির্বাচন করুন পঞ্চমুখ থেকে।",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&auto=format&fit=crop&q=80",
    buttonText: "Shop Now",
    buttonUrl: "/shop",
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-[#FFF7EE] dark:bg-zinc-900 border border-[#E8DCD2] dark:border-zinc-800 py-10 px-6 sm:px-12 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[420px] md:min-h-[480px]">
        
        {/* Left Content Column */}
        <div className="md:col-span-7 flex flex-col items-start text-left z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC40E]/20 text-[#3B0C04] font-black text-xs uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#D99E00]" />
            #Big Fashion & Electronics Sale
          </span>
          
          <h1 className="mt-4 font-sans font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-[#3B0C04] dark:text-white">
            {currentBanner.title}
          </h1>

          <p className="mt-4 text-xs sm:text-base font-semibold text-[#6B5A52] dark:text-zinc-300 max-w-lg leading-relaxed">
            {currentBanner.subtitle || "দৈনন্দিন জীবনের প্রয়োজনীয় পণ্য নির্বাচন করুন পঞ্চমুখ থেকে।"}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={currentBanner.buttonUrl || "/shop"}
              className="flex h-12 items-center justify-center px-8 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-white font-bold text-sm transition-all hover:scale-102 shadow-md"
            >
              {currentBanner.buttonText || "Shop Now"}
            </Link>

            <Link
              href="/shop"
              className="flex h-12 items-center justify-center px-6 rounded-xl border border-[#3B0C04] text-[#3B0C04] hover:bg-[#3B0C04]/5 font-bold text-sm transition-all dark:border-white dark:text-white"
            >
              Explore Products
            </Link>
          </div>

          {/* Banner Slider Indicators */}
          {banners.length > 1 && (
            <div className="mt-10 flex gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? "w-8 bg-[#3B0C04] dark:bg-white" : "w-2.5 bg-[#E8DCD2]"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Banner Image */}
        <div className="md:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-white">
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              className="w-full h-full object-cover rounded-2xl transition-all duration-500 hover:scale-103"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
