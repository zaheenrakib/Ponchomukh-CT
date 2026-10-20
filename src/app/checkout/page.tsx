"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import {
  Lock,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Loader2
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { language, t, formatPrice, formatNumber } = useLanguage();
  const {
    cartItems,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    deliveryZone,
    setDeliveryZone,
    appliedCoupon,
    clearCart
  } = useCart();

  // Form States
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [thana, setThana] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BKASH" | "NAGAD">("COD");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage(
        language === "bn"
          ? "আপনার কার্ট খালি। অর্ডার সম্পন্ন করতে কিছু পণ্য যোগ করুন।"
          : "Your cart is empty. Please add items before placing an order."
      );
      return;
    }

    if (!fullName.trim() || !phoneNumber.trim() || !fullAddress.trim()) {
      setErrorMessage(
        language === "bn"
          ? "অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা পূরণ করুন।"
          : "Please fill in your name, mobile number, and full delivery address."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          phone: phoneNumber.trim(),
          email: email.trim() || undefined,
          division,
          district,
          upazila: thana || undefined,
          addressLine: fullAddress.trim(),
          deliveryArea: deliveryZone,
          couponCode: appliedCoupon?.code,
          orderNotes: orderNotes || undefined,
          items: cartItems.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.variant.price,
            name: item.product.name,
            image: item.product.images?.[0]?.imageUrl,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "অর্ডার সম্পন্ন করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
      }

      const assignedOrderId = data.orderNumber || `PN${Math.floor(10000 + Math.random() * 90000)}`;

      // Save order in localStorage for instant tracking lookup
      try {
        const existingOrders = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
        const newOrder = {
          orderId: assignedOrderId,
          date: new Date().toISOString(),
          customer: {
            name: fullName.trim(),
            phone: phoneNumber.trim(),
            email: email.trim(),
            address: `${fullAddress.trim()}, ${thana ? thana + ", " : ""}${district}, ${division}`
          },
          items: cartItems.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.variant.price,
            total: item.variant.price * item.quantity,
            image: item.product.images?.[0]?.imageUrl
          })),
          subtotal: cartSubtotal,
          discount: cartDiscount,
          shippingFee: cartShippingFee,
          total: cartTotal,
          paymentMethod: paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod,
          status: "PENDING",
          timeline: [
            { status: "Order Placed", date: "আজকে", completed: true },
            { status: "Confirmed", date: "অপেক্ষমান", completed: false },
            { status: "Processing", date: "অপেক্ষমান", completed: false },
            { status: "Shipped", date: "অপেক্ষমান", completed: false },
            { status: "Out for Delivery", date: "অপেক্ষমান", completed: false },
            { status: "Delivered", date: "অপেক্ষমান", completed: false }
          ]
        };

        existingOrders.unshift(newOrder);
        localStorage.setItem("ponchomukh_all_orders", JSON.stringify(existingOrders));
      } catch (err) {
        console.warn("Failed to save local order backup:", err);
      }

      clearCart();
      setIsSubmitting(false);
      router.push(
        `/order-success?orderId=${assignedOrderId}&name=${encodeURIComponent(
          fullName.trim()
        )}&phone=${encodeURIComponent(phoneNumber.trim())}&total=${cartTotal}&method=${paymentMethod}`
      );
    } catch (err: any) {
      console.error("Order submission failed:", err);
      setErrorMessage(err.message || "অর্ডার প্রসেসিং ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      {/* Minimal Header (Distraction-Free) */}
      <header className="bg-white border-b border-[#E8DCD2] py-4">
        <div className="container-custom flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-lg">
              প
            </div>
            <span className="text-xl font-black tracking-tight text-[#3B0C04]">
              PONCHOMUKH
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="pill" className="hidden sm:inline-flex" />
            <LanguageSwitcher variant="compact" className="sm:hidden" />
            <div className="flex items-center gap-2 text-xs font-bold text-[#16834A] bg-[#E8F6F1] px-3 py-1.5 rounded-full border border-[#16834A]/30">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === "bn" ? "১০০% নিরাপদ চেকআউট" : "100% Secure Checkout"}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container-custom max-w-5xl">
          {/* Breadcrumb back */}
          <div className="mb-6">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B5A52] hover:text-[#3B0C04]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === "bn" ? "কার্ট পেজে ফিরে যান" : "Back to Cart"}</span>
            </Link>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Customer & Delivery Info (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Customer Information */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2 border-b border-[#E8DCD2] pb-3">
                    <span className="w-6 h-6 rounded-full bg-[#3B0C04] text-[#FFC40E] text-xs font-black flex items-center justify-center">
                      {formatNumber(1)}
                    </span>
                    <span>{language === "bn" ? "গ্রাহকের তথ্য (Customer Information)" : "Customer Information"}</span>
                  </h2>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        {language === "bn" ? "আপনার সম্পূর্ণ নাম" : "Full Name"} <span className="text-[#D64545]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === "bn" ? "যেমন: মোঃ সাকিব হাসান" : "e.g. John Doe"}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        {language === "bn" ? "মোবাইল নম্বর" : "Mobile Phone Number"} <span className="text-[#D64545]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={language === "bn" ? "যেমন: 017XXXXXXXX" : "e.g. 017XXXXXXXX"}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        {language === "bn" ? "ইমেইল অ্যাড্রেস (ঐচ্ছিক)" : "Email Address (Optional)"}
                      </label>
                      <input
                        type="email"
                        placeholder={language === "bn" ? "যেমন: example@gmail.com" : "e.g. example@gmail.com"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Address */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2 border-b border-[#E8DCD2] pb-3">
                    <span className="w-6 h-6 rounded-full bg-[#3B0C04] text-[#FFC40E] text-xs font-black flex items-center justify-center">
                      {formatNumber(2)}
                    </span>
                    <span>{language === "bn" ? "ডেলিভারি ঠিকানা (Delivery Address)" : "Delivery Address"}</span>
                  </h2>

                  <div className="space-y-3 text-xs">
                    {/* Delivery Zone Selection */}
                    <div>
                      <label className="block font-bold text-[#2B160F] mb-2">
                        {language === "bn" ? "ডেলিভারি এলাকা নির্বাচন করুন:" : "Select Delivery Zone:"} <span className="text-[#D64545]">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`p-3 rounded-xl border flex flex-col cursor-pointer transition-all ${
                            deliveryZone === "INSIDE_DHAKA"
                              ? "bg-[#FFF7EE] border-[#3B0C04] ring-1 ring-[#3B0C04]"
                              : "bg-[#FFFDF9] border-[#E8DCD2] hover:border-[#3B0C04]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#3B0C04]">
                              {language === "bn" ? "ঢাকা সিটির ভেতর" : "Inside Dhaka City"}
                            </span>
                            <input
                              type="radio"
                              name="zone"
                              checked={deliveryZone === "INSIDE_DHAKA"}
                              onChange={() => setDeliveryZone("INSIDE_DHAKA")}
                              className="text-[#3B0C04] focus:ring-[#3B0C04]"
                            />
                          </div>
                          <span className="text-xs font-black text-[#2B160F]">
                            {language === "bn" ? `চার্জ ${formatPrice(60)}` : `Fee ${formatPrice(60)}`}
                          </span>
                          <span className="text-[10px] text-[#8C7B72]">
                            {language === "bn" ? "২৪-৪৮ ঘণ্টার মধ্যে" : "Within 24-48 Hours"}
                          </span>
                        </label>

                        <label
                          className={`p-3 rounded-xl border flex flex-col cursor-pointer transition-all ${
                            deliveryZone === "OUTSIDE_DHAKA"
                              ? "bg-[#FFF7EE] border-[#3B0C04] ring-1 ring-[#3B0C04]"
                              : "bg-[#FFFDF9] border-[#E8DCD2] hover:border-[#3B0C04]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#3B0C04]">
                              {language === "bn" ? "ঢাকার বাইরে" : "Outside Dhaka"}
                            </span>
                            <input
                              type="radio"
                              name="zone"
                              checked={deliveryZone === "OUTSIDE_DHAKA"}
                              onChange={() => setDeliveryZone("OUTSIDE_DHAKA")}
                              className="text-[#3B0C04] focus:ring-[#3B0C04]"
                            />
                          </div>
                          <span className="text-xs font-black text-[#2B160F]">
                            {language === "bn" ? `চার্জ ${formatPrice(120)}` : `Fee ${formatPrice(120)}`}
                          </span>
                          <span className="text-[10px] text-[#8C7B72]">
                            {language === "bn" ? "২-৩ কার্যদিবসের মধ্যে" : "Within 2-3 Work Days"}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#2B160F] mb-1">
                          {language === "bn" ? "বিভাগ (Division):" : "Division:"}
                        </label>
                        <select
                          value={division}
                          onChange={(e) => setDivision(e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold"
                        >
                          <option value="Dhaka">{language === "bn" ? "ঢাকা (Dhaka)" : "Dhaka"}</option>
                          <option value="Chattogram">{language === "bn" ? "চট্টগ্রাম (Chattogram)" : "Chattogram"}</option>
                          <option value="Rajshahi">{language === "bn" ? "রাজশাহী (Rajshahi)" : "Rajshahi"}</option>
                          <option value="Khulna">{language === "bn" ? "খুলনা (Khulna)" : "Khulna"}</option>
                          <option value="Sylhet">{language === "bn" ? "সিলেট (Sylhet)" : "Sylhet"}</option>
                          <option value="Barishal">{language === "bn" ? "বরিশাল (Barishal)" : "Barishal"}</option>
                          <option value="Rangpur">{language === "bn" ? "রংপুর (Rangpur)" : "Rangpur"}</option>
                          <option value="Mymensingh">{language === "bn" ? "ময়মনসিংহ (Mymensingh)" : "Mymensingh"}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#2B160F] mb-1">
                          {language === "bn" ? "জেলা (District):" : "District:"}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={language === "bn" ? "যেমন: ঢাকা / গাজীপুর" : "e.g. Dhaka / Gazipur"}
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        {language === "bn" ? "থানা / উপজেলা:" : "Thana / Upazila:"}
                      </label>
                      <input
                        type="text"
                        placeholder={language === "bn" ? "যেমন: ধানমন্ডি / মিরপুর" : "e.g. Dhanmondi / Mirpur"}
                        value={thana}
                        onChange={(e) => setThana(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        {language === "bn" ? "সম্পূর্ণ ডেলিভারি ঠিকানা" : "Full Delivery Address"} <span className="text-[#D64545]">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder={
                          language === "bn"
                            ? "বাড়ি নম্বর, রোড নম্বর, এলাকা বা ল্যান্ডমার্ক..."
                            : "House number, street address, area or landmark..."
                        }
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        className="w-full p-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        {language === "bn" ? "অর্ডার সম্পর্কিত বিশেষ নোট (ঐচ্ছিক)" : "Order Notes (Optional)"}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          language === "bn"
                            ? "যেমন: বিকেলে ডেলিভারি করবেন বা কল দিয়ে আসবেন..."
                            : "e.g. Please deliver in the afternoon or call upon arrival..."
                        }
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2 border-b border-[#E8DCD2] pb-3">
                    <span className="w-6 h-6 rounded-full bg-[#3B0C04] text-[#FFC40E] text-xs font-black flex items-center justify-center">
                      {formatNumber(3)}
                    </span>
                    <span>{language === "bn" ? "মূল্য পরিশোধের পদ্ধতি (Payment Method)" : "Payment Method"}</span>
                  </h2>

                  <div className="space-y-2.5 text-xs">
                    <label
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === "COD"
                          ? "bg-[#FFF7EE] border-[#3B0C04] ring-1 ring-[#3B0C04]"
                          : "bg-white border-[#E8DCD2]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-[#3B0C04]" />
                        <div>
                          <p className="font-bold text-[#2B160F]">
                            {language === "bn" ? "ক্যাশ অন ডেলিভারি (Cash on Delivery)" : "Cash on Delivery (COD)"}
                          </p>
                          <p className="text-[11px] text-[#6B5A52]">
                            {language === "bn" ? "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন" : "Pay with cash when your product arrives"}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="text-[#3B0C04] focus:ring-[#3B0C04]"
                      />
                    </label>

                    <label
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all opacity-80 ${
                        paymentMethod === "BKASH"
                          ? "bg-[#FFF7EE] border-[#3B0C04]"
                          : "bg-white border-[#E8DCD2]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#D12053] text-white font-bold text-[10px] flex items-center justify-center">
                          b
                        </span>
                        <div>
                          <p className="font-bold text-[#2B160F]">
                            {language === "bn" ? "bKash (বিকাশ অনলাইন পেমেন্ট)" : "bKash Online Payment"}
                          </p>
                          <p className="text-[11px] text-[#6B5A52]">
                            {language === "bn" ? "পেমেন্ট গেটওয়ে ইন্টিগ্রেশন শীঘ্রই আসছে" : "Payment gateway integration coming soon"}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "BKASH"}
                        onChange={() => setPaymentMethod("BKASH")}
                        className="text-[#3B0C04]"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Place Order (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4 sticky top-24">
                  <h3 className="text-base font-black text-[#3B0C04] border-b border-[#E8DCD2] pb-3">
                    {language === "bn"
                      ? `অর্ডার সামারি (${formatNumber(cartItems.reduce((acc, i) => acc + i.quantity, 0))} আইটেম)`
                      : `Order Summary (${cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)`}
                  </h3>

                  {/* Cart Item Preview */}
                  <div className="divide-y divide-[#E8DCD2]/60 max-h-60 overflow-y-auto pr-1">
                    {cartItems.map((item) => {
                      const displayName = (language === "en" && item.product.nameEn) ? item.product.nameEn : item.product.name;
                      return (
                        <div key={item.productVariantId} className="py-2.5 flex items-center gap-3">
                          <img
                            src={item.product.images?.[0]?.imageUrl}
                            alt={displayName}
                            className="w-11 h-11 object-contain rounded-md border border-[#E8DCD2] p-0.5 bg-white shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#2B160F] truncate">{displayName}</p>
                            <p className="text-[11px] text-[#8C7B72]">
                              {language === "bn"
                                ? `পরিমাণ: ${formatNumber(item.quantity)} × ${formatPrice(item.variant.price)}`
                                : `Qty: ${item.quantity} × ${formatPrice(item.variant.price)}`}
                            </p>
                          </div>
                          <span className="text-xs font-black text-[#3B0C04] shrink-0">
                            {formatPrice(item.variant.price * item.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price Calculations */}
                  <div className="space-y-2 text-xs text-[#6B5A52] border-t border-[#E8DCD2] pt-3">
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

                    <div className="flex justify-between">
                      <span>
                        {t("cart.shipping")} ({deliveryZone === "INSIDE_DHAKA" ? (language === "bn" ? "ঢাকা" : "Dhaka") : (language === "bn" ? "বাইরে" : "Outside")})
                      </span>
                      <span className="font-bold text-[#2B160F]">{formatPrice(cartShippingFee)}</span>
                    </div>

                    <div className="flex justify-between text-base font-black text-[#3B0C04] pt-3 border-t border-[#E8DCD2]">
                      <span>{t("cart.total")}</span>
                      <span className="text-xl font-black text-[#3B0C04]">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-[#D64545]/10 border border-[#D64545] text-xs font-bold text-[#D64545]">
                      {errorMessage}
                    </div>
                  )}

                  {/* Place Order CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || cartItems.length === 0}
                      className="w-full h-13 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-black text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{language === "bn" ? "অর্ডার প্রসেসিং হচ্ছে..." : "Processing Order..."}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>{language === "bn" ? "অর্ডার কনফার্ম করুন (Place Order)" : "Confirm & Place Order"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-[#8C7B72]">
                    {language === "bn"
                      ? "অর্ডার প্লেস করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে সম্মত হচ্ছেন।"
                      : "By placing this order, you agree to our Terms and Conditions."}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
