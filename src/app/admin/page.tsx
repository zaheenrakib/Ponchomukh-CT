"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  Warehouse,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Package,
  Calendar,
  ExternalLink,
  Store,
  Globe,
  PlusCircle,
  Receipt,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  BarChart3
} from "lucide-react";
import { mockProducts } from "@/lib/mockData";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      let combined: any[] = [];
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            combined = data.orders.map((o: any) => ({
              orderId: o.orderNumber,
              date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              source: o.orderNotes?.includes("[POS]")
                ? "POS"
                : o.orderNotes?.includes("[LANDING_PAGE]")
                ? "LANDING_PAGE"
                : (o.source || "STOREFRONT"),
              customer: { name: o.shippingAddress?.name || "Customer", phone: o.shippingAddress?.phone || "" },
              total: o.total,
              paymentMethod: o.paymentMethod === "COD" ? "Cash on Delivery" : o.paymentMethod,
              status: o.status,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not load API orders:", err);
      }

      // Merge local storage
      try {
        const stored = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
        const existingIds = new Set(combined.map((o) => o.orderId));
        for (const s of stored) {
          if (!existingIds.has(s.orderId)) {
            combined.push({
              ...s,
              source: s.source || (s.orderNotes?.includes("[POS]") ? "POS" : "STOREFRONT"),
            });
          }
        }
      } catch (e) {
        console.error(e);
      }

      if (combined.length > 0) {
        setOrders(combined);
      } else {
        setOrders([
          {
            orderId: "POS-10025",
            date: "Sep 04, 2026",
            source: "POS",
            customer: { name: "Retail Walk-in Customer", phone: "01700-000000" },
            total: 1359,
            paymentMethod: "Cash",
            status: "DELIVERED"
          },
          {
            orderId: "PN10024",
            date: "Sep 04, 2026",
            source: "STOREFRONT",
            customer: { name: "Sumaiya Akter", phone: "01823-456789" },
            total: 1899,
            paymentMethod: "bKash Online",
            status: "DELIVERED"
          },
          {
            orderId: "PN10023",
            date: "Sep 03, 2026",
            source: "LANDING_PAGE",
            customer: { name: "Tanvir Ahmed", phone: "01712-345678" },
            total: 4299,
            paymentMethod: "Cash on Delivery",
            status: "PROCESSING"
          }
        ]);
      }
    }

    loadData();
  }, []);

  const lowStockProducts = mockProducts.filter((p) => p.stock <= (p.lowStockThreshold || 15));

  // Analytics Metrics
  const metrics = useMemo(() => {
    let ecomRev = 0;
    let posRev = 0;
    let ecomCount = 0;
    let posCount = 0;

    orders.forEach((o) => {
      const val = Number(o.total) || 0;
      if (o.source === "POS") {
        posRev += val;
        posCount += 1;
      } else {
        ecomRev += val;
        ecomCount += 1;
      }
    });

    const totalRev = ecomRev + posRev || 38500;
    const estProfit = Math.round(totalRev * 0.32);

    return {
      totalRev,
      ecomRev,
      posRev,
      totalOrders: orders.length || 15,
      ecomCount,
      posCount,
      estProfit,
      pendingCount: orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length || 2,
    };
  }, [orders]);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    try {
      localStorage.setItem("ponchomukh_all_orders", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP ERP OVERVIEW HEADER & QUICK ACTION BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DCD2] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16834A] animate-pulse" />
            <h1 className="text-2xl font-black text-[#3B0C04] tracking-tight">
              Enterprise Resource Planning (ERP) Overview
            </h1>
          </div>
          <p className="text-xs text-[#6B5A52]">
            Live operational status across E-Commerce Storefront, POS Retail Outlets, and Supply Inventory
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/pos"
            className="px-4 py-2.5 rounded-xl bg-[#3B0C04] text-[#FFC40E] hover:bg-[#260700] text-xs font-bold shadow-xs flex items-center gap-2 transition-transform active:scale-95"
          >
            <Store className="w-4 h-4 text-[#FFC40E]" />
            <span>Launch POS Register</span>
          </Link>

          <Link
            href="/admin/products/add"
            className="px-4 py-2.5 rounded-xl border border-[#E8DCD2] bg-[#FFF7EE] hover:bg-[#3B0C04] hover:text-[#FFC40E] text-[#3B0C04] text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Product Item</span>
          </Link>

          <Link
            href="/admin/accounts"
            className="px-4 py-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4 text-[#16834A]" />
            <span>Record Expense</span>
          </Link>

          <Link
            href="/admin/reports"
            className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold transition-colors"
            title="Open Executive Reports"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#3B0C04]" />
          </Link>
        </div>
      </div>

      {/* 2. CORE EXECUTIVE METRIC KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales Volume</span>
            <DollarSign className="w-4 h-4 text-[#16834A]" />
          </div>
          <h3 className="text-2xl font-black text-[#16834A]">
            ৳{metrics.totalRev.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#16834A] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% vs Last Month
          </p>
        </div>

        {/* E-Commerce vs POS Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold uppercase tracking-wider">Sales by Channel</span>
            <BarChart3 className="w-4 h-4 text-[#3B0C04]" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#1E3A8A]">E-Com:</span>
              <span className="text-[#1E3A8A]">৳{metrics.ecomRev.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#16834A]">POS Store:</span>
              <span className="text-[#16834A]">৳{metrics.posRev.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Total Orders by Channel */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#3B0C04]" />
          </div>
          <h3 className="text-2xl font-black text-[#3B0C04]">{metrics.totalOrders} Orders</h3>
          <p className="text-[11px] text-[#6B5A52]">
            Online: {metrics.ecomCount} | POS Counter: {metrics.posCount}
          </p>
        </div>

        {/* Estimated Net Margin */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold uppercase tracking-wider">Net Operating Profit</span>
            <TrendingUp className="w-4 h-4 text-[#FFC40E]" />
          </div>
          <h3 className="text-2xl font-black text-[#3B0C04]">
            ৳{metrics.estProfit.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#16834A] font-semibold">Healthy Operating Margin (32%)</p>
        </div>

        {/* Pending Fulfillment */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-[#D99E00]" />
          </div>
          <h3 className="text-2xl font-black text-[#D99E00]">{metrics.pendingCount} Orders</h3>
          <p className="text-[11px] text-[#D99E00] font-semibold">Awaiting Dispatch Fulfillment</p>
        </div>

        {/* Total Registered Customers */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold uppercase tracking-wider">Customer Accounts</span>
            <Users className="w-4 h-4 text-[#3B0C04]" />
          </div>
          <h3 className="text-2xl font-black text-[#3B0C04]">128 Accounts</h3>
          <p className="text-[11px] text-[#16834A] font-semibold">+8 New Registrations</p>
        </div>

        {/* Low Stock Warehouse Alert */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Inventory</span>
            <AlertTriangle className="w-4 h-4 text-[#D64545]" />
          </div>
          <h3 className="text-2xl font-black text-[#D64545]">
            {lowStockProducts.length} Items
          </h3>
          <p className="text-[11px] text-[#D64545] font-semibold">Below Safety Threshold</p>
        </div>

        {/* Live POS Register Status */}
        <div className="p-5 rounded-2xl bg-[#3B0C04] text-[#FFFDF9] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#FFC40E]">
            <span className="text-xs font-bold uppercase tracking-wider">POS Register #01</span>
            <Store className="w-4 h-4 text-[#FFC40E]" />
          </div>
          <h3 className="text-xl font-black text-[#FFC40E]">ONLINE & ACTIVE</h3>
          <p className="text-[11px] text-zinc-300">Ready for Counter Billing</p>
        </div>
      </div>

      {/* 3. RECENT ORDERS WITH CHANNEL TAGS & LOW STOCK WAREHOUSE ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E8DCD2] flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#3B0C04]">Recent Sales & Dispatches</h3>
              <p className="text-xs text-[#6B5A52]">Transactions across E-Commerce, Landing Pages & POS</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#3B0C04] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Sales Channel</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD2]/60">
                {orders.slice(0, 6).map((order) => {
                  const isPOS = order.source === "POS";
                  const isLanding = order.source === "LANDING_PAGE";

                  return (
                    <tr key={order.orderId} className="hover:bg-[#FFF7EE]/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#3B0C04]">
                        #{order.orderId}
                      </td>
                      <td className="py-3.5 px-4">
                        {isPOS ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                            <Store className="w-3 h-3" />
                            <span>POS STORE</span>
                          </span>
                        ) : isLanding ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800">
                            <Globe className="w-3 h-3" />
                            <span>LANDING</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
                            <Globe className="w-3 h-3" />
                            <span>E-COM</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2B160F]">
                        {order.customer?.name}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-[#16834A]">
                        ৳{Number(order.total || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-[#6B5A52]">{order.paymentMethod}</td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                          className="h-6 px-2 rounded text-[10px] font-bold border border-[#E8DCD2] bg-[#FFFDF9] outline-none cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (1 Column) */}
        <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#E8DCD2] flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#3B0C04] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D64545]" />
                  <span>Inventory Alerts</span>
                </h3>
                <p className="text-xs text-[#6B5A52]">Items approaching stock depletion</p>
              </div>
              <Link
                href="/admin/inventory"
                className="text-xs font-bold text-[#3B0C04] hover:underline"
              >
                Warehouse →
              </Link>
            </div>

            <div className="divide-y divide-[#E8DCD2]/60 p-2">
              {lowStockProducts.slice(0, 5).map((p) => (
                <div key={p.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex items-center gap-2.5">
                    <img
                      src={p.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100"}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover border border-[#E8DCD2]"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#2B160F] truncate">{p.name}</p>
                      <p className="text-[10px] text-[#8C7B72] font-mono">SKU: {p.sku}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#D64545] block">
                      {p.stock} Pcs Left
                    </span>
                    <span className="text-[10px] text-[#8C7B72]">Min: {p.lowStockThreshold || 15}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-[#E8DCD2] bg-[#FFFDF9]">
            <Link
              href="/admin/inventory"
              className="w-full py-2.5 rounded-xl bg-[#3B0C04] text-[#FFC40E] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#260700] transition-colors"
            >
              <span>Manage Full Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
