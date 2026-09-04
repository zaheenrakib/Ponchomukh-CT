"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Footer } from "@/components/footer";
import {
  Lock,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Loader2
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    deliveryZone,
    setDeliveryZone,
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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage("আপনার কার্ট খালি। অর্ডার সম্পন্ন করতে কিছু পণ্য যোগ করুন।");
      return;
    }

    if (!fullName.trim() || !phoneNumber.trim() || !fullAddress.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা পূরণ করুন।");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // Generate Human-Readable Order ID (e.g. PN10025)
    const randomOrderNumber = `PN${Math.floor(10000 + Math.random() * 90000)}`;

    // Store in recent orders for Order Tracking lookup demo
    try {
      const existingOrders = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
      const newOrder = {
        orderId: randomOrderNumber,
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
      console.error("Failed to save order to localStorage", err);
    }

    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      router.push(
        `/order-success?orderId=${randomOrderNumber}&name=${encodeURIComponent(
          fullName.trim()
        )}&phone=${encodeURIComponent(phoneNumber.trim())}&total=${cartTotal}&method=${paymentMethod}`
      );
    }, 1200);
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

          <div className="flex items-center gap-2 text-xs font-bold text-[#16834A] bg-[#E8F6F1] px-3 py-1.5 rounded-full border border-[#16834A]/30">
            <Lock className="w-3.5 h-3.5" />
            <span>১০০% নিরাপদ চেকআউট</span>
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
              <span>কার্ট পেজে ফিরে যান</span>
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
                      ১
                    </span>
                    <span>গ্রাহকের তথ্য (Customer Information)</span>
                  </h2>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        আপনার সম্পূর্ণ নাম <span className="text-[#D64545]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: মোঃ সাকিব হাসান"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        মোবাইল নম্বর <span className="text-[#D64545]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="যেমন: 017XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs text-[#2B160F] focus:outline-none focus:border-[#3B0C04]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        ইমেইল অ্যাড্রেস (ঐচ্ছিক)
                      </label>
                      <input
                        type="email"
                        placeholder="যেমন: example@gmail.com"
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
                      ২
                    </span>
                    <span>ডেলিভারি ঠিকানা (Delivery Address)</span>
                  </h2>

                  <div className="space-y-3 text-xs">
                    {/* Delivery Zone Selection */}
                    <div>
                      <label className="block font-bold text-[#2B160F] mb-2">
                        ডেলিভারি এলাকা নির্বাচন করুন: <span className="text-[#D64545]">*</span>
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
                            <span className="font-bold text-[#3B0C04]">ঢাকা সিটির ভেতর</span>
                            <input
                              type="radio"
                              name="zone"
                              checked={deliveryZone === "INSIDE_DHAKA"}
                              onChange={() => setDeliveryZone("INSIDE_DHAKA")}
                              className="text-[#3B0C04] focus:ring-[#3B0C04]"
                            />
                          </div>
                          <span className="text-xs font-black text-[#2B160F]">চার্জ ৳৬০</span>
                          <span className="text-[10px] text-[#8C7B72]">২৪-৪৮ ঘণ্টার মধ্যে</span>
                        </label>

                        <label
                          className={`p-3 rounded-xl border flex flex-col cursor-pointer transition-all ${
                            deliveryZone === "OUTSIDE_DHAKA"
                              ? "bg-[#FFF7EE] border-[#3B0C04] ring-1 ring-[#3B0C04]"
                              : "bg-[#FFFDF9] border-[#E8DCD2] hover:border-[#3B0C04]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#3B0C04]">ঢাকার বাইরে</span>
                            <input
                              type="radio"
                              name="zone"
                              checked={deliveryZone === "OUTSIDE_DHAKA"}
                              onChange={() => setDeliveryZone("OUTSIDE_DHAKA")}
                              className="text-[#3B0C04] focus:ring-[#3B0C04]"
                            />
                          </div>
                          <span className="text-xs font-black text-[#2B160F]">চার্জ ৳১২০</span>
                          <span className="text-[10px] text-[#8C7B72]">২-৩ কার্যদিবসের মধ্যে</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#2B160F] mb-1">বিভাগ (Division):</label>
                        <select
                          value={division}
                          onChange={(e) => setDivision(e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold"
                        >
                          <option value="Dhaka">ঢাকা (Dhaka)</option>
                          <option value="Chattogram">চট্টগ্রাম (Chattogram)</option>
                          <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                          <option value="Khulna">খুলনা (Khulna)</option>
                          <option value="Sylhet">সিলেট (Sylhet)</option>
                          <option value="Barishal">বরিশাল (Barishal)</option>
                          <option value="Rangpur">রংপুর (Rangpur)</option>
                          <option value="Mymensingh">ময়মনসিংহ (Mymensingh)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#2B160F] mb-1">জেলা (District):</label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: ঢাকা / গাজীপুর"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">থানা / উপজেলা:</label>
                      <input
                        type="text"
                        placeholder="যেমন: ধানমন্ডি / মিরপুর"
                        value={thana}
                        onChange={(e) => setThana(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2B160F] mb-1">
                        সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-[#D64545]">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="বাড়ি নম্বর, রোড নম্বর, এলাকা বা ল্যান্ডমার্ক..."
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        className="w-full p-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-[#3B0C04] flex items-center gap-2 border-b border-[#E8DCD2] pb-3">
                    <span className="w-6 h-6 rounded-full bg-[#3B0C04] text-[#FFC40E] text-xs font-black flex items-center justify-center">
                      ৩
                    </span>
                    <span>মূল্য পরিশোধের পদ্ধতি (Payment Method)</span>
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
                          <p className="font-bold text-[#2B160F]">ক্যাশ অন ডেলিভারি (Cash on Delivery)</p>
                          <p className="text-[11px] text-[#6B5A52]">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</p>
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
                          <p className="font-bold text-[#2B160F]">bKash (বিকাশ অনলাইন পেমেন্ট)</p>
                          <p className="text-[11px] text-[#6B5A52]">পেমেন্ট গেটওয়ে ইন্টিগ্রেশন শীঘ্রই আসছে</p>
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
                    অর্ডার সামারি ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} আইটেম)
                  </h3>

                  {/* Cart Item Preview */}
                  <div className="divide-y divide-[#E8DCD2]/60 max-h-60 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.productVariantId} className="py-2.5 flex items-center gap-3">
                        <img
                          src={item.product.images?.[0]?.imageUrl}
                          alt=""
                          className="w-11 h-11 object-contain rounded-md border border-[#E8DCD2] p-0.5 bg-white shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#2B160F] truncate">{item.product.name}</p>
                          <p className="text-[11px] text-[#8C7B72]">পরিমাণ: {item.quantity} × ৳{item.variant.price}</p>
                        </div>
                        <span className="text-xs font-black text-[#3B0C04] shrink-0">
                          ৳{item.variant.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price Calculations */}
                  <div className="space-y-2 text-xs text-[#6B5A52] border-t border-[#E8DCD2] pt-3">
                    <div className="flex justify-between">
                      <span>সাব-টোটাল</span>
                      <span className="font-bold text-[#2B160F]">৳{cartSubtotal}</span>
                    </div>

                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-[#16834A]">
                        <span>ডিসকাউন্ট ছাড়</span>
                        <span className="font-bold">-৳{cartDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>ডেলিভারি চার্জ ({deliveryZone === "INSIDE_DHAKA" ? "ঢাকা" : "বাইরে"})</span>
                      <span className="font-bold text-[#2B160F]">৳{cartShippingFee}</span>
                    </div>

                    <div className="flex justify-between text-base font-black text-[#3B0C04] pt-3 border-t border-[#E8DCD2]">
                      <span>সর্বমোট প্রদেয় বিল</span>
                      <span className="text-xl font-black text-[#3B0C04]">৳{cartTotal}</span>
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
                          <span>অর্ডার প্রসেসিং হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>অর্ডার কনফার্ম করুন (Place Order)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-[#8C7B72]">
                    অর্ডার প্লেস করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে সম্মত হচ্ছেন।
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
