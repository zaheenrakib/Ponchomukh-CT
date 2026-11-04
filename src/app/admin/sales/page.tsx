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
            <h1 className="font-sans font-black text-2xl text-[#3B0C04]">
              বিক্রয় ও রাজস্ব লেজার (Sales Ledger)
            </h1>
            <p className="text-xs text-[#6B5A52] mt-0.5">
              প্রতিটি পণ্য এবং অর্ডারের বিস্তারিত বিক্রয় ও ক্রেতা লেজার
            </p>
          </div>
        </div>

        <Link
          href="/admin/reports"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>সম্পূর্ণ রিপোর্ট ও ডাউনলোড সেন্টার</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-6 md:p-8 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF7EE] text-[#3B0C04] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-[#3B0C04]">সরাসরি পণ্যভিত্তিক ক্রেতা বিশ্লেষণ</h3>
            <p className="text-xs text-[#6B5A52]">
              একটি নির্দিষ্ট পণ্য সিলেক্ট করে দেখতে পারবেন কতজন ক্রেতা সেই পণ্যটি কিনেছেন এবং তাদের বিস্তারিত তথ্য
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16834A] text-white font-bold text-xs hover:bg-[#11693a] transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>অর্ডার ও ক্রেতা রিপোর্ট খুলুন এবং এক্সপোর্ট করুন →</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
