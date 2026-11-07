"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mockProducts, mockCategories, mockBrands, Product } from "@/lib/mockData";
import { generateQRDataURL } from "@/lib/qrcode";
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
  Sparkles,
  QrCode,
  Printer,
  Download,
  ExternalLink,
  RefreshCw
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadDbProducts() {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.products) && data.products.length > 0) {
            const mapped: Product[] = data.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              sku: p.sku,
              basePrice: p.basePrice,
              salePrice: p.salePrice || p.basePrice,
              stock: p.stock,
              status: p.status,
              averageRating: 5.0,
              reviewsCount: 0,
              isFeatured: true,
              category: p.category || mockCategories[0],
              brand: p.brand || undefined,
              description: p.description,
              images: p.images?.length > 0 ? p.images : [{ id: `img-${p.id}`, productId: p.id, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", isPrimary: true }],
              variants: p.variants?.length > 0 ? p.variants : [{ id: `var-${p.id}`, productId: p.id, sku: p.sku, price: p.salePrice || p.basePrice, stock: p.stock, selectedOptions: [] }],
            }));

            const dbIds = new Set(mapped.map((m) => m.id));
            const remainingMocks = mockProducts.filter((m) => !dbIds.has(m.id));
            setProducts([...mapped, ...remainingMocks]);
          }
        }
      } catch (err) {
        console.warn("Could not fetch DB products:", err);
      }
    }

    loadDbProducts();
  }, []);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedQRProduct, setSelectedQRProduct] = useState<Product | null>(null);

  const generateSmartSKU = (catSlug: string = "GAD") => {
    const catCode = (catSlug || "GAD").slice(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PM-${catCode}-${year}-${rand}`;
  };

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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      try {
        await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Could not sync product delete to API:", err);
      }
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
      sku: generateSmartSKU("gadgets"),
      categorySlug: "gadgets",
      brandSlug: "sonifer",
      basePrice: 1500,
      salePrice: 1200,
      costPrice: 900,
      stock: 25,
      lowStockThreshold: 5,
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
      description: "Premium commercial grade product.",
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
      costPrice: 950,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold || 5,
      imageUrl: p.images[0]?.imageUrl || "",
      description: p.description || "",
      isFeatured: p.isFeatured || false,
      isBestSeller: p.isBestSeller || false,
      isNewArrival: p.isNewArrival || false,
      isFlashSale: p.isFlashSale || false
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    const cat = mockCategories.find((c) => c.slug === formData.categorySlug) || mockCategories[0];
    const br = mockBrands.find((b) => b.slug === formData.brandSlug);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name,
      slug: editingProduct ? editingProduct.slug : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sku: formData.sku,
      basePrice: Number(formData.basePrice),
      salePrice: Number(formData.salePrice),
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold),
      status: "ACTIVE",
      averageRating: editingProduct ? editingProduct.averageRating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      isNewArrival: formData.isNewArrival,
      isFlashSale: formData.isFlashSale,
      categoryId: cat.id,
      brandId: br?.id,
      category: cat,
      brand: br,
      description: formData.description,
      images: [{ id: `img-${Date.now()}`, productId: "", imageUrl: formData.imageUrl, isPrimary: true }],
      variants: [{
        id: `var-${Date.now()}`,
        productId: "",
        sku: formData.sku,
        price: Number(formData.salePrice),
        stock: Number(formData.stock),
        selectedOptions: []
      }]
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? productPayload : p)));
    } else {
      setProducts([productPayload, ...products]);
    }

    try {
      await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });
    } catch (err) {
      console.warn("Could not sync product to server API:", err);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2">
            <span>Master Data: Product Catalog</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              {filteredProducts.length} Items
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            Manage product pricing, SKU barcodes, inventory levels, and omnichannel status
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product Item</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by title or SKU code..."
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
            <option value="ALL">All Categories</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] font-semibold text-[#2B160F]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E8DCD2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FFF7EE] border-b border-[#E8DCD2] text-[#3B0C04] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Image</th>
                <th className="p-3.5">Product Title & Category</th>
                <th className="p-3.5">SKU Code</th>
                <th className="p-3.5">Selling Price</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Flags</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Actions</th>
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
                      {p.stock} Pcs
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
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedQRProduct(p)}
                        className="p-1.5 rounded-md hover:bg-[#FFF7EE] text-[#3B0C04] hover:scale-110 transition-transform"
                        title="View & Print Dynamic QR Code Label"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-md hover:bg-[#FFF7EE] text-[#3B0C04]"
                        title="Edit Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="p-1.5 rounded-md hover:bg-[#FFF7EE] text-[#6B5A52]"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-md hover:bg-[#D64545]/10 text-[#D64545]"
                        title="Delete Item"
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
                {editingProduct ? "Edit Product Item" : "Add New Catalog Item"}
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
                  <label className="block font-bold text-[#2B160F] mb-1">Product Title: *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sonifer SF-350 Portable Rechargeable Juicer"
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">SKU Barcode Code: *</label>
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
                  <label className="block font-bold text-[#2B160F] mb-1">Category:</label>
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
                  <label className="block font-bold text-[#2B160F] mb-1">Brand:</label>
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
                  <label className="block font-bold text-[#2B160F] mb-1">Regular Price (৳):</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3B0C04] mb-1">Sale Price (৳):</label>
                  <input
                    type="number"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-[#3B0C04] bg-[#FFF7EE] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">Inventory Stock:</label>
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
                <label className="block font-bold text-[#2B160F] mb-1">Primary Image URL:</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2B160F] mb-1">Product Description:</label>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC QR CODE & BARCODE MODAL */}
      {selectedQRProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-[#E8DCD2] space-y-5 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#3B0C04]" />
                <h3 className="text-base font-black text-[#3B0C04]">Dynamic QR & Barcode Label</h3>
              </div>
              <button
                onClick={() => setSelectedQRProduct(null)}
                className="p-1 rounded-lg text-[#8C7B72] hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Label Area */}
            <div
              id="printable-qr-label"
              className="p-6 rounded-2xl bg-[#FFFDF9] border-2 border-dashed border-[#3B0C04] space-y-4"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#3B0C04] text-[#FFC40E] font-black text-xs flex items-center justify-center">
                  P
                </span>
                <span className="font-black text-sm tracking-tight text-[#3B0C04]">
                  PONCHOMUKH VERIFIED
                </span>
              </div>

              {/* QR Image */}
              <div className="w-44 h-44 mx-auto bg-white p-2 rounded-2xl border border-[#E8DCD2] shadow-sm flex items-center justify-center">
                <img
                  src={generateQRDataURL(
                    typeof window !== "undefined"
                      ? `${window.location.origin}/product/${selectedQRProduct.slug}`
                      : `https://ponchomukh.com/product/${selectedQRProduct.slug}`,
                    180
                  )}
                  alt={selectedQRProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#2B160F] line-clamp-1">
                  {selectedQRProduct.name}
                </h4>
                <p className="font-mono text-xs font-black text-[#3B0C04]">
                  SKU: {selectedQRProduct.sku}
                </p>
                <p className="text-xs font-black text-[#16834A]">
                  Price: ৳{selectedQRProduct.salePrice || selectedQRProduct.basePrice}
                </p>
              </div>

              <p className="text-[10px] text-[#8C7B72]">
                📷 Scan with smartphone camera to view full specifications & online checkout
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-[#3B0C04] text-[#FFC40E] hover:bg-[#260700] flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Label</span>
                </button>

                <a
                  href={generateQRDataURL(
                    typeof window !== "undefined"
                      ? `${window.location.origin}/product/${selectedQRProduct.slug}`
                      : `https://ponchomukh.com/product/${selectedQRProduct.slug}`,
                    400
                  )}
                  download={`QR_${selectedQRProduct.sku}.svg`}
                  className="px-4 py-2.5 rounded-xl border border-[#E8DCD2] text-[#3B0C04] hover:bg-[#FFF7EE] flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download SVG</span>
                </a>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href={`/product/${selectedQRProduct.slug}`}
                  target="_blank"
                  className="text-[#3B0C04] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>View Product Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <Link
                  href={`/landing/${selectedQRProduct.slug}`}
                  target="_blank"
                  className="text-[#16834A] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Special Funnel Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
