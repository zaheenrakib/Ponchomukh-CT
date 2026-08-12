"use client";

import React, { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.recentOrders);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatBDT = (value: number) => {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-zinc-950 p-8 text-left text-zinc-900 dark:text-zinc-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
            Order Management
          </h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Process customer purchases and status workflows
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700"
        >
          <RefreshCcw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 shadow-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-zinc-700 dark:text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-150 font-black text-zinc-400 uppercase text-[10px]">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Update Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 font-bold">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 font-bold">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#3B0C04]">{ord.orderNumber}</td>
                    <td className="py-3 font-bold">{ord.user?.name || "Guest"}</td>
                    <td className="py-3">{ord.user?.phoneNumber}</td>
                    <td className="py-3 font-black">{formatBDT(Number(ord.total))}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="h-8 px-2 rounded-lg border border-zinc-200 text-[11px] font-bold outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
