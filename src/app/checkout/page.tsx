"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { useCart, CartProvider } from "@/context/cart-context";
import { Truck, CreditCard, ChevronRight, Check } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const { cartItems, cartSubtotal, cartDiscount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "",
    addressLine: "",
    deliveryArea: "INSIDE_DHAKA",
    orderNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const shippingFee = formData.deliveryArea === "INSIDE_DHAKA" ? 60 : 120;
  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + shippingFee);

  const formatBDT = (value: number) => {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.addressLine) {
      setErrorMsg("Please fill in your Name, Phone Number, and Full Address.");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        ...formData,
        items: cartItems.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          price: Number(item.variant.price),
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        router.push(`/order-success/${data.orderNumber}`);
      } else {
        setErrorMsg(data.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setErrorMsg("Something went wrong. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-left">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold mb-6">
          <Link href="/" className="hover:text-[#3B0C04]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/cart" className="hover:text-[#3B0C04]">Cart</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#3B0C04] font-bold">Checkout</span>
        </div>

        <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04] dark:text-white mb-8">
          Checkout Information
        </h1>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Contact */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-[#E8DCD2] space-y-4">
              <h2 className="font-sans font-black text-base text-[#3B0C04] dark:text-white border-b border-zinc-100 pb-2">
                1. Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Tanvir Ahmed"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/40 text-xs font-semibold outline-none focus:border-[#3B0C04]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="01700000000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/40 text-xs font-semibold outline-none focus:border-[#3B0C04]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/40 text-xs font-semibold outline-none focus:border-[#3B0C04]"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-[#E8DCD2] space-y-4">
              <h2 className="font-sans font-black text-base text-[#3B0C04] dark:text-white border-b border-zinc-100 pb-2">
                2. Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">Division</label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/40 text-xs font-bold outline-none"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="e.g. Dhaka"
                    className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/40 text-xs font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">Upazila / Thana</label>
                  <input
                    type="text"
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleInputChange}
                    placeholder="e.g. Dhanmondi"
                    className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/40 text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1">Full Address *</label>
                <textarea
                  name="addressLine"
                  rows={2}
                  placeholder="House No, Road No, Area details..."
                  value={formData.addressLine}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE]/40 text-xs font-semibold outline-none focus:border-[#3B0C04]"
                />
              </div>
            </div>

            {/* Delivery Method Selector */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-[#E8DCD2] space-y-4">
              <h2 className="font-sans font-black text-base text-[#3B0C04] dark:text-white border-b border-zinc-100 pb-2">
                3. Delivery Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setFormData((p) => ({ ...p, deliveryArea: "INSIDE_DHAKA" }))}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    formData.deliveryArea === "INSIDE_DHAKA"
                      ? "border-[#3B0C04] bg-[#FFF7EE]"
                      : "border-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-[#3B0C04]" />
                    <div>
                      <h4 className="font-bold text-xs text-[#3B0C04]">Inside Dhaka</h4>
                      <p className="text-[10px] text-zinc-500">Delivery in 24 - 48 Hours</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#3B0C04]">৳60</span>
                </label>

                <label
                  onClick={() => setFormData((p) => ({ ...p, deliveryArea: "OUTSIDE_DHAKA" }))}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    formData.deliveryArea === "OUTSIDE_DHAKA"
                      ? "border-[#3B0C04] bg-[#FFF7EE]"
                      : "border-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-[#3B0C04]" />
                    <div>
                      <h4 className="font-bold text-xs text-[#3B0C04]">Outside Dhaka</h4>
                      <p className="text-[10px] text-zinc-500">Delivery in 2 - 4 Days</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#3B0C04]">৳120</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-[#E8DCD2] space-y-4">
              <h2 className="font-sans font-black text-base text-[#3B0C04] dark:text-white border-b border-zinc-100 pb-2">
                4. Payment Method
              </h2>

              <div className="p-4 rounded-xl border-2 border-[#3B0C04] bg-[#FFF7EE] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[#3B0C04]" />
                  <div>
                    <h4 className="font-bold text-xs text-[#3B0C04]">Cash on Delivery (COD)</h4>
                    <p className="text-[10px] text-zinc-600">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।</p>
                  </div>
                </div>
                <Check className="h-5 w-5 text-[#3B0C04]" />
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-[#E8DCD2] space-y-4 sticky top-24">
              <h2 className="font-sans font-black text-base text-[#3B0C04] dark:text-white border-b border-zinc-100 pb-2">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.productVariantId} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-400">{item.quantity}x</span>
                      <span className="font-bold text-zinc-800 line-clamp-1">{item.product.name}</span>
                    </div>
                    <span className="font-bold text-[#3B0C04]">{formatBDT(Number(item.variant.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 pt-4 border-t border-zinc-150 text-xs font-semibold text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-800">{formatBDT(cartSubtotal)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Discount</span>
                    <span>-{formatBDT(cartDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-zinc-800">{formatBDT(shippingFee)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#E8DCD2] text-base font-black text-[#3B0C04]">
                  <span>Total Payable</span>
                  <span className="text-lg text-rose-600">{formatBDT(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-white font-black text-sm transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-[10px] text-center text-zinc-400 font-medium">
                🔒 100% Safe & Secure Cash on Delivery Order
              </p>
            </div>
          </div>

        </form>

      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}
