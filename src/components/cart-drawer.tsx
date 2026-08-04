"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Tag, Check } from "lucide-react";

export const CartDrawer: React.FC = () => {
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

  const formatRp = (value: number) => {
    return `Rp${value.toLocaleString("id-ID")}`;
  };

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === "PONCHOMUKH10" || cleanCode === "WELCOME10") {
      setIsCouponApplied(true);
      setCouponError("");
      // Add extra 10% discount
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-350 dark:bg-zinc-950 flex flex-col h-full border-l border-zinc-200 dark:border-zinc-800">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-zinc-150 p-6 dark:border-zinc-850">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-rose-500" />
              <h2 className="font-sans text-lg font-black text-zinc-900 dark:text-white">Shopping Cart</h2>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-extrabold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 active:scale-95 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Body: Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 mb-4 border border-zinc-100 dark:border-zinc-850">
                  <ShoppingBag className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="font-sans text-base font-black text-zinc-800 dark:text-zinc-200">Your cart is empty</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-[220px]">Add some products from our store to start your order.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 flex h-10 items-center justify-center px-6 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-white font-semibold transition-all active:scale-95 text-xs dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const opt = item.variant.selectedOptions[0]; // Simple single-option representation
                return (
                  <div
                    key={item.productVariantId}
                    className="flex gap-4 p-3 rounded-2xl border border-zinc-150 bg-zinc-50/50 dark:border-zinc-850 dark:bg-zinc-900/40 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                      <img
                        src={item.variant.imageUrl || item.product.images.find(img => img.isPrimary)?.imageUrl || item.product.images[0]?.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Item Metadata & controls */}
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        {/* Title & Brand */}
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-sans text-xs font-extrabold text-zinc-805 dark:text-zinc-200 line-clamp-1 leading-tight">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productVariantId)}
                            className="p-1 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all shrink-0 active:scale-90"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {item.product.brand && (
                          <span className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
                            {item.product.brand.name}
                          </span>
                        )}
                        {opt && (
                          <span className="inline-flex mt-1 text-[9.5px] font-bold text-zinc-500 dark:text-zinc-450 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md">
                            {opt.attributeName}: {opt.value}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex justify-between items-center pt-2 mt-1">
                        {/* Quantity Counter */}
                        <div className="flex items-center h-8 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-1">
                          <button
                            onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-650"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono text-xs font-bold text-zinc-850 dark:text-white px-2.5">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.stock}
                            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-650 disabled:opacity-30"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-mono text-xs font-extrabold text-zinc-850 dark:text-white block">
                            {formatRp(item.variant.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500 block">
                              {formatRp(item.variant.price)} each
                            </span>
                          )}
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
            <div className="border-t border-zinc-150 p-6 bg-zinc-50/50 dark:border-zinc-850 dark:bg-zinc-900/20 space-y-4">
              
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Enter code (WELCOM10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isCouponApplied}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-205 bg-white text-xs font-medium transition-all outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white disabled:bg-zinc-100 dark:disabled:bg-zinc-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCouponApplied}
                  className={`h-9 px-4 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                    isCouponApplied
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  }`}
                >
                  {isCouponApplied ? <Check className="h-4 w-4" /> : "Apply"}
                </button>
              </form>
              {couponError && <p className="text-[10px] text-rose-500 font-bold -mt-2 pl-1">{couponError}</p>}
              {isCouponApplied && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black -mt-2 pl-1 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Coupon applied (Extra 10% Off)!
                </p>
              )}

              {/* Fee Breakdown */}
              <div className="space-y-1.5 text-xs font-medium text-zinc-550 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-850 dark:text-white">{formatRp(cartSubtotal)}</span>
                </div>
                
                {finalDiscount > 0 && (
                  <div className="flex justify-between text-rose-500 font-bold">
                    <span>Discounts</span>
                    <span className="font-mono">-{formatRp(finalDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-zinc-850 dark:text-white">
                    {cartShippingFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">Free</span>
                    ) : (
                      formatRp(cartShippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800 text-sm font-black text-zinc-900 dark:text-white">
                  <span>Total</span>
                  <span className="font-mono text-base text-rose-500">{formatRp(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => alert("Checkout Flow Triggered! Integration details can be hooked to SSLCommerz / Stripe.")}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold transition-all hover:scale-101 active:scale-98 shadow-md shadow-zinc-950/15"
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="text-center text-[10px] font-bold text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 py-1 cursor-pointer transition-colors"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
