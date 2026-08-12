"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Failed to load admin products:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatBDT = (value: number) => {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-zinc-950 p-8 text-left text-zinc-900 dark:text-zinc-100">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
            Product Management
          </h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Manage website catalog items and inventory
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-white font-bold text-xs shadow-sm"
        >
          <Plus className="h-4 w-4 text-[#FFC40E]" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 mb-6 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 shadow-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-zinc-700 dark:text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-150 font-black text-zinc-400 uppercase text-[10px]">
                <th className="pb-3">Product</th>
                <th className="pb-3">SKU</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 font-bold">
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 font-bold">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"}
                          alt={p.name}
                          className="h-9 w-9 rounded-lg object-cover border border-zinc-200"
                        />
                        <span className="font-bold text-[#3B0C04] line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-zinc-500">{p.sku}</td>
                    <td className="py-3">{p.category?.name || "General"}</td>
                    <td className="py-3 font-black text-zinc-900">{formatBDT(Number(p.salePrice || p.basePrice))}</td>
                    <td className="py-3">
                      <span className={`font-bold ${p.stock <= 5 ? "text-rose-600 font-black" : "text-zinc-700"}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
