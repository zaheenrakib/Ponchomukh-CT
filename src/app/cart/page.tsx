"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

export default function CartPage() {
  const { language, t, formatPrice, formatNumber } = useLanguage();
  const {
    cartItems,
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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError("");
      setCouponInput("");
    }
  };

  const totalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header Breadcrumb */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-4">
          <div className="container-custom">
            <div className="flex items-center gap-1.5 text-xs text-[#8C7B72]">
              <Link href="/" className="hover:text-[#3B0C04]">{t("nav.home")}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3B0C04] font-semibold">
                {language === "bn" ? "আপনার কার্ট" : "Shopping Cart"}
              </span>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B0C04] mb-6">
            {language === "bn"
              ? `শপিং কার্ট (${formatNumber(totalCount)})`
              : `Shopping Cart (${totalCount})`}
          </h1>

          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center rounded-2xl bg-white border border-[#E8DCD2] max-w-lg mx-auto space-y-4 shadow-xs">
              <div className="w-20 h-20 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-[#3B0C04]" />
              </div>
              <h2 className="text-xl font-bold text-[#2B160F]">
                {t("cart.emptyTitle")}
              </h2>
              <p className="text-xs text-[#8C7B72]">
                {t("cart.emptySubtitle")}
              </p>
              <div className="pt-3">
                <Link
                  href="/shop"
                  className="inline-block px-7 py-3 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700] transition-colors"
                >
                  {t("cart.startShopping")}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Cart Table / Item List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Desktop Table */}
                <div className="hidden sm:block bg-white rounded-xl border border-[#E8DCD2] overflow-hidden shadow-xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FFF7EE] border-b border-[#E8DCD2] text-[#3B0C04] font-bold">
                      <tr>
                        <th className="p-4">{language === "bn" ? "পণ্য" : "Product"}</th>
                        <th className="p-4">{language === "bn" ? "মূল্য" : "Price"}</th>
                        <th className="p-4">{language === "bn" ? "পরিমাণ" : "Quantity"}</th>
                        <th className="p-4">{language === "bn" ? "মোট" : "Total"}</th>
                        <th className="p-4 text-center">{language === "bn" ? "রিমুভ" : "Remove"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCD2]">
                      {cartItems.map((item) => {
                        const displayName = (language === "en" && item.product.nameEn) ? item.product.nameEn : item.product.name;
                        return (
                          <tr key={item.productVariantId} className="hover:bg-[#FFFDF9]">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product.images?.[0]?.imageUrl}
                                  alt={displayName}
                                  className="w-14 h-14 object-contain rounded-lg border border-[#E8DCD2] p-1 shrink-0 bg-white"
                                />
                                <div>
                                  <Link
                                    href={`/product/${item.product.slug}`}
                                    className="font-bold text-[#2B160F] hover:text-[#3B0C04] line-clamp-1"
                                  >
                                    {displayName}
                                  </Link>
                                  {item.variant.selectedOptions?.[0] && (
                                    <span className="text-[11px] text-[#8C7B72] block">
                                      {language === "bn" ? "অপশন" : "Option"}: {item.variant.selectedOptions[0].value}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-bold text-[#2B160F]">
                              {formatPrice(item.variant.price)}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center border border-[#E8DCD2] rounded-md bg-white w-fit">
                                <button
                                  onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center text-xs text-[#2B160F] hover:bg-[#FFF7EE]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-[#2B160F]">
                                  {formatNumber(item.quantity)}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center text-xs text-[#2B160F] hover:bg-[#FFF7EE]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="p-4 font-black text-[#3B0C04]">
                              {formatPrice(item.variant.price * item.quantity)}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => removeFromCart(item.productVariantId)}
                                className="p-1 text-[#8C7B72] hover:text-[#D64545] transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3">
                  {cartItems.map((item) => {
                    const displayName = (language === "en" && item.product.nameEn) ? item.product.nameEn : item.product.name;
                    return (
                      <div
                        key={item.productVariantId}
                        className="p-3.5 rounded-xl border border-[#E8DCD2] bg-white flex gap-3 shadow-xs"
                      >
                        <img
                          src={item.product.images?.[0]?.imageUrl}
                          alt={displayName}
                          className="w-16 h-16 object-contain rounded-lg border border-[#E8DCD2] p-1 shrink-0 bg-[#FFFDF9]"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${item.product.slug}`}
                              className="text-xs font-bold text-[#2B160F] line-clamp-1"
                            >
                              {displayName}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.productVariantId)}
                              className="text-[#8C7B72] hover:text-[#D64545]"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-black text-[#3B0C04]">
                              {formatPrice(item.variant.price * item.quantity)}
                            </span>

                            <div className="flex items-center border border-[#E8DCD2] rounded-md bg-[#FFFDF9]">
                              <button
                                onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center text-xs"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-bold">
                                {formatNumber(item.quantity)}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center text-xs"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue Shopping Link */}
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#3B0C04] hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "আরও পণ্য দেখুন" : "Continue Shopping"}</span>
                  </Link>
                </div>
              </div>

              {/* Right 1 Col: Order Summary & Checkout */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] space-y-4 shadow-xs">
                  <h3 className="text-sm font-black text-[#3B0C04] uppercase tracking-wider border-b border-[#E8DCD2] pb-3">
                    {language === "bn" ? "অর্ডার সামারি" : "Order Summary"}
                  </h3>

                  {/* Coupon Form */}
                  <div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#E8F6F1] border border-[#16834A]/30 text-xs">
                        <div className="flex items-center gap-1.5 text-[#16834A] font-bold">
                          <Tag className="w-3.5 h-3.5" />
                          <span>{t("cart.appliedCoupon")}: {appliedCoupon.code}</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[#D64545] hover:underline text-xs font-semibold"
                        >
                          {t("cart.removeCoupon")}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t("cart.couponPlaceholder")}
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="flex-1 h-9 px-3 text-xs rounded-lg border border-[#E8DCD2] uppercase placeholder:normal-case focus:outline-none focus:border-[#3B0C04]"
                        />
                        <button
                          type="submit"
                          className="h-9 px-4 rounded-lg bg-[#FFF7EE] hover:bg-[#3B0C04] text-[#3B0C04] hover:text-[#FFC40E] border border-[#E8DCD2] text-xs font-bold transition-colors"
                        >
                          {t("cart.applyCoupon")}
                        </button>
                      </form>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-[#D64545] mt-1">{couponError}</p>
                    )}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 text-xs text-[#6B5A52] border-t border-[#E8DCD2]/60 pt-3">
                    <div className="flex justify-between">
                      <span>{t("cart.subtotal")}</span>
                      <span className="font-bold text-[#2B160F]">{formatPrice(cartSubtotal)}</span>
                    </div>

                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-[#16834A]">
                        <span>{t("cart.discount")}</span>
                        <span className="font-bold">-{formatPrice(cartDiscount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span>{t("cart.deliveryZone")}</span>
                      <select
                        value={deliveryZone}
                        onChange={(e) => setDeliveryZone(e.target.value as any)}
                        className="text-[11px] py-1 px-2 border border-[#E8DCD2] rounded bg-[#FFFDF9] text-[#2B160F] font-semibold"
                      >
                        <option value="INSIDE_DHAKA">{t("cart.insideDhaka")}</option>
                        <option value="OUTSIDE_DHAKA">{t("cart.outsideDhaka")}</option>
                      </select>
                    </div>

                    <div className="flex justify-between">
                      <span>{t("cart.shipping")}</span>
                      <span className="font-bold text-[#2B160F]">{formatPrice(cartShippingFee)}</span>
                    </div>

                    <div className="flex justify-between text-base font-black text-[#3B0C04] pt-3 border-t border-[#E8DCD2]">
                      <span>{t("cart.total")}</span>
                      <span className="text-xl text-[#3B0C04]">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <div className="pt-2">
                    <Link
                      href="/checkout"
                      className="w-full h-12 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <span>{t("cart.checkout")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] text-xs text-[#6B5A52] space-y-1.5">
                  <p className="font-bold text-[#3B0C04] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#16834A]" />
                    <span>{language === "bn" ? "১০০% নিরাপদ চেকআউট" : "100% Secure Checkout"}</span>
                  </p>
                  <p className="text-[11px]">
                    {language === "bn"
                      ? "ক্যাশ অন ডেলিভারিতে কোনো অগ্রিম পেমেন্ট ছাড়াই অর্ডার করতে পারবেন।"
                      : "Cash on delivery available nationwide with no advance payment required."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
