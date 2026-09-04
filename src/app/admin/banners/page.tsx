"use client";

import React, { useState } from "react";
import { mockBanners, Banner } from "@/lib/mockData";
import { Image as ImageIcon, Plus, Trash2, Edit2, X } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [btnText, setBtnText] = useState("Shop Now");
  const [btnUrl, setBtnUrl] = useState("/shop");
  const [imageUrl, setImageUrl] = useState("");
  const [position, setPosition] = useState<"HERO" | "PROMOTIONAL">("HERO");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const newBanner: Banner = {
      id: `banner-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      buttonText: btnText.trim(),
      buttonUrl: btnUrl.trim(),
      imageUrl: imageUrl.trim(),
      position,
      isActive: true,
      sortOrder: banners.length + 1
    };

    setBanners([...banners, newBanner]);
    setIsAddOpen(false);
    setTitle("");
    setSubtitle("");
    setImageUrl("");
  };

  const handleDelete = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই ব্যানারটি মুছে ফেলতে চান?")) {
      setBanners(banners.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            ব্যানার ব্যবস্থাপনা (Banners)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            হিরো সেকশন ও প্রমোশনাল ব্যানার পরিবর্তন করুন
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্যানার যুক্ত করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-3 overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative aspect-16/7 w-full rounded-xl overflow-hidden bg-[#FFF7EE] border border-[#E8DCD2]">
                <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#3B0C04] text-[#FFC40E] text-[10px] font-black">
                  {b.position} BANNER
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#2B160F]">{b.title}</h3>
              <p className="text-xs text-[#6B5A52]">{b.subtitle}</p>
            </div>

            <div className="pt-3 border-t border-[#E8DCD2] flex items-center justify-between text-xs">
              <span className="font-bold text-[#3B0C04]">বাটন: {b.buttonText} ({b.buttonUrl})</span>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-1.5 text-[#D64545] hover:bg-[#D64545]/10 rounded-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-[#E8DCD2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <h3 className="text-sm font-bold text-[#3B0C04]">নতুন ব্যানার যুক্ত করুন</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8C7B72]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">ব্যানার শিরোনাম: *</label>
                <input
                  type="text"
                  required
                  placeholder="আপনার পছন্দের পণ্য, এখন এক ঠিকানায়..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">সাবটাইটেল / বিবরণ:</label>
                <input
                  type="text"
                  placeholder="Quality products for your everyday life..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">ইমেজ URL: *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">বাটন টেক্সট:</label>
                  <input
                    type="text"
                    value={btnText}
                    onChange={(e) => setBtnText(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">পজিশন:</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                  >
                    <option value="HERO">HERO BANNER</option>
                    <option value="PROMOTIONAL">PROMOTIONAL BANNER</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DCD2]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-lg border font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#3B0C04] text-[#FFC40E] font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
