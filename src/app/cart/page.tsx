"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useCart } from "@/context/cart-context";
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
  const router = useRouter();
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
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header Breadcrumb */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-4">
          <div className="container-custom">
            <div className="flex items-center gap-1.5 text-xs text-[#8C7B72]">
              <Link href="/" className="hover:text-[#3B0C04]">হোম</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3B0C04] font-semibold">আপনার কার্ট (Shopping Cart)</span>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B0C04] mb-6">
            শপিং কার্ট ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>

          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center rounded-2xl bg-white border border-[#E8DCD2] max-w-lg mx-auto space-y-4 shadow-xs">
              <div className="w-20 h-20 rounded-full bg-[#FFF7EE] text-[#3B0C04] mx-auto flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-[#3B0C04]" />
              </div>
              <h2 className="text-xl font-bold text-[#2B160F]">
                আপনার কার্ট এখনো খালি
              </h2>
              <p className="text-xs text-[#8C7B72]">
                আপনার পছন্দের প্রয়োজনীয় পণ্য খুঁজে শপিং শুরু করুন।
              </p>
              <div className="pt-3">
                <Link
                  href="/shop"
                  className="inline-block px-7 py-3 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700]"
                >
                  Shop Now (পণ্য দেখুন)
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
                        <th className="p-4">পণ্য (Product)</th>
                        <th className="p-4">মূল্য</th>
                        <th className="p-4">পরিমাণ</th>
                        <th className="p-4">মোট</th>
                        <th className="p-4 text-center">রিমুভ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DCD2]">
                      {cartItems.map((item) => (
                        <tr key={item.productVariantId} className="hover:bg-[#FFFDF9]">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.images?.[0]?.imageUrl}
                                alt={item.product.name}
                                className="w-14 h-14 object-contain rounded-lg border border-[#E8DCD2] p-1 shrink-0 bg-white"
                              />
                              <div>
                                <Link
                                  href={`/product/${item.product.slug}`}
                                  className="font-bold text-[#2B160F] hover:text-[#3B0C04] line-clamp-1"
                                >
                                  {item.product.name}
                                </Link>
                                {item.variant.selectedOptions?.[0] && (
                                  <span className="text-[11px] text-[#8C7B72] block">
                                    অপশন: {item.variant.selectedOptions[0].value}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-bold text-[#2B160F]">
                            ৳{item.variant.price}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center border border-[#E8DCD2] rounded-md bg-white w-fit">
                              <button
                                onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-xs text-[#2B160F] hover:bg-[#FFF7EE]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-[#2B160F]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-xs text-[#2B160F] hover:bg-[#FFF7EE]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 font-black text-[#3B0C04]">
                            ৳{item.variant.price * item.quantity}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => removeFromCart(item.productVariantId)}
                              className="p-1 text-[#8C7B72] hover:text-[#D64545] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.productVariantId}
                      className="p-3.5 rounded-xl border border-[#E8DCD2] bg-white flex gap-3 shadow-xs"
                    >
                      <img
                        src={item.product.images?.[0]?.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-contain rounded-lg border border-[#E8DCD2] p-1 shrink-0 bg-[#FFFDF9]"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="text-xs font-bold text-[#2B160F] line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.productVariantId)}
                            className="text-[#8C7B72] hover:text-[#D64545]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-black text-[#3B0C04]">
                            ৳{item.variant.price * item.quantity}
                          </span>

                          <div className="flex items-center border border-[#E8DCD2] rounded-md bg-[#FFFDF9]">
                            <button
                              onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping Link */}
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#3B0C04] hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>আরও পণ্য দেখুন (Continue Shopping)</span>
                  </Link>
                </div>
              </div>

              {/* Right 1 Col: Order Summary & Checkout */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] space-y-4 shadow-xs">
                  <h3 className="text-sm font-black text-[#3B0C04] uppercase tracking-wider border-b border-[#E8DCD2] pb-3">
                    অর্ডার সামারি (Order Summary)
                  </h3>

                  {/* Coupon Form */}
                  <div>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#E8F6F1] border border-[#16834A]/30 text-xs">
                        <div className="flex items-center gap-1.5 text-[#16834A] font-bold">
                          <Tag className="w-3.5 h-3.5" />
                          <span>কুপন: {appliedCoupon.code}</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[#D64545] hover:underline text-xs font-semibold"
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
                          className="h-9 px-4 rounded-lg bg-[#FFF7EE] hover:bg-[#3B0C04] text-[#3B0C04] hover:text-[#FFC40E] border border-[#E8DCD2] text-xs font-bold transition-colors"
                        >
                          Apply
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
                      <span>সাব-টোটাল</span>
                      <span className="font-bold text-[#2B160F]">৳{cartSubtotal}</span>
                    </div>

                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-[#16834A]">
                        <span>ডিসকাউন্ট</span>
                        <span className="font-bold">-৳{cartDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span>ডেলিভারি এলাকা</span>
                      <select
                        value={deliveryZone}
                        onChange={(e) => setDeliveryZone(e.target.value as any)}
                        className="text-[11px] py-1 px-2 border border-[#E8DCD2] rounded bg-[#FFFDF9] text-[#2B160F] font-semibold"
                      >
                        <option value="INSIDE_DHAKA">ঢাকা সিটি (৳৬০)</option>
                        <option value="OUTSIDE_DHAKA">ঢাকার বাইরে (৳১২০)</option>
                      </select>
                    </div>

                    <div className="flex justify-between">
                      <span>ডেলিভারি চার্জ</span>
                      <span className="font-bold text-[#2B160F]">৳{cartShippingFee}</span>
                    </div>

                    <div className="flex justify-between text-base font-black text-[#3B0C04] pt-3 border-t border-[#E8DCD2]">
                      <span>সর্বমোট প্রদেয়</span>
                      <span className="text-xl text-[#3B0C04]">৳{cartTotal}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <div className="pt-2">
                    <Link
                      href="/checkout"
                      className="w-full h-12 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] text-xs text-[#6B5A52] space-y-1.5">
                  <p className="font-bold text-[#3B0C04] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#16834A]" />
                    <span>১০০% নিরাপদ চেকআউট</span>
                  </p>
                  <p className="text-[11px]">
                    ক্যাশ অন ডেলিভারিতে কোনো অগ্রিম পেমেন্ট ছাড়াই অর্ডার করতে পারবেন।
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
