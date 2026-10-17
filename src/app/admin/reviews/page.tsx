"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, XCircle, Trash2, RefreshCw } from "lucide-react";

interface ReviewItem {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  date: string;
}

const fallbackReviews: ReviewItem[] = [
  {
    id: "rev-1",
    customer: "তানভীর আহমেদ",
    product: "Sonifer SF-350 Portable Rechargeable Juicer & Blender",
    rating: 5,
    comment: "প্রোডাক্ট কোয়ালিটি অসাধারণ! অর্ডার করার পরদিন ঢাকায় হোম ডেলিভারি পেয়েছি। খুব সন্তুষ্ট।",
    status: "APPROVED",
    date: "০৪ সেপ্টেম্বর, ২০২৬"
  },
  {
    id: "rev-2",
    customer: "সুমাইয়া আক্তার",
    product: "Joyroom JR-T03S Pro ANC True Wireless Earbuds",
    rating: 5,
    comment: "দাম অনুযায়ী খুবই ভালো পণ্য। একদম ছবির মতোই পেয়েছি। ক্যাশ অন ডেলিভারিতে চেক করে নিতে পেরেছি।",
    status: "APPROVED",
    date: "০৩ সেপ্টেম্বর, ২০২৬"
  },
  {
    id: "rev-3",
    customer: "সাকিব মাহমুদ",
    product: "Kensen 5-in-1 Electric Grooming Trimmer Kit",
    rating: 4,
    comment: "ব্লেড খুব শার্প এবং চার্জিং ব্যাকআপও বেশ ভালো। প্যাকেজিং আরও সুন্দর হতে পারত।",
    status: "PENDING",
    date: "০৪ সেপ্টেম্বর, ২০২৬"
  }
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(fallbackReviews);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      }
    } catch (err) {
      console.warn("Could not load reviews from DB, using fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" as const } : r))
    );
    try {
      await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "APPROVED" }),
      });
    } catch (err) {
      console.warn("Could not approve review in DB:", err);
    }
  };

  const handleReject = async (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" as const } : r))
    );
    try {
      await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "REJECTED" }),
      });
    } catch (err) {
      console.warn("Could not reject review in DB:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই রিভিউটি মুছে ফেলতে চান?")) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Could not delete review from DB:", err);
    }
  };

  const filtered = reviews.filter((r) => activeTab === "ALL" || r.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            গ্রাহক রিভিউ নিয়ন্ত্রণ (Customer Reviews)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            পণ্যসমূহের রিভিউ পর্যবেক্ষণ, অনুমোদন ও ফিল্টার করুন
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DCD2] pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "ALL"
              ? "bg-[#3B0C04] text-[#FFC40E]"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          সব রিভিউ ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "PENDING"
              ? "bg-[#3B0C04] text-[#FFC40E]"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          অপেক্ষমাণ ({reviews.filter((r) => r.status === "PENDING").length})
        </button>
        <button
          onClick={() => setActiveTab("APPROVED")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "APPROVED"
              ? "bg-[#3B0C04] text-[#FFC40E]"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          অনুমোদিত ({reviews.filter((r) => r.status === "APPROVED").length})
        </button>
        <button
          onClick={() => setActiveTab("REJECTED")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "REJECTED"
              ? "bg-[#3B0C04] text-[#FFC40E]"
              : "text-[#6B5A52] hover:bg-[#FFF7EE]"
          }`}
        >
          বাতিলকৃত ({reviews.filter((r) => r.status === "REJECTED").length})
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#2B160F]">{rev.customer}</span>
                <span className="text-[11px] text-[#8C7B72]">• {rev.date}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rev.status === "APPROVED"
                      ? "bg-[#E8F6F1] text-[#16834A]"
                      : rev.status === "REJECTED"
                      ? "bg-[#D64545]/10 text-[#D64545]"
                      : "bg-[#FFF7EE] text-[#3B0C04] border border-[#E8DCD2]"
                  }`}
                >
                  {rev.status}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[#FFC40E]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating ? "fill-[#FFC40E]" : "text-[#E8DCD2]"
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-[#3B0C04] ml-1">{rev.product}</span>
              </div>

              <p className="text-xs text-[#6B5A52] leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {rev.status !== "APPROVED" && (
                <button
                  onClick={() => handleApprove(rev.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E8F6F1] hover:bg-[#16834A] hover:text-white text-[#16834A] text-xs font-bold transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>অনুমোদন</span>
                </button>
              )}
              {rev.status !== "REJECTED" && (
                <button
                  onClick={() => handleReject(rev.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#D64545]/10 hover:bg-[#D64545] hover:text-white text-[#D64545] text-xs font-bold transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>বাতিল</span>
                </button>
              )}
              <button
                onClick={() => handleDelete(rev.id)}
                className="p-1.5 rounded-lg text-[#8C7B72] hover:text-[#D64545] hover:bg-[#D64545]/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white border border-[#E8DCD2] text-xs text-[#8C7B72]">
            কোনো রিভিউ পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
