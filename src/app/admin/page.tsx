"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag, ClipboardList, TrendingUp, Users,
  Search, Bell, ArrowUpRight, ArrowDownRight, Calendar
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 1645,
    pendingOrders: 117,
    totalProducts: 142,
    lowStockProducts: 8,
    totalRevenue: 82650,
  });

  const fetchStats = () => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats((prev) => ({
            ...prev,
            totalOrders: data.stats.totalOrders || 1645,
            pendingOrders: data.stats.pendingOrders || 117,
            totalRevenue: data.stats.totalRevenue || 82650,
          }));
        }
      })
      .catch((err) => console.error("Failed to load admin stats:", err));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatBDT = (value: number) => {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
  };

  return (
    <div className="p-8 flex flex-col gap-6 text-left">

      {/* Header Bar */}
      <div className="flex justify-between items-center gap-4">
        <h1 className="font-sans font-black text-2xl text-zinc-900">
          Overview
        </h1>

        {/* Search */}
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#E6E8EC] text-xs font-semibold outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 font-semibold text-xs text-zinc-700">
          <div className="flex items-center gap-2 h-10 px-3.5 rounded-xl bg-white border border-[#E6E8EC]">
            <Calendar className="h-4 w-4 text-zinc-400" />
            <span>30 May</span>
          </div>

          <button className="h-10 w-10 rounded-xl bg-white border border-[#E6E8EC] flex items-center justify-center relative">
            <Bell className="h-4 w-4 text-zinc-600" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>

          <div className="h-10 w-10 rounded-xl bg-zinc-200 overflow-hidden border border-[#E6E8EC]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1 — Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E8EC] flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-xs text-zinc-400 font-bold">Total Revenue</span>
            <h3 className="font-sans font-black text-2xl text-zinc-900">
              {formatBDT(stats.totalRevenue)}
            </h3>
            <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
              <span className="text-emerald-500 flex items-center"><ArrowUpRight className="h-3 w-3" /> +11%</span> Last 30 days
            </span>
          </div>
          <div className="h-11 w-11 rounded-full bg-[#E6F9F2] text-[#2CD49F] flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2 — Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E8EC] flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-xs text-zinc-400 font-bold">Total Order</span>
            <h3 className="font-sans font-black text-2xl text-zinc-900">
              {stats.totalOrders}
            </h3>
            <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
              <span className="text-emerald-500 flex items-center"><ArrowUpRight className="h-3 w-3" /> +11%</span> Last 30 days
            </span>
          </div>
          <div className="h-11 w-11 rounded-full bg-[#E7F0FD] text-blue-600 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3 — Customers */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E8EC] flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-xs text-zinc-400 font-bold">Total Customer</span>
            <h3 className="font-sans font-black text-2xl text-zinc-900">1,462</h3>
            <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
              <span className="text-rose-500 flex items-center"><ArrowDownRight className="h-3 w-3" /> -17%</span> Last 30 days
            </span>
          </div>
          <div className="h-11 w-11 rounded-full bg-[#E6F9F2] text-emerald-600 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4 — Pending */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E8EC] flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-xs text-zinc-400 font-bold">Pending Delivery</span>
            <h3 className="font-sans font-black text-2xl text-zinc-900">
              {stats.pendingOrders}
            </h3>
            <span className="text-[10px] text-zinc-400 font-bold">Last 30 days</span>
          </div>
          <div className="h-11 w-11 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Middle Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sales Analytic Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#E6E8EC] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-black text-base text-zinc-900">Sales Analytic</h3>
            <select className="h-8 px-2 rounded-lg border border-[#E6E8EC] text-[11px] font-bold outline-none bg-white">
              <option>Sort by Jul 2023</option>
            </select>
          </div>

          {/* Income breakdown badges */}
          <div className="flex gap-8 text-left">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase">Income</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-sans font-black text-lg text-zinc-900">23,262.00</span>
                <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-bold">+0.05%</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase">Expenses</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-sans font-black text-lg text-zinc-900">11,135.00</span>
                <span className="px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[9px] font-bold">+0.05%</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 font-bold block uppercase">Balance</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-sans font-black text-lg text-zinc-900">48,135.00</span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#E6F9F2] text-[#2CD49F] text-[9px] font-bold">+0.05%</span>
              </div>
            </div>
          </div>

          {/* Premium Wavy Chart */}
          <div className="h-44 relative w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2CD49F" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2CD49F" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,100 Q100,20 200,80 T400,30 T600,90 T800,40 L800,150 L0,150 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M0,100 Q100,20 200,80 T400,30 T600,90 T800,40"
                fill="none"
                stroke="#2CD49F"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Dates strip */}
            <div className="flex justify-between text-[9px] font-black text-zinc-400 pt-2 px-1">
              <span>22 July</span>
              <span>23 July</span>
              <span>24 July</span>
              <span>25 July</span>
              <span>26 July</span>
              <span>27 July</span>
              <span>28 July</span>
              <span>29 July</span>
            </div>
          </div>
        </div>

        {/* Sales Target */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E6E8EC] flex flex-col justify-between">
          <h3 className="font-sans font-black text-base text-zinc-900">Sales Target</h3>

          {/* Radial circles diagram */}
          <div className="relative flex items-center justify-center my-6 h-36">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F3F6" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2CD49F" strokeWidth="8" strokeDasharray="180 250" strokeLinecap="round" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="#F1F3F6" strokeWidth="8" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="#5EEAD4" strokeWidth="8" strokeDasharray="100 200" strokeLinecap="round" transform="rotate(-90 50 50)" />
            </svg>
          </div>

          <div className="space-y-3 font-semibold text-xs text-left">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-400 block" /> Daily Target
              </span>
              <span className="font-sans font-black text-base text-zinc-900 mt-0.5 flex items-center gap-1">
                ↓ 650
              </span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2CD49F] block" /> Monthly Target
              </span>
              <span className="font-sans font-black text-base text-zinc-900 mt-0.5 flex items-center gap-1">
                ↑ 145,00
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Rows: Top Selling Products & Current Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Top Selling Products */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#E6E8EC] space-y-4">
          <h3 className="font-sans font-black text-base text-zinc-900">Top Selling Products</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-[#F1F3F6] text-left space-y-2">
              <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E6E8EC] p-2 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" alt="shoe" className="object-contain h-full w-full" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900 line-clamp-1">Air Jordan 8</h4>
                <span className="text-[10px] text-zinc-400 font-semibold block">752 Pcs</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-[#F1F3F6] text-left space-y-2">
              <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E6E8EC] p-2 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200" alt="shoe" className="object-contain h-full w-full" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900 line-clamp-1">Air Jordan 5</h4>
                <span className="text-[10px] text-zinc-400 font-semibold block">752 Pcs</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-[#F1F3F6] text-left space-y-2">
              <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E6E8EC] p-2 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200" alt="shoe" className="object-contain h-full w-full" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900 line-clamp-1">Air Jordan 13</h4>
                <span className="text-[10px] text-zinc-400 font-semibold block">752 Pcs</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-[#F1F3F6] text-left space-y-2">
              <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E6E8EC] p-2 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1539185441755-769473a23570?w=200" alt="shoe" className="object-contain h-full w-full" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900 line-clamp-1">Nike Air Max</h4>
                <span className="text-[10px] text-zinc-400 font-semibold block">752 Pcs</span>
              </div>
            </div>

          </div>
        </div>

        {/* Current Offer Progress */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E6E8EC] space-y-4">
          <h3 className="font-sans font-black text-base text-zinc-900">Current Offer</h3>

          <div className="space-y-4 text-xs font-semibold text-left">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>40% Discount Offer</span>
                <span className="text-[10px] text-zinc-400">Expire on: 05-08</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#F1F3F6] overflow-hidden">
                <div className="h-full bg-[#2CD49F]" style={{ width: "65%" }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>100 Taka Coupon</span>
                <span className="text-[10px] text-zinc-400">Expire on: 10-09</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#F1F3F6] overflow-hidden">
                <div className="h-full bg-[#5EEAD4]" style={{ width: "45%" }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Stock Out Sell</span>
                <span className="text-[10px] text-zinc-400">Upcoming: 14-09</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#F1F3F6] overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: "80%" }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
