"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Star, X, ShoppingCart, Plus, Minus, ShieldCheck, RefreshCw } from "lucide-react";
import { ProductVariant } from "@/lib/mockData";

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    isProductModalOpen,
    setIsProductModalOpen,
    addToCart
  } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Initialize selected variant and image when product opens
  useEffect(() => {
    if (selectedProduct) {
      const defaultVariant = selectedProduct.variants[0] || null;
      setSelectedVariant(defaultVariant);
      
      const primaryImg = selectedProduct.images.find((img) => img.isPrimary)?.imageUrl 
        || selectedProduct.images[0]?.imageUrl 
        || "";
      setSelectedImage(primaryImg);
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (!isProductModalOpen || !selectedProduct) return null;

  const discountPercent = selectedProduct.salePrice
    ? Math.round(((selectedProduct.basePrice - selectedProduct.salePrice) / selectedProduct.basePrice) * 100)
    : 0;

  // Handle quantity adjustments
  const incrementQuantity = () => {
    const maxStock = selectedVariant ? selectedVariant.stock : selectedProduct.stock;
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (variant.imageUrl) {
      setSelectedImage(variant.imageUrl);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(selectedProduct, selectedVariant, quantity);
    setIsProductModalOpen(false);
  };

  const activePrice = selectedVariant ? selectedVariant.price : (selectedProduct.salePrice || selectedProduct.basePrice);
  const activeStock = selectedVariant ? selectedVariant.stock : selectedProduct.stock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsProductModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={() => setIsProductModalOpen(false)}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:text-zinc-400 dark:hover:text-white transition-all shadow-md active:scale-95"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Modal Left: Images */}
        <div className="md:w-1/2 p-6 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30 overflow-y-auto">
          {/* Main Visual */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-zinc-900 flex items-center justify-center">
            <img
              src={selectedImage}
              alt={selectedProduct.name}
              className="h-full w-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 rounded-lg bg-rose-500 px-2.5 py-1 text-xs font-black text-white shadow-md shadow-rose-500/10">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {selectedProduct.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {selectedProduct.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all bg-white dark:bg-zinc-900 ${
                    selectedImage === img.imageUrl
                      ? "border-rose-500 scale-102"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Right: Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Brand */}
            {selectedProduct.brand && (
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-rose-500">
                {selectedProduct.brand.name}
              </span>
            )}

            {/* Title */}
            <h2 className="mt-1.5 font-sans text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
              {selectedProduct.name}
            </h2>

            {/* Ratings */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(selectedProduct.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-200 dark:text-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                {selectedProduct.averageRating.toFixed(1)} ({selectedProduct.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-black text-zinc-900 dark:text-white">
                ${activePrice.toFixed(2)}
              </span>
              {selectedProduct.salePrice && (
                <span className="font-mono text-sm font-medium text-zinc-450 line-through dark:text-zinc-600">
                  ${selectedProduct.basePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Variants Selector */}
            {selectedProduct.variants.length > 0 && selectedProduct.variants[0].selectedOptions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Select Options:
                </h4>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {selectedProduct.variants.map((v) => {
                    const opt = v.selectedOptions[0]; // Simple single-option representation
                    const isSelected = selectedVariant?.id === v.id;
                    const isColor = opt.attributeName.toLowerCase() === "color";
                    
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVariantChange(v)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all active:scale-95 ${
                          isSelected
                            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
                            : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-750"
                        }`}
                      >
                        {isColor && opt.meta && (
                          <span
                            className="h-3 w-3 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: opt.meta }}
                          />
                        )}
                        <span>{opt.value}</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                          (${v.price.toFixed(2)})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-zinc-150 dark:border-zinc-850 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Quantity Selector */}
            <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Quantity</span>
              <div className="flex h-11 items-center rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 w-full sm:w-32 justify-between px-2">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-850 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-mono font-bold text-sm text-zinc-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= activeStock}
                  className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-850 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart button */}
            <div className="flex flex-col w-full sm:flex-1">
              <span className="text-right text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 mb-1">
                {activeStock > 0 ? `${activeStock} items in stock` : "Out of stock"}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={activeStock === 0}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed font-semibold transition-all hover:scale-102 active:scale-98 shadow-md shadow-rose-500/10"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Core Guarantees */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-[10.5px] font-bold text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
              1 Year Brand Warranty
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4 text-rose-500 animate-spin-slow" />
              7-Day Easy Returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
