"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, QrCode, RefreshCw, Sparkles } from "lucide-react";
import { generateQRDataURL } from "@/lib/qrcode";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const generateSmartSKU = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PM-PROD-${year}-${rand}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    salePrice: "",
    costPrice: "",
    sku: generateSmartSKU(),
    stock: "25",
    categoryId: "",
    brandId: "",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegenerateSKU = () => {
    setFormData((prev) => ({ ...prev, sku: generateSmartSKU() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/products");
      } else {
        setErrorMsg(data.error || "Failed to add product.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error creating product.");
    } finally {
      setLoading(false);
    }
  };

  const slugPreview = formData.name
    ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    : "new-product";

  const qrPreviewUrl = typeof window !== "undefined"
    ? `${window.location.origin}/product/${slugPreview}`
    : `https://ponchomukh.com/product/${slugPreview}`;

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] transition-colors">
          <ArrowLeft className="h-4 w-4 text-[#3B0C04]" />
        </Link>
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04]">
            নতুন পণ্য যুক্ত করুন (Add Product & Auto-QR)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            পণ্য ইনপুট করার সাথে সাথে স্বয়ংক্রিয়ভাবে SKU এবং QR কোড তৈরি হবে
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DCD2] shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#2B160F] mb-1">পণ্যের নাম (Product Name) *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="যেমন: Sonifer SF-350 Portable Rechargeable Juicer & Blender"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] text-xs font-semibold outline-none focus:border-[#3B0C04]"
            />
          </div>

          {/* SKU with Auto-Generate Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#2B160F]">স্বয়ংক্রিয় SKU কোড (Auto SKU) *</label>
              <button
                type="button"
                onClick={handleRegenerateSKU}
                className="text-[11px] font-bold text-[#3B0C04] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>নতুন SKU কোড জেনারেট</span>
              </button>
            </div>
            <input
              type="text"
              name="sku"
              required
              value={formData.sku}
              onChange={handleChange}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-mono font-bold text-[#3B0C04] outline-none focus:border-[#3B0C04]"
            />
          </div>

          {/* Pricing Row: Base, Sale, Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2B160F] mb-1">নিয়মিত মূল্য (Base Price) *</label>
              <input
                type="number"
                name="basePrice"
                required
                placeholder="1500"
                value={formData.basePrice}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-xl border border-[#E8DCD2] text-xs font-bold outline-none focus:border-[#3B0C04]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2B160F] mb-1">অফার মূল্য (Sale Price)</label>
              <input
                type="number"
                name="salePrice"
                placeholder="1200"
                value={formData.salePrice}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-xl border border-[#E8DCD2] text-xs font-bold text-[#16834A] outline-none focus:border-[#3B0C04]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2B160F] mb-1">কেনা দাম (Cost Price) *</label>
              <input
                type="number"
                name="costPrice"
                placeholder="850"
                value={formData.costPrice}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE] text-xs font-bold text-[#3B0C04] outline-none focus:border-[#3B0C04]"
              />
              <span className="text-[10px] text-[#8C7B72]">মুনাফা হিসেবের জন্য ব্যবহৃত হবে</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B160F] mb-1">মজুত পরিমাণ (Initial Stock) *</label>
            <input
              type="number"
              name="stock"
              required
              value={formData.stock}
              onChange={handleChange}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] text-xs font-bold outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B160F] mb-1">পণ্যের ছবি URL (Image URL) *</label>
            <input
              type="url"
              name="imageUrl"
              required
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] text-xs font-mono outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B160F] mb-1">বিস্তারিত বিবরণ (Description) *</label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="পণ্যের গুণাগুণ ও বিস্তারিত বর্ণনা..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-[#E8DCD2] text-xs outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div className="pt-3 border-t border-[#E8DCD2] flex justify-end gap-3">
            <Link
              href="/admin/products"
              className="px-5 py-2.5 rounded-xl border border-[#E8DCD2] text-xs font-bold text-[#6B5A52] hover:bg-[#FFF7EE]"
            >
              বাতিল
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "সংরক্ষণ হচ্ছে..." : "পণ্য সংরক্ষণ করুন"}</span>
            </button>
          </div>
        </form>

        {/* Live QR Code Auto-Preview Panel */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DCD2] shadow-xs space-y-4 text-center h-fit">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#3B0C04]">
            <QrCode className="w-4 h-4" />
            <span>লাইভ কিউআর (QR) জেনারেটর</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-dashed border-[#3B0C04] space-y-3">
            <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl border border-[#E8DCD2] shadow-2xs flex items-center justify-center">
              <img
                src={generateQRDataURL(qrPreviewUrl, 160)}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <p className="font-mono text-xs font-black text-[#3B0C04]">
                {formData.sku}
              </p>
              <p className="text-[11px] text-[#6B5A52] line-clamp-1">
                {formData.name || "নতুন পণ্য"}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-[#8C7B72] leading-relaxed">
            💡 পণ্যটি সেভ করার সাথে সাথে এই কিউআর দিয়ে ক্রেতারা যেকোনো মোবাইল থেকে স্ক্যান করে পণ্যের বিবরণ দেখতে পারবেন।
          </p>
        </div>
      </div>
    </div>
  );
}
