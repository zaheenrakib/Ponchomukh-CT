"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useLanguage } from "@/context/language-context";
import {
  CheckCircle2,
  PackageCheck,
  Phone,
  ShoppingBag
} from "lucide-react";

function OrderSuccessContent() {
  const { language, formatPrice } = useLanguage();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "#PN10025";
  const name = searchParams.get("name") || (language === "bn" ? "সম্মানিত গ্রাহক" : "Valued Customer");
  const phone = searchParams.get("phone") || "017XXXXXXXX";
  const total = searchParams.get("total") || "1299";
  const method = searchParams.get("method") || "Cash on Delivery";

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E8DCD2] p-6 sm:p-10 text-center shadow-xl space-y-6">
          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-[#E8F6F1] border-4 border-[#16834A]/20 text-[#16834A] mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#16834A] bg-[#E8F6F1] px-3 py-1 rounded-full">
              {language === "bn" ? "অর্ডার গৃহীত হয়েছে" : "Order Placed Successfully"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3B0C04]">
              {language === "bn"
                ? "আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!"
                : "Thank You! Your Order has been Placed."}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5A52]">
              {language === "bn"
                ? "আমাদের টিম খুব দ্রুত আপনার সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবে।"
                : "Our support team will call you shortly to confirm your delivery details."}
            </p>
          </div>

          {/* Order Details Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] text-left text-xs space-y-3">
            <div className="flex justify-between border-b border-[#E8DCD2]/60 pb-2">
              <span className="text-[#8C7B72]">
                {language === "bn" ? "অর্ডার নম্বর (Order ID):" : "Order ID:"}
              </span>
              <strong className="font-mono text-sm text-[#3B0C04] font-black">{orderId}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8C7B72]">
                {language === "bn" ? "গ্রাহকের নাম:" : "Customer Name:"}
              </span>
              <span className="font-bold text-[#2B160F]">{name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8C7B72]">
                {language === "bn" ? "মোবাইল নম্বর:" : "Mobile Number:"}
              </span>
              <span className="font-bold text-[#2B160F]">{phone}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8C7B72]">
                {language === "bn" ? "পেমেন্ট মাধ্যম:" : "Payment Method:"}
              </span>
              <span className="font-bold text-[#2B160F]">{method}</span>
            </div>

            <div className="flex justify-between border-t border-[#E8DCD2]/60 pt-2 text-sm">
              <span className="font-bold text-[#3B0C04]">
                {language === "bn" ? "সর্বমোট প্রদেয় বিল:" : "Total Amount:"}
              </span>
              <span className="font-black text-[#3B0C04] text-base">
                {formatPrice(Number(total.replace(/[^0-9]/g, "")) || 0)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <Link
              href={`/order-tracking?orderId=${encodeURIComponent(orderId)}`}
              className="w-full h-12 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <PackageCheck className="w-4 h-4" />
              <span>{language === "bn" ? "অর্ডার ট্র্যাক করুন (Track Order)" : "Track Your Order"}</span>
            </Link>

            <Link
              href="/shop"
              className="w-full h-12 rounded-lg bg-white hover:bg-[#FFF7EE] border border-[#E8DCD2] text-[#3B0C04] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === "bn" ? "আরও শপিং করুন (Continue Shopping)" : "Continue Shopping"}</span>
            </Link>
          </div>

          <div className="pt-2 text-[11px] text-[#8C7B72] flex items-center justify-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#3B0C04]" />
            <span>
              {language === "bn"
                ? "যেকোনো প্রয়োজনে কল করুন: 01700-000000"
                : "Need help? Call hotline: 01700-000000"}
            </span>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-8 text-[#3B0C04] font-bold">লোড হচ্ছে...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
