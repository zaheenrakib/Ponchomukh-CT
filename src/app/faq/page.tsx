"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Plus, Minus, HelpCircle, ChevronRight, Phone } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What payment methods do you accept? (আপনারা কী কী পেমেন্ট মাধ্যম গ্রহণ করেন?)",
      a: "আমরা বর্তমানে সমগ্র বাংলাদেশে সম্পূর্ণ ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা প্রদান করছি। এছাড়া বিকাশ (bKash) ও অনলাইন পেমেন্ট গেটওয়ে সিস্টেমের সুবিধা খুব শীঘ্রই চালু হতে যাচ্ছে।"
    },
    {
      q: "How long does delivery take? (ডেলিভারি পেতে কতদিন সময় লাগে?)",
      a: "ঢাকা সিটির ভেতরে অর্ডার কনফার্মের পর ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়। ঢাকার বাইরে সমগ্র বাংলাদেশে ২ থেকে ৩ কার্যদিবসের মধ্যে নির্ভরযোগ্য কুরিয়ার সার্ভিসের মাধ্যমে হোম ডেলিভারি করা হয়।"
    },
    {
      q: "Do you offer Cash on Delivery? (আপনারা কি ক্যাশ অন ডেলিভারিতে পণ্য দেন?)",
      a: "হ্যাঁ, পঞ্চমুখের সকল পণ্যে কোনো প্রকার অগ্রিম চার্জ ছাড়াই সম্পূর্ণ ক্যাশ অন ডেলিভারির সুবিধা রয়েছে। ডেলিভারি ম্যানের কাছ থেকে পণ্য বুঝে পেয়ে মূল্য পরিশোধ করতে পারবেন।"
    },
    {
      q: "What is your return policy? (পণ্য রিটার্ন বা পরিবর্তনের নিয়ম কী?)",
      a: "পণ্য হাতে পাওয়ার পর যদি কোনো ত্রুটি, অসম্পূর্ণতা বা সমস্যা পরিলক্ষিত হয়, তবে ৭ দিনের মধ্যে আমাদের হটলাইনে কল দিয়ে সহজ রিটার্ন ও তাৎক্ষণিক রিপ্লেসমেন্ট সেবা গ্রহণ করতে পারবেন।"
    },
    {
      q: "How can I track my order? (আমি কীভাবে আমার অর্ডার ট্র্যাক করব?)",
      a: "ওয়েবসাইটের উপরের মেন্যু থেকে 'অর্ডার ট্র্যাকিং' পেজে যান এবং আপনার অর্ডার নম্বর (যেমন: PN10025) ও মোবাইল নম্বর ইনপুট দিয়ে লাইভ স্ট্যাটাস দেখতে পারবেন।"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header Breadcrumb */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-8 text-center">
          <div className="container-custom max-w-xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-[#3B0C04]">
              সাধারণ জিজ্ঞাসা (FAQ)
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5A52]">
              অনলাইন শপিং সম্পর্কিত সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর
            </p>
          </div>
        </div>

        <div className="container-custom py-10 max-w-3xl space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#E8DCD2] overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#2B160F] hover:bg-[#FFF7EE] transition-colors"
              >
                <span>{faq.q}</span>
                <span className="w-6 h-6 rounded-full bg-[#FFF7EE] text-[#3B0C04] flex items-center justify-center shrink-0">
                  {openIndex === idx ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </button>

              {openIndex === idx && (
                <div className="px-5 pb-5 text-xs text-[#6B5A52] leading-relaxed border-t border-[#E8DCD2]/60 pt-3 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          ))}

          {/* Direct Support CTA */}
          <div className="mt-8 p-6 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] text-center space-y-3">
            <h3 className="text-sm font-bold text-[#3B0C04]">অন্য কোনো প্রশ্ন আছে?</h3>
            <p className="text-xs text-[#6B5A52]">
              আমাদের কাস্টমার সাপোর্ট টিম আপনাকে সহযোগিতা করতে সর্বদা প্রস্তুত।
            </p>
            <div className="pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>আমাদের সাথে যোগাযোগ করুন</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
