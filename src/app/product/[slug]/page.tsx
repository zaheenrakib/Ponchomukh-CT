"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ProductCard } from "@/components/product-card";
import { CartDrawer } from "@/components/cart-drawer";
import { mockProducts, Product, ProductReview } from "@/lib/mockData";
import { useCart } from "@/context/cart-context";
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Minus,
  Plus,
  Zap,
  MessageCircle,
  Link as LinkIcon,
  MessageSquarePlus,
  X
} from "lucide-react";
import { FacebookIcon } from "@/components/ui/social-icons";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast
  } = useCart();

  // Find product by slug
  const product = mockProducts.find((p) => p.slug === slug) || mockProducts[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "features" | "specs" | "delivery" | "return">("description");

  // Review submission modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [customReviews, setCustomReviews] = useState<ProductReview[]>(product.reviews || []);

  const isFavorited = isInWishlist(product.id);
  const activeVariant = product.variants?.[selectedVariantIndex] || {
    id: `var-${product.id}-default`,
    productId: product.id,
    sku: product.sku,
    price: product.salePrice ?? product.basePrice,
    stock: product.stock || 20,
    selectedOptions: []
  };

  const images = product.images?.length > 0
    ? product.images
    : [{ id: "def-img", productId: product.id, imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80", isPrimary: true }];

  const discountPercent = product.salePrice && product.salePrice < product.basePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, activeVariant, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, activeVariant, quantity, false);
    router.push("/checkout");
  };

  const handleShare = (platform: "facebook" | "whatsapp" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + " " + url)}`, "_blank");
    } else {
      navigator.clipboard.writeText(url);
      showToast("✓ লিংক কপি করা হয়েছে!");
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      userName: reviewName.trim(),
      rating: reviewRating,
      date: "আজকে",
      comment: reviewComment.trim(),
      verified: true
    };

    setCustomReviews((prev) => [newReview, ...prev]);
    setIsReviewModalOpen(false);
    setReviewName("");
    setReviewComment("");
    showToast("✓ আপনার রিভিউ জমা হয়েছে ও অনুমোদিত হয়েছে!");
  };

  // Related products
  const relatedProducts = mockProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-24 lg:pb-16">
        {/* Breadcrumb */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-3.5">
          <div className="container-custom">
            <div className="flex items-center gap-1.5 text-xs text-[#8C7B72] truncate">
              <Link href="/" className="hover:text-[#3B0C04]">হোম</Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <Link href={`/category/${product.category.slug}`} className="hover:text-[#3B0C04] shrink-0">
                {product.category.name}
              </Link>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-[#3B0C04] font-semibold truncate">{product.name}</span>
            </div>
          </div>
        </div>

        {/* 50/50 Desktop Product Top Section */}
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Product Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-2xl bg-white border border-[#E8DCD2] p-6 flex items-center justify-center overflow-hidden shadow-xs">
                {discountPercent && (
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-[#D64545] text-white text-xs font-bold rounded-md">
                    -{discountPercent}% OFF
                  </span>
                )}
                <img
                  src={images[selectedImageIndex]?.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 rounded-xl bg-white border p-1.5 shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? "border-[#3B0C04] ring-2 ring-[#3B0C04]"
                          : "border-[#E8DCD2] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img.imageUrl} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & SKU */}
                <div className="flex items-center justify-between text-xs text-[#8C7B72]">
                  <span>ব্র্যান্ড: <strong className="text-[#3B0C04]">{product.brand?.name || "Ponchomukh"}</strong></span>
                  <span className="font-mono">SKU: {product.sku}</span>
                </div>

                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2B160F] leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center text-[#FFC40E] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-[#2B160F]">{product.averageRating}</span>
                  <span className="text-[#8C7B72]">({customReviews.length} কাস্টমার রিভিউ)</span>
                  <span className="text-[#E8DCD2]">•</span>
                  <span className="text-[#16834A] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> স্টক এভেইলেবল ({product.stock || 20} পিস)
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#3B0C04]">
                    ৳{product.salePrice ?? product.basePrice}
                  </span>
                  {product.salePrice && product.salePrice < product.basePrice && (
                    <span className="text-base text-[#8C7B72] line-through">
                      ৳{product.basePrice}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="px-2 py-0.5 rounded-md bg-[#D64545] text-white text-xs font-bold">
                      ৳{product.basePrice - product.salePrice!} ছাড়
                    </span>
                  )}
                </div>

                {/* Short Highlights */}
                {product.shortDescription && (
                  <p className="text-xs sm:text-sm text-[#6B5A52] leading-relaxed">
                    {product.shortDescription}
                  </p>
                )}

                {/* Variants if any */}
                {product.variants && product.variants.length > 1 && (
                  <div>
                    <label className="block text-xs font-bold text-[#2B160F] mb-2">
                      কালার / ভ্যারিয়েন্ট নির্বাচন:
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.map((v, i) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariantIndex(i)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                            selectedVariantIndex === i
                              ? "bg-[#3B0C04] text-[#FFC40E] border-[#3B0C04] shadow-xs"
                              : "bg-white text-[#2B160F] border-[#E8DCD2] hover:border-[#3B0C04]"
                          }`}
                        >
                          {v.selectedOptions?.[0]?.value || `Option ${i + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-bold text-[#2B160F]">পরিমাণ:</span>
                  <div className="flex items-center border border-[#E8DCD2] rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-sm font-bold text-[#2B160F] hover:bg-[#FFF7EE]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-[#2B160F]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-sm font-bold text-[#2B160F] hover:bg-[#FFF7EE]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary CTA Buttons (Desktop) */}
                <div className="hidden sm:flex items-center gap-3 pt-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 rounded-lg bg-white hover:bg-[#FFF7EE] border-2 border-[#3B0C04] text-[#3B0C04] font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 h-12 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now (অর্ডার করুন)</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center transition-colors ${
                      isFavorited
                        ? "border-[#D64545] text-[#D64545] bg-[#D64545]/10"
                        : "border-[#E8DCD2] text-[#8C7B72] hover:text-[#D64545]"
                    }`}
                    aria-label="উইশলিস্ট"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* Social Share & Trust */}
                <div className="pt-4 border-t border-[#E8DCD2]/60 flex items-center justify-between text-xs text-[#6B5A52]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#2B160F]">শেয়ার করুন:</span>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="p-1.5 rounded-md hover:bg-[#1877F2]/10 text-[#1877F2]"
                      title="Share to Facebook"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className="p-1.5 rounded-md hover:bg-[#25D366]/10 text-[#25D366]"
                      title="Share to WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="p-1.5 rounded-md hover:bg-[#3B0C04]/10 text-[#3B0C04]"
                      title="Copy link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery & Service Summary Card */}
              <div className="p-4 rounded-xl bg-white border border-[#E8DCD2] grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#3B0C04] shrink-0" />
                  <div>
                    <p className="font-bold text-[#2B160F]">ডেলিভারি চার্জ</p>
                    <p className="text-[#8C7B72] text-[11px]">ঢাকা ৳৬০ | ঢাকার বাইরে ৳১২০</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#3B0C04] shrink-0" />
                  <div>
                    <p className="font-bold text-[#2B160F]">ক্যাশ অন ডেলিভারি</p>
                    <p className="text-[#8C7B72] text-[11px]">পণ্য দেখে টাকা দিন</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Product Information (Description, Features, Specs, Delivery, Return) */}
          <div className="mt-14 pt-8 border-t border-[#E8DCD2]">
            {/* Tab Headers */}
            <div className="flex items-center gap-2 border-b border-[#E8DCD2] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-5 py-3 text-xs md:text-sm font-bold border-b-2 shrink-0 transition-colors ${
                  activeTab === "description"
                    ? "border-[#3B0C04] text-[#3B0C04]"
                    : "border-transparent text-[#6B5A52] hover:text-[#2B160F]"
                }`}
              >
                পণ্য বিবরণ (Description)
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`px-5 py-3 text-xs md:text-sm font-bold border-b-2 shrink-0 transition-colors ${
                  activeTab === "features"
                    ? "border-[#3B0C04] text-[#3B0C04]"
                    : "border-transparent text-[#6B5A52] hover:text-[#2B160F]"
                }`}
              >
                ফিচারসমূহ (Features)
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`px-5 py-3 text-xs md:text-sm font-bold border-b-2 shrink-0 transition-colors ${
                  activeTab === "specs"
                    ? "border-[#3B0C04] text-[#3B0C04]"
                    : "border-transparent text-[#6B5A52] hover:text-[#2B160F]"
                }`}
              >
                স্পেসিফিকেশন (Specifications)
              </button>
              <button
                onClick={() => setActiveTab("delivery")}
                className={`px-5 py-3 text-xs md:text-sm font-bold border-b-2 shrink-0 transition-colors ${
                  activeTab === "delivery"
                    ? "border-[#3B0C04] text-[#3B0C04]"
                    : "border-transparent text-[#6B5A52] hover:text-[#2B160F]"
                }`}
              >
                ডেলিভারি তথ্য (Delivery Info)
              </button>
              <button
                onClick={() => setActiveTab("return")}
                className={`px-5 py-3 text-xs md:text-sm font-bold border-b-2 shrink-0 transition-colors ${
                  activeTab === "return"
                    ? "border-[#3B0C04] text-[#3B0C04]"
                    : "border-transparent text-[#6B5A52] hover:text-[#2B160F]"
                }`}
              >
                রিটার্ন পলিসি (Return Policy)
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-6 bg-white rounded-b-xl p-6 border-x border-b border-[#E8DCD2]">
              {activeTab === "description" && (
                <div className="space-y-4 text-xs sm:text-sm text-[#2B160F] leading-relaxed max-w-3xl">
                  <p>{product.description}</p>
                </div>
              )}

              {activeTab === "features" && (
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#2B160F] max-w-3xl">
                  {product.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  )) || <li>প্রোডাক্টের বিস্তারিত ফিচার শীঘ্রই আসছে।</li>}
                </ul>
              )}

              {activeTab === "specs" && (
                <div className="max-w-xl overflow-hidden rounded-xl border border-[#E8DCD2]">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <tbody className="divide-y divide-[#E8DCD2]">
                      {product.specifications?.map((spec, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-[#FFFDF9]" : "bg-white"}>
                          <td className="px-4 py-2.5 font-bold text-[#3B0C04] w-1/3">
                            {spec.label}
                          </td>
                          <td className="px-4 py-2.5 text-[#2B160F]">
                            {spec.value}
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td className="p-4 text-center text-[#8C7B72]">কোনো স্পেসিফিকেশন তথ্য নেই।</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "delivery" && (
                <div className="space-y-3 text-xs sm:text-sm text-[#2B160F] max-w-2xl leading-relaxed">
                  <p><strong>ঢাকা সিটির মধ্যে:</strong> ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়। ডেলিভারি চার্জ মাত্র ৳৬০।</p>
                  <p><strong>ঢাকার বাইরে (সমগ্র বাংলাদেশ):</strong> ২ থেকে ৩ কার্যদিবসের মধ্যে নির্ভরযোগ্য কুরিয়ারের মাধ্যমে আপনার ঠিকানায় সরাসরি হোম ডেলিভারি করা হয়। ডেলিভারি চার্জ ৳১২০।</p>
                  <p className="text-[#16834A] font-semibold">✓ ডেলিভারি ম্যানের সামনে পণ্য চেক করে মূল্য পরিশোধের সুযোগ রয়েছে।</p>
                </div>
              )}

              {activeTab === "return" && (
                <div className="space-y-3 text-xs sm:text-sm text-[#2B160F] max-w-2xl leading-relaxed">
                  <p><strong>৭ দিনের রিটার্ন ও রিপ্লেসমেন্ট গ্যারান্টি:</strong></p>
                  <p>পণ্য হাতে পাওয়ার পর যদি কোনো ত্রুটি বা সমস্যা দেখা যায়, তবে ৭ দিনের মধ্যে আমাদের কাস্টমার সাপোর্টে জানালে তাৎক্ষণিক রিপ্লেসমেন্ট প্রদান করা হবে।</p>
                  <p className="text-xs text-[#8C7B72]">শর্ত: পণ্যের আসল বক্স ও এক্সেসরিজ অক্ষত থাকতে হবে।</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-14 pt-8 border-t border-[#E8DCD2]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#2B160F]">
                  কাস্টমার রিভিউ ({customReviews.length})
                </h3>
                <p className="text-xs text-[#6B5A52] mt-0.5">
                  গড় রেটিং: {product.averageRating} / 5.0
                </p>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold hover:bg-[#260700] transition-colors"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>রিভিউ লিখুন</span>
              </button>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customReviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-xl bg-white border border-[#E8DCD2] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#FFC40E] gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#8C7B72]">{rev.date}</span>
                  </div>

                  <p className="text-xs text-[#2B160F] leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E8DCD2]/50">
                    <span className="text-xs font-bold text-[#3B0C04]">{rev.userName}</span>
                    {rev.verified && (
                      <span className="text-[10px] font-semibold text-[#16834A] bg-[#E8F6F1] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* You May Also Like / Related Products */}
          <div className="mt-16 pt-8 border-t border-[#E8DCD2]">
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-[#2B160F]">
                You May Also Like (সম্পর্কিত পণ্যসমূহ)
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        {/* REVIEW SUBMISSION MODAL */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-[#E8DCD2] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
                <h3 className="text-sm font-bold text-[#3B0C04]">আপনার মতামত / রিভিউ লিখুন</h3>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="text-[#8C7B72] hover:text-[#2B160F]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">আপনার নাম:</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ সাকিব হাসান"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] focus:outline-none focus:border-[#3B0C04]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">রেটিং নির্বাচন করুন:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setReviewRating(s)}
                        className="p-1 text-[#FFC40E]"
                      >
                        <Star className={`w-6 h-6 ${s <= reviewRating ? "fill-current" : "text-[#E8DCD2]"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">আপনার রিভিউ লিখুন:</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="পণ্যটির গুণমান ও অভিজ্ঞতা সম্পর্কে লিখুন..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-3 rounded-lg border border-[#E8DCD2] focus:outline-none focus:border-[#3B0C04]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold"
                >
                  রিভিউ সাবমিট করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MOBILE STICKY PURCHASE BAR (64px) - Non-Negotiable Blueprint Spec */}
        <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white border-t border-[#E8DCD2] shadow-2xl p-2.5 px-4 flex items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)]">
          <div>
            <span className="text-[10px] text-[#8C7B72] block">মূল্য:</span>
            <span className="text-base font-black text-[#3B0C04]">
              ৳{product.salePrice ?? product.basePrice}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-[240px]">
            <button
              onClick={handleAddToCart}
              className="flex-1 h-10 rounded-lg bg-[#FFF7EE] border border-[#3B0C04] text-[#3B0C04] text-xs font-bold flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>কার্টে নিন</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 h-10 rounded-lg bg-[#3B0C04] text-[#FFC40E] text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>অর্ডার</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
      <CartDrawer />
    </div>
  );
}
