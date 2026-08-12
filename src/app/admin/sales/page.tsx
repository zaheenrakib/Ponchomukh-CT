"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminSalesPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-zinc-950 p-8 text-left text-zinc-900 dark:text-zinc-100">
      
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="p-2 rounded-xl border border-zinc-200 bg-white">
          <ArrowLeft className="h-4 w-4 text-zinc-600" />
        </Link>
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
            Sales & Revenue Ledger
          </h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Track daily/weekly revenue statistics and order margins
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
        <h3 className="font-sans font-black text-base text-zinc-900">Revenue Ledger Summary</h3>
        <p className="text-xs text-zinc-500">Gross metrics calculated from successfully completed checkouts.</p>
      </div>

    </div>
  );
}
