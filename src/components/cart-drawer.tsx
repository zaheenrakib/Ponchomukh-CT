"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Tag, Check } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    clearCart
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [activeCouponDiscount, setActiveCouponDiscount] = useState(0);

  const formatBDT = (value: number) => {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
  };

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === "PONCHOMUKH10" || cleanCode === "WELCOME10") {
      setIsCouponApplied(true);
      setCouponError("");
      setActiveCouponDiscount(cartSubtotal * 0.1);
    } else if (cleanCode === "") {
      setCouponError("Please enter a code");
    } else {
      setCouponError("Invalid coupon code");
      setIsCouponApplied(false);
      setActiveCouponDiscount(0);
    }
  };

  const finalDiscount = cartDiscount + activeCouponDiscount;
  const finalTotal = Math.max(0, cartSubtotal - finalDiscount + cartShippingFee);

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 dark:bg-zinc-950 flex flex-col h-full border-l border-zinc-200 dark:border-zinc-800">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E8DCD2] p-5 dark:border-zinc-800 bg-[#FFF7EE] dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#3B0C04]" />
              <h2 className="font-sans text-base sm:text-lg font-black text-[#3B0C04] dark:text-white">Your Shopping Cart</h2>
              <span className="rounded-full bg-[#FFC40E] px-2 py-0.5 text-xs font-black text-[#3B0C04]">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#E8DCD2] text-zinc-600 dark:text-zinc-400 active:scale-95 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body: Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF7EE] dark:bg-zinc-900 mb-4 border border-[#E8DCD2]">
                  <ShoppingBag className="h-8 w-8 text-[#3B0C04]" />
                </div>
                <h3 className="font-sans text-base font-black text-[#2B160F] dark:text-zinc-200">আপনার cart এখনো খালি।</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-[220px]">আপনার পছন্দের পণ্য খুঁজে shopping শুরু করুন।</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 flex h-10 items-center justify-center px-6 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-white font-bold transition-all text-xs shadow-md"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPrice = Number(item.variant.price);
                return (
                  <div
                    key={item.productVariantId}
                    className="flex gap-3 p-3 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/30 dark:border-zinc-800 dark:bg-zinc-900/40"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white">
                      <img
                        src={item.variant.imageUrl || item.product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Item Metadata & controls */}
                    <div className="flex flex-col flex-1 justify-between text-left">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-sans text-xs font-bold text-[#2B160F] dark:text-zinc-200 line-clamp-1 leading-tight">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productVariantId)}
                            className="p-1 rounded-md text-zinc-400 hover:text-rose-600 transition-all shrink-0"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex justify-between items-center pt-2 mt-1">
                        {/* Quantity Counter */}
                        <div className="flex items-center h-7 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-1">
                          <button
                            onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                            className="p-1 rounded hover:bg-zinc-100 text-zinc-500"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white px-2">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                            className="p-1 rounded hover:bg-zinc-100 text-zinc-500"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-sans text-xs font-black text-[#3B0C04] dark:text-white">
                            {formatBDT(itemPrice * item.quantity)}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#E8DCD2] p-5 bg-[#FFF7EE]/60 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3">
              
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Coupon code (WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isCouponApplied}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E8DCD2] bg-white text-xs font-medium outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCouponApplied}
                  className={`h-9 px-4 rounded-lg text-xs font-bold transition-all ${
                    isCouponApplied
                      ? "bg-emerald-600 text-white"
                      : "bg-[#3B0C04] text-white hover:bg-[#260700]"
                  }`}
                >
                  {isCouponApplied ? <Check className="h-4 w-4" /> : "Apply"}
                </button>
              </form>
              {couponError && <p className="text-[10px] text-rose-600 font-bold pl-1">{couponError}</p>}
              {isCouponApplied && (
                <p className="text-[10px] text-emerald-600 font-bold pl-1 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Coupon applied (10% Off)!
                </p>
              )}

              {/* Fee Breakdown */}
              <div className="space-y-1.5 text-xs font-semibold text-[#6B5A52] dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2B160F] dark:text-white">{formatBDT(cartSubtotal)}</span>
                </div>
                
                {finalDiscount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Discount</span>
                    <span>-{formatBDT(finalDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-[#E8DCD2] dark:border-zinc-800 text-sm font-black text-[#3B0C04] dark:text-white">
                  <span>Total</span>
                  <span className="text-base text-rose-600">{formatBDT(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleProceedCheckout}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3B0C04] text-white hover:bg-[#260700] font-bold text-sm transition-all shadow-md active:scale-98"
                >
                  <CreditCard className="h-4 w-4 text-[#FFC40E]" />
                  Proceed to Checkout
                </button>

                <button
                  onClick={clearCart}
                  className="text-center text-[10px] font-bold text-zinc-400 hover:text-rose-600 py-1 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
