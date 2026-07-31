"use client";

import React, { useState } from "react";
import { Product } from "@/lib/mockData";
import { useCart } from "@/context/cart-context";
import { Star, Eye, ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, setIsProductModalOpen } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Get active image
  const primaryImage = product.images.find((img) => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl;
  const hoverImage = product.images.find((img) => !img.isPrimary)?.imageUrl || primaryImage;
  const currentImage = isHovered ? hoverImage : primaryImage;

  // Calculate discount percentage
  const discountPercent = product.salePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first variant
    const defaultVariant = product.variants[0] || {
      id: `${product.id}-default`,
      productId: product.id,
      sku: product.sku,
      price: product.salePrice || product.basePrice,
      stock: product.stock,
      selectedOptions: []
    };
    addToCart(product, defaultVariant, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-350 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleQuickView}
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 cursor-pointer">
        <img
          src={currentImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 z-10 rounded-lg bg-rose-500 px-2 py-1 text-[11px] font-black text-white shadow-md shadow-rose-500/10">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/40 backdrop-blur-md transition-all active:scale-90 hover:bg-white hover:text-rose-500 ${
            isWishlisted ? "text-rose-500 bg-white scale-105" : "text-zinc-600 dark:text-zinc-300"
          }`}
        >
          <Heart className={`h-4.5 w-4.5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Quick View Button (Slide Up on Hover) */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center p-3 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={handleQuickView}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/75 dark:bg-zinc-900/75 dark:text-white dark:hover:bg-zinc-900 backdrop-blur-md px-4 py-2 text-xs font-bold text-zinc-900 shadow-md hover:bg-white transition-all scale-95 hover:scale-100"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        {product.brand && (
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            {product.brand.name}
          </span>
        )}

        {/* Title */}
        <h3 className="mt-1 font-sans text-sm font-bold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer">
          {product.name}
        </h3>

        {/* Ratings */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.averageRating) ? "fill-amber-400" : "text-zinc-200 dark:text-zinc-800"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {product.salePrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-base font-extrabold text-zinc-900 dark:text-white">
                  ${product.salePrice.toFixed(2)}
                </span>
                <span className="font-mono text-xs font-medium text-zinc-400 line-through dark:text-zinc-600">
                  ${product.basePrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-mono text-base font-extrabold text-zinc-900 dark:text-white">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 hover:bg-rose-500 hover:text-white dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-rose-500 dark:hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
