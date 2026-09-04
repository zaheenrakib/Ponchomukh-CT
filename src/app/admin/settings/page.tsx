"use client";

import React, { useState } from "react";
import { Settings, Save, ShieldCheck, Truck, CreditCard, Share2, Globe } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { initialSiteSettings } from "@/lib/mockData";

export default function AdminSettingsPage() {
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState<"general" | "delivery" | "payment" | "social" | "seo">("general");

  const [settings, setSettings] = useState(initialSiteSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("ponchomukh_site_settings", JSON.stringify(settings));
      showToast("✓ সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            ওয়েবসাইট সেটিংস (Website Settings)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            ব্র্যান্ড ইনফো, ডেলিভারি চার্জ, পেমেন্ট গেটওয়ে এবং সোশ্যাল লিংক পরিচালনা করুন
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DCD2] pb-1 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-lg shrink-0 transition-colors ${
            activeTab === "general" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          সাধারণ সেটিংস (General)
        </button>
        <button
          onClick={() => setActiveTab("delivery")}
          className={`px-4 py-2 rounded-lg shrink-0 transition-colors ${
            activeTab === "delivery" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          ডেলিভারি চার্জ (Delivery)
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2 rounded-lg shrink-0 transition-colors ${
            activeTab === "payment" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          পেমেন্ট মেথড (Payment)
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`px-4 py-2 rounded-lg shrink-0 transition-colors ${
            activeTab === "social" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          সোশ্যাল মিডিয়া (Social Links)
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-2 rounded-lg shrink-0 transition-colors ${
            activeTab === "seo" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          এসইও (SEO)
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* GENERAL SETTINGS */}
        {activeTab === "general" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              ব্র্যান্ড ও যোগাযোগের তথ্য
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">ব্র্যান্ড নাম (ইংরেজি):</label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">ব্র্যান্ড নাম (বাংলা):</label>
                <input
                  type="text"
                  value={settings.brandNameBn}
                  onChange={(e) => setSettings({ ...settings, brandNameBn: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">ট্যাগলাইন (Tagline):</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">হটলাইন ফোন নম্বর:</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">সাপোর্ট ইমেইল:</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">অফিস ও ওয়্যারহাউজ ঠিকানা:</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-3 rounded-lg border border-[#E8DCD2]"
              />
            </div>
          </div>
        )}

        {/* DELIVERY SETTINGS */}
        {activeTab === "delivery" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              ডেলিভারি চার্জ ও সময়সীমা
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] space-y-2">
                <h3 className="font-bold text-[#3B0C04]">ঢাকা সিটির ভেতর</h3>
                <div>
                  <label className="block font-bold mb-1">ডেলিভারি চার্জ (৳):</label>
                  <input
                    type="number"
                    value={settings.insideDhakaFee}
                    onChange={(e) => setSettings({ ...settings, insideDhakaFee: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-white font-bold text-sm text-[#3B0C04]"
                  />
                </div>
                <p className="text-[11px] text-[#8C7B72]">প্রত্যাশিত সময়: ২৪-৪৮ ঘণ্টা</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] space-y-2">
                <h3 className="font-bold text-[#3B0C04]">ঢাকার বাইরে (সারাদেশ)</h3>
                <div>
                  <label className="block font-bold mb-1">ডেলিভারি চার্জ (৳):</label>
                  <input
                    type="number"
                    value={settings.outsideDhakaFee}
                    onChange={(e) => setSettings({ ...settings, outsideDhakaFee: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-white font-bold text-sm text-[#3B0C04]"
                  />
                </div>
                <p className="text-[11px] text-[#8C7B72]">প্রত্যাশিত সময়: ২-৩ কার্যদিবস</p>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT SETTINGS */}
        {activeTab === "payment" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              পেমেন্ট মাধ্যম কনফিগারেশন
            </h2>

            <div className="p-4 rounded-xl border border-[#E8DCD2] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#2B160F]">ক্যাশ অন ডেলিভারি (Cash on Delivery)</h3>
                <p className="text-[#8C7B72]">চেকআউট পেজে গ্রাহকদের জন্য ডিফল্ট চালু রয়েছে</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E8F6F1] text-[#16834A] font-bold">
                ACTIVE
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#E8DCD2] flex items-center justify-between opacity-80">
              <div>
                <h3 className="font-bold text-[#2B160F]">bKash Merchant Payment Gateway</h3>
                <p className="text-[#8C7B72]">API ক্রেডেনশিয়াল ও ওয়েবহুক রেডি</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                GATEWAY READY
              </span>
            </div>
          </div>
        )}

        {/* SOCIAL LINKS */}
        {activeTab === "social" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              সোশ্যাল মিডিয়া প্রোফাইল লিংক
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Facebook URL:</label>
                <input
                  type="url"
                  value={settings.socialLinks.facebook}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Instagram URL:</label>
                <input
                  type="url"
                  value={settings.socialLinks.instagram}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">WhatsApp Hotline URL:</label>
                <input
                  type="url"
                  value={settings.socialLinks.whatsapp}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, whatsapp: e.target.value }
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO SETTINGS */}
        {activeTab === "seo" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              গ্লোবাল এসইও মেটাডাটা
            </h2>

            <div>
              <label className="block font-bold mb-1">সাইট টাইটেল (SEO Title):</label>
              <input
                type="text"
                defaultValue="পঞ্চমুখ (Ponchomukh) | পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ"
                className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">মেটা ডেসক্রিপশন (Meta Description):</label>
              <textarea
                rows={3}
                defaultValue="পঞ্চমুখ একটি modern Bangladesh-focused e-commerce platform। Gadgets, Electronics, Home & Kitchen, Travel Accessories এবং Lifestyle পণ্য সবচেয়ে সহজে ও দ্রুত ডেলিভারিতে পান।"
                className="w-full p-3 rounded-lg border border-[#E8DCD2]"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-xs shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস পরিবর্তন সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
}
