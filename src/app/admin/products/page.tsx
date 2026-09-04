"use client";

import React, { useState } from "react";
import { mockProducts, mockCategories, mockBrands, Product } from "@/lib/mockData";
import {
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  X,
  Upload,
  Sparkles
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categorySlug: "gadgets",
    brandSlug: "sonifer",
    basePrice: 1500,
    salePrice: 1200,
    costPrice: 900,
    stock: 25,
    lowStockThreshold: 5,
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    description: "",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isFlashSale: false
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.category.slug === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই পণ্যটি মুছে ফেলতে চান?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleDuplicate = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      slug: `${product.slug}-copy-${Date.now()}`
    };
    setProducts([duplicated, ...products]);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      categorySlug: "gadgets",
      brandSlug: "sonifer",
      basePrice: 1500,
      salePrice: 1200,
      costPrice: 900,
      stock: 25,
      lowStockThreshold: 5,
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
      description: "প্রিমিয়াম কোয়ালিটি পণ্য।",
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      isFlashSale: false
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      categorySlug: p.category.slug,
      brandSlug: p.brand?.slug || "sonifer",
      basePrice: p.basePrice,
      salePrice: p.salePrice || p.basePrice,
      costPrice: p.costPrice || Math.round(p.basePrice * 0.7),
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold || 5,
      imageUrl: p.images[0]?.imageUrl || "",
      description: p.description,
      isFeatured: p.isFeatured,
      isBestSeller: !!p.isBestSeller,
      isNewArrival: !!p.isNewArrival,
      isFlashSale: !!p.isFlashSale
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = mockCategories.find((c) => c.slug === formData.categorySlug) || mockCategories[0];
    const brnd = mockBrands.find((b) => b.slug === formData.brandSlug);

    if (editingProduct) {
      // Update
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              sku: formData.sku,
              basePrice: Number(formData.basePrice),
              salePrice: Number(formData.salePrice),
              costPrice: Number(formData.costPrice),
              stock: Number(formData.stock),
              lowStockThreshold: Number(formData.lowStockThreshold),
              description: formData.description,
              isFeatured: formData.isFeatured,
              isBestSeller: formData.isBestSeller,
              isNewArrival: formData.isNewArrival,
              isFlashSale: formData.isFlashSale,
              category: cat,
              brand: brnd,
              images: [{ id: `img-${Date.now()}`, productId: p.id, imageUrl: formData.imageUrl, isPrimary: true }]
            }
          : p
      );
      setProducts(updated);
    } else {
      // Create new
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `prod-${Date.now()}`,
        sku: formData.sku,
        basePrice: Number(formData.basePrice),
        salePrice: Number(formData.salePrice),
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        status: "ACTIVE",
        averageRating: 5.0,
        reviewsCount: 1,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        isFlashSale: formData.isFlashSale,
        categoryId: cat.id,
        category: cat,
        brand: brnd,
        description: formData.description,
        images: [{ id: `img-${Date.now()}`, productId: `prod-${Date.now()}`, imageUrl: formData.imageUrl, isPrimary: true }],
        variants: [
          {
            id: `var-${Date.now()}`,
            productId: `prod-${Date.now()}`,
            sku: formData.sku,
            price: Number(formData.salePrice || formData.basePrice),
            stock: Number(formData.stock),
            selectedOptions: []
          }
        ]
      };
      setProducts([newProd, ...products]);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            পণ্য ব্যবস্থাপনা (Product Management)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            সকল প্রোডাক্টের প্রাইসিং, স্টক এবং পাবলিশিং স্ট্যাটাস নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যুক্ত করুন (Add Product)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="নাম বা SKU দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B72]" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] font-semibold text-[#2B160F]"
          >
            <option value="ALL">সকল ক্যাটাগরি</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] font-semibold text-[#2B160F]"
          >
            <option value="ALL">সকল স্ট্যাটাস</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E8DCD2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FFF7EE] border-b border-[#E8DCD2] text-[#3B0C04] font-bold">
              <tr>
                <th className="p-3.5">ছবি</th>
                <th className="p-3.5">পণ্যের নাম & ক্যাটাগরি</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">বিক্রয় মূল্য</th>
                <th className="p-3.5">মজুত স্টক</th>
                <th className="p-3.5">ফ্ল্যাগস</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCD2]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FFFDF9]">
                  <td className="p-3.5">
                    <img
                      src={p.images[0]?.imageUrl}
                      alt=""
                      className="w-12 h-12 rounded-lg object-contain bg-white border border-[#E8DCD2] p-1"
                    />
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <p className="font-bold text-[#2B160F] truncate" title={p.name}>{p.name}</p>
                    <span className="text-[11px] text-[#8C7B72]">{p.category.name}</span>
                  </td>
                  <td className="p-3.5 font-mono text-[#6B5A52] font-semibold">{p.sku}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-[#3B0C04]">৳{p.salePrice ?? p.basePrice}</span>
                    {p.salePrice && <span className="text-[#8C7B72] line-through block text-[10px]">৳{p.basePrice}</span>}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.stock <= 5 ? "bg-[#D64545]/10 text-[#D64545]" : "bg-[#E8F6F1] text-[#16834A]"
                      }`}
                    >
                      {p.stock} পিস
                    </span>
                  </td>
                  <td className="p-3.5 space-x-1">
                    {p.isFeatured && <span className="px-1.5 py-0.5 rounded bg-[#FFC40E] text-[#260700] text-[9px] font-black">Featured</span>}
                    {p.isBestSeller && <span className="px-1.5 py-0.5 rounded bg-[#3B0C04] text-[#FFC40E] text-[9px] font-bold">Best Seller</span>}
                    {p.isFlashSale && <span className="px-1.5 py-0.5 rounded bg-[#D64545] text-white text-[9px] font-bold">Flash</span>}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#E8F6F1] text-[#16834A] text-[11px] font-bold">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-md hover:bg-[#FFF7EE] text-[#3B0C04]"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 rounded-md hover:bg-[#FFF7EE] text-[#6B5A52]"
                        title="ডুপ্লিকেট করুন"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-md hover:bg-[#D64545]/10 text-[#D64545]"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border border-[#E8DCD2] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <h2 className="text-base font-bold text-[#3B0C04]">
                {editingProduct ? "পণ্য সম্পাদনা (Edit Product)" : "নতুন পণ্য যুক্ত করুন (Add New Product)"}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8C7B72] hover:text-[#2B160F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">পণ্যের নাম: *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: Sonifer SF-350 Portable Blender"
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">SKU কোড: *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">ক্যাটাগরি:</label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] font-semibold"
                  >
                    {mockCategories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">ব্র্যান্ড:</label>
                  <select
                    value={formData.brandSlug}
                    onChange={(e) => setFormData({ ...formData, brandSlug: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] font-semibold"
                  >
                    {mockBrands.map((b) => (
                      <option key={b.id} value={b.slug}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">আসল মূল্য (Regular Price):</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3B0C04] mb-1">অফার মূল্য (Sale Price):</label>
                  <input
                    type="number"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-[#3B0C04] bg-[#FFF7EE] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">মজুত স্টক সংখ্যা:</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2B160F] mb-1">ছবির URL (Primary Image):</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2B160F] mb-1">পণ্য বিবরণ (Description):</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3B0C04]"
                  />
                  <span>Featured</span>
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3B0C04]"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3B0C04]"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFlashSale}
                    onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3B0C04]"
                  />
                  <span>Flash Sale</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8DCD2]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-[#E8DCD2] font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] font-bold"
                >
                  সংরক্ষণ করুন (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
