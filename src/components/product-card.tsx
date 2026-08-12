"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Star, Heart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, setIsProductModalOpen, addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const basePrice = Number(product.basePrice);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const activePrice = salePrice || basePrice;

  // Format currency helper to BDT ৳
  const formatBDT = (value: number) => {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
  };

  const primaryImage = product.images?.find((img: any) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";
  const hoverImage = product.images?.find((img: any) => !img.isPrimary)?.imageUrl || primaryImage;
  const currentImage = isHovered ? hoverImage : primaryImage;

  const discountPercent = salePrice
    ? Math.round(((basePrice - salePrice) / basePrice) * 100)
    : 0;

  const handleCardClick = () => {
    setSelectedProduct(product as any);
    setIsProductModalOpen(true);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants?.[0] || {
      id: `${product.id}-default`,
      sku: `${product.id}-SKU`,
      price: activePrice,
      stock: 10,
      selectedOptions: [],
    };
    addToCart(product as any, defaultVariant, 1);
  };

  return (
    <div
      className="group relative flex flex-col rounded-xl border border-[#E8DCD2] bg-white dark:border-zinc-800 dark:bg-zinc-950 p-3 transition-all duration-300 hover:shadow-md cursor-pointer text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image Area (1:1 Ratio) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#FFF7EE] dark:bg-zinc-900 flex items-center justify-center p-2">
        <img
          src={currentImage}
          alt={product.name}
          className="h-full w-full object-cover object-center rounded-md transition-transform duration-300 ease-out group-hover:scale-103"
        />

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-xs backdrop-blur-xs transition-all active:scale-90 hover:bg-white"
          title="Wishlist"
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              isWishlisted ? "fill-rose-500 text-rose-500 scale-105" : "text-zinc-500"
            }`}
          />
        </button>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 z-10 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 justify-between pt-3">
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 text-[#FFC40E]">
            <Star className="h-3.5 w-3.5 fill-current text-[#D99E00]" />
            <span className="text-[11px] font-extrabold text-zinc-700 dark:text-zinc-300">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-[10px] font-semibold text-zinc-400">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Product Name (Max 2 Lines) */}
          <h3 className="mt-1 font-sans text-xs sm:text-sm font-bold text-[#2B160F] dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-[#3B0C04] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-850">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-sm sm:text-base font-black text-[#3B0C04] dark:text-white">
              {formatBDT(activePrice)}
            </span>
            {salePrice && (
              <span className="font-sans text-xs font-semibold text-zinc-400 line-through">
                {formatBDT(basePrice)}
              </span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleQuickAdd}
            className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-white font-bold text-xs transition-all active:scale-98 shadow-xs"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#FFC40E]" />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>
    </div>
  );
};
