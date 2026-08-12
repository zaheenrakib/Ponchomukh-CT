"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    salePrice: "",
    sku: "",
    stock: "20",
    categoryId: "",
    brandId: "",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600",
  });

  useEffect(() => {
    fetch("/api/products")
      .then(() => {
        // Fetch categories
        return fetch("/api/settings");
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-zinc-950 p-8 text-left text-zinc-900 dark:text-zinc-100">
      
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="p-2 rounded-xl border border-zinc-200 bg-white">
          <ArrowLeft className="h-4 w-4 text-zinc-600" />
        </Link>
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
            Add New Product
          </h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Create a new item in your inventory catalog
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 space-y-6">
        
        <div>
          <label className="block text-xs font-bold text-zinc-600 mb-1">Product Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Sonifer Portable Mini Blender"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1">SKU *</label>
            <input
              type="text"
              name="sku"
              required
              placeholder="e.g. SNF-PMB-01"
              value={formData.sku}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1">Category ID *</label>
            <input
              type="text"
              name="categoryId"
              required
              placeholder="e.g. category-id"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1">Base Price (৳) *</label>
            <input
              type="number"
              name="basePrice"
              required
              placeholder="1500"
              value={formData.basePrice}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1">Sale Price (৳)</label>
            <input
              type="number"
              name="salePrice"
              placeholder="1200"
              value={formData.salePrice}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1">Initial Stock *</label>
            <input
              type="number"
              name="stock"
              required
              placeholder="20"
              value={formData.stock}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-600 mb-1">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://images.unsplash.com/..."
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-600 mb-1">Full Description *</label>
          <textarea
            name="description"
            rows={4}
            required
            placeholder="Describe product features..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 items-center justify-center gap-2 px-8 rounded-xl bg-[#3B0C04] text-white font-bold text-xs shadow-md"
        >
          <Save className="h-4 w-4 text-[#FFC40E]" />
          <span>{loading ? "Saving..." : "Save Product"}</span>
        </button>

      </form>
    </div>
  );
}
