"use client";

import React, { useState } from "react";
import { Sliders, CheckCircle2, Eye, EyeOff, Save, Layout } from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function AdminHomepageControlPage() {
  const { showToast } = useCart();

  const [sections, setSections] = useState([
    { id: "sec-announcement", name: "Announcement Bar", enabled: true, desc: "Top header notification bar for delivery policies and store announcements" },
    { id: "sec-hero", name: "Hero Banner Carousel", enabled: true, desc: "Primary rotatable slider with headlines and call-to-action buttons" },
    { id: "sec-category", name: "Shop by Category Grid", enabled: true, desc: "Visual category exploration tiles and quick access cards" },
    { id: "sec-featured", name: "Featured Products Showcase", enabled: true, desc: "Curated flagship spotlight product cards" },
    { id: "sec-promo", name: "Promotional Campaign Banner", enabled: true, desc: "High-impact lifestyle promotion and seasonal campaign banners" },
    { id: "sec-bestseller", name: "Best Sellers Collection", enabled: true, desc: "Top-selling merchandise based on actual sales velocity" },
    { id: "sec-flash", name: "Flash Sale Countdown Deal", enabled: true, desc: "Limited-time promotional campaign with live countdown timer" },
    { id: "sec-new", name: "New Arrivals Showcase", enabled: true, desc: "Latest inventory releases and recently stocked items" },
    { id: "sec-collection", name: "Curated Box Collections", enabled: true, desc: "Lifestyle, kitchen essentials, and smart gadgets bundles" },
    { id: "sec-why", name: "Trust Badges & Value Propositions", enabled: true, desc: "Store guarantees: authentic items, swift delivery, cash on delivery" },
    { id: "sec-reviews", name: "Customer Testimonials & Reviews", enabled: true, desc: "Verified customer testimonials and social proof cards" },
    { id: "sec-social", name: "Social Channels & Community", enabled: true, desc: "Links to official Facebook and Instagram pages" },
    { id: "sec-newsletter", name: "Newsletter Subscription Box", enabled: true, desc: "Customer email retention and discount subscriber form" },
  ]);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSave = () => {
    try {
      localStorage.setItem("ponchomukh_homepage_sections", JSON.stringify(sections));
      showToast("✓ Homepage layout configuration saved successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2">
            <span>CMS: Homepage Layout & Section Controls</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              Marketing & CMS
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            Enable, disable, order, and toggle storefront homepage layout modules and sections
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Layout Configuration</span>
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
                {sec.enabled ? "Active" : "Hidden"}
              </span>

              <button
                onClick={() => toggleSection(sec.id)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  sec.enabled ? "bg-[#3B0C04]" : "bg-[#E8DCD2]"
                }`}
                title={sec.enabled ? "Click to hide section" : "Click to enable section"}
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
