"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileSpreadsheet, Download, TrendingUp, ShoppingBag, ArrowRight } from "lucide-react";

export default function AdminSalesPage() {
  return (
    <div className="space-y-8 text-left text-zinc-900">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] transition-colors">
            <ArrowLeft className="h-4 w-4 text-[#3B0C04]" />
          </Link>
          <div>
            <h1 className="font-sans font-black text-2xl text-[#3B0C04] flex items-center gap-2">
              <span>Sales & Revenue Ledger</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
                Sales Ledger
              </span>
            </h1>
            <p className="text-xs text-[#6B5A52] mt-0.5">
              Comprehensive line-item sales audit, customer records, and channel breakdown
            </p>
          </div>
        </div>

        <Link
          href="/admin/reports"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Full Reports & Download Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF7EE] text-[#3B0C04] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-[#3B0C04]">Product-Wise Customer Matrix</h3>
            <p className="text-xs text-[#6B5A52]">
              Select any SKU or product catalog entry to view full purchaser profiles, purchase frequency, channel, and order IDs
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16834A] text-white font-bold text-xs hover:bg-[#11693a] transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Open & Export Sales & Buyer Matrix (CSV) →</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
