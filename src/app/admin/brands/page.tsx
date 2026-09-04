"use client";

import React, { useState } from "react";
import { mockBrands, Brand } from "@/lib/mockData";
import { Tag, Plus, Trash2, X } from "lucide-react";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    };

    setBrands([...brands, newBrand]);
    setIsAddOpen(false);
    setName("");
    setSlug("");
  };

  const handleDelete = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই ব্র্যান্ডটি মুছে ফেলতে চান?")) {
      setBrands(brands.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            ব্র্যান্ড ব্যবস্থাপনা (Brands)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            পণ্যসমূহের ব্র্যান্ড পরিচালনা করুন
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্র্যান্ড যোগ করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((b) => (
          <div
            key={b.id}
            className="p-4 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center justify-between"
          >
            <div>
              <h3 className="text-sm font-bold text-[#2B160F]">{b.name}</h3>
              <span className="font-mono text-[10px] text-[#8C7B72]">/{b.slug}</span>
            </div>
            <button
              onClick={() => handleDelete(b.id)}
              className="p-1 rounded text-[#8C7B72] hover:text-[#D64545]"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-[#E8DCD2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <h3 className="text-sm font-bold text-[#3B0C04]">নতুন ব্র্যান্ড</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8C7B72]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBrand} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">ব্র্যান্ড নাম: *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Anker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">স্লাগ:</label>
                <input
                  type="text"
                  placeholder="anker"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] font-mono"
                />
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
