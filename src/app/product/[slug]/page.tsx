"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider, useCart } from "@/context/cart-context";
import {
  Star, ShoppingBag, CreditCard, ShieldCheck, RefreshCw,
  Plus, Minus, ChevronRight, Check
} from "lucide-react";

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, any> | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products?q=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products?.length > 0) {
          const p = data.products.find((item: Record<string, any>) => item.slug === slug) || data.products[0];
          setProduct(p);
          setSelectedVariant(p.variants?.[0] || null);
          const primaryImg = p.images?.find((img: Record<string, any>) => img.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || "";
          setSelectedImage(primaryImg);
        }
      })
      .catch((err) => console.error("Failed to load product detail:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] dark:bg-zinc-950">
        <Navbar />
        <div className="max-w-7xl mx-auto p-10 text-center text-zinc-500 font-bold">
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] dark:bg-zinc-950">
        <Navbar />
        <div className="max-w-7xl mx-auto p-16 text-center">
          <h2 className="text-xl font-black text-[#3B0C04]">Product Not Found</h2>
          <Link href="/shop" className="mt-4 inline-block px-6 py-2 rounded-xl bg-[#3B0C04] text-white text-xs font-bold">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const basePrice = Number(product.basePrice);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const activePrice = selectedVariant ? Number(selectedVariant.price) : (salePrice || basePrice);

  const formatBDT = (value: number) => {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
  };

  const handleAddToCart = () => {
    const variantToUse = selectedVariant || {
      id: `${product.id}-default`,
      sku: product.sku,
      price: activePrice,
      stock: product.stock,
    };
    addToCart(product as any, variantToUse as any, quantity);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50 pb-20 lg:pb-12">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-left">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold mb-6">
          <Link href="/" className="hover:text-[#3B0C04]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-[#3B0C04]">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#3B0C04] font-bold line-clamp-1">{product.name}</span>
        </div>

        {/* Top Split: Image Gallery & Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl border border-[#E8DCD2] bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex items-center justify-center p-4">
              <img
                src={selectedImage || product.images?.[0]?.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>

            {/* Thumbnail Strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img: any) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`relative aspect-square w-16 shrink-0 rounded-xl border-2 overflow-hidden bg-white ${
                      selectedImage === img.imageUrl ? "border-[#3B0C04]" : "border-[#E8DCD2]"
                    }`}
                  >
                    <img src={img.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Meta & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {product.brand && (
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
                  {product.brand.name}
                </span>
              )}

              <h1 className="mt-1 font-sans text-xl sm:text-3xl font-black text-[#3B0C04] dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center text-[#FFC40E]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.averageRating) ? "fill-current text-[#D99E00]" : "text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-500">
                  {product.averageRating.toFixed(1)} ({product.reviewsCount} reviews)
                </span>
                <span className="text-zinc-300">|</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> In Stock
                </span>
              </div>

              {/* Price section */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-sans text-2xl sm:text-3xl font-black text-[#3B0C04] dark:text-white">
                  {formatBDT(activePrice)}
                </span>
                {salePrice && (
                  <span className="font-sans text-sm font-semibold text-zinc-400 line-through">
                    {formatBDT(basePrice)}
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-bold uppercase text-zinc-500">Quantity</span>
                <div className="flex items-center h-10 rounded-xl border border-[#E8DCD2] bg-white dark:border-zinc-800 dark:bg-zinc-900 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-zinc-500 hover:text-[#3B0C04]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white px-3">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-zinc-500 hover:text-[#3B0C04]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-[#E8DCD2] dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-white font-bold text-sm transition-all shadow-md active:scale-98"
                >
                  <ShoppingBag className="h-4 w-4 text-[#FFC40E]" />
                  Add to Cart
                </button>

                <button
                  onClick={() => {
                    handleAddToCart();
                    window.location.href = "/checkout";
                  }}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-[#FFC40E] hover:bg-[#D99E00] text-[#3B0C04] font-black text-sm transition-all shadow-md active:scale-98"
                >
                  <CreditCard className="h-4 w-4" />
                  Buy Now
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-zinc-500 pt-3">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  1 Year Brand Warranty
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4 text-rose-600" />
                  7-Day Easy Returns
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Lower Tabs / Information Accordions (PART 28 Blueprint) */}
        <div className="mt-16 pt-8 border-t border-[#E8DCD2]">
          <div className="flex gap-4 border-b border-[#E8DCD2] pb-3 text-xs sm:text-sm font-extrabold text-zinc-500 overflow-x-auto">
            {["description", "specifications", "delivery", "reviews"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`capitalize pb-3 -mb-3 transition-colors ${
                  activeTab === t ? "text-[#3B0C04] border-b-2 border-[#3B0C04] font-black" : "hover:text-[#3B0C04]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="py-6 text-xs sm:text-sm font-medium leading-relaxed">
            {activeTab === "description" && (
              <div>
                <h3 className="font-bold text-base text-[#3B0C04] mb-2">Product Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-md space-y-2">
                <h3 className="font-bold text-base text-[#3B0C04] mb-3">Technical Specifications</h3>
                <div className="grid grid-cols-2 py-1.5 border-b border-zinc-150">
                  <span className="text-zinc-500">Brand</span>
                  <span className="font-bold">{product.brand?.name || "Ponchomukh"}</span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-zinc-150">
                  <span className="text-zinc-500">SKU</span>
                  <span className="font-bold">{product.sku}</span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-zinc-150">
                  <span className="text-zinc-500">Warranty</span>
                  <span className="font-bold">7 Days Replacement</span>
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-2">
                <h3 className="font-bold text-base text-[#3B0C04] mb-2">Delivery Information</h3>
                <p>🚚 Inside Dhaka: 24 - 48 Hours (৳60)</p>
                <p>🚚 Outside Dhaka: 2 - 4 Days (৳120)</p>
                <p>💳 Cash on Delivery available nationwide.</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="font-bold text-base text-[#3B0C04] mb-3">Customer Reviews</h3>
                <p className="text-zinc-500">Verified purchase reviews will appear here.</p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* MOBILE STICKY PURCHASE BAR (PART 32 Blueprint: 64px Height) */}
      <div className="lg:hidden fixed bottom-12 left-0 right-0 z-40 bg-white dark:bg-zinc-950 border-t border-[#E8DCD2] p-3 flex items-center justify-between shadow-lg h-16">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Price</span>
          <span className="font-sans font-black text-lg text-[#3B0C04] dark:text-white">
            {formatBDT(activePrice)}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="h-10 px-4 rounded-xl bg-[#3B0C04] text-white text-xs font-bold"
          >
            Add to Cart
          </button>

          <button
            onClick={() => {
              handleAddToCart();
              window.location.href = "/checkout";
            }}
            className="h-10 px-4 rounded-xl bg-[#FFC40E] text-[#3B0C04] text-xs font-black"
          >
            Buy Now
          </button>
        </div>
      </div>

      <CartDrawer />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <CartProvider>
      <ProductDetailContent />
    </CartProvider>
  );
}
