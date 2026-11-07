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
      setErrorMessage("Please select a valid parent category.");
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
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          fetchCategories();
        } else {
          setErrorMessage(data.error || "Update operation failed.");
          setIsSubmitting(false);
          return;
        }
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          fetchCategories();
        } else {
          setErrorMessage(data.error || "Failed to create category.");
          setIsSubmitting(false);
          return;
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.warn("API error, applying changes locally:", err);
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
    if (!confirm(`Are you sure you want to permanently delete category "${name}"?`)) return;

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
    if (!confirm(`Are you sure you want to delete subcategory "${subName}"?`)) return;

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

  const totalMainCategories = categories.length;
  const totalSubcategories = categories.reduce(
    (sum, c) => sum + (c.children?.length || 0),
    0
  );

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2.5">
            <span>Master Data: Category Hierarchy</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              Parent & Subcategories
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            Manage multi-level category taxonomy trees for storefront catalog and POS register navigation
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs transition-colors"
            title="Refresh Categories"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => openAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#3B0C04] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <FolderPlus className="w-4 h-4 text-[#3B0C04]" />
            <span>+ Add Subcategory</span>
          </button>

          <button
            onClick={() => openAddModal(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Main Category</span>
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
            <p className="text-xs text-[#8C7B72] font-bold uppercase tracking-wider">Main Categories</p>
            <h3 className="text-2xl font-black text-[#3B0C04]">{totalMainCategories} Active</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFC40E]/20 text-[#3B0C04] flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#8C7B72] font-bold uppercase tracking-wider">Subcategories</p>
            <h3 className="text-2xl font-black text-[#3B0C04]">{totalSubcategories} Active</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#16834A]/10 text-[#16834A] flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#8C7B72] font-bold uppercase tracking-wider">Total Taxonomies</p>
            <h3 className="text-2xl font-black text-[#16834A]">
              {totalMainCategories + totalSubcategories} Nodes
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
            placeholder="Search category or subcategory name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setViewFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              viewFilter === "ALL"
                ? "bg-[#3B0C04] text-[#FFC40E]"
                : "text-[#6B5A52] hover:bg-[#FFF7EE]"
            }`}
          >
            View All ({totalMainCategories})
          </button>
          <button
            onClick={() => setViewFilter("SUBCAT")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              viewFilter === "SUBCAT"
                ? "bg-[#3B0C04] text-[#FFC40E]"
                : "text-[#6B5A52] hover:bg-[#FFF7EE]"
            }`}
          >
            With Subcategories
          </button>
        </div>
      </div>

      {/* Categories & Subcategories Tree Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#3B0C04]/40 transition-all"
          >
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
                      {cat.description || "Primary Root Category"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded-xl text-[#3B0C04] hover:bg-[#FFF7EE] border border-transparent hover:border-[#E8DCD2]"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-2 rounded-xl text-[#D64545] hover:bg-[#D64545]/10"
                    title="Delete Category"
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
                    <span>Subcategories ({cat.children?.length || 0})</span>
                  </div>
                  <button
                    onClick={() => openAddModal(true, cat.id)}
                    className="text-[11px] font-bold text-[#3B0C04] hover:text-[#260700] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Subcategory</span>
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
                            title="Edit Subcategory"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(cat.id, sub.id, sub.name)}
                            className="p-1 text-[#8C7B72] hover:text-[#D64545]"
                            title="Delete Subcategory"
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
                      No subcategories configured for this category yet.
                    </p>
                    <button
                      onClick={() => openAddModal(true, cat.id)}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add First Subcategory</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DCD2]/60 flex items-center justify-between text-xs text-[#8C7B72]">
              <span>ID: <code className="font-mono text-[10px]">{cat.id.slice(0, 12)}...</code></span>
              <a
                href={`/category/${cat.slug}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#3B0C04] hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Store Category</span>
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
                        ? "Edit Subcategory"
                        : "Edit Main Category"
                      : isSubcategory
                      ? "Create New Subcategory"
                      : "Create New Main Category"}
                  </h3>
                  <p className="text-[11px] text-[#6B5A52]">
                    Configure taxonomy attributes and catalog relationships
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
              {!editingItem && (
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1.5">
                    Category Hierarchy Level: *
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
                      <span className="font-bold text-[#3B0C04] block">📁 Root / Main Category</span>
                      <span className="text-[11px] text-[#6B5A52] block mt-0.5">
                        e.g., Gadgets, Home & Kitchen
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
                      <span className="font-bold text-[#3B0C04] block">📂 Subcategory</span>
                      <span className="text-[11px] text-[#6B5A52] block mt-0.5">
                        e.g., Smartwatches, Blenders
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {isSubcategory && (
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">
                    Select Parent Category: *
                  </label>
                  <select
                    required
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-bold text-[#3B0C04] focus:outline-none focus:border-[#3B0C04]"
                  >
                    <option value="">-- Choose Parent Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        📁 {c.name} (/{c.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  {isSubcategory ? "Subcategory Title: *" : "Main Category Title: *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    isSubcategory
                      ? "e.g., Wireless ANC Earbuds"
                      : "e.g., Smart Electronics & Gadgets"
                  }
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  URL Slug:
                </label>
                <input
                  type="text"
                  placeholder="e.g., smartwatches (leave empty for auto-generated slug)"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-mono focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  Category Image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={catImageUrl}
                  onChange={(e) => setCatImageUrl(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-mono focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  Description:
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter a brief summary for storefront browsing..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8DCD2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8DCD2] text-[#6B5A52] font-bold text-xs hover:bg-[#FFF7EE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingItem
                    ? "Update Category"
                    : isSubcategory
                    ? "Create Subcategory"
                    : "Create Main Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
