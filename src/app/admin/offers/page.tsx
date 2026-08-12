"use client";

import React from "react";
import { Tag, Plus } from "lucide-react";

export default function AdminOffersPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-zinc-950 p-8 text-left text-zinc-900 dark:text-zinc-100">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
            Offers & Campaigns
          </h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Manage product discounts, flash sales, and active discount coupons
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] text-white font-bold text-xs shadow-sm">
          <Plus className="h-4 w-4 text-[#FFC40E]" /> Add Campaign
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
        <h3 className="font-sans font-black text-base text-zinc-900">Active Coupons</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#FFF7EE] border border-[#E8DCD2] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="h-5 w-5 text-[#3B0C04]" />
              <div>
                <h4 className="font-bold text-xs">PONCHO10</h4>
                <p className="text-[10px] text-zinc-500">10% discount on all gadget products</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-[#3B0C04] bg-[#FFC40E] px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>
        </div>
      </div>

    </div>
  );
}
