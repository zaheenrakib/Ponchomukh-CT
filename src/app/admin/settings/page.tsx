"use client";

import React, { useState } from "react";
import { Settings, Save, ShieldCheck, Truck, CreditCard, Share2, Globe } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { initialSiteSettings } from "@/lib/mockData";

export default function AdminSettingsPage() {
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState<"general" | "delivery" | "payment" | "social" | "seo">("general");

  const [settings, setSettings] = useState(initialSiteSettings);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("ponchomukh_site_settings", JSON.stringify(settings));
    } catch (err) {
      console.error(err);
    }

    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      showToast("✓ System settings saved successfully to database!");
    } catch (err) {
      console.warn("Could not save settings to API:", err);
      showToast("✓ Settings saved locally!");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2">
            <span>System Settings & Store Configuration</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              Configuration
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            Configure store profile, logistics fulfillment fees, payment channels, social links, and SEO
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
          General Store Info
        </button>
        <button
          onClick={() => setActiveTab("delivery")}
          className={`px-4 py-2 rounded-lg shrink-0 transition-colors ${
            activeTab === "delivery" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          Delivery & Shipping Charges
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2 rounded-lg shrink-0 transition-colors ${
            activeTab === "payment" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          Payment Gateways
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`px-4 py-2 rounded-lg shrink-0 transition-colors ${
            activeTab === "social" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          Social Media & Support Links
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-2 rounded-lg shrink-0 transition-colors ${
            activeTab === "seo" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          Global SEO
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* GENERAL SETTINGS */}
        {activeTab === "general" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              Brand Profile & Corporate Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1 text-[#2B160F]">Brand Name (English):</label>
                <input
                  type="text"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#2B160F]">Brand Name (Localized / Alternate):</label>
                <input
                  type="text"
                  value={settings.brandNameBn}
                  onChange={(e) => setSettings({ ...settings, brandNameBn: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-[#2B160F]">Corporate Tagline:</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1 text-[#2B160F]">Customer Hotline Phone:</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#2B160F]">Official Support Email:</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-[#2B160F]">Head Office & Warehouse Address:</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
              />
            </div>
          </div>
        )}

        {/* DELIVERY SETTINGS */}
        {activeTab === "delivery" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              Logistics & Courier Delivery Tariffs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] space-y-2">
                <h3 className="font-bold text-[#3B0C04]">Inside Dhaka Metro</h3>
                <div>
                  <label className="block font-bold mb-1 text-[#2B160F]">Delivery Fee (৳):</label>
                  <input
                    type="number"
                    value={settings.insideDhakaFee}
                    onChange={(e) => setSettings({ ...settings, insideDhakaFee: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-white font-bold text-sm text-[#3B0C04] focus:outline-none focus:border-[#3B0C04]"
                  />
                </div>
                <p className="text-[11px] text-[#8C7B72]">Estimated SLA: 24 - 48 Hours</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] space-y-2">
                <h3 className="font-bold text-[#3B0C04]">Outside Dhaka Metro (Nationwide)</h3>
                <div>
                  <label className="block font-bold mb-1 text-[#2B160F]">Delivery Fee (৳):</label>
                  <input
                    type="number"
                    value={settings.outsideDhakaFee}
                    onChange={(e) => setSettings({ ...settings, outsideDhakaFee: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-white font-bold text-sm text-[#3B0C04] focus:outline-none focus:border-[#3B0C04]"
                  />
                </div>
                <p className="text-[11px] text-[#8C7B72]">Estimated SLA: 2 - 4 Business Days</p>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT SETTINGS */}
        {activeTab === "payment" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              Payment Gateway Configurations
            </h2>

            <div className="p-4 rounded-2xl border border-[#E8DCD2] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#2B160F]">Cash on Delivery (COD)</h3>
                <p className="text-[#8C7B72]">Enabled by default on checkout and POS registers</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E8F6F1] text-[#16834A] font-bold text-xs">
                ACTIVE
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[#E8DCD2] flex items-center justify-between opacity-80">
              <div>
                <h3 className="font-bold text-[#2B160F]">bKash Merchant Payment Gateway</h3>
                <p className="text-[#8C7B72]">Direct API credentials and webhook integration ready</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                GATEWAY READY
              </span>
            </div>
          </div>
        )}

        {/* SOCIAL LINKS */}
        {activeTab === "social" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              Social Media Channels & Customer Support
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block font-bold mb-1 text-[#2B160F]">Facebook Page URL:</label>
                <input
                  type="url"
                  value={settings.socialLinks.facebook}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#2B160F]">Instagram Profile URL:</label>
                <input
                  type="url"
                  value={settings.socialLinks.instagram}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#2B160F]">WhatsApp Hotline URL:</label>
                <input
                  type="url"
                  value={settings.socialLinks.whatsapp}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, whatsapp: e.target.value }
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO SETTINGS */}
        {activeTab === "seo" && (
          <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
              Global SEO Metadata & Search Discovery
            </h2>

            <div>
              <label className="block font-bold mb-1 text-[#2B160F]">Site Meta Title:</label>
              <input
                type="text"
                defaultValue="Ponchomukh | Curated Essentials, Premium Gadgets & Lifestyle Store"
                className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[#2B160F]">Meta Description:</label>
              <textarea
                rows={3}
                defaultValue="Ponchomukh is a modern enterprise e-commerce platform delivering curated smart gadgets, home & kitchen accessories, travel gear, and lifestyle products nationwide across Bangladesh."
                className="w-full p-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
