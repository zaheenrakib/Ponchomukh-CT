"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingBag, Users, LineChart, Tag, Settings, RefreshCw
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalRevenue: 0,
  });

  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);

  const fetchStats = () => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setOrders(data.recentOrders);
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStats();
      }
    } catch (err) {
      console.error("Order status update error:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F6F8] dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-60 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between py-6 px-4 shrink-0 text-left">
        <div className="flex flex-col gap-6">
          
          {/* Logo */}
          <div className="flex items-center gap-2 px-2">
            <div className="h-9 w-9 rounded-xl bg-[#3B0C04] text-[#FFC40E] font-black flex items-center justify-center text-lg">
              P
            </div>
            <span className="font-sans font-black text-lg text-[#3B0C04] dark:text-white">
              Ponchomukh Admin
            </span>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 text-xs font-extrabold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#3B0C04] text-white"
            >
              <LayoutDashboard className="h-4 w-4 text-[#FFC40E]" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              <LineChart className="h-4 w-4" />
              <span>Orders</span>
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </Link>

            <Link
              href="/admin/banners"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              <Tag className="h-4 w-4" />
              <span>Banners</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-zinc-150 pt-4 px-2 space-y-2">
          <Link href="/" className="text-xs font-bold text-[#3B0C04] hover:underline flex items-center gap-1">
            ← View Customer Website
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="w-full text-left text-xs font-bold text-rose-600 hover:underline pt-1"
          >
            🔒 Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard Content */}
      <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 text-left">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-xs text-zinc-500 font-semibold mt-0.5">
              Live statistics from PostgreSQL Neon DB
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase text-zinc-400">Total Sales Revenue</span>
            <h3 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
              {formatBDT(stats.totalRevenue)}
            </h3>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase text-zinc-400">Total Orders</span>
            <h3 className="font-sans font-black text-2xl text-zinc-800 dark:text-white">
              {stats.totalOrders}
            </h3>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-600">Pending Orders</span>
            <h3 className="font-sans font-black text-2xl text-amber-600">
              {stats.pendingOrders}
            </h3>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-2">
            <span className="text-[10px] font-black uppercase text-rose-600">Low Stock Alert</span>
            <h3 className="font-sans font-black text-2xl text-rose-600">
              {stats.lowStockProducts} items
            </h3>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-black text-lg text-[#3B0C04] dark:text-white">
              Recent Customer Orders
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-700 dark:text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-150 font-black text-zinc-400 uppercase text-[10px]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-semibold">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400 font-bold">
                      No orders found in database.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord: Record<string, any>) => (
                    <tr key={ord.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#3B0C04]">{ord.orderNumber}</td>
                      <td className="py-3 font-bold">{ord.user?.name || "Guest"}</td>
                      <td className="py-3">{ord.user?.phoneNumber}</td>
                      <td className="py-3 font-black">{formatBDT(Number(ord.total))}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          ord.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : ord.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-800"
                            : ord.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-zinc-100 text-zinc-800"
                        }`}>
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

      </main>
    </div>
  );
}
