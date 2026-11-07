"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Download, FileSpreadsheet, ArrowRight, TrendingUp, Users, ShoppingBag } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  return (
    <div className="space-y-8 text-left text-zinc-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04] flex items-center gap-2">
            <span>Store Analytics & Revenue Insights</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              Analytics Hub
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            Store traffic sessions, conversion funnel metrics, and financial growth performance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Reports Hub & CSV Downloads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[#E8DCD2] shadow-xs space-y-2">
          <span className="text-xs text-[#8C7B72] font-bold block uppercase tracking-wider">Conversion Rate</span>
          <h3 className="font-sans font-black text-2xl text-[#3B0C04]">3.24%</h3>
          <span className="text-[10px] text-emerald-600 font-bold">↑ +0.4% compared to previous cycle</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8DCD2] shadow-xs space-y-2">
          <span className="text-xs text-[#8C7B72] font-bold block uppercase tracking-wider">Average Order Value (AOV)</span>
          <h3 className="font-sans font-black text-2xl text-[#3B0C04]">৳2,450</h3>
          <span className="text-[10px] text-emerald-600 font-bold">↑ +৳120 from previous period</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8DCD2] shadow-xs space-y-2">
          <span className="text-xs text-[#8C7B72] font-bold block uppercase tracking-wider">Total Store Visits</span>
          <h3 className="font-sans font-black text-2xl text-[#3B0C04]">45,210</h3>
          <span className="text-[10px] text-rose-500 font-bold">↓ -2.5% from previous period</span>
        </div>
      </div>

      {/* Main Performance Chart */}
      <div className="bg-white p-8 rounded-3xl border border-[#E8DCD2] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-black text-base text-[#3B0C04]">Traffic Inflow & Acquisition Trend</h3>
          <span className="text-xs text-[#8C7B72] font-semibold">Weekly aggregate view</span>
        </div>
        
        <div className="h-64 relative w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B0C04" stopOpacity="0.15" />
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
          <div className="flex justify-between text-[11px] font-bold text-[#8C7B72] pt-3 border-t border-[#E8DCD2]">
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
