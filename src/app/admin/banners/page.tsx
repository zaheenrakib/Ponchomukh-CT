"use client";

import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  X,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown
} from "lucide-react";
import { mockBanners } from "@/lib/mockData";

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  mobileImageUrl?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  position: "HERO" | "PROMOTIONAL" | string;
  sortOrder: number;
  isActive: boolean;
}

// Preset banner images for quick selection
const presetImages = [
  { label: "Smart Gadgets & Watch", url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80" },
  { label: "Kitchen Blender & Juicer", url: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=1200&auto=format&fit=crop&q=80" },
  { label: "Audio Earbuds & Sound", url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80" },
  { label: "Lifestyle & Backpack", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&auto=format&fit=crop&q=80" },
  { label: "Promotional Shopping Sale", url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80" },
  { label: "Modern Home Accessories", url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1200&auto=format&fit=crop&q=80" },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "HERO" | "PROMOTIONAL">("HERO");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [buttonText, setButtonText] = useState("এখনই কিনুন");
  const [buttonUrl, setButtonUrl] = useState("/shop");
  const [position, setPosition] = useState<"HERO" | "PROMOTIONAL">("HERO");
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  // Live Carousel Preview index
  const [previewSlide, setPreviewSlide] = useState(0);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.banners) && data.banners.length > 0) {
          setBanners(data.banners);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load banners from DB, using fallback:", err);
    } finally {
      setIsLoading(false);
    }

    // Fallback if DB empty or unavailable
    setBanners(mockBanners as BannerItem[]);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = (defaultPos: "HERO" | "PROMOTIONAL" = "HERO") => {
    setEditingBanner(null);
    setTitle("");
    setSubtitle("");
    setImageUrl(presetImages[0].url);
    setButtonText(defaultPos === "HERO" ? "এখনই কিনুন" : "অফার দেখুন");
    setButtonUrl("/shop");
    setPosition(defaultPos);
    setSortOrder(banners.filter((b) => b.position === defaultPos).length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: BannerItem) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || "");
    setImageUrl(banner.imageUrl);
    setButtonText(banner.buttonText || "এখনই কিনুন");
    setButtonUrl(banner.buttonUrl || "/shop");
    setPosition(banner.position as "HERO" | "PROMOTIONAL");
    setSortOrder(banner.sortOrder || 1);
    setIsActive(banner.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const bannerPayload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      imageUrl: imageUrl.trim(),
      buttonText: buttonText.trim() || "এখনই কিনুন",
      buttonUrl: buttonUrl.trim() || "/shop",
      position,
      sortOrder: Number(sortOrder) || 1,
      isActive,
    };

    try {
      if (editingBanner) {
        // Update
        const res = await fetch("/api/admin/banners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingBanner.id, ...bannerPayload }),
        });
        const data = await res.json();
        if (data.success && data.banner) {
          setBanners((prev) =>
            prev.map((b) => (b.id === editingBanner.id ? data.banner : b))
          );
        }
      } else {
        // Create
        const res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bannerPayload),
        });
        const data = await res.json();
        if (data.success && data.banner) {
          setBanners((prev) => [...prev, data.banner]);
        }
      }
    } catch (err) {
      console.warn("Could not save banner via API, applying locally:", err);
      if (editingBanner) {
        setBanners((prev) =>
          prev.map((b) =>
            b.id === editingBanner.id ? { ...b, ...bannerPayload } : b
          )
        );
      } else {
        const newLocal: BannerItem = {
          id: `banner-${Date.now()}`,
          ...bannerPayload,
        };
        setBanners((prev) => [...prev, newLocal]);
      }
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  const handleToggleActive = async (banner: BannerItem) => {
    const nextStatus = !banner.isActive;
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, isActive: nextStatus } : b))
    );

    try {
      await fetch("/api/admin/banners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banner.id, isActive: nextStatus }),
      });
    } catch (err) {
      console.warn("Could not toggle banner status via API:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ব্যানারটি মুছে ফেলতে চান?")) return;

    setBanners((prev) => prev.filter((b) => b.id !== id));
    try {
      await fetch(`/api/admin/banners?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Could not delete banner via API:", err);
    }
  };

  const filteredBanners = banners
    .filter((b) => activeTab === "ALL" || b.position === activeTab)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const heroBanners = banners.filter((b) => b.position === "HERO" && b.isActive);
  const currentPreview = heroBanners[previewSlide % (heroBanners.length || 1)] || heroBanners[0];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2">
            <span>ব্যানার ও হিরো স্লাইডার ব্যবস্থাপনা</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              Hero Carousel
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            স্টোরফ্রন্টের মূল হিরো স্লাইডার এবং প্রমোশনাল ব্যানার তৈরি, এডিট এবং রি-অর্ডার করুন
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBanners}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => openAddModal(activeTab === "PROMOTIONAL" ? "PROMOTIONAL" : "HERO")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন স্লাইডার/ব্যানার যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* LIVE CAROUSEL PREVIEW BOX (Visible when viewing Hero Carousel) */}
      {(activeTab === "HERO" || activeTab === "ALL") && heroBanners.length > 0 && currentPreview && (
        <div className="p-6 rounded-3xl bg-white border border-[#E8DCD2] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#3B0C04]" />
              <h2 className="text-sm font-black text-[#3B0C04]">
                লাইভ হিরো ক্যারোজেল প্রিভিউ (Live Preview)
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FFF7EE] text-[#3B0C04] font-bold border border-[#E8DCD2]">
                স্লাইড {previewSlide + 1} / {heroBanners.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPreviewSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
                className="p-1.5 rounded-lg border border-[#E8DCD2] hover:bg-[#FFF7EE] text-[#3B0C04]"
                title="পূর্ববর্তী স্লাইড"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewSlide((prev) => (prev + 1) % heroBanners.length)}
                className="p-1.5 rounded-lg border border-[#E8DCD2] hover:bg-[#FFF7EE] text-[#3B0C04]"
                title="পরবর্তী স্লাইড"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFF7EE] via-[#FFFDF9] to-[#F3F7F5] border border-[#E8DCD2] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-3/5 space-y-3 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-[#3B0C04]/10 text-[11px] font-bold text-[#3B0C04]">
                ক্রম নং: #{currentPreview.sortOrder} • HERO SLIDE
              </span>
              <h3 className="text-xl md:text-3xl font-black text-[#3B0C04] leading-tight">
                {currentPreview.title}
              </h3>
              <p className="text-xs md:text-sm text-[#6B5A52]">
                {currentPreview.subtitle || "আপনার স্টোরের গ্রাহকদের জন্য আকর্ষণীয় স্লাইডার ব্যানার"}
              </p>
              <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
                <span className="px-5 py-2 rounded-xl bg-[#3B0C04] text-[#FFC40E] text-xs font-bold inline-flex items-center gap-1.5">
                  <span>{currentPreview.buttonText || "এখনই কিনুন"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs text-[#8C7B72] font-mono">
                  লিংক: {currentPreview.buttonUrl || "/shop"}
                </span>
              </div>
            </div>

            <div className="w-full md:w-2/5 flex items-center justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-white/90 border border-[#E8DCD2] shadow-md p-3 flex items-center justify-center overflow-hidden">
                <img
                  src={currentPreview.imageUrl}
                  alt={currentPreview.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-[#E8DCD2] pb-3">
        <button
          onClick={() => setActiveTab("HERO")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "HERO"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          🎠 হিরো স্লাইডার ({banners.filter((b) => b.position === "HERO").length})
        </button>
        <button
          onClick={() => setActiveTab("PROMOTIONAL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "PROMOTIONAL"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          🏷️ প্রমোশনাল ব্যানার ({banners.filter((b) => b.position === "PROMOTIONAL").length})
        </button>
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "ALL"
              ? "bg-[#3B0C04] text-[#FFC40E] shadow-xs"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          সব ব্যানার ({banners.length})
        </button>
      </div>

      {/* Banners Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanners.map((b) => (
          <div
            key={b.id}
            className={`p-5 rounded-3xl bg-white border shadow-xs space-y-4 flex flex-col justify-between transition-all ${
              b.isActive ? "border-[#E8DCD2]" : "border-zinc-200 opacity-60 bg-zinc-50"
            }`}
          >
            <div className="space-y-3">
              <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-[#FFF7EE] border border-[#E8DCD2]">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-[10px] font-black tracking-wider">
                    {b.position === "HERO" ? "🎠 HERO CAROUSEL" : "🏷️ PROMOTIONAL"}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold">
                    স্লট #{b.sortOrder}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shadow-xs ${
                      b.isActive
                        ? "bg-[#16834A] text-white"
                        : "bg-zinc-600 text-white"
                    }`}
                  >
                    {b.isActive ? "সক্রিয় (Active)" : "নিষ্ক্রিয় (Inactive)"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#2B160F] line-clamp-2">
                  {b.title}
                </h3>
                {b.subtitle && (
                  <p className="text-xs text-[#6B5A52] line-clamp-2 mt-1">
                    {b.subtitle}
                  </p>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] text-xs space-y-1">
                <div className="flex items-center justify-between text-[#3B0C04] font-bold">
                  <span>বাটন টেক্সট:</span>
                  <span>{b.buttonText || "এখনই কিনুন"}</span>
                </div>
                <div className="flex items-center justify-between text-[#8C7B72] text-[11px]">
                  <span>লিংক:</span>
                  <span className="font-mono truncate max-w-[150px]">{b.buttonUrl || "/shop"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#E8DCD2]/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(b)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                    b.isActive
                      ? "border-[#D64545] text-[#D64545] hover:bg-[#D64545]/10"
                      : "border-[#16834A] text-[#16834A] hover:bg-[#16834A]/10"
                  }`}
                >
                  {b.isActive ? "বন্ধ করুন" : "চালু করুন"}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-2 rounded-xl text-[#3B0C04] hover:bg-[#FFF7EE] border border-transparent hover:border-[#E8DCD2] transition-colors"
                  title="এডিট করুন"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2 rounded-xl text-[#D64545] hover:bg-[#D64545]/10 transition-colors"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#E8DCD2] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-sm">
                  {editingBanner ? "✏️" : "➕"}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#3B0C04]">
                    {editingBanner ? "ব্যানার এডিট করুন" : "নতুন ব্যানার যোগ করুন"}
                  </h3>
                  <p className="text-[11px] text-[#6B5A52]">
                    হিরো ক্যারোজেল অথবা হোম পেজ প্রমোশন ব্যানার কনফিগার করুন
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Position Selector */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1.5">
                  ব্যানারের ধরন ও অবস্থান (Position): *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPosition("HERO")}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      position === "HERO"
                        ? "border-[#3B0C04] bg-[#FFF7EE] shadow-xs"
                        : "border-[#E8DCD2] hover:bg-zinc-50"
                    }`}
                  >
                    <span className="font-bold text-[#3B0C04]">🎠 Hero Carousel স্লাইডার</span>
                    <span className="text-[11px] text-[#6B5A52]">
                      হোম পেজের প্রধান হিরো সেকশনে ক্যারোজেল হিসেবে ঘুরবে
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosition("PROMOTIONAL")}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      position === "PROMOTIONAL"
                        ? "border-[#3B0C04] bg-[#FFF7EE] shadow-xs"
                        : "border-[#E8DCD2] hover:bg-zinc-50"
                    }`}
                  >
                    <span className="font-bold text-[#3B0C04]">🏷️ Promotional ব্যানার</span>
                    <span className="text-[11px] text-[#6B5A52]">
                      হোম পেজের মাঝামাঝি প্রমোশনাল সেকশনে প্রদর্শন হবে
                    </span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  ব্যানার শিরোনাম (Title): *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আপনার পছন্দের সেরা গ্যাজেট, এখন এক ঠিকানায়।"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1">
                  উপ-শিরোনাম বা বিবরণ (Subtitle):
                </label>
                <textarea
                  rows={2}
                  placeholder="ব্যানারের আকর্ষণীয় বিবরণ লিখুন..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              {/* Image URL & Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-[#2B160F]">
                    ছবির লিংক (Image URL): *
                  </label>
                  <span className="text-[10px] text-[#8C7B72]">হাই-রেজ্যুলুশন ইমেজ ব্যবহার করুন</span>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-mono focus:outline-none focus:border-[#3B0C04]"
                />

                {/* Quick Presets */}
                <div className="mt-2 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#6B5A52]">
                    দ্রুত ব্যবহারের জন্য কিছু স্যাম্পল ছবি:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetImages.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(p.url)}
                        className={`px-2 py-1 rounded-lg text-[10px] border transition-colors ${
                          imageUrl === p.url
                            ? "bg-[#3B0C04] text-[#FFC40E] border-[#3B0C04] font-bold"
                            : "bg-[#FFF7EE] text-[#3B0C04] border-[#E8DCD2] hover:bg-[#E8DCD2]"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {imageUrl && (
                  <div className="mt-3 p-2 rounded-xl bg-zinc-50 border border-[#E8DCD2] flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-[#E8DCD2]"
                      onError={(e) => {
                        (e.target as any).src = "https://placehold.co/600x400?text=Invalid+Image";
                      }}
                    />
                    <span className="text-[11px] text-[#6B5A52]">ইমেজ প্রিভিউ সফলভাবে লোড হয়েছে</span>
                  </div>
                )}
              </div>

              {/* Button Text & Button URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">
                    বাটন টেক্সট (Button Text):
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: এখনই কিনুন"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:border-[#3B0C04]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">
                    বাটন লিংক (Button Link):
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: /shop অথবা /category/gadgets"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-mono focus:outline-none focus:border-[#3B0C04]"
                  />
                </div>
              </div>

              {/* Sort Order & Active */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">
                    স্লাইড ক্রম (Sort Order):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-bold focus:outline-none focus:border-[#3B0C04]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">
                    স্ট্যাটাস (Status):
                  </label>
                  <div className="flex items-center h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9]">
                    <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs text-[#2B160F]">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 rounded text-[#3B0C04] accent-[#3B0C04]"
                      />
                      <span>ব্যানারটি সক্রিয় রাখুন</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DCD2]">
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
                  {isSubmitting ? "সংরক্ষণ হচ্ছে..." : editingBanner ? "আপডেট করুন" : "যোগ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
