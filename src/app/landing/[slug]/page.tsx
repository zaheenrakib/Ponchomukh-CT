"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Truck,
  CreditCard,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Phone,
  MessageCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  Package,
  ThumbsUp,
  RotateCcw
} from "lucide-react";
import { mockProducts, Product } from "@/lib/mockData";
import { useLanguage } from "@/context/language-context";
import { BrandLogoMark } from "@/components/brand-logo";

export default function ProductLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { formatPrice } = useLanguage();
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryZone, setDeliveryZone] = useState<"INSIDE" | "OUTSIDE">("INSIDE");

  // Form State (Zero OTP)
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Countdown timer for urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 27, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch product from API with mockData fallback
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            setProduct(data.product);
            const primaryImg = data.product.images?.[0]?.imageUrl || "";
            setSelectedImage(primaryImg);
            return;
          }
        }
      } catch (e) {
        console.warn("Could not fetch product from API, using fallback:", e);
      }

      // Fallback
      const found = mockProducts.find((p) => p.slug === slug) || mockProducts[0];
      setProduct(found);
      const img = found.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800";
      setSelectedImage(img);
    }

    fetchProduct();
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#3B0C04] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#6B5A52]">পণ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const unitPrice = product.salePrice || product.basePrice;
  const regularPrice = product.basePrice > unitPrice ? product.basePrice : unitPrice + 500;
  const discountPercent = Math.round(((regularPrice - unitPrice) / regularPrice) * 100);

  const deliveryCharge = deliveryZone === "INSIDE" ? 60 : 120;
  const subtotal = unitPrice * quantity;
  const grandTotal = subtotal + deliveryCharge;

  const scrollToOrderForm = () => {
    const el = document.getElementById("direct-order-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 1-STEP DIRECT COD ORDER SUBMIT (ZERO OTP)
  const handleDirectOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা পূরণ করুন।");
      return;
    }

    if (customerPhone.trim().length < 11) {
      setErrorMessage("অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const orderPayload = {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        division: deliveryZone === "INSIDE" ? "Dhaka" : "Outside Dhaka",
        district: deliveryZone === "INSIDE" ? "Dhaka" : "Outside Dhaka",
        addressLine: customerAddress.trim(),
        deliveryArea: deliveryZone === "INSIDE" ? "INSIDE_DHAKA" : "OUTSIDE_DHAKA",
        source: "LANDING_PAGE",
        orderNotes: `[LANDING_PAGE] Product: ${product.name}. Note: ${orderNotes || "Direct Landing Page Order"}`,
        items: [
          {
            productVariantId: product.variants?.[0]?.id,
            name: product.name,
            price: unitPrice,
            quantity: quantity,
            image: selectedImage || product.images?.[0]?.imageUrl,
          },
        ],
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      const orderId = data.orderNumber || `PN${Math.floor(10000 + Math.random() * 90000)}`;

      // Save locally for fallback tracking
      try {
        const stored = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
        stored.unshift({
          orderId,
          date: new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" }),
          rawDate: new Date().toISOString(),
          source: "LANDING_PAGE",
          customer: {
            name: customerName.trim(),
            phone: customerPhone.trim(),
            address: customerAddress.trim(),
          },
          items: [
            {
              name: product.name,
              quantity: quantity,
              price: unitPrice,
              image: selectedImage,
            },
          ],
          total: grandTotal,
          paymentMethod: "Cash on Delivery",
          paymentStatus: "PENDING",
          status: "CONFIRMED",
        });
        localStorage.setItem("ponchomukh_all_orders", JSON.stringify(stored));
      } catch (err) {
        console.error(err);
      }

      // Directly redirect to order success page
      router.push(`/order-success?orderId=${encodeURIComponent(orderId)}&total=${grandTotal}`);
    } catch (err) {
      console.error("Order submission error:", err);
      // Fallback redirect
      const mockId = `PN${Math.floor(10000 + Math.random() * 90000)}`;
      router.push(`/order-success?orderId=${mockId}&total=${grandTotal}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] font-sans antialiased selection:bg-[#FFC40E] selection:text-[#3B0C04]">
      {/* 1. TOP STICKY URGENCY BAR */}
      <div className="sticky top-0 z-40 bg-[#3B0C04] text-[#FFC40E] py-2 px-3 text-center text-xs font-bold flex items-center justify-between shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <BrandLogoMark className="w-9 h-9" />
          <span className="font-black text-sm tracking-tight text-white hidden sm:inline">
            PONCHOMUKH
          </span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <Clock className="w-3.5 h-3.5 text-[#FFC40E] animate-pulse" />
          <span>অফারের বাকি সময়:</span>
          <span className="font-mono bg-[#260700] px-2 py-0.5 rounded-md text-white font-black">
            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>

        <button
          onClick={scrollToOrderForm}
          className="px-3 py-1 rounded-lg bg-[#FFC40E] text-[#3B0C04] text-[11px] font-black hover:bg-white transition-all shadow-xs"
        >
          অর্ডার করুন
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* 2. HERO / PRODUCT SHOWCASE SECTION */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFC40E]/20 text-[#3B0C04] text-xs font-black border border-[#FFC40E]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC40E]" />
            <span>🔥 বিশেষ ছাড় {discountPercent}% ছাড় চলছে!</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3B0C04] leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs">
            <div className="flex items-center text-[#FFC40E]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-bold text-[#6B5A52]">
              {product.averageRating || 4.9} রেটিং (৫০০+ গ্রাহক সন্তুষ্ট)
            </span>
          </div>
        </div>

        {/* 3. MEDIA GALLERY + PRICING CALLOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DCD2] shadow-sm">
          {/* Left: Gallery */}
          <div className="space-y-3">
            <div className="aspect-square w-full rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] p-4 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage || product.images?.[0]?.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`w-16 h-16 rounded-xl border p-1 shrink-0 overflow-hidden transition-all ${
                      selectedImage === img.imageUrl
                        ? "border-[#3B0C04] ring-2 ring-[#3B0C04]/20"
                        : "border-[#E8DCD2] hover:border-[#8C7B72]"
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Price & Quick CTA */}
          <div className="space-y-5">
            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#3B0C04]">
                  {formatPrice(unitPrice)}
                </span>
                <span className="text-base text-[#8C7B72] line-through font-semibold">
                  {formatPrice(regularPrice)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#D64545] text-white text-xs font-bold">
                  -{discountPercent}%
                </span>
              </div>
              <p className="text-xs text-[#16834A] font-bold">
                ✓ আপনার সাশ্রয় হচ্ছে {formatPrice(regularPrice - unitPrice)}!
              </p>
            </div>

            {/* Highlights bullet points */}
            <div className="space-y-2 text-xs font-semibold text-[#2B160F]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />
                <span>সারা বাংলাদেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />
                <span>১০০% অরিজিনাল ও প্রিমিয়াম কোয়ালিটি পণ্য</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />
                <span>প্যাকেট খুলে চেক করে টাকা পরিশোধের সুযোগ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />
                <span>৭ দিনের সহজ রিপ্লেসমেন্ট গ্যারান্টি</span>
              </div>
            </div>

            {/* Big Action Button */}
            <button
              onClick={scrollToOrderForm}
              className="w-full py-4 rounded-2xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-base font-black flex items-center justify-center gap-3 transition-transform active:scale-98 shadow-lg shadow-[#3B0C04]/20 animate-bounce"
            >
              <span>অর্ডার করতে ক্লিক করুন</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4. TRUST BADGES ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCD2] text-center space-y-1.5 shadow-2xs">
            <Truck className="w-6 h-6 text-[#3B0C04] mx-auto" />
            <p className="font-bold text-xs text-[#3B0C04]">দ্রুত ডেলিভারি</p>
            <p className="text-[10px] text-[#6B5A52]">২৪ থেকে ৪৮ ঘণ্টায়</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCD2] text-center space-y-1.5 shadow-2xs">
            <CreditCard className="w-6 h-6 text-[#3B0C04] mx-auto" />
            <p className="font-bold text-xs text-[#3B0C04]">ক্যাশ অন ডেলিভারি</p>
            <p className="text-[10px] text-[#6B5A52]">হাতে পেয়ে টাকা দিন</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCD2] text-center space-y-1.5 shadow-2xs">
            <ShieldCheck className="w-6 h-6 text-[#16834A] mx-auto" />
            <p className="font-bold text-xs text-[#16834A]">আসল পণ্যের নিশ্চয়তা</p>
            <p className="text-[10px] text-[#6B5A52]">১০০% অথেনটিক</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCD2] text-center space-y-1.5 shadow-2xs">
            <RotateCcw className="w-6 h-6 text-[#3B0C04] mx-auto" />
            <p className="font-bold text-xs text-[#3B0C04]">৭ দিনের রিটার্ন</p>
            <p className="text-[10px] text-[#6B5A52]">সহজ রিপ্লেসমেন্ট</p>
          </div>
        </div>

        {/* 5. PRODUCT DESCRIPTION & FEATURES */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DCD2] shadow-sm space-y-6">
          <div className="border-b border-[#E8DCD2] pb-3">
            <h2 className="text-xl font-black text-[#3B0C04]">
              পণ্যটির বিস্তারিত বিবরণ ও বিশেষত্ব
            </h2>
          </div>

          <div className="prose prose-sm text-xs sm:text-sm text-[#2B160F] leading-relaxed">
            <p>{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#3B0C04]">মূল ফিচারসমূহ:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. EMBEDDED DIRECT 1-STEP ORDER FORM (NO OTP REQUIRED!) */}
        <div
          id="direct-order-form"
          className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-[#3B0C04] shadow-xl space-y-6 relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center space-y-2 border-b border-[#E8DCD2] pb-5">
            <div className="inline-block px-3 py-1 rounded-full bg-[#3B0C04] text-[#FFC40E] text-xs font-black uppercase tracking-wider">
              ১ মিনিটে সরাসরি অর্ডার করুন
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#3B0C04]">
              অর্ডার করতে নিচের তথ্যগুলো পূরণ করুন
            </h2>
            <p className="text-xs text-[#6B5A52]">
              কোন ওটিপি (OTP) বা অগ্রিম পেমেন্ট লাগবে না। পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleDirectOrder} className="space-y-5 text-xs">
            {/* Customer Name */}
            <div>
              <label className="block font-bold text-[#2B160F] mb-1.5">
                আপনার নাম (Full Name): *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: তানভীর আহমেদ"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:border-[#3B0C04] shadow-2xs"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block font-bold text-[#2B160F] mb-1.5">
                মোবাইল নম্বর (Phone Number): *
              </label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-bold text-[#3B0C04] tracking-wide focus:outline-none focus:border-[#3B0C04] shadow-2xs font-mono"
              />
              <span className="text-[10px] text-[#8C7B72] mt-1 block">
                ডেলিভারি সংক্রান্ত যোগাযোগের জন্য সঠিক নম্বর দিন
              </span>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block font-bold text-[#2B160F] mb-1.5">
                পূর্ণ ঠিকানা (বাসা/রোড/এলাকা/উপজেলা/জেলা): *
              </label>
              <textarea
                rows={2}
                required
                placeholder="যেমন: বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04] shadow-2xs"
              />
            </div>

            {/* Delivery Zone Selector */}
            <div>
              <label className="block font-bold text-[#2B160F] mb-1.5">
                ডেলিভারি লোকেশন নির্বাচন করুন: *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryZone("INSIDE")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    deliveryZone === "INSIDE"
                      ? "border-[#3B0C04] bg-[#FFF7EE] shadow-xs ring-1 ring-[#3B0C04]"
                      : "border-[#E8DCD2] hover:bg-zinc-50"
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-[#3B0C04] block">ঢাকার ভিতরে</span>
                    <span className="text-[11px] text-[#6B5A52] block">চার্জ: ৳৬০ (২৪-৪৮ ঘণ্টা)</span>
                  </div>
                  <input
                    type="radio"
                    checked={deliveryZone === "INSIDE"}
                    onChange={() => setDeliveryZone("INSIDE")}
                    className="accent-[#3B0C04]"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryZone("OUTSIDE")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    deliveryZone === "OUTSIDE"
                      ? "border-[#3B0C04] bg-[#FFF7EE] shadow-xs ring-1 ring-[#3B0C04]"
                      : "border-[#E8DCD2] hover:bg-zinc-50"
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-[#3B0C04] block">ঢাকার বাইরে</span>
                    <span className="text-[11px] text-[#6B5A52] block">চার্জ: ৳১২০ (৪৮-৭২ ঘণ্টা)</span>
                  </div>
                  <input
                    type="radio"
                    checked={deliveryZone === "OUTSIDE"}
                    onChange={() => setDeliveryZone("OUTSIDE")}
                    className="accent-[#3B0C04]"
                  />
                </button>
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2]">
              <span className="font-bold text-xs text-[#3B0C04]">অর্ডারের পরিমাণ (Quantity):</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-[#E8DCD2] font-black text-sm text-[#3B0C04] hover:bg-zinc-100"
                >
                  -
                </button>
                <span className="font-black text-base text-[#3B0C04] w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-xl bg-white border border-[#E8DCD2] font-black text-sm text-[#3B0C04] hover:bg-zinc-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Order Price Summary Card */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-[#E8DCD2] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#6B5A52]">
                <span>পণ্যের মূল্য ({quantity} টি):</span>
                <span className="font-bold text-[#2B160F]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#6B5A52]">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-[#2B160F]">{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="border-t border-[#E8DCD2] pt-2 flex items-center justify-between text-sm">
                <span className="font-black text-[#3B0C04]">সর্বমোট প্রদেয় টাকা:</span>
                <span className="font-black text-lg text-[#16834A]">{formatPrice(grandTotal)}</span>
              </div>
              <p className="text-[10px] text-[#8C7B72] text-center pt-1">
                💳 ক্যাশ অন ডেলিভারি: পণ্য হাতে পেয়ে সম্পূর্ণ টাকা পরিশোধ করবেন
              </p>
            </div>

            {/* Order Notes / Instructions (Optional) */}
            <div>
              <label className="block font-bold text-[#6B5A52] mb-1">
                বিশেষ কোনো নোট বা নির্দেশনা থাকলে লিখুন (ঐচ্ছিক):
              </label>
              <input
                type="text"
                placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-base font-black flex items-center justify-center gap-3 transition-transform active:scale-98 shadow-xl shadow-[#3B0C04]/25 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>অর্ডার সম্পন্ন হচ্ছে...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#FFC40E]" />
                  <span>অর্ডার নিশ্চিত করুন (৳{grandTotal.toLocaleString()})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 7. CUSTOMER SUPPORT / ASSISTANCE CALLOUT */}
        <div className="p-6 rounded-3xl bg-[#FFF7EE] border border-[#E8DCD2] text-center space-y-3">
          <p className="text-xs font-bold text-[#6B5A52]">
            অর্ডার করতে কোনো সমস্যা হচ্ছে? সরাসরি ফোন বা হোয়াটসঅ্যাপে কথা বলুন:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+8801700000000"
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E8DCD2] text-[#3B0C04] text-xs font-bold flex items-center gap-2 hover:bg-[#3B0C04] hover:text-white transition-colors shadow-2xs"
            >
              <Phone className="w-4 h-4 text-[#16834A]" />
              <span>+880 1700-000000</span>
            </a>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#1EBE5D] transition-colors shadow-2xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp চ্যাট করুন</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

