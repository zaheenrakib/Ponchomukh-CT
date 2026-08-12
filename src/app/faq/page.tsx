"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { ChevronDown } from "lucide-react";

function FAQContent() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "কী কী পেমেন্ট পদ্ধতি গ্রহণ করা হয়?",
      a: "আমরা বর্তমানে ক্যাশ অন ডেলিভারি (Cash on Delivery) পেমেন্ট সুবিধা প্রদান করছি। পণ্য হাতে পেয়ে মূল্য পরিশোধ করতে পারবেন।",
    },
    {
      q: "ডেলিভারি হতে কত সময় লাগে?",
      a: "ঢাকার ভিতরে ২৪ থেকে ৪৮ ঘণ্টা এবং ঢাকার বাইরে ২ থেকে ৪ দিনের মধ্যে হোম ডেলিভারি সম্পন্ন করা হয়।",
    },
    {
      q: "ক্যাশ অন ডেলিভারি সুবিধা আছে কি?",
      a: "হ্যাঁ, সারা বাংলাদেশে ক্যাশ অন ডেলিভারি প্রযোজ্য।",
    },
    {
      q: "রিটার্ন বা পরিবর্তন পলিসি কী?",
      a: "পণ্য গ্রহণের ৭ দিনের মধ্যে কোনো ত্রুটি পরিলক্ষিত হলে আমরা সহজ রিটার্ন এবং রিপ্লেসমেন্ট নিশ্চিত করি।",
    },
    {
      q: "অর্ডার ট্র্যাক করবো কীভাবে?",
      a: "আমাদের ওয়েবসাইটে 'Track Order' অপশনে গিয়ে আপনার Order Number (যেমন: PN-10001) বা ফোন নম্বর টাইপ করে রিয়েল-টাইম স্ট্যাটাস ট্র্যাক করতে পারবেন।",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 text-left space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04] dark:text-white">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-zinc-500">
            সাধারণ জিজ্ঞাসা ও উত্তর
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#E8DCD2] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-xs sm:text-sm text-[#3B0C04] flex justify-between items-center"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-600 font-medium leading-relaxed border-t border-zinc-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function FAQPage() {
  return (
    <CartProvider>
      <FAQContent />
    </CartProvider>
  );
}
