"use client";

import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { FileText, CheckCircle2 } from "lucide-react";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-8 text-center">
          <div className="container-custom max-w-xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-[#3B0C04]">
              শর্তাবলী (Terms & Conditions)
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5A52]">
              পঞ্চমুখ ওয়েবসাইট ব্যবহারের সাধারণ নিয়ম ও নিয়মনীতি
            </p>
          </div>
        </div>

        <div className="container-custom py-10 max-w-3xl space-y-6 text-xs sm:text-sm text-[#2B160F] leading-relaxed">
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3B0C04]" />
              <span>১. সাধারণ নিয়মাবলী</span>
            </h2>
            <p className="text-[#6B5A52]">
              পঞ্চমুখ থেকে যেকোনো অর্ডার প্রদান করার মাধ্যমে গ্রাহক আমাদের নিয়ম ও শর্তাবলীতে সম্মতি প্রদান করেন। পণ্যের প্রাপ্যতা ও মূল্যের তারতম্য কর্তৃপক্ষ যেকোনো সময় পরিবর্তনের অধিকার রাখে।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#16834A]" />
              <span>২. অর্ডার গ্রহণ ও বাতিল</span>
            </h2>
            <p className="text-[#6B5A52]">
              স্টক অনুপলব্ধতা বা অনিবার্য কারণে কর্তৃপক্ষ যেকোনো অর্ডার সংশোধন বা বাতিল করার অধিকার সংরক্ষণ করে। গ্রাহককে তাৎক্ষণিকভাবে বিষয়টি অবগত করা হবে।
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
