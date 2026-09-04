"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useCart } from "@/context/cart-context";
import {
  User,
  PackageCheck,
  Heart,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
  Clock,
  ShieldCheck,
  Edit2,
  CheckCircle2
} from "lucide-react";

function AccountContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses" | "profile" | "password">(
    (tabParam as any) || "overview"
  );

  const { wishlistCount } = useCart();

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
      if (stored.length > 0) {
        setOrders(stored);
      } else {
        // Sample order history
        setOrders([
          {
            orderId: "PN10025",
            date: "০৪ সেপ্টেম্বর, ২০২৬",
            items: [{ name: "Sonifer SF-350 Portable Rechargeable Juicer & Blender", quantity: 1, price: 1299 }],
            total: 1359,
            paymentMethod: "Cash on Delivery",
            status: "PROCESSING"
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header Breadcrumb */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-6">
          <div className="container-custom">
            <div className="flex items-center gap-1.5 text-xs text-[#8C7B72] mb-2">
              <Link href="/" className="hover:text-[#3B0C04]">হোম</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3B0C04] font-semibold">কাস্টমার অ্যাকাউন্ট</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3B0C04]">
              মাই অ্যাকাউন্ট (My Account)
            </h1>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation (3 Cols) */}
            <aside className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-[#E8DCD2] p-4 shadow-xs space-y-1">
                <div className="p-3 border-b border-[#E8DCD2]/60 mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold flex items-center justify-center text-sm">
                    তা
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2B160F] truncate">তানভীর আহমেদ</p>
                    <p className="text-[11px] text-[#8C7B72]">01712-345678</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === "overview"
                      ? "bg-[#3B0C04] text-[#FFC40E]"
                      : "text-[#2B160F] hover:bg-[#FFF7EE]"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>অ্যাকাউন্ট ওভারভিউ</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === "orders"
                      ? "bg-[#3B0C04] text-[#FFC40E]"
                      : "text-[#2B160F] hover:bg-[#FFF7EE]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <PackageCheck className="w-4 h-4" />
                    <span>আমার অর্ডারসমূহ</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFC40E] text-[#260700]">
                    {orders.length}
                  </span>
                </button>

                <Link
                  href="/wishlist"
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#2B160F] hover:bg-[#FFF7EE] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-[#D64545]" />
                    <span>উইশলিস্ট</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8DCD2] text-[#2B160F]">
                    {wishlistCount}
                  </span>
                </Link>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === "addresses"
                      ? "bg-[#3B0C04] text-[#FFC40E]"
                      : "text-[#2B160F] hover:bg-[#FFF7EE]"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>সংরক্ষিত ঠিকানা</span>
                </button>

                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === "profile"
                      ? "bg-[#3B0C04] text-[#FFC40E]"
                      : "text-[#2B160F] hover:bg-[#FFF7EE]"
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  <span>প্রোফাইল আপডেট</span>
                </button>

                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === "password"
                      ? "bg-[#3B0C04] text-[#FFC40E]"
                      : "text-[#2B160F] hover:bg-[#FFF7EE]"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>পাসওয়ার্ড পরিবর্তন</span>
                </button>

                <div className="pt-2 border-t border-[#E8DCD2]/60">
                  <Link
                    href="/"
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#D64545] hover:bg-[#D64545]/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>লগআউট (Logout)</span>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content (9 Cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
                    <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
                      স্বাগতম, তানভীর আহমেদ!
                    </h2>
                    <p className="text-xs text-[#6B5A52] leading-relaxed">
                      আপনার পঞ্চমুখ কাস্টমার ড্যাশবোর্ড থেকে সহজেই সাম্প্রতিক অর্ডার ট্র্যাকিং, প্রোফাইল তথ্য এবং সংরক্ষিত শিপিং ঠিকানা পরিচালনা করুন।
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2]">
                        <p className="text-xs font-bold text-[#6B5A52]">মোট অর্ডার</p>
                        <p className="text-2xl font-black text-[#3B0C04] mt-1">{orders.length}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2]">
                        <p className="text-xs font-bold text-[#6B5A52]">উইশলিস্ট পণ্য</p>
                        <p className="text-2xl font-black text-[#3B0C04] mt-1">{wishlistCount}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2]">
                        <p className="text-xs font-bold text-[#6B5A52]">সংরক্ষিত ঠিকানা</p>
                        <p className="text-2xl font-black text-[#3B0C04] mt-1">১টি</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Preview */}
                  <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E8DCD2] pb-3">
                      <h3 className="text-sm font-bold text-[#3B0C04]">সাম্প্রতিক অর্ডারসমূহ</h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs text-[#3B0C04] font-bold hover:underline"
                      >
                        সবগুলো দেখুন →
                      </button>
                    </div>

                    <div className="divide-y divide-[#E8DCD2]">
                      {orders.slice(0, 2).map((order) => (
                        <div key={order.orderId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#3B0C04]">{order.orderId}</span>
                            <p className="text-[#8C7B72] text-[11px]">{order.date}</p>
                          </div>
                          <div className="font-bold text-[#2B160F]">৳{order.total}</div>
                          <div>
                            <span className="px-2.5 py-1 rounded-full bg-[#E8F6F1] text-[#16834A] text-[11px] font-bold">
                              {order.status}
                            </span>
                          </div>
                          <Link
                            href={`/order-tracking?orderId=${order.orderId}`}
                            className="px-3 py-1.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] font-bold text-xs w-fit"
                          >
                            ট্র্যাক করুন
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 animate-in fade-in duration-200">
                  <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
                    আমার সকল অর্ডার ({orders.length})
                  </h2>

                  <div className="divide-y divide-[#E8DCD2]">
                    {orders.map((order) => (
                      <div key={order.orderId} className="py-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <strong className="font-mono text-sm text-[#3B0C04]">অর্ডার #{order.orderId}</strong>
                            <span className="text-[#8C7B72] ml-2">তারিখ: {order.date}</span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-[#E8F6F1] text-[#16834A] font-bold w-fit">
                            স্ট্যাটাস: {order.status}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E8DCD2] text-xs space-y-1">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-bold">৳{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="font-bold text-[#3B0C04] text-sm">সর্বমোট: ৳{order.total}</span>
                          <Link
                            href={`/order-tracking?orderId=${order.orderId}`}
                            className="px-4 py-2 rounded-lg bg-[#3B0C04] text-[#FFC40E] font-bold"
                          >
                            লাইভ ট্র্যাকিং দেখুন
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === "addresses" && (
                <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 animate-in fade-in duration-200">
                  <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
                    সংরক্ষিত ডেলিভারি ঠিকানা
                  </h2>

                  <div className="p-4 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#3B0C04] bg-[#FFF7EE] px-2 py-0.5 rounded border border-[#E8DCD2]">
                        ডিফল্ট ঠিকানা
                      </span>
                      <button className="text-[#3B0C04] font-bold hover:underline">এডিট</button>
                    </div>
                    <p className="font-bold text-[#2B160F]">তানভীর আহমেদ (01712-345678)</p>
                    <p className="text-[#6B5A52]">বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা-১২০৫</p>
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 animate-in fade-in duration-200">
                  <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
                    প্রোফাইল তথ্য আপডেট
                  </h2>

                  <form className="space-y-4 text-xs max-w-md">
                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">পূর্ণ নাম:</label>
                      <input
                        type="text"
                        defaultValue="তানভীর আহমেদ"
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">মোবাইল নম্বর:</label>
                      <input
                        type="tel"
                        defaultValue="01712-345678"
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">ইমেইল অ্যাড্রেস:</label>
                      <input
                        type="email"
                        defaultValue="tanvir.ahmed@example.com"
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] font-bold"
                    >
                      পরিবর্তন সংরক্ষণ করুন
                    </button>
                  </form>
                </div>
              )}

              {/* PASSWORD TAB */}
              {activeTab === "password" && (
                <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 animate-in fade-in duration-200">
                  <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
                    পাসওয়ার্ড পরিবর্তন
                  </h2>

                  <form className="space-y-4 text-xs max-w-md">
                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">বর্তমান পাসওয়ার্ড:</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">নতুন পাসওয়ার্ড:</label>
                      <input
                        type="password"
                        placeholder="নতুন পাসওয়ার্ড দিন"
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] font-bold"
                    >
                      পাসওয়ার্ড আপডেট করুন
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-8 text-[#3B0C04] font-bold">লোড হচ্ছে...</div>}>
      <AccountContent />
    </Suspense>
  );
}
