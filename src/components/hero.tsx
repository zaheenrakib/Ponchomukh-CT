"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonUrl?: string;
  badge?: string;
  highlightTitle?: string;
  highlightPrice?: number;
  highlightOldPrice?: number;
}

const defaultSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "আপনার পছন্দের সেরা পণ্য, এখন এক ঠিকানায়।",
    subtitle: "দৈনন্দিন জীবনের প্রয়োজনীয় স্মার্ট গ্যাজেট, হোম অ্যাপ্লায়েন্স ও লাইফস্টাইল পণ্য নির্বাচন করুন সেরা মূল্যে।",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    buttonText: "এখনই কিনুন",
    buttonUrl: "/shop",
    badge: "নতুন কালেকশন ২০২৬",
    highlightTitle: "আল্ট্রা স্মার্টওয়াচ সিরিজ ৯",
    highlightPrice: 1999,
    highlightOldPrice: 2899,
  },
  {
    id: "hero-2",
    title: "স্মার্ট কিচেন ও হোম অ্যাপ্লায়েন্সের বিশাল সমাহার!",
    subtitle: "সহজ ও স্বাস্থ্যকর জীবনযাপনের জন্য আধুনিক ব্লেন্ডার, ইলেকট্রিক চপার ও কিচেন গ্যাজেট কিনুন ক্যাশ অন ডেলিভারিতে।",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80",
    buttonText: "কিচেন অফার দেখুন",
    buttonUrl: "/category/home-kitchen",
    badge: "হট ডিল ৫০% পর্যন্ত ছাড়",
    highlightTitle: "সনিফার পোর্টেবল জুসার ব্লেন্ডার",
    highlightPrice: 1299,
    highlightOldPrice: 1850,
  },
  {
    id: "hero-3",
    title: "প্রিমিয়াম অডিও ও ওয়্যারলেস সাউন্ডের আসল অনুভূতি।",
    subtitle: "নয়েজ ক্যান্সেলেশন ইয়ারবাডস, ব্লুটুথ স্পিকার এবং চার্জিং এক্সেসরিজ সরাসরি আপনার দোরগোড়ায়।",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    buttonText: "অডিও কালেকশন",
    buttonUrl: "/category/gadgets",
    badge: "টপ রেটেড পণ্য",
    highlightTitle: "জয়রুম প্রো এএনসি ইয়ারবাডস",
    highlightPrice: 1899,
    highlightOldPrice: 2600,
  },
];

export const Hero: React.FC = () => {
  const { t, formatPrice } = useLanguage();
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Fetch banners from API
  useEffect(() => {
    let isMounted = true;
    async function fetchHeroBanners() {
      try {
        const res = await fetch("/api/banners?position=HERO");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.banners) && data.banners.length > 0) {
            const mapped: HeroSlide[] = data.banners.map((b: any, idx: number) => ({
              id: b.id || `banner-${idx}`,
              title: b.title,
              subtitle: b.subtitle || defaultSlides[idx % defaultSlides.length].subtitle,
              imageUrl: b.imageUrl,
              buttonText: b.buttonText || "এখনই কিনুন",
              buttonUrl: b.buttonUrl || "/shop",
              badge: b.badge || defaultSlides[idx % defaultSlides.length].badge,
              highlightTitle: b.highlightTitle || defaultSlides[idx % defaultSlides.length].highlightTitle,
              highlightPrice: b.highlightPrice || defaultSlides[idx % defaultSlides.length].highlightPrice,
              highlightOldPrice: b.highlightOldPrice || defaultSlides[idx % defaultSlides.length].highlightOldPrice,
            }));
            if (isMounted) {
              setSlides(mapped);
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch hero banners, using default slides:", err);
      }
    }

    fetchHeroBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play interval
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalSlides]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (deltaX > 50) {
      nextSlide(); // Swiped left -> next slide
    } else if (deltaX < -50) {
      prevSlide(); // Swiped right -> prev slide
    }
    touchStartX.current = null;
  };

  const current = slides[currentSlide] || slides[0];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[#FFF7EE] via-[#FFFDF9] to-[#F3F7F5] border-b border-[#E8DCD2] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container-custom relative">
        <div className="min-h-[460px] md:min-h-[500px] lg:h-[500px] py-8 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-8 transition-opacity duration-300">
          
          {/* Left Text Content (50%) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-5 text-center lg:text-left z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3B0C04]/10 border border-[#3B0C04]/20 text-xs font-bold text-[#3B0C04] w-fit mx-auto lg:mx-0 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC40E]" />
              <span>{current.badge || t("hero.badge")}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#3B0C04] tracking-tight leading-[1.2] min-h-[70px] sm:min-h-[110px] flex items-center justify-center lg:justify-start">
              <span>{current.title}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-[#6B5A52] max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal min-h-[44px]">
              {current.subtitle || t("hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href={current.buttonUrl || "/shop"}
                className="w-full sm:w-auto h-11 md:h-12 px-7 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95"
              >
                <span>{current.buttonText || t("hero.shopNow")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-auto h-11 md:h-12 px-6 rounded-xl bg-white hover:bg-[#FFF7EE] text-[#3B0C04] border border-[#3B0C04] font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
              >
                <span>{t("hero.exploreProducts")}</span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-[#6B5A52]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#3B0C04]" />
                <span>{t("hero.homeDelivery")}</span>
              </div>
              <span className="hidden sm:inline text-[#E8DCD2]">•</span>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#3B0C04]" />
                <span>{t("hero.cashOnDelivery")}</span>
              </div>
              <span className="hidden sm:inline text-[#E8DCD2]">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16834A]" />
                <span>{t("hero.originalProducts")}</span>
              </div>
            </div>
          </div>

          {/* Right Visual / Image Area (50%) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative">
            {/* Soft decorative background circles */}
            <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#FFC40E]/20 blur-2xl -z-0 pointer-events-none" />
            <div className="absolute w-60 h-60 rounded-full bg-[#3B0C04]/10 blur-xl -z-0 pointer-events-none" />

            {/* Featured Product Composition Card */}
            <div className="relative z-10 w-full max-w-md aspect-4/3 md:aspect-square rounded-3xl bg-white/85 backdrop-blur-md border border-[#E8DCD2] shadow-xl p-4 flex flex-col items-center justify-center overflow-hidden group">
              <img
                key={current.id}
                src={current.imageUrl}
                alt={current.title}
                className="w-4/5 h-4/5 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 animate-in fade-in zoom-in-95 duration-300"
              />

              {/* Floating Highlight Pill */}
              {current.highlightTitle && (
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/95 border border-[#E8DCD2] shadow-sm flex items-center justify-between backdrop-blur-xs">
                  <div>
                    <p className="text-xs font-bold text-[#2B160F] truncate max-w-[180px] sm:max-w-[220px]">
                      {current.highlightTitle}
                    </p>
                    {current.highlightPrice && (
                      <p className="text-xs text-[#3B0C04] font-black">
                        {formatPrice(current.highlightPrice)}{" "}
                        {current.highlightOldPrice && (
                          <span className="text-[10px] text-[#8C7B72] line-through font-normal">
                            {formatPrice(current.highlightOldPrice)}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <Link
                    href={current.buttonUrl || "/shop"}
                    className="px-3.5 py-1.5 rounded-xl bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700] transition-colors shrink-0"
                  >
                    {t("hero.view")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#E8DCD2] text-[#3B0C04] hover:bg-[#3B0C04] hover:text-[#FFC40E] flex items-center justify-center shadow-md transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#E8DCD2] text-[#3B0C04] hover:bg-[#3B0C04] hover:text-[#FFC40E] flex items-center justify-center shadow-md transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Indicators (Dots & Auto-Play Pause Indicator) */}
        {totalSlides > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#E8DCD2] backdrop-blur-xs shadow-2xs">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === idx
                    ? "w-6 h-2 bg-[#3B0C04]"
                    : "w-2 h-2 bg-[#8C7B72]/40 hover:bg-[#8C7B72]"
                }`}
              />
            ))}
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "অটোপ্লে চালু করুন" : "অটোপ্লে বন্ধ করুন"}
              className="ml-1 text-[#8C7B72] hover:text-[#3B0C04] p-0.5"
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
