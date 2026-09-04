"use client";

import React, { useState } from "react";
import { mockCategories, Category } from "@/lib/mockData";
import { FolderTree, Plus, Edit2, Trash2, X, Check } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: catName.trim(),
      slug: catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: catDesc.trim(),
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
      subcategories: []
    };

    setCategories([...categories, newCat]);
    setIsAddOpen(false);
    setCatName("");
    setCatSlug("");
    setCatDesc("");
  };

  const handleDelete = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই ক্যাটাগরিটি মুছে ফেলতে চান?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            ক্যাটাগরি ব্যবস্থাপনা (Categories)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            স্টোরফ্রন্ট ক্যাটাগরি এবং সাবক্যাটাগরি নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি তৈরি করুন</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold text-[#8C7B72]">/{c.slug}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E8F6F1] text-[#16834A] text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <h3 className="text-base font-bold text-[#2B160F]">{c.name}</h3>
              <p className="text-xs text-[#6B5A52] line-clamp-2 mt-1">
                {c.description || "কোনো বিবরণ যোগ করা হয়নি।"}
              </p>

              {c.subcategories && c.subcategories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.subcategories.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded-md bg-[#FFF7EE] text-[#3B0C04] text-[10px] font-semibold border border-[#E8DCD2]"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E8DCD2]/60 flex items-center justify-between">
              <span className="text-[11px] text-[#8C7B72]">
                {c.subcategories?.length || 0} সাবক্যাটাগরি
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 rounded-md hover:bg-[#D64545]/10 text-[#D64545]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-[#E8DCD2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <h3 className="text-sm font-bold text-[#3B0C04]">নতুন ক্যাটাগরি যোগ করুন</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8C7B72]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">ক্যাটাগরি নাম: *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Smart Accessories"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">স্লাগ (URL Slug):</label>
                <input
                  type="text"
                  placeholder="smart-accessories"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">সংক্ষিপ্ত বিবরণ:</label>
                <textarea
                  rows={3}
                  placeholder="ক্যাটাগরির বিবরণ লিখুন..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E8DCD2]"
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
