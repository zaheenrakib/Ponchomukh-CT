"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    announcement_text: "🚚 সারা বাংলাদেশে হোম ডেলিভারি | Cash on Delivery Available",
    delivery_inside_dhaka: "60",
    delivery_outside_dhaka: "120",
    contact_phone: "+880 1700-000000",
    contact_email: "support@ponchomukh.com",
    contact_address: "Dhaka, Bangladesh",
    social_facebook: "https://facebook.com/ponchomukh",
    social_instagram: "https://instagram.com/ponchomukh",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-zinc-950 p-8 text-left text-zinc-900 dark:text-zinc-100">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="p-2 rounded-xl border border-zinc-200 bg-white">
          <ArrowLeft className="h-4 w-4 text-zinc-600" />
        </Link>
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
            Website Settings
          </h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Manage announcement text, delivery charges, and contact information
          </p>
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="h-4 w-4" /> Settings successfully saved to database!
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 space-y-6">
        
        {/* Header & Announcement */}
        <div className="space-y-4">
          <h2 className="font-sans font-black text-base text-[#3B0C04] border-b border-zinc-150 pb-2">
            Header & Announcement Bar
          </h2>

          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1">Announcement Bar Text</label>
            <input
              type="text"
              name="announcement_text"
              value={settings.announcement_text || ""}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
            />
          </div>
        </div>

        {/* Delivery Charges */}
        <div className="space-y-4 pt-4 border-t border-zinc-150">
          <h2 className="font-sans font-black text-base text-[#3B0C04] border-b border-zinc-150 pb-2">
            Delivery Charges (৳ BDT)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1">Inside Dhaka Fee (৳)</label>
              <input
                type="number"
                name="delivery_inside_dhaka"
                value={settings.delivery_inside_dhaka || "60"}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1">Outside Dhaka Fee (৳)</label>
              <input
                type="number"
                name="delivery_outside_dhaka"
                value={settings.delivery_outside_dhaka || "120"}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 pt-4 border-t border-zinc-150">
          <h2 className="font-sans font-black text-base text-[#3B0C04] border-b border-zinc-150 pb-2">
            Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1">Contact Phone</label>
              <input
                type="text"
                name="contact_phone"
                value={settings.contact_phone || ""}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email || ""}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 items-center justify-center gap-2 px-8 rounded-xl bg-[#3B0C04] text-white font-bold text-xs shadow-md"
        >
          <Save className="h-4 w-4 text-[#FFC40E]" />
          <span>{loading ? "Saving Settings..." : "Save Settings"}</span>
        </button>

      </form>
    </div>
  );
}
