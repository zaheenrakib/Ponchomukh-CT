"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { Search, CheckCircle2, Circle, Package } from "lucide-react";

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";

  const [query, setQuery] = useState(initialOrder);
  const [orderData, setOrderData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchTrackOrder = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrderData(data.order);
      } else {
        setOrderData(null);
      }
    } catch (err) {
      console.error("Order tracking error:", err);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTrack = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchTrackOrder(query);
  };

  useEffect(() => {
    if (initialOrder) {
      fetchTrackOrder(initialOrder);
    }
  }, [initialOrder, fetchTrackOrder]);

  // Workflow timeline steps
  const steps = [
    { key: "PENDING", label: "Order Placed" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "PACKED", label: "Out for Delivery" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "PACKED", "DELIVERED"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus === "CANCELLED") return "cancelled";
    if (stepIndex <= currentIndex) return "completed";
    return "upcoming";
  };

  const formatBDT = (value: number) => {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 text-left">
        <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04] dark:text-white text-center mb-6">
          Track Your Order
        </h1>

        {/* Tracking Search Input */}
        <form onSubmit={handleTrack} className="flex gap-2 max-w-xl mx-auto mb-10">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Enter Order ID (PN-10001) or Phone Number..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E8DCD2] bg-white text-xs font-semibold outline-none focus:border-[#3B0C04]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-6 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-white font-bold text-xs shadow-md"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {/* Results */}
        {searched && !orderData && !loading && (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#E8DCD2]">
            <Package className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#3B0C04]">No Order Found</h3>
            <p className="text-xs text-zinc-500 mt-1">Please check your Order Number (e.g. PN-10001) and try again.</p>
          </div>
        )}

        {orderData && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-[#E8DCD2] shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
              <div>
                <span className="text-xs text-zinc-400 font-bold block">Order Number</span>
                <span className="font-mono font-black text-lg text-[#3B0C04] dark:text-white">{orderData.orderNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400 font-bold block">Total Amount</span>
                <span className="font-black text-base text-rose-600">{formatBDT(Number(orderData.total))}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="py-4">
              <h3 className="font-bold text-xs text-zinc-400 uppercase tracking-wider mb-6">Delivery Timeline</h3>
              
              <div className="space-y-6 relative pl-6 border-l-2 border-[#E8DCD2]">
                {steps.map((st) => {
                  const state = getStepStatus(st.key, orderData.status);
                  return (
                    <div key={st.key} className="relative flex items-center gap-4">
                      {/* Step Indicator Node */}
                      <div className="absolute -left-[31px]">
                        {state === "completed" ? (
                          <div className="h-6 w-6 rounded-full bg-[#3B0C04] text-white flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-white border-2 border-zinc-300 text-zinc-400 flex items-center justify-center">
                            <Circle className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      <div className="text-left">
                        <h4 className={`font-bold text-sm ${state === "completed" ? "text-[#3B0C04] font-black" : "text-zinc-400"}`}>
                          {st.label}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <CartProvider>
      <Suspense fallback={<div className="p-10 text-center">Loading tracker...</div>}>
        <OrderTrackingContent />
      </Suspense>
    </CartProvider>
  );
}
