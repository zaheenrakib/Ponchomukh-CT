"use client";

import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-8 text-center">
          <div className="container-custom max-w-xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-[#3B0C04]">
              ডেলিভারি পলিসি (Shipping Policy)
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5A52]">
              আমাদের ডেলিভারি সময়সীমা, চার্জ এবং শর্তাবলী
            </p>
          </div>
        </div>

        <div className="container-custom py-10 max-w-3xl space-y-6 text-xs sm:text-sm text-[#2B160F] leading-relaxed">
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#3B0C04]" />
              <span>১. ডেলিভারি এলাকা ও চার্জসমূহ</span>
            </h2>
            <p>
              পঞ্চমুখ সমগ্র বাংলাদেশে অত্যন্ত দ্রুততম সময়ে নির্ভরযোগ্য হোম ডেলিভারি সেবা প্রদান করে থাকে।
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#6B5A52]">
              <li><strong>ঢাকা সিটির ভেতরে:</strong> ডেলিভারি চার্জ মাত্র ৳৬০।</li>
              <li><strong>ঢাকার বাইরে (সমগ্র বাংলাদেশ):</strong> হোম ডেলিভারি চার্জ ৳১২০।</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#3B0C04]" />
              <span>২. ডেলিভারি সময়সীমা</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[#6B5A52]">
              <li>অর্ডার সফলভাবে প্লেস করার পর আমাদের প্রতিনিধি গ্রাহকের সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবেন।</li>
              <li>ঢাকা সিটির ভেতরে অর্ডার কনফার্মেশনের ২৪ থেকে ৪৮ ঘণ্টার মধ্যে পণ্য পৌঁছে দেওয়া হয়।</li>
              <li>ঢাকার বাইরে সমগ্র বাংলাদেশে ২ থেকে ৩ কার্যদিবসের মধ্যে কুরিয়ারের মাধ্যমে ডেলিভারি করা হয়।</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#16834A]" />
              <span>৩. ক্যাশ অন ডেলিভারি এবং পার্সেল চেকিং</span>
            </h2>
            <p className="text-[#6B5A52]">
              গ্রাহক ডেলিভারি ম্যানের উপস্থিতিতে পার্সেল চেক করে সঠিক পণ্য বুঝে পাওয়ার পর মূল্য পরিশোধ করতে পারবেন। কোনো অসঙ্গতি থাকলে তাৎক্ষণিকভাবে আমাদের হেল্পলাইনে (+880 1700-000000) অবহিত করুন।
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
