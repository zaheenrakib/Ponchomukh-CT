"use client";

import React from "react";
import { ArrowRight, Truck, ShieldCheck, Zap } from "lucide-react";
import { useCart } from "@/context/cart-context";

export const Hero: React.FC = () => {
  const { setSelectedCategory } = useCart();

  const scrollToProducts = () => {
    const el = document.getElementById("products-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-zinc-100/50 to-white pt-8 pb-16 dark:from-zinc-950 dark:via-zinc-900/50 dark:to-zinc-950">
      
      {/* Background patterns */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-rose-400/10 to-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-10 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-amber-400/5 to-rose-500/5 blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              <Zap className="h-3.5 w-3.5 fill-rose-600 dark:fill-rose-400" />
              Summer Launch Event
            </span>
            
            <h1 className="mt-6 font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-zinc-900 dark:text-white">
              Elevate Your <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 bg-clip-text text-transparent">
                Everyday Rituals
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Discover a curated collection of premium products built for performance, aesthetics, and lasting durability. Crafted without compromise.
            </p>

            {/* CTA Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={scrollToProducts}
                className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-all hover:scale-102 active:scale-98 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-lg shadow-zinc-950/15"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedCategory("electronics")}
                className="flex items-center justify-center h-12 px-6 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 font-semibold transition-all hover:scale-102 active:scale-98"
              >
                Explore Tech
              </button>
            </div>

            {/* Micro value badges */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 w-full pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-800 shadow-md shadow-zinc-100 dark:bg-zinc-900 dark:text-white dark:shadow-none border border-zinc-150 dark:border-zinc-800">
                  <Truck className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-850 dark:text-zinc-200">Free Shipping</h4>
                  <p className="text-xs text-zinc-500">For orders over $200</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-800 shadow-md shadow-zinc-100 dark:bg-zinc-900 dark:text-white dark:shadow-none border border-zinc-150 dark:border-zinc-800">
                  <ShieldCheck className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-850 dark:text-zinc-200">Secure Payments</h4>
                  <p className="text-xs text-zinc-500">SSL Encrypted checkout</p>
                </div>
              </div>

              <div className="flex items-start gap-3 col-span-2 sm:col-span-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-800 shadow-md shadow-zinc-100 dark:bg-zinc-900 dark:text-white dark:shadow-none border border-zinc-150 dark:border-zinc-800">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-850 dark:text-zinc-200">10% Off Orders</h4>
                  <p className="text-xs text-zinc-500">On checkout &gt; $150</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right Image Showcase */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            <div className="relative overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-850 h-[380px] sm:h-[450px] w-full max-w-sm sm:max-w-md shadow-2xl hover:scale-101 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
                alt="Lifestyle premium shopping"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-zinc-900/0" />
              
              {/* Overlay Glass Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl border border-white/20 bg-white/20 dark:bg-zinc-950/20 backdrop-blur-md text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Featured Drop</p>
                <h3 className="text-lg font-black mt-1 leading-snug">The AeroSound Over-Ear Series</h3>
                <p className="text-xs text-zinc-200 mt-1">Starting from $249.99. Now in Silver and Matte Black.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
