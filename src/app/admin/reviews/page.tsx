"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, XCircle, Trash2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([
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
  ]);

  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r)));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r)));
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
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
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DCD2] pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "ALL" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          সকল রিভিউ ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "PENDING" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          অপেক্ষমান ({reviews.filter((r) => r.status === "PENDING").length})
        </button>
        <button
          onClick={() => setActiveTab("APPROVED")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "APPROVED" ? "bg-[#3B0C04] text-[#FFC40E]" : "text-[#2B160F] hover:bg-[#FFF7EE]"
          }`}
        >
          অনুমোদিত ({reviews.filter((r) => r.status === "APPROVED").length})
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="flex text-[#FFC40E]">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[#2B160F]">{r.customer}</span>
                <span className="text-[#8C7B72]">• {r.date}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    r.status === "APPROVED"
                      ? "bg-[#E8F6F1] text-[#16834A]"
                      : r.status === "PENDING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-[#D64545]/10 text-[#D64545]"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <p className="font-semibold text-[#3B0C04]">{r.product}</p>
              <p className="text-[#6B5A52] leading-relaxed italic">&ldquo;{r.comment}&rdquo;</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {r.status !== "APPROVED" && (
                <button
                  onClick={() => handleApprove(r.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#E8F6F1] text-[#16834A] font-bold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>অনুমোদন দিন</span>
                </button>
              )}
              {r.status !== "REJECTED" && (
                <button
                  onClick={() => handleReject(r.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#D64545]/10 text-[#D64545] font-bold flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>বাতিল</span>
                </button>
              )}
              <button
                onClick={() => handleDelete(r.id)}
                className="p-1.5 rounded-md hover:bg-[#D64545]/10 text-[#8C7B72] hover:text-[#D64545]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
