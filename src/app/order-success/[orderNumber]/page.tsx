"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { CheckCircle2, Truck, ShoppingBag } from "lucide-react";

function OrderSuccessContent() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-3xl border border-[#E8DCD2] dark:border-zinc-800 shadow-md space-y-6">
          
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04] dark:text-white">
              🎉 আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-zinc-500">
              Order Number: <span className="font-mono font-black text-[#3B0C04] dark:text-white">{orderNumber}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF7EE] text-left text-xs space-y-2 font-medium text-zinc-700">
            <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
            <p><strong>Delivery:</strong> 24 - 48 Hours inside Dhaka / 2 - 4 Days nationwide.</p>
            <p className="text-[11px] text-zinc-500">Our customer representative will contact you shortly to confirm your order.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href={`/order-tracking?order=${orderNumber}`}
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-[#3B0C04] text-white font-bold text-xs"
            >
              <Truck className="h-4 w-4 text-[#FFC40E]" />
              Track Order
            </Link>

            <Link
              href="/shop"
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border border-[#3B0C04] text-[#3B0C04] font-bold text-xs"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <CartProvider>
      <OrderSuccessContent />
    </CartProvider>
  );
}
