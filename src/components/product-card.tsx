"use client";

import React, { useState } from "react";
import { Product } from "@/lib/mockData";
import { useCart } from "@/context/cart-context";
import { Star, Eye, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, setIsProductModalOpen } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Format currency helper
  const formatRp = (value: number) => {
    return `Rp${value.toLocaleString("id-ID")}`;
  };

  const primaryImage = product.images.find((img) => img.isPrimary)?.imageUrl || product.images[0]?.imageUrl;
  const hoverImage = product.images.find((img) => !img.isPrimary)?.imageUrl || primaryImage;
  const currentImage = isHovered ? hoverImage : primaryImage;

  // Calculate discount percent
  const discountPercent = product.salePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : 0;



  const handleCardClick = () => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-zinc-950 transition-all duration-300 hover:shadow-sm cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#EFF1F4] dark:bg-zinc-900/60 flex items-center justify-center p-4">
        <img
          src={currentImage}
          alt={product.name}
          className="h-full w-full object-cover object-center rounded-xl transition-transform duration-500 ease-out group-hover:scale-103"
        />

        {/* Heart Wishlist Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/70 backdrop-blur-md transition-all active:scale-90 hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              isWishlisted ? "fill-rose-500 text-rose-500 scale-105" : "text-zinc-500"
            }`}
          />
        </button>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 z-10 rounded-lg bg-rose-500 px-2 py-0.5 text-[9px] font-black text-white">
            {discountPercent}% OFF
          </span>
        )}

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-800 shadow-md transition-transform duration-300 scale-75 group-hover:scale-100">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col pt-3 pb-2 text-left">
        <h3 className="font-sans text-xs font-bold text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-snug group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
          {product.name}
        </h3>

        {/* Price & Discounts */}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-sans text-sm font-black text-zinc-900 dark:text-white">
            {formatRp(product.salePrice || product.basePrice)}
          </span>
          {product.salePrice && (
            <span className="font-sans text-[10px] font-bold text-rose-450 line-through dark:text-rose-500/80">
              {formatRp(product.basePrice)}
            </span>
          )}
        </div>

        {/* Flash Sale vs Today's for you progress items */}
        {product.isFlashSale ? (
          <div className="mt-2.5 flex items-center justify-between gap-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
            {/* Progress stock bar */}
            <div className="flex-1 h-2 rounded-full bg-zinc-205 dark:bg-zinc-800 overflow-hidden relative">
              <div
                className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-350"
                style={{ width: `${product.soldPercent || 0}%` }}
              />
            </div>
            <span className="shrink-0">{product.soldCount}/{product.limitCount} Sold</span>
          </div>
        ) : (
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 text-amber-500 font-sans text-[10px] font-black">
              <Star className="h-3 w-3 fill-current" />
              <span>{product.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
              | {product.reviewsCount}+ Sold
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
