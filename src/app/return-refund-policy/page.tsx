"use client";

import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-8 text-center">
          <div className="container-custom max-w-xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-[#3B0C04]">
              রিটার্ন ও রিফান্ড পলিসি
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5A52]">
              সহজ ৭ দিনের রিটার্ন এবং রিপ্লেসমেন্ট নির্দেশিকা
            </p>
          </div>
        </div>

        <div className="container-custom py-10 max-w-3xl space-y-6 text-xs sm:text-sm text-[#2B160F] leading-relaxed">
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#3B0C04]" />
              <span>১. ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি</span>
            </h2>
            <p className="text-[#6B5A52]">
              পণ্য রিসিভ করার পর যদি পণ্যে কোনো কারিগরি ত্রুটি, ড্যামেজ বা ভুল পণ্য পাওয়ার ঘটনা ঘটে, তবে ৭ দিনের মধ্যে আমাদের সাথে যোগাযোগ করে সম্পূর্ণ বিনামূল্যে রিপ্লেসমেন্ট সেবা গ্রহণ করা যাবে।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#16834A]" />
              <span>২. রিটার্নের প্রযোজ্য শর্তাবলী</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[#6B5A52]">
              <li>পণ্যের মূল প্যাকেজিং বক্স, ম্যানুয়াল ও সকল এক্সেসরিজ অক্ষত থাকতে হবে।</li>
              <li>পণ্যটি অপব্যবহারজনিত কারণে ক্ষতিগ্রস্ত হওয়া যাবে না।</li>
              <li>রিটার্ন প্রসেসের জন্য পণ্যের ত্রুটির ছবি বা ছোট ভিডিও আমাদের হোয়াটসঅ্যাপে প্রেরণ করতে হবে।</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-3">
            <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3B0C04]" />
              <span>৩. রিফান্ড পদ্ধতি</span>
            </h2>
            <p className="text-[#6B5A52]">
              যদি সমমানের পণ্য স্টকে না থাকে বা গ্রাহক টাকা ফেরত চান, তবে পণ্যটি আমাদের ওয়্যারহাউজে পৌঁছানোর ৩ থেকে ৫ কার্যদিবসের মধ্যে বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্টের মাধ্যমে সম্পূর্ণ টাকা রিফান্ড করা হবে।
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
