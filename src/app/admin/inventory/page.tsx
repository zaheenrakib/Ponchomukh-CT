"use client";

import React, { useState, useEffect } from "react";
import { mockProducts, Product } from "@/lib/mockData";
import { Search, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const mapped: Product[] = data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.sku || `SKU-${p.id.slice(0, 6)}`,
            basePrice: p.basePrice,
            salePrice: p.salePrice || p.basePrice,
            stock: p.stock ?? 0,
            lowStockThreshold: p.lowStockThreshold || 10,
            status: p.status || "ACTIVE",
            averageRating: p.averageRating || 5.0,
            reviewsCount: p.reviewsCount || 0,
            isFeatured: p.isFeatured ?? true,
            categoryId: p.categoryId || "general",
            category: p.category || { id: "general", name: "General", slug: "general" },
            images: p.images?.length > 0
              ? p.images
              : [{ id: "def-img", productId: p.id, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", isPrimary: true }],
            variants: p.variants || [],
          }));
          setProducts(mapped);
        }
      }
    } catch (err) {
      console.warn("Could not load inventory from DB, using fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdjustStock = async (id: string, delta: number) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );

    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: newStock }),
      });
    } catch (e) {
      console.warn("Could not persist stock update to DB:", e);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLow = filterLowStockOnly ? p.stock <= (p.lowStockThreshold || 15) : true;
    return matchesSearch && matchesLow;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            ইনভেন্টরি ও স্টক নিয়ন্ত্রণ (Inventory Management)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            পণ্যভিত্তিক লাইভ স্টক সংখ্যা পর্যবেক্ষণ এবং রিস্টক সমন্বয় করুন
          </p>
        </div>

        <button
          onClick={fetchProducts}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="পণ্য বা SKU দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B72]" />
        </div>

        <label className="flex items-center gap-2 font-bold text-[#3B0C04] cursor-pointer">
          <input
            type="checkbox"
            checked={filterLowStockOnly}
            onChange={(e) => setFilterLowStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-[#3B0C04]"
          />
          <span>শুধুমাত্র লো-স্টক সতর্কতাযুক্ত পণ্য দেখান</span>
        </label>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#E8DCD2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FFF7EE] border-b border-[#E8DCD2] text-[#3B0C04] font-bold">
              <tr>
                <th className="p-3.5">ছবি</th>
                <th className="p-3.5">পণ্যের নাম</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">বর্তমান মজুত</th>
                <th className="p-3.5">স্টক স্ট্যাটাস</th>
                <th className="p-3.5 text-center">দ্রুত স্টক এডজাস্টমেন্ট (+ / -)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCD2]">
              {filtered.map((p) => {
                const isLow = p.stock <= (p.lowStockThreshold || 15);
                return (
                  <tr key={p.id} className="hover:bg-[#FFFDF9]">
                    <td className="p-3.5">
                      <img
                        src={p.images[0]?.imageUrl}
                        alt=""
                        className="w-12 h-12 rounded-lg object-contain bg-white border border-[#E8DCD2] p-1"
                      />
                    </td>
                    <td className="p-3.5 font-bold text-[#2B160F]">{p.name}</td>
                    <td className="p-3.5 font-mono text-[#6B5A52] font-semibold">{p.sku}</td>
                    <td className="p-3.5 font-black text-sm text-[#3B0C04]">{p.stock} পিস</td>
                    <td className="p-3.5">
                      {isLow ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#D64545]/10 text-[#D64545] font-bold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> লো স্টক
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#E8F6F1] text-[#16834A] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ইন স্টক
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(p.id, -5)}
                          className="px-2 py-1 rounded bg-[#FFF7EE] hover:bg-[#3B0C04] hover:text-[#FFC40E] border border-[#E8DCD2] font-bold text-[11px]"
                        >
                          -৫
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-[#FFF7EE] hover:bg-[#3B0C04] hover:text-[#FFC40E] border border-[#E8DCD2] font-bold"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-[#FFF7EE] hover:bg-[#3B0C04] hover:text-[#FFC40E] border border-[#E8DCD2] font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, 10)}
                          className="px-2 py-1 rounded bg-[#3B0C04] text-[#FFC40E] font-bold text-[11px] shadow-2xs"
                        >
                          +১০ রিস্টক
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
