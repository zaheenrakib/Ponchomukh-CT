"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Download, FileSpreadsheet, ArrowRight } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  return (
    <div className="space-y-8 text-left text-zinc-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04]">
            অ্যানালিটিক্স ও সেলস ইনসাইটস (Analytics & Insights)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            স্টোর ভিজিটর, কনভার্সন রেট এবং রেভিনিউ অ্যানালিটিক্স
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>রিপোর্ট হাব ও ডাউনলোড (CSV)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <span className="text-xs text-zinc-400 font-bold block uppercase">Conversion Rate</span>
          <h3 className="font-sans font-black text-2xl text-[#3B0C04]">3.24%</h3>
          <span className="text-[10px] text-emerald-600 font-bold">↑ +0.4% from last period</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <span className="text-xs text-zinc-400 font-bold block uppercase">Average Order Value</span>
          <h3 className="font-sans font-black text-2xl text-[#3B0C04]">৳2,450</h3>
          <span className="text-[10px] text-emerald-600 font-bold">↑ +৳120 from last period</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
          <span className="text-xs text-zinc-400 font-bold block uppercase">Store Sessions</span>
          <h3 className="font-sans font-black text-2xl text-[#3B0C04]">45,210</h3>
          <span className="text-[10px] text-rose-500 font-bold">↓ -2.5% from last period</span>
        </div>
      </div>

      {/* Main Performance Chart */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
        <h3 className="font-sans font-black text-base text-zinc-900">Traffic & Acquisition</h3>
        
        <div className="h-64 relative w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B0C04" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B0C04" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,120 Q100,50 200,90 T400,20 T600,110 T800,50 L800,150 L0,150 Z"
              fill="url(#analyticsGradient)"
            />
            <path
              d="M0,120 Q100,50 200,90 T400,20 T600,110 T800,50"
              fill="none"
              stroke="#3B0C04"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex justify-between text-[10px] font-black text-zinc-400 pt-3">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
      </div>

    </div>
  );
}
