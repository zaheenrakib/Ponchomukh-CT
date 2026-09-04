"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  ChevronRight,
  Phone,
  ShieldCheck,
  RotateCcw,
  AlertCircle
} from "lucide-react";

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const [orderInput, setOrderInput] = useState(initialOrderId);
  const [phoneInput, setPhoneInput] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Default demo order for instant preview if no orders in storage
  const demoOrder = {
    orderId: "PN10025",
    date: "০৪ সেপ্টেম্বর, ২০২৬",
    customer: {
      name: "তানভীর আহমেদ",
      phone: "01712-345678",
      address: "বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা-১২০৫"
    },
    items: [
      {
        name: "Sonifer SF-350 Portable Rechargeable Juicer & Blender (350ml)",
        quantity: 1,
        price: 1299,
        image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&auto=format&fit=crop&q=80"
      }
    ],
    total: 1359,
    shippingFee: 60,
    paymentMethod: "Cash on Delivery",
    status: "PROCESSING",
    timeline: [
      { title: "অর্ডার গ্রহণ (Order Placed)", time: "০৪ সেপ্টেম্বর, ১০:৩০ AM", done: true },
      { title: "অর্ডার নিশ্চিত (Confirmed)", time: "০৪ সেপ্টেম্বর, ১১:১৫ AM", done: true },
      { title: "প্যাকেজিং ও প্রসেসিং (Processing)", time: "০৪ সেপ্টেম্বর, ০৩:৪৫ PM", done: true, current: true },
      { title: "কুরিয়ারে হস্তান্তর (Shipped)", time: "প্রত্যাশিত: ০৫ সেপ্টেম্বর", done: false },
      { title: "ডেলিভারির জন্য বের হয়েছে (Out for Delivery)", time: "প্রত্যাশিত: ০৫ সেপ্টেম্বর", done: false },
      { title: "ডেলিভারি সম্পন্ন (Delivered)", time: "প্রত্যাশিত: ০৬ সেপ্টেম্বর", done: false }
    ]
  };

  useEffect(() => {
    if (initialOrderId) {
      handleSearch(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = (idToSearch?: string) => {
    const targetId = (idToSearch || orderInput).trim().toUpperCase();
    if (!targetId) return;

    setHasSearched(true);

    try {
      const storedOrders = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
      const found = storedOrders.find(
        (o: any) => o.orderId.toUpperCase() === targetId || o.orderId.toUpperCase() === `#${targetId}`
      );

      if (found) {
        setSearchedOrder({
          ...found,
          timeline: [
            { title: "অর্ডার গ্রহণ (Order Placed)", time: "আজকে", done: true, current: found.status === "PENDING" },
            { title: "অর্ডার নিশ্চিত (Confirmed)", time: found.status !== "PENDING" ? "আজকে" : "অপেক্ষমান", done: found.status !== "PENDING" },
            { title: "প্রসেসিং (Processing)", time: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(found.status) ? "আজকে" : "অপেক্ষমান", done: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(found.status) },
            { title: "কুরিয়ারে হস্তান্তর (Shipped)", time: ["SHIPPED", "DELIVERED"].includes(found.status) ? "আজকে" : "অপেক্ষমান", done: ["SHIPPED", "DELIVERED"].includes(found.status) },
            { title: "আউট ফর ডেলিভারি (Out for Delivery)", time: found.status === "DELIVERED" ? "আজকে" : "অপেক্ষমান", done: found.status === "DELIVERED" },
            { title: "ডেলিভারি সম্পন্ন (Delivered)", time: found.status === "DELIVERED" ? "সম্পন্ন" : "অপেক্ষমান", done: found.status === "DELIVERED" }
          ]
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback demo order
    if (targetId.includes("10025") || targetId === "PN10025" || targetId === "#PN10025") {
      setSearchedOrder(demoOrder);
    } else {
      setSearchedOrder(null);
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header Breadcrumb */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-8">
          <div className="container-custom">
            <div className="flex items-center gap-1.5 text-xs text-[#8C7B72] mb-2">
              <Link href="/" className="hover:text-[#3B0C04]">হোম</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3B0C04] font-semibold">অর্ডার ট্র্যাকিং</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3B0C04]">
              অর্ডার ট্র্যাকিং (Order Tracking)
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5A52] mt-0.5">
              আপনার অর্ডারের বর্তমান অবস্থা এবং ডেলিভারি অগ্রগতি সরাসরি ট্র্যাক করুন
            </p>
          </div>
        </div>

        <div className="container-custom py-8 max-w-4xl">
          {/* Tracking Lookup Box */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs mb-8">
            <form onSubmit={onSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold text-[#2B160F] mb-1">
                  অর্ডার নম্বর (Order ID):
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: PN10025"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] uppercase text-xs font-mono font-bold focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-[#2B160F] mb-1">
                  মোবাইল নম্বর (ঐচ্ছিক):
                </label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] text-xs focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>ট্র্যাক করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* Results Area */}
          {hasSearched && !searchedOrder && (
            <div className="p-10 text-center rounded-2xl bg-white border border-[#E8DCD2] space-y-3">
              <AlertCircle className="w-10 h-10 text-[#D64545] mx-auto" />
              <h3 className="text-base font-bold text-[#2B160F]">
                অর্ডারটি খুঁজে পাওয়া যায়নি
              </h3>
              <p className="text-xs text-[#8C7B72]">
                দয়া করে অর্ডার নম্বর (যেমন: PN10025) সঠিকভাবে পরীক্ষা করে আবার চেষ্টা করুন।
              </p>
            </div>
          )}

          {searchedOrder && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Order Status Badge & Meta */}
              <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#8C7B72]">অর্ডার আইডি:</span>
                    <strong className="font-mono text-base font-black text-[#3B0C04]">
                      {searchedOrder.orderId}
                    </strong>
                  </div>
                  <p className="text-xs text-[#6B5A52]">
                    অর্ডারের তারিখ: {searchedOrder.date} | পেমেন্ট: {searchedOrder.paymentMethod}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F6F1] border border-[#16834A]/30 text-xs font-bold text-[#16834A]">
                  <Clock className="w-4 h-4" />
                  <span>স্ট্যাটাস: {searchedOrder.status}</span>
                </div>
              </div>

              {/* Vertical / Horizontal Timeline */}
              <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs">
                <h3 className="text-sm font-bold text-[#3B0C04] uppercase tracking-wider mb-6 border-b border-[#E8DCD2] pb-3">
                  ডেলিভারি ট্র্যাকিং টাইমলাইন (Live Timeline)
                </h3>

                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DCD2]">
                  {searchedOrder.timeline.map((step: any, idx: number) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Step Circle Indicator */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          step.done
                            ? "bg-[#16834A] text-white ring-4 ring-[#E8F6F1]"
                            : "bg-white border-2 border-[#E8DCD2] text-[#8C7B72]"
                        }`}
                      >
                        {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Step Text Info */}
                      <div className="flex-1">
                        <h4
                          className={`text-xs sm:text-sm font-bold ${
                            step.done ? "text-[#2B160F]" : "text-[#8C7B72]"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-[#8C7B72] mt-0.5">
                          {step.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-white border border-[#E8DCD2] text-xs space-y-2">
                  <h4 className="font-bold text-[#3B0C04] uppercase border-b border-[#E8DCD2] pb-2">
                    ডেলিভারি ঠিকানা
                  </h4>
                  <p><strong>প্রাপক:</strong> {searchedOrder.customer.name}</p>
                  <p><strong>ফোন:</strong> {searchedOrder.customer.phone}</p>
                  <p><strong>ঠিকানা:</strong> {searchedOrder.customer.address}</p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-[#E8DCD2] text-xs space-y-2">
                  <h4 className="font-bold text-[#3B0C04] uppercase border-b border-[#E8DCD2] pb-2">
                    পেমেন্ট ও বিলিং
                  </h4>
                  <p><strong>পেমেন্ট মেথড:</strong> {searchedOrder.paymentMethod}</p>
                  <p><strong>ডেলিভারি চার্জ:</strong> ৳{searchedOrder.shippingFee || 60}</p>
                  <p className="text-sm font-bold text-[#3B0C04]">
                    <strong>সর্বমোট বিল:</strong> ৳{searchedOrder.total}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-8 text-[#3B0C04] font-bold">লোড হচ্ছে...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
