"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/lib/mockData";
import { useCart } from "@/context/cart-context";
import { Star, ShoppingBag, Heart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addProductToCart, toggleWishlist, isInWishlist, setSelectedProduct, setIsProductModalOpen } = useCart();

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80";

  // Calculate discount percentage if salePrice exists
  const discountPercent = product.salePrice && product.salePrice < product.basePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addProductToCart(product, 1, true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setSelectedProduct(product);
      setIsProductModalOpen(true);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white border border-[#E8DCD2] rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Product Image Container (1:1 Aspect Ratio) */}
      <div className="relative aspect-square w-full bg-[#FFFDF9] p-3 flex items-center justify-center overflow-hidden">
        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-[#D64545] text-white text-xs font-bold rounded-md shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Status Flags (Best Seller / New) */}
        {!discountPercent && product.isBestSeller && (
          <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-[#FFC40E] text-[#260700] text-xs font-black rounded-md shadow-xs">
            বেস্ট সেলার
          </span>
        )}
        {!discountPercent && !product.isBestSeller && product.isNewArrival && (
          <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-[#3B0C04] text-[#FFC40E] text-xs font-bold rounded-md shadow-xs">
            New
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E8DCD2]/60 transition-all ${
            isFavorited ? "text-[#D64545] scale-110" : "text-[#8C7B72] hover:text-[#D64545] hover:scale-105"
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>

        {/* Product Image */}
        <Link href={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Quick View Hover Button (Desktop) */}
        <button
          onClick={handleQuickView}
          className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center gap-1 px-3 py-1.5 rounded-lg bg-white/95 text-[#2B160F] text-xs font-semibold shadow-md border border-[#E8DCD2] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
        >
          <Eye className="w-3.5 h-3.5 text-[#3B0C04]" />
          <span>কুইক ভিউ</span>
        </button>
      </div>

      {/* Product Card Content */}
      <div className="flex-1 flex flex-col p-3.5 justify-between">
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-[#FFC40E]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-[#2B160F]">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-[11px] text-[#8C7B72]">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Product Title (2-lines max with ellipsis) */}
          <Link href={`/product/${product.slug}`}>
            <h3
              className="text-sm font-semibold text-[#2B160F] line-clamp-2 hover:text-[#3B0C04] transition-colors leading-snug"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Add to Cart CTA */}
        <div className="mt-3 pt-2.5 border-t border-[#E8DCD2]/50">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base md:text-lg font-black text-[#3B0C04]">
              ৳{product.salePrice ?? product.basePrice}
            </span>
            {product.salePrice && product.salePrice < product.basePrice && (
              <span className="text-xs text-[#8C7B72] line-through">
                ৳{product.basePrice}
              </span>
            )}
          </div>

          {/* Primary CTA: Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full h-10 md:h-11 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFFFFF] text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFC40E]" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
