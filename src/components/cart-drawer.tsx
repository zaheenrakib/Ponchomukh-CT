"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryZone,
    setDeliveryZone
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError("");
      setCouponInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 bg-[#3B0C04] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#FFC40E]" />
            <h2 className="font-bold text-base text-[#FFC40E]">
              আপনার কার্ট ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping or Offer Progress */}
        <div className="bg-[#FFF7EE] px-4 py-2.5 border-b border-[#E8DCD2] text-xs text-[#2B160F] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#16834A] shrink-0" />
          <span>সারা বাংলাদেশে ১০০% ক্যাশ অন ডেলিভারি সুবিধা!</span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF7EE] text-[#3B0C04] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-[#3B0C04]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2B160F]">আপনার কার্ট এখনো খালি</h3>
                <p className="text-xs text-[#8C7B72] mt-1">
                  আপনার পছন্দের পণ্য খুঁজে শপিং শুরু করুন।
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold shadow-xs hover:bg-[#260700]"
              >
                এখনই শপিং শুরু করুন
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productVariantId}
                className="flex gap-3 p-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] relative group"
              >
                {/* Product Thumbnail */}
                <div className="w-18 h-18 rounded-lg bg-white border border-[#E8DCD2]/60 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.product.images?.[0]?.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-xs font-semibold text-[#2B160F] hover:text-[#3B0C04] line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.productVariantId)}
                        className="text-[#8C7B72] hover:text-[#D64545] p-0.5"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.variant.selectedOptions?.[0] && (
                      <span className="text-[11px] text-[#8C7B72]">
                        অপশন: {item.variant.selectedOptions[0].value}
                      </span>
                    )}
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E8DCD2]/40">
                    <span className="text-xs font-bold text-[#3B0C04]">
                      ৳{item.variant.price * item.quantity}
                    </span>

                    <div className="flex items-center border border-[#E8DCD2] rounded-md bg-white">
                      <button
                        onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#2B160F] hover:bg-[#FFF7EE]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-[#2B160F]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-[#2B160F] hover:bg-[#FFF7EE]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-[#E8DCD2] space-y-3">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#E8F6F1] border border-[#16834A]/30 text-xs">
                  <div className="flex items-center gap-1.5 text-[#16834A] font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>কুপন কোড: {appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#D64545] hover:underline text-[11px] font-semibold"
                  >
                    মুছুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="কুপন কোড (যেমন: PONCHO10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 h-9 px-3 text-xs rounded-lg border border-[#E8DCD2] uppercase placeholder:normal-case focus:outline-none focus:border-[#3B0C04]"
                  />
                  <button
                    type="submit"
                    className="h-9 px-3.5 rounded-lg bg-[#FFF7EE] hover:bg-[#3B0C04] text-[#3B0C04] hover:text-[#FFC40E] border border-[#E8DCD2] text-xs font-bold transition-colors"
                  >
                    প্রয়োগ
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-[#D64545] mt-1">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#6B5A52] border-t border-[#E8DCD2]/60 pt-2">
              <div className="flex justify-between">
                <span>সাব-টোটাল</span>
                <span className="font-semibold text-[#2B160F]">৳{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#16834A]">
                  <span>ডিসকাউন্ট</span>
                  <span className="font-semibold">-৳{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>ডেলিভারি চার্জ</span>
                <div className="flex items-center gap-2">
                  <select
                    value={deliveryZone}
                    onChange={(e) => setDeliveryZone(e.target.value as any)}
                    className="text-[11px] py-0.5 px-1.5 border border-[#E8DCD2] rounded bg-[#FFFDF9] text-[#2B160F]"
                  >
                    <option value="INSIDE_DHAKA">ঢাকা সিটি (৳৬০)</option>
                    <option value="OUTSIDE_DHAKA">ঢাকার বাইরে (৳১২০)</option>
                  </select>
                  <span className="font-semibold text-[#2B160F]">৳{cartShippingFee}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#3B0C04] pt-1.5 border-t border-[#E8DCD2]">
                <span>সর্বমোট (Total)</span>
                <span className="text-base font-black">৳{cartTotal}</span>
              </div>
            </div>

            {/* Direct Checkout & View Cart Buttons */}
            <div className="space-y-2 pt-1">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full h-11 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>অর্ডার সম্পন্ন করুন (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="block text-center text-xs font-semibold text-[#6B5A52] hover:text-[#3B0C04] py-1"
              >
                কার্ট পেজ দেখুন →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
