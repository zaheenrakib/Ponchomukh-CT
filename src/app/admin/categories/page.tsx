"use client";

import React, { useState, useEffect } from "react";
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  X,
  RefreshCw,
  Search,
  Tag,
  Package,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink,
  FolderPlus
} from "lucide-react";
import { mockCategories } from "@/lib/mockData";

interface SubCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  _count?: { products: number };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  parent?: { id: string; name: string } | null;
  children?: SubCategoryItem[];
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewFilter, setViewFilter] = useState<"ALL" | "MAIN" | "SUBCAT">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; isSub: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form Fields
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImageUrl, setCatImageUrl] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          // Normalize categories into top-level categories with their children
          const allCats: CategoryItem[] = data.categories;
          const topLevelMap = new Map<string, CategoryItem>();
          const standaloneSubs: CategoryItem[] = [];

          allCats.forEach((c) => {
            if (!c.parentId) {
              topLevelMap.set(c.id, {
                ...c,
                children: c.children || [],
              });
            } else {
              standaloneSubs.push(c);
            }
          });

          // Attach standalone subcategories if any weren't in children
          standaloneSubs.forEach((sub) => {
            if (sub.parentId && topLevelMap.has(sub.parentId)) {
              const parent = topLevelMap.get(sub.parentId)!;
              const exists = (parent.children || []).some((ch) => ch.id === sub.id);
              if (!exists) {
                parent.children = [...(parent.children || []), sub];
              }
            }
          });

          setCategories(Array.from(topLevelMap.values()));
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load categories from DB, using fallback:", err);
    } finally {
      setIsLoading(false);
    }

    // Fallback to mockCategories
    const mappedMock: CategoryItem[] = mockCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      imageUrl: c.imageUrl || "",
      parentId: null,
      children: (c.subcategories || []).map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        parentId: c.id,
        _count: { products: 0 },
      })),
      _count: { products: 0 },
    }));
    setCategories(mappedMock);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal to add a Main Category or Subcategory
  const openAddModal = (asSubcategory: boolean = false, parentId: string = "") => {
    setEditingItem(null);
    setErrorMessage("");
    setIsSubcategory(asSubcategory);
    setSelectedParentId(parentId || (categories[0]?.id || ""));
    setCatName("");
    setCatSlug("");
    setCatDesc("");
    setCatImageUrl("https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80");
    setIsModalOpen(true);
  };

  // Open modal to edit existing
  const openEditModal = (item: { id: string; name: string; slug: string; description?: string | null; imageUrl?: string | null; parentId?: string | null }) => {
    const isSub = Boolean(item.parentId);
    setEditingItem({ id: item.id, isSub });
    setErrorMessage("");
    setIsSubcategory(isSub);
    setSelectedParentId(item.parentId || "");
    setCatName(item.name);
    setCatSlug(item.slug);
    setCatDesc(item.description || "");
    setCatImageUrl(item.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || isSubmitting) return;

    if (isSubcategory && !selectedParentId) {
      setErrorMessage("দয়া করে একটি প্রধান প্যারেন্ট ক্যাটাগরি নির্বাচন করুন।");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const newSlug = catSlug.trim() || catName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = {
      name: catName.trim(),
      slug: newSlug,
      description: catDesc.trim() || null,
      imageUrl: catImageUrl.trim() || null,
      parentId: isSubcategory ? selectedParentId : null,
    };

    try {
      if (editingItem) {
        // Update category
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          fetchCategories();
        } else {
          setErrorMessage(data.error || "আপডেট ব্যর্থ হয়েছে");
          setIsSubmitting(false);
          return;
        }
      } else {
        // Create category
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          fetchCategories();
        } else {
          setErrorMessage(data.error || "ক্যাটাগরি তৈরি ব্যর্থ হয়েছে");
          setIsSubmitting(false);
          return;
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.warn("API error, applying changes locally:", err);
      // Local fallback
      if (!isSubcategory) {
        const newCat: CategoryItem = {
          id: `cat-${Date.now()}`,
          name: catName.trim(),
          slug: newSlug,
          description: catDesc.trim(),
          imageUrl: catImageUrl.trim(),
          parentId: null,
          children: [],
          _count: { products: 0 },
        };
        setCategories((prev) => [newCat, ...prev]);
      } else {
        const newSub: SubCategoryItem = {
          id: `sub-${Date.now()}`,
          name: catName.trim(),
          slug: newSlug,
          description: catDesc.trim(),
          imageUrl: catImageUrl.trim(),
          parentId: selectedParentId,
          _count: { products: 0 },
        };
        setCategories((prev) =>
          prev.map((c) =>
            c.id === selectedParentId
              ? { ...c, children: [...(c.children || []), newSub] }
              : c
          )
        );
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিতভাবে "${name}" ক্যাটাগরি মুছে ফেলতে চান?`)) return;

    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Could not delete category via API:", err);
    }
  };

  const handleDeleteSubcategory = async (parentId: string, subId: string, subName: string) => {
    if (!confirm(`আপনি কি নিশ্চিতভাবে "${subName}" সাবক্যাটাগরিটি মুছে ফেলতে চান?`)) return;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? { ...c, children: (c.children || []).filter((s) => s.id !== subId) }
          : c
      )
    );

    try {
      await fetch(`/api/admin/categories?id=${encodeURIComponent(subId)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Could not delete subcategory via API:", err);
    }
  };

  // Calculations for stats
  const totalMainCategories = categories.length;
  const totalSubcategories = categories.reduce(
    (sum, c) => sum + (c.children?.length || 0),
    0
  );

  // Filtered categories
  const filteredCategories = categories.filter((c) => {
    const q = search.toLowerCase();
    const matchesMain =
      c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
    const matchesSub = (c.children || []).some(
      (s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
    );

    if (viewFilter === "MAIN") return matchesMain;
    if (viewFilter === "SUBCAT") return (c.children || []).length > 0;
    return matchesMain || matchesSub;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2.5">
            <span>ক্যাটাগরি ও সাব-ক্যাটাগরি ব্যবস্থাপনা</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              Hierarchical Categories
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            স্টোরফ্রন্ট পণ্য সাজানোর জন্য প্রধান ক্যাটাগরি এবং সাবক্যাটাগরি তৈরি ও নিয়ন্ত্রণ করুন
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Add Subcategory Quick Action */}
          <button
            onClick={() => openAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#3B0C04] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <FolderPlus className="w-4 h-4 text-[#3B0C04]" />
            <span>+ নতুন সাব-ক্যাটাগরি</span>
          </button>

          {/* Add Main Category */}
          <button
            onClick={() => openAddModal(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন প্রধান ক্যাটাগরি</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#3B0C04]/10 text-[#3B0C04] flex items-center justify-center">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#8C7B72] font-semibold">প্রধান ক্যাটাগরি (Main)</p>
            <h3 className="text-2xl font-black text-[#3B0C04]">{totalMainCategories} টি</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFC40E]/20 text-[#3B0C04] flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#8C7B72] font-semibold">সাব-ক্যাটাগরি (Subcategories)</p>
            <h3 className="text-2xl font-black text-[#3B0C04]">{totalSubcategories} টি</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#8C7B72] font-semibold">মোট বিভাগসমূহ</p>
            <h3 className="text-2xl font-black text-[#16834A]">
              {totalMainCategories + totalSubcategories} টি
            </h3>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8DCD2]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C7B72] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ক্যাটাগরি বা সাবক্যাটাগরি খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setViewFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              viewFilter === "ALL"
                ? "bg-[#3B0C04] text-[#FFC40E]"
                : "text-[#6B5A52] hover:bg-[#FFF7EE]"
            }`}
          >
            সব দেখুন ({totalMainCategories})
          </button>
          <button
            onClick={() => setViewFilter("SUBCAT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              viewFilter === "SUBCAT"
                ? "bg-[#3B0C04] text-[#FFC40E]"
                : "text-[#6B5A52] hover:bg-[#FFF7EE]"
            }`}
          >
            সাবক্যাটাগরি সহ
          </button>
        </div>
      </div>

      {/* Categories & Subcategories Tree List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#3B0C04]/30 transition-all"
          >
            {/* Main Category Header */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] flex items-center justify-center shrink-0 overflow-hidden">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FolderTree className="w-5 h-5 text-[#3B0C04]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-[#2B160F]">{cat.name}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-[#FFF7EE] border border-[#E8DCD2] font-mono text-[10px] text-[#3B0C04] font-bold">
                        /{cat.slug}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B5A52] line-clamp-1 mt-0.5">
                      {cat.description || "প্রধান ক্যাটাগরি"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded-xl text-[#3B0C04] hover:bg-[#FFF7EE] border border-transparent hover:border-[#E8DCD2]"
                    title="এডিট করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-2 rounded-xl text-[#D64545] hover:bg-[#D64545]/10"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories Container */}
              <div className="mt-5 p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD2]/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B0C04]">
                    <Layers className="w-3.5 h-3.5" />
                    <span>সাব-ক্যাটাগরি তালিকা ({cat.children?.length || 0})</span>
                  </div>
                  <button
                    onClick={() => openAddModal(true, cat.id)}
                    className="text-[11px] font-bold text-[#3B0C04] hover:text-[#260700] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ সাবক্যাটাগরি যোগ করুন</span>
                  </button>
                </div>

                {cat.children && cat.children.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.children.map((sub) => (
                      <div
                        key={sub.id}
                        className="px-3 py-2 rounded-xl bg-white border border-[#E8DCD2] flex items-center justify-between text-xs group hover:border-[#3B0C04]/40"
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="font-bold text-[#2B160F] truncate">{sub.name}</span>
                          <span className="text-[10px] font-mono text-[#8C7B72]">/{sub.slug}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditModal({ ...sub, parentId: cat.id })}
                            className="p-1 text-[#8C7B72] hover:text-[#3B0C04]"
                            title="এডিট"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(cat.id, sub.id, sub.name)}
                            className="p-1 text-[#8C7B72] hover:text-[#D64545]"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-[#8C7B72]">
                      এই ক্যাটাগরিতে এখনও কোনো সাব-ক্যাটাগরি যুক্ত করা হয়নি।
                    </p>
                    <button
                      onClick={() => openAddModal(true, cat.id)}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>প্রথম সাব-ক্যাটাগরি যোগ করুন</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-[#E8DCD2]/60 flex items-center justify-between text-xs text-[#8C7B72]">
              <span>আইডি: <code className="font-mono text-[10px]">{cat.id.slice(0, 12)}...</code></span>
              <a
                href={`/category/${cat.slug}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#3B0C04] hover:underline inline-flex items-center gap-1"
              >
                <span>স্টোর পেজ দেখুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#E8DCD2] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-base">
                  {isSubcategory ? "📂" : "📁"}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#3B0C04]">
                    {editingItem
                      ? isSubcategory
                        ? "সাব-ক্যাটাগরি এডিট করুন"
                        : "প্রধান ক্যাটাগরি এডিট করুন"
                      : isSubcategory
                      ? "নতুন সাব-ক্যাটাগরি তৈরি করুন"
                      : "নতুন প্রধান ক্যাটাগরি তৈরি করুন"}
                  </h3>
                  <p className="text-[11px] text-[#6B5A52]">
                    পণ্য বিভাজনের সঠিক তথ্য পূরণ করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#8C7B72] hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Type Switcher (Only when adding new) */}
              {!editingItem && (
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1.5">
                    ক্যাটাগরির স্তর নির্বাচন করুন: *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSubcategory(false)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        !isSubcategory
                          ? "border-[#3B0C04] bg-[#FFF7EE] shadow-xs"
                          : "border-[#E8DCD2] hover:bg-zinc-50"
                      }`}
                    >
                      <span className="font-bold text-[#3B0C04] block">📁 প্রধান ক্যাটাগরি (Main)</span>
                      <span className="text-[11px] text-[#6B5A52] block mt-0.5">
                        যেমন: Gadgets, Home & Kitchen
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSubcategory(true);
                        if (!selectedParentId && categories[0]) {
                          setSelectedParentId(categories[0].id);
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSubcategory
                          ? "border-[#3B0C04] bg-[#FFF7EE] shadow-xs"
                          : "border-[#E8DCD2] hover:bg-zinc-50"
                      }`}
                    >
                      <span className="font-bold text-[#3B0C04] block">📂 সাব-ক্যাটাগরি (Subcategory)</span>
                      <span className="text-[11px] text-[#6B5A52] block mt-0.5">
                        যেমন: Smartwatches, Blenders
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Parent Category Selection Dropdown (When Subcategory is selected) */}
              {isSubcategory && (
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">
                    প্যারেন্ট / প্রধান ক্যাটাগরি নির্বাচন করুন: *
                  </label>
                  <select
                    required
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-bold text-[#3B0C04] focus:outline-none focus:border-[#3B0C04]"
                  >
                    <option value="">-- প্রধান ক্যাটাগরি সিলেক্ট করুন --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        📁 {c.name} (/{c.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  {isSubcategory ? "সাব-ক্যাটাগরির নাম: *" : "প্রধান ক্যাটাগরির নাম: *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    isSubcategory
                      ? "যেমন: Smartwatches অথবা Wireless Earbuds"
                      : "যেমন: Smart Gadgets অথবা Kitchen & Appliances"
                  }
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  স্লাগ বা URL পাথ (URL Slug):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: smartwatches (ফাঁকা রাখলে স্বয়ংক্রিয় তৈরি হবে)"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-mono focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  ক্যাটাগরি ছবি URL (Image URL):
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={catImageUrl}
                  onChange={(e) => setCatImageUrl(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-mono focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  সংক্ষিপ্ত বিবরণ (Description):
                </label>
                <textarea
                  rows={2}
                  placeholder="ক্যাটাগরির আকর্ষণীয় সংক্ষিপ্ত বিবরণ..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8DCD2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8DCD2] text-[#6B5A52] font-bold text-xs hover:bg-[#FFF7EE]"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "সংরক্ষণ হচ্ছে..."
                    : editingItem
                    ? "আপডেট করুন"
                    : isSubcategory
                    ? "সাব-ক্যাটাগরি তৈরি করুন"
                    : "প্রধান ক্যাটাগরি তৈরি করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
