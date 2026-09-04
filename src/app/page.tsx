"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { CartDrawer } from "@/components/cart-drawer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Footer } from "@/components/footer";
import {
  mockCategories,
  mockProducts,
  mockCollections,
  mockBanners,
  Category,
  Product
} from "@/lib/mockData";
import {
  Smartphone,
  Headphones,
  Utensils,
  Luggage,
  Sparkles,
  Package,
  ArrowRight,
  Flame,
  Clock,
  Truck,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  HeadphonesIcon,
  Lock,
  Star,
  CheckCircle2,
  Mail,
  MessageCircle,
  Video
} from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/social-icons";

export default function HomePage() {
  // Flash Sale Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 34,
    seconds: 22
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, "0");

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case "Smartphone": return <Smartphone className="w-6 h-6 text-[#3B0C04]" />;
      case "Headphones": return <Headphones className="w-6 h-6 text-[#3B0C04]" />;
      case "Utensils": return <Utensils className="w-6 h-6 text-[#3B0C04]" />;
      case "Luggage": return <Luggage className="w-6 h-6 text-[#3B0C04]" />;
      case "Sparkles": return <Sparkles className="w-6 h-6 text-[#3B0C04]" />;
      default: return <Package className="w-6 h-6 text-[#3B0C04]" />;
    }
  };

  // Filter products by homepage sections
  const featuredProducts = mockProducts.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellerProducts = mockProducts.filter((p) => p.isBestSeller).slice(0, 4);
  const flashSaleProducts = mockProducts.filter((p) => p.isFlashSale).slice(0, 4);
  const newArrivalProducts = mockProducts.filter((p) => p.isNewArrival || !p.isBestSeller).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      {/* 1. ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* 2 & 3. HEADER & NAVIGATION MENU */}
      <Navbar />

      <main className="flex-1 space-y-16 md:space-y-20 pb-16">
        {/* 4. HERO BANNER */}
        <Hero />

        {/* 5. SHOP BY CATEGORY */}
        <section className="container-custom">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-[#2B160F]">
                Shop by Category
              </h2>
              <p className="text-xs md:text-sm text-[#6B5A52] mt-1">
                আপনার প্রয়োজনীয় ক্যাটাগরি বেছে নিয়ে সহজেই পণ্য খুঁজুন
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs md:text-sm font-bold text-[#3B0C04] hover:text-[#260700] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Cards Grid (6 cards desktop, 2-col mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 md:gap-4">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center text-center p-4 rounded-xl bg-white border border-[#E8DCD2] hover:border-[#3B0C04] hover:shadow-md transition-all duration-200"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#FFF7EE] group-hover:bg-[#3B0C04] flex items-center justify-center mb-3 transition-colors duration-200">
                  <div className="group-hover:text-[#FFC40E] transition-colors">
                    {getCategoryIcon(category.iconName)}
                  </div>
                </div>
                <h3 className="text-xs md:text-sm font-bold text-[#2B160F] group-hover:text-[#3B0C04] transition-colors line-clamp-1">
                  {category.name}
                </h3>
                <span className="text-[11px] text-[#8C7B72] mt-0.5">
                  {category.subcategories?.length || 0}+ আইটেম
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. FEATURED PRODUCTS (4 cards desktop, 2-col mobile) */}
        <section className="container-custom">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFC40E]" />
                <h2 className="text-xl md:text-3xl font-bold text-[#2B160F]">
                  Featured Products
                </h2>
              </div>
              <p className="text-xs md:text-sm text-[#6B5A52] mt-1">
                গ্রাহকদের সর্বাধিক পছন্দের যাচাইকৃত প্রিমিয়াম প্রোডাক্ট
              </p>
            </div>
            <Link
              href="/shop?filter=featured"
              className="text-xs md:text-sm font-bold text-[#3B0C04] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 7. PROMOTIONAL BANNER (280px full width, Brown + Gold + Cream) */}
        <section className="container-custom">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#3B0C04] via-[#260700] to-[#1A0400] text-white p-6 sm:p-10 lg:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl space-y-3 text-center md:text-left z-10">
              <span className="px-3 py-1 rounded-full bg-[#FFC40E] text-[#260700] text-xs font-black uppercase tracking-wider">
                Special Collection
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#FFC40E] leading-tight">
                Make Everyday Life Better
              </h3>
              <p className="text-xs sm:text-sm text-[#E8DCD2]/90 leading-relaxed font-normal">
                প্রিমিয়াম কোয়ালিটি ও আধুনিক ডিজাইনের কিচেন ও হোম গ্যাজেটে বিশেষ ছাড়। আজই অর্ডার করুন এবং উপভোগ করুন দ্রুত হোম ডেলিভারি।
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FFC40E] hover:bg-[#D99E00] text-[#260700] font-bold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative w-full md:w-auto flex justify-center">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-2xl bg-white/10 p-3 backdrop-blur-xs border border-white/20 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80"
                  alt="Special Home Collection"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 8. BEST SELLERS */}
        <section className="container-custom">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-[#2B160F]">
                Best Sellers
              </h2>
              <p className="text-xs md:text-sm text-[#6B5A52] mt-1">
                সবচেয়ে বেশি বিক্রিত এবং গ্রাহকদের সেরা রেটিংপ্রাপ্ত পণ্যসমূহ
              </p>
            </div>
            <Link
              href="/shop?filter=bestseller"
              className="text-xs md:text-sm font-bold text-[#3B0C04] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 9. FLASH SALE (Countdown + Products) */}
        {flashSaleProducts.length > 0 && (
          <section className="container-custom">
            <div className="p-6 md:p-8 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 border-b border-[#E8DCD2]/70 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D64545] text-white flex items-center justify-center shadow-xs">
                    <Flame className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-[#3B0C04]">
                      ⚡ FLASH SALE
                    </h2>
                    <p className="text-xs text-[#6B5A52]">সীমিত সময়ের স্পেশাল ডিসকাউন্ট অফার</p>
                  </div>
                </div>

                {/* Countdown Box */}
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-[#6B5A52] mr-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> অফার শেষ হতে বাকি:
                  </span>
                  <div className="flex items-center gap-1 font-mono text-sm font-black text-white">
                    <span className="px-2 py-1 rounded-md bg-[#3B0C04]">{formatDigit(timeLeft.days)}d</span>
                    <span className="text-[#3B0C04]">:</span>
                    <span className="px-2 py-1 rounded-md bg-[#3B0C04]">{formatDigit(timeLeft.hours)}h</span>
                    <span className="text-[#3B0C04]">:</span>
                    <span className="px-2 py-1 rounded-md bg-[#3B0C04]">{formatDigit(timeLeft.minutes)}m</span>
                    <span className="text-[#3B0C04]">:</span>
                    <span className="px-2 py-1 rounded-md bg-[#D64545]">{formatDigit(timeLeft.seconds)}s</span>
                  </div>
                </div>
              </div>

              {/* Flash Sale Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
                {flashSaleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 10. NEW ARRIVALS */}
        <section className="container-custom">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-[#2B160F]">
                New Arrivals
              </h2>
              <p className="text-xs md:text-sm text-[#6B5A52] mt-1">
                সর্বশেষ যুক্ত হওয়া নতুন পণ্যের আধুনিক কালেকশন
              </p>
            </div>
            <Link
              href="/shop?filter=new"
              className="text-xs md:text-sm font-bold text-[#3B0C04] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
            {newArrivalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 11. SHOP BY COLLECTION */}
        <section className="container-custom">
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-[#2B160F]">
              Curated Collections
            </h2>
            <p className="text-xs md:text-sm text-[#6B5A52] mt-1">
              আপনার প্রয়োজন অনুযায়ী বিশেষভাবে সাজানো কালেকশন
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {mockCollections.map((col) => (
              <Link
                key={col.id}
                href="/shop"
                className="group relative h-60 rounded-2xl overflow-hidden border border-[#E8DCD2] shadow-sm flex flex-col justify-end p-5"
              >
                {/* Background Image */}
                <img
                  src={col.imageUrl}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#260700] via-[#260700]/60 to-transparent" />

                {/* Content */}
                <div className="relative z-10 text-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC40E]">
                    {col.productCount}+ পণ্য
                  </span>
                  <h3 className="text-lg font-bold group-hover:text-[#FFC40E] transition-colors">
                    {col.titleBn}
                  </h3>
                  <p className="text-xs text-[#E8DCD2]/80 line-clamp-1">
                    {col.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#FFC40E]">
                    <span>Explore Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 12. WHY CHOOSE PONCHOMUKH (6 Trust Cards) */}
        <section className="container-custom">
          <div className="text-center max-w-xl mx-auto mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-[#3B0C04]">
              কেন পঞ্চমুখ?
            </h2>
            <p className="text-xs md:text-sm text-[#6B5A52] mt-1.5">
              অনলাইন শপিংয়ে আপনার সর্বোচ্চ আস্থা ও সন্তুষ্টি নিশ্চিতে আমরা প্রতিশ্রুতিবদ্ধ
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 md:gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E8DCD2] text-center space-y-2 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#3B0C04]" />
              </div>
              <h3 className="text-xs md:text-sm font-bold text-[#2B160F]">Fast Delivery</h3>
              <p className="text-[11px] text-[#6B5A52]">সারা দেশে দ্রুত হোম ডেলিভারি</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8DCD2] text-center space-y-2 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#3B0C04]" />
              </div>
              <h3 className="text-xs md:text-sm font-bold text-[#2B160F]">Easy Payment</h3>
              <p className="text-[11px] text-[#6B5A52]">সহজ ও নিরাপদ Cash on Delivery</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8DCD2] text-center space-y-2 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#16834A]" />
              </div>
              <h3 className="text-xs md:text-sm font-bold text-[#2B160F]">Trusted Products</h3>
              <p className="text-[11px] text-[#6B5A52]">মানসম্মত ও ১০০% যাচাইকৃত পণ্য</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8DCD2] text-center space-y-2 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-[#3B0C04]" />
              </div>
              <h3 className="text-xs md:text-sm font-bold text-[#2B160F]">Easy Return</h3>
              <p className="text-[11px] text-[#6B5A52]">সহজ ৭ দিনের রিটার্ন পলিসি</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8DCD2] text-center space-y-2 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                <HeadphonesIcon className="w-6 h-6 text-[#3B0C04]" />
              </div>
              <h3 className="text-xs md:text-sm font-bold text-[#2B160F]">Customer Support</h3>
              <p className="text-[11px] text-[#6B5A52]">দ্রুত ও নির্ভরযোগ্য কাস্টমার কেয়ার</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8DCD2] text-center space-y-2 hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#3B0C04]" />
              </div>
              <h3 className="text-xs md:text-sm font-bold text-[#2B160F]">Secure Shopping</h3>
              <p className="text-[11px] text-[#6B5A52]">নিরাপদ অনলাইন শপিং অভিজ্ঞতা</p>
            </div>
          </div>
        </section>

        {/* 13. CUSTOMER REVIEWS (3 review cards desktop / swipe mobile) */}
        <section className="container-custom">
          <div className="text-center max-w-xl mx-auto mb-8 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-[#2B160F]">
              Customers Love Ponchomukh
            </h2>
            <p className="text-xs md:text-sm text-[#6B5A52] mt-1">
              আমাদের সম্মানিত গ্রাহকদের বাস্তব অভিজ্ঞতা ও মতামত
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] space-y-4 shadow-xs">
              <div className="flex items-center text-[#FFC40E] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-[#2B160F] leading-relaxed italic">
                “Sonifer ব্লেন্ডারটা অনেক ভালো কাজ করছে। ঢাকার ভেতর মাত্র ২৪ ঘণ্টায় ডেলিভারি পেয়েছি। প্রোডাক্টের ফিনিশিং একদম ছবির মতোই নিখুঁত।”
              </p>
              <div className="pt-2 border-t border-[#E8DCD2]/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2B160F]">তানভীর আহমেদ</h4>
                  <span className="text-[10px] text-[#8C7B72]">ধানমন্ডি, ঢাকা</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16834A] bg-[#E8F6F1] px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] space-y-4 shadow-xs">
              <div className="flex items-center text-[#FFC40E] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-[#2B160F] leading-relaxed italic">
                “Joyroom ইয়ারবাডসটা সাউন্ড কোয়ালিটি বেশ দারুণ। ব্যাস খুব ভালো। পঞ্চমুখের কাস্টমার সাপোর্ট খুব হেল্পফুল ছিল। ধন্যবাদ!”
              </p>
              <div className="pt-2 border-t border-[#E8DCD2]/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2B160F]">সুমাইয়া আক্তার</h4>
                  <span className="text-[10px] text-[#8C7B72]">উত্তরা, ঢাকা</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16834A] bg-[#E8F6F1] px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] space-y-4 shadow-xs">
              <div className="flex items-center text-[#FFC40E] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-[#2B160F] leading-relaxed italic">
                “স্মার্ট ফ্লাস্ক ও ওয়াটারপ্রুফ ব্যাকপ্যাক অর্ডার করেছিলাম। চিটাগংয়ে ৩ দিনের মধ্যে পেয়েছি। ক্যাশ অন ডেলিভারিতে চেক করে নিয়েছি।”
              </p>
              <div className="pt-2 border-t border-[#E8DCD2]/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2B160F]">মাহির ফয়সাল</h4>
                  <span className="text-[10px] text-[#8C7B72]">চট্টগ্রাম</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16834A] bg-[#E8F6F1] px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 14. TRUST & PAYMENT SECTION */}
        <section className="container-custom">
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD2] flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#16834A]" />
              <div>
                <h4 className="text-sm font-bold text-[#2B160F]">১০০% নিরাপদ ও সুবিধাজনক পেমেন্ট</h4>
                <p className="text-xs text-[#6B5A52]">ক্যাশ অন ডেলিভারি এবং দ্রুত অনলাইন ট্রানজেকশন</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E8DCD2] text-[#3B0C04]">
                💵 Cash on Delivery
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E8DCD2] text-[#D12053]">
                bKash Ready
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E8DCD2] text-[#F7931E]">
                Nagad Ready
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E8DCD2] text-[#1A1F71]">
                Visa / MasterCard
              </span>
            </div>
          </div>
        </section>

        {/* 15. SOCIAL MEDIA / FOLLOW PONCHOMUKH */}
        <section className="container-custom text-center space-y-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#2B160F]">
              Follow Ponchomukh
            </h2>
            <p className="text-xs text-[#6B5A52] mt-1">
              আমাদের সোশ্যাল মিডিয়া পেজে যুক্ত হয়ে পান আকর্ষণীয় গিভঅ্যাওয়ে ও লাইভ আপডেট
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <a
              href="https://facebook.com/ponchomukh"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white text-xs font-bold transition-colors"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Facebook</span>
            </a>
            <a
              href="https://instagram.com/ponchomukh"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white text-xs font-bold transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram</span>
            </a>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366] hover:text-white text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </section>

        {/* 16. NEWSLETTER (Deep Brown Background + Gold CTA) */}
        <section className="container-custom">
          <div className="rounded-2xl bg-[#3B0C04] text-white p-6 md:p-10 lg:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFC40E]">
                <Mail className="w-4 h-4" />
                <span>Stay Updated</span>
              </div>
              <h3 className="text-xl md:text-3xl font-black text-[#FFC40E]">
                বিশেষ অফার ও ডিসকাউন্ট পেতে থাকুন
              </h3>
              <p className="text-xs text-[#E8DCD2]/80 leading-relaxed font-normal">
                নতুন পণ্য, ফ্ল্যাশ সেল ও ডিসকাউন্ট কুপনের নোটিফিকেশন সবার আগে পেতে আমাদের নিউজলেটার সাবস্ক্রাইব করুন।
              </p>
            </div>

            <div className="w-full md:w-auto flex-1 max-w-md">
              {newsletterSubmitted ? (
                <div className="p-4 rounded-xl bg-[#16834A]/20 border border-[#16834A] text-center text-xs font-bold text-[#FFC40E]">
                  ✓ ধন্যবাদ! আপনার সাবস্ক্রিপশন সফলভাবে সম্পন্ন হয়েছে।
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 h-12 px-4 rounded-lg bg-white text-[#2B160F] text-xs placeholder-[#8C7B72] focus:outline-none focus:ring-2 focus:ring-[#FFC40E]"
                  />
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-lg bg-[#FFC40E] hover:bg-[#D99E00] text-[#260700] font-bold text-xs sm:text-sm transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 17. FOOTER */}
      <Footer />

      {/* Sticky Mobile Bottom Navigation (0-767px) */}
      <MobileBottomNav />

      {/* Quick View Product Modal */}
      <ProductModal />

      {/* Mini Cart Slide-Over Drawer */}
      <CartDrawer />
    </div>
  );
}
