"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Star, X, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check } from "lucide-react";
import Link from "next/link";

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    isProductModalOpen,
    setIsProductModalOpen,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useCart();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isProductModalOpen || !selectedProduct) return null;

  const activeVariant = selectedProduct.variants?.[selectedVariantIndex] || {
    id: `var-${selectedProduct.id}-default`,
    productId: selectedProduct.id,
    sku: selectedProduct.sku,
    price: selectedProduct.salePrice ?? selectedProduct.basePrice,
    stock: selectedProduct.stock || 20,
    selectedOptions: []
  };

  const isFavorited = isInWishlist(selectedProduct.id);
  const images = selectedProduct.images?.length > 0
    ? selectedProduct.images
    : [{ id: "def-img", productId: selectedProduct.id, imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80", isPrimary: true }];

  const handleClose = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedImageIndex(0);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, activeVariant, quantity, true);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E8DCD2] overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 border border-[#E8DCD2] flex items-center justify-center text-[#2B160F] hover:bg-[#3B0C04] hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 p-6 bg-[#FFFDF9] flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#E8DCD2]">
          <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-xl bg-white border border-[#E8DCD2]/60 p-4">
            <img
              src={images[selectedImageIndex]?.imageUrl}
              alt={selectedProduct.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg border p-1 bg-white shrink-0 transition-all ${
                    selectedImageIndex === idx ? "border-[#3B0C04] ring-1 ring-[#3B0C04]" : "border-[#E8DCD2] opacity-70"
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Actions */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Rating & SKU */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#FFC40E] fill-current" />
                <span className="text-xs font-bold text-[#2B160F]">{selectedProduct.averageRating}</span>
                <span className="text-xs text-[#8C7B72]">({selectedProduct.reviewsCount} রিভিউ)</span>
              </div>
              <span className="text-[11px] text-[#8C7B72] font-mono">SKU: {selectedProduct.sku}</span>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-[#2B160F] leading-snug mb-2">
              {selectedProduct.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-2xl font-black text-[#3B0C04]">
                ৳{selectedProduct.salePrice ?? selectedProduct.basePrice}
              </span>
              {selectedProduct.salePrice && selectedProduct.salePrice < selectedProduct.basePrice && (
                <span className="text-sm text-[#8C7B72] line-through">
                  ৳{selectedProduct.basePrice}
                </span>
              )}
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E8F6F1] text-[#16834A]">
                ✓ ইন স্টক
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs text-[#6B5A52] leading-relaxed mb-4">
              {selectedProduct.shortDescription || selectedProduct.description.slice(0, 140) + "..."}
            </p>

            {/* Variants if any */}
            {selectedProduct.variants && selectedProduct.variants.length > 1 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#2B160F] mb-1.5">
                  ভ্যারিয়েন্ট নির্বাচন করুন:
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedVariantIndex === i
                          ? "bg-[#3B0C04] text-white border-[#3B0C04]"
                          : "bg-[#FFFDF9] text-[#2B160F] border-[#E8DCD2] hover:border-[#3B0C04]"
                      }`}
                    >
                      {v.selectedOptions?.[0]?.value || `Option ${i + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 mb-6">
              <label className="text-xs font-bold text-[#2B160F]">পরিমাণ:</label>
              <div className="flex items-center border border-[#E8DCD2] rounded-lg bg-[#FFFDF9] overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#2B160F] hover:bg-[#FFF7EE]"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-[#2B160F]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold text-[#2B160F] hover:bg-[#FFF7EE]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-[#E8DCD2]/60">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleAddToCart}
                className="flex-1 h-11 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#FFC40E]" />
                <span>কার্টে যোগ করুন</span>
              </button>

              <button
                onClick={() => toggleWishlist(selectedProduct)}
                className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                  isFavorited
                    ? "border-[#D64545] text-[#D64545] bg-[#D64545]/10"
                    : "border-[#E8DCD2] text-[#8C7B72] hover:text-[#D64545]"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
              </button>
            </div>

            <Link
              href={`/product/${selectedProduct.slug}`}
              onClick={handleClose}
              className="block text-center text-xs font-semibold text-[#3B0C04] hover:underline pt-1"
            >
              বিস্তারিত বিস্তারিত তথ্য ও রিভিউ দেখুন →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
