"use client";

import React, { useState } from "react";
import { Sliders, CheckCircle2, Eye, EyeOff, Save } from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function AdminHomepageControlPage() {
  const { showToast } = useCart();

  const [sections, setSections] = useState([
    { id: "sec-announcement", name: "Announcement Bar (টপ নোটিশ বার)", enabled: true, desc: "সারা দেশে ফ্রি/হোম ডেলিভারি নোটিস" },
    { id: "sec-hero", name: "Hero Banner Slider (প্রধান ব্যানার)", enabled: true, desc: "হেডলাইন ও শপ নাও বাটন" },
    { id: "sec-category", name: "Shop by Category (ক্যাটাগরি গ্রিড)", enabled: true, desc: "৬টি প্রধান ক্যাটাগরি কার্ড" },
    { id: "sec-featured", name: "Featured Products (প্রস্তাবিত পণ্য)", enabled: true, desc: "৪টি স্পেশাল প্রোডাক্ট কার্ড" },
    { id: "sec-promo", name: "Promotional Banner (প্রোমো ব্যানার)", enabled: true, desc: "Make Everyday Life Better ব্যানার" },
    { id: "sec-bestseller", name: "Best Sellers (বেস্ট সেলার)", enabled: true, desc: "টপ বিক্রিত প্রোডাক্ট গ্রিড" },
    { id: "sec-flash", name: "Flash Sale (কাউন্টডাউন ডিল)", enabled: true, desc: "সীমিত সময়ের অফার টাইমার ও প্রোডাক্ট" },
    { id: "sec-new", name: "New Arrivals (নতুন পণ্য)", enabled: true, desc: "লেটেস্ট কালেকশন গ্রিড" },
    { id: "sec-collection", name: "Curated Collections (কালেকশন)", enabled: true, desc: "স্মার্ট গ্যাজেট, কিচেন ও ট্রাভেল বক্স" },
    { id: "sec-why", name: "Why Choose Ponchomukh (বিশ্বাসযোগ্যতা)", enabled: true, desc: "৬টি ট্রাস্ট আইকন ও বিবরণ" },
    { id: "sec-reviews", name: "Customer Reviews (গ্রাহক রিভিউ)", enabled: true, desc: "যাচাইকৃত কাস্টমার মতামত" },
    { id: "sec-social", name: "Follow Ponchomukh (সোশ্যাল চ্যানেল)", enabled: true, desc: "ফেসবুক ও ইনস্টাগ্রাম লিংক" },
    { id: "sec-newsletter", name: "Newsletter (নিউজলেটার)", enabled: true, desc: "ইমেইল সাবস্ক্রিপশন বক্স" },
  ]);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSave = () => {
    try {
      localStorage.setItem("ponchomukh_homepage_sections", JSON.stringify(sections));
      showToast("✓ হোমপেজ কনফিগারেশন সংরক্ষিত হয়েছে!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            হোমপেজ সেকশন কন্ট্রোলার (Homepage Management)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            হোমপেজের প্রতিটি সেকশনের দৃশ্যমানতা (Enable/Disable) ও ক্রম নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>পরিবর্তন সংরক্ষণ করুন</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8DCD2] shadow-xs divide-y divide-[#E8DCD2]">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FFFDF9] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-[#FFF7EE] border border-[#E8DCD2] text-[#3B0C04] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#2B160F] flex items-center gap-2">
                  <span>{sec.name}</span>
                </h3>
                <p className="text-xs text-[#8C7B72] mt-0.5">{sec.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  sec.enabled ? "bg-[#E8F6F1] text-[#16834A]" : "bg-[#D64545]/10 text-[#D64545]"
                }`}
              >
                {sec.enabled ? "সক্রিয় (Active)" : "নিষ্ক্রিয় (Hidden)"}
              </span>

              <button
                onClick={() => toggleSection(sec.id)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  sec.enabled ? "bg-[#3B0C04]" : "bg-[#E8DCD2]"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    sec.enabled ? "translate-x-6 bg-[#FFC40E]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
