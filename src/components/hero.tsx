"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
export const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-[#F0F2F5] dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 py-10 px-8 sm:px-12 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[360px]">
        
        {/* Left Content Column */}
        <div className="md:col-span-7 flex flex-col items-start text-left z-10">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 fill-emerald-600 dark:fill-emerald-400" />
            #Big Fashion Sale
          </span>
          
          <h1 className="mt-4 font-sans font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none text-zinc-900 dark:text-white max-w-lg">
            Limited Time Offer!<br />
            Up to <span className="text-rose-500">50% OFF!</span>
          </h1>

          <p className="mt-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Redefine Your Everyday Style
          </p>

          <button
            onClick={() => {
              const el = document.getElementById("products-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-8 flex h-10 items-center justify-center px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-all hover:scale-102 active:scale-98 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-sm cursor-pointer"
          >
            Shop Now
          </button>

          {/* Dots Indicator */}
          <div className="mt-12 flex gap-1.5">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all duration-350 ${
                  activeSlide === idx ? "w-6 bg-zinc-850 dark:bg-white" : "w-2 bg-zinc-300 dark:bg-zinc-700"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Product Image Column */}
        <div className="md:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden hover:scale-101 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
              alt="Apparel Stack Showroom"
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Visual Glassmorphism overlay card */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 to-transparent" />
          </div>
        </div>

      </div>
    </section>
  );
};
