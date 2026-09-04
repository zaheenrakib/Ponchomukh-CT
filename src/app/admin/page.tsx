"use client";

import React, { useState, useEffect } from "react";
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
  ExternalLink
} from "lucide-react";
import { mockProducts } from "@/lib/mockData";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
      if (stored.length > 0) {
        setOrders(stored);
      } else {
        setOrders([
          {
            orderId: "PN10025",
            date: "০৪ সেপ্টেম্বর, ২০২৬",
            customer: { name: "তানভীর আহমেদ", phone: "01712-345678" },
            total: 1359,
            paymentMethod: "Cash on Delivery",
            status: "PROCESSING"
          },
          {
            orderId: "PN10024",
            date: "০৪ সেপ্টেম্বর, ২০২৬",
            customer: { name: "সুমাইয়া আক্তার", phone: "01823-456789" },
            total: 1899,
            paymentMethod: "Cash on Delivery",
            status: "CONFIRMED"
          },
          {
            orderId: "PN10023",
            date: "০৩ সেপ্টেম্বর, ২০২৬",
            customer: { name: "মাহির ফয়সাল", phone: "01934-567890" },
            total: 4299,
            paymentMethod: "bKash",
            status: "DELIVERED"
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const lowStockProducts = mockProducts.filter((p) => p.stock <= (p.lowStockThreshold || 15));

  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 24500);

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
      {/* Top Welcome Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            অ্যাডমিন ড্যাশবোর্ড ওভারভিউ
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            আজকের বিক্রয়, অর্ডার ও ইনভেন্টরি ট্র্যাকিং
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-[#3B0C04] text-[#FFC40E] text-xs font-bold shadow-xs hover:bg-[#260700]"
          >
            + নতুন পণ্য যোগ করুন
          </Link>
        </div>
      </div>

      {/* 8 CORE STAT METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Today's Orders */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold">আজকের অর্ডার</span>
            <Clock className="w-4 h-4 text-[#3B0C04]" />
          </div>
          <p className="text-2xl font-black text-[#3B0C04]">১২ টি</p>
          <p className="text-[11px] text-[#16834A] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +১৮% গতকাল থেকে বেশি
          </p>
        </div>

        {/* Today's Sales */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold">আজকের সেলস</span>
            <DollarSign className="w-4 h-4 text-[#16834A]" />
          </div>
          <p className="text-2xl font-black text-[#16834A]">৳১৬,৪৫০</p>
          <p className="text-[11px] text-[#6B5A52]">মোট ১২টি ডেলিভারি অর্ডার</p>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold">সর্বমোট অর্ডার</span>
            <ShoppingBag className="w-4 h-4 text-[#3B0C04]" />
          </div>
          <p className="text-2xl font-black text-[#3B0C04]">{orders.length + 85} টি</p>
          <p className="text-[11px] text-[#6B5A52]">লাইফটাইম অর্ডার রেকর্ড</p>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold">সর্বমোট রেভিনিউ</span>
            <TrendingUp className="w-4 h-4 text-[#FFC40E]" />
          </div>
          <p className="text-2xl font-black text-[#3B0C04]">৳{totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-[#16834A] font-semibold">গ্রোথ রেট +২৪%</p>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold">পেন্ডিং অর্ডার</span>
            <Clock className="w-4 h-4 text-[#D99E00]" />
          </div>
          <p className="text-2xl font-black text-[#D99E00]">
            {orders.filter((o) => o.status === "PENDING").length || 3} টি
          </p>
          <p className="text-[11px] text-[#D99E00] font-semibold">কনফার্মেশন অপেক্ষমান</p>
        </div>

        {/* Total Customers */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold">কাস্টমার সংখ্যা</span>
            <Users className="w-4 h-4 text-[#3B0C04]" />
          </div>
          <p className="text-2xl font-black text-[#3B0C04]">১,২৪৫ জন</p>
          <p className="text-[11px] text-[#6B5A52]">একটিভ রেজিস্টার্ড ইউজার</p>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold">মোট পণ্য সংখ্যা</span>
            <Package className="w-4 h-4 text-[#3B0C04]" />
          </div>
          <p className="text-2xl font-black text-[#3B0C04]">{mockProducts.length + 18} টি</p>
          <p className="text-[11px] text-[#6B5A52]">৬টি সক্রিয় ক্যাটাগরিতে</p>
        </div>

        {/* Low Stock Products Alert */}
        <div className="p-5 rounded-2xl bg-white border border-[#D64545]/40 shadow-xs space-y-2 bg-[#D64545]/5">
          <div className="flex items-center justify-between text-[#D64545]">
            <span className="text-xs font-bold">লো স্টক সতর্কতা</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-[#D64545]">{lowStockProducts.length} টি</p>
          <p className="text-[11px] text-[#D64545] font-semibold">তাৎক্ষণিক রিস্টক প্রয়োজন</p>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8DCD2] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#3B0C04]">
              সাম্প্রতিক অর্ডারসমূহ (Recent Orders)
            </h2>
            <p className="text-xs text-[#6B5A52]">
              স্ট্যাটাস পরিবর্তন করে সরাসরি কাস্টমার টাইমলাইন আপডেট করুন
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#3B0C04] hover:underline"
          >
            সকল অর্ডার দেখুন →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FFF7EE] text-[#3B0C04] font-bold border-b border-[#E8DCD2]">
              <tr>
                <th className="p-3.5">অর্ডার আইডি</th>
                <th className="p-3.5">কাস্টমার নাম & ফোন</th>
                <th className="p-3.5">তারিখ</th>
                <th className="p-3.5">বিল পরিমাণ</th>
                <th className="p-3.5">পেমেন্ট</th>
                <th className="p-3.5">বর্তমান স্ট্যাটাস</th>
                <th className="p-3.5">স্ট্যাটাস আপডেট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCD2]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.orderId} className="hover:bg-[#FFFDF9]">
                  <td className="p-3.5 font-mono font-bold text-[#3B0C04]">
                    {order.orderId}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-[#2B160F]">{order.customer?.name || "Customer"}</p>
                    <p className="text-[11px] text-[#8C7B72]">{order.customer?.phone || "N/A"}</p>
                  </td>
                  <td className="p-3.5 text-[#6B5A52]">{order.date}</td>
                  <td className="p-3.5 font-bold text-[#2B160F]">৳{order.total}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E8DCD2] text-[11px] font-semibold">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.status === "DELIVERED"
                          ? "bg-[#E8F6F1] text-[#16834A]"
                          : order.status === "PROCESSING" || order.status === "SHIPPED"
                          ? "bg-[#FFF7EE] text-[#3B0C04]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold focus:outline-none focus:border-[#3B0C04]"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOW STOCK PRODUCTS WARNING */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8DCD2] pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#D64545]" />
            <h2 className="text-base font-bold text-[#3B0C04]">
              ইনভেন্টরি লো স্টক অ্যালার্ট
            </h2>
          </div>
          <Link
            href="/admin/inventory"
            className="text-xs font-bold text-[#3B0C04] hover:underline"
          >
            ইনভেন্টরি ম্যানেজ করুন →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockProducts.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-xl border border-[#D64545]/30 bg-[#D64545]/5 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={p.images[0]?.imageUrl}
                  alt=""
                  className="w-12 h-12 rounded-lg object-contain bg-white border border-[#E8DCD2] p-1 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-[#2B160F] truncate">{p.name}</p>
                  <p className="text-[11px] text-[#8C7B72]">SKU: {p.sku}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 rounded bg-[#D64545] text-white font-bold text-[11px]">
                  বাকি {p.stock} পিস
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
