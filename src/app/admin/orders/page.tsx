"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  X,
  Printer,
  Truck,
  CreditCard,
  User,
  MapPin,
  Download,
  FileSpreadsheet,
  Store,
  Globe,
  PhoneCall,
  ShoppingBag,
  Filter,
  DollarSign,
  TrendingUp,
  Package
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    async function loadOrders() {
      let combinedOrders: any[] = [];
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
            combinedOrders = data.orders.map((o: any) => ({
              orderId: o.orderNumber,
              id: o.id,
              date: new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
              source: o.orderNotes?.includes("[POS]")
                ? "POS"
                : o.orderNotes?.includes("[LANDING_PAGE]")
                ? "LANDING_PAGE"
                : o.orderNotes?.includes("[MANUAL_PHONE]")
                ? "MANUAL_PHONE"
                : (o.source || "STOREFRONT"),
              orderNotes: o.orderNotes || "",
              customer: {
                name: o.shippingAddress?.name || o.user?.name || "Customer",
                phone: o.shippingAddress?.phone || o.user?.phoneNumber || "",
                email: o.user?.email || "",
                address: `${o.shippingAddress?.addressLine1 || ""}, ${o.shippingAddress?.district || ""}`.trim() || "Dhaka, Bangladesh"
              },
              items: o.items?.map((item: any) => ({
                name: item.variant?.product?.name || "Product Item",
                quantity: item.quantity,
                price: item.price,
                image: item.variant?.product?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200"
              })) || [],
              subtotal: o.subtotal,
              discount: o.discount,
              shippingFee: o.shippingFee,
              total: o.total,
              paymentMethod: o.paymentMethod === "COD" ? "Cash on Delivery" : o.paymentMethod,
              paymentStatus: o.paymentStatus,
              status: o.status,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch orders from API:", err);
      }

      // Merge with localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
        const existingIds = new Set(combinedOrders.map(o => o.orderId));
        for (const s of stored) {
          if (!existingIds.has(s.orderId)) {
            combinedOrders.push({
              ...s,
              source: s.source || (s.orderNotes?.includes("[POS]") ? "POS" : s.orderNotes?.includes("[LANDING_PAGE]") ? "LANDING_PAGE" : "STOREFRONT"),
            });
          }
        }
      } catch (e) {
        console.error(e);
      }

      if (combinedOrders.length > 0) {
        setOrders(combinedOrders);
      } else {
        setOrders([
          {
            orderId: "POS-10025",
            date: "Sep 04, 2026",
            source: "POS",
            customer: { name: "Retail Walk-in Customer", phone: "01700-000000", email: "pos@ponchomukh.com", address: "In-Store Counter #01, Dhaka" },
            items: [
              { name: "Sonifer SF-350 Portable Rechargeable Juicer & Blender", quantity: 1, price: 1299, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&auto=format&fit=crop&q=80" }
            ],
            subtotal: 1299,
            discount: 0,
            shippingFee: 0,
            total: 1299,
            paymentMethod: "Cash",
            paymentStatus: "PAID",
            status: "DELIVERED"
          },
          {
            orderId: "PN10024",
            date: "Sep 04, 2026",
            source: "STOREFRONT",
            customer: { name: "Sumaiya Akter", phone: "01823-456789", email: "sumaiya@gmail.com", address: "Sector 3, Uttara, Dhaka" },
            items: [
              { name: "Joyroom JR-T03S Pro ANC True Wireless Earbuds", quantity: 1, price: 1899, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80" }
            ],
            subtotal: 1899,
            discount: 0,
            shippingFee: 60,
            total: 1959,
            paymentMethod: "bKash Online",
            paymentStatus: "PAID",
            status: "DELIVERED"
          },
          {
            orderId: "PN10023",
            date: "Sep 03, 2026",
            source: "LANDING_PAGE",
            customer: { name: "Tanvir Ahmed", phone: "01712-345678", email: "tanvir@gmail.com", address: "House 12, Road 4, Dhanmondi, Dhaka" },
            items: [
              { name: "Sonifer SF-350 Portable Rechargeable Juicer & Blender", quantity: 2, price: 1299, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&auto=format&fit=crop&q=80" }
            ],
            subtotal: 2598,
            discount: 100,
            shippingFee: 60,
            total: 2558,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "PENDING",
            status: "PROCESSING"
          },
          {
            orderId: "PN10022",
            date: "Sep 02, 2026",
            source: "MANUAL_PHONE",
            customer: { name: "Mahir Faisal", phone: "01934-567890", email: "mahir@gmail.com", address: "GEC Circle, Chattogram" },
            items: [
              { name: "Baseus Blade 100W Power Bank 20000mAh", quantity: 1, price: 4299, image: "https://images.unsplash.com/photo-1609592424368-8a0b0d36c535?w=200&auto=format&fit=crop&q=80" }
            ],
            subtotal: 4299,
            discount: 0,
            shippingFee: 120,
            total: 4419,
            paymentMethod: "bKash",
            paymentStatus: "PAID",
            status: "DELIVERED"
          }
        ]);
      }
    }

    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    try {
      localStorage.setItem("ponchomukh_all_orders", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderId, status: newStatus }),
      });
    } catch (err) {
      console.warn("Could not sync status update to server:", err);
    }
  };

  // Filter Logic: Search + Status + Channel
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o.orderId.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q);

      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;

      let matchesChannel = true;
      if (channelFilter === "ALL") {
        matchesChannel = true;
      } else if (channelFilter === "ECOMMERCE") {
        matchesChannel = o.source === "STOREFRONT" || o.source === "LANDING_PAGE" || !o.source;
      } else if (channelFilter === "POS") {
        matchesChannel = o.source === "POS";
      } else if (channelFilter === "LANDING_PAGE") {
        matchesChannel = o.source === "LANDING_PAGE";
      } else if (channelFilter === "MANUAL_PHONE") {
        matchesChannel = o.source === "MANUAL_PHONE";
      }

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [orders, search, statusFilter, channelFilter]);

  // Channel Metrics Breakdown
  const channelMetrics = useMemo(() => {
    let ecomRevenue = 0;
    let posRevenue = 0;
    let ecomCount = 0;
    let posCount = 0;

    orders.forEach((o) => {
      const val = Number(o.total) || 0;
      if (o.source === "POS") {
        posRevenue += val;
        posCount += 1;
      } else {
        ecomRevenue += val;
        ecomCount += 1;
      }
    });

    return {
      ecomRevenue,
      posRevenue,
      ecomCount,
      posCount,
      totalOrders: orders.length,
      totalRevenue: ecomRevenue + posRevenue,
    };
  }, [orders]);

  // CSV Export
  const handleExportCSV = () => {
    const filename = `ponchomukh_orders_${channelFilter.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
    const headers = [
      "Order ID",
      "Date",
      "Sales Channel",
      "Customer Name",
      "Customer Phone",
      "Customer Email",
      "Shipping Address",
      "Items Purchased",
      "Subtotal",
      "Discount",
      "Shipping",
      "Total Amount",
      "Payment Method",
      "Payment Status",
      "Order Status",
    ];

    let csvContent = "\uFEFF";
    csvContent += headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";

    filteredOrders.forEach((o) => {
      const channelLabel =
        o.source === "POS"
          ? "POS In-Store"
          : o.source === "LANDING_PAGE"
          ? "Landing Page Funnel"
          : o.source === "MANUAL_PHONE"
          ? "Phone Order"
          : "E-Commerce Online";

      const row = [
        o.orderId,
        o.date,
        channelLabel,
        o.customer?.name || "",
        o.customer?.phone || "",
        o.customer?.email || "",
        o.customer?.address || "",
        (o.items || []).map((i: any) => `${i.name} (x${i.quantity})`).join(" | "),
        o.subtotal || 0,
        o.discount || 0,
        o.shippingFee || 0,
        o.total || 0,
        o.paymentMethod || "",
        o.paymentStatus || "",
        o.status || "",
      ];
      csvContent += row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2">
            <span>Sales Orders & Dispatch Hub</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              {filteredOrders.length} Orders
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            Unified management for E-Commerce Online Store, POS In-Store Counters, and Landing Page Funnels
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/pos"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] text-[#FFC40E] hover:bg-[#260700] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <Store className="w-4 h-4 text-[#FFC40E]" />
            <span>Open POS Terminal</span>
          </Link>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#16834A]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* CHANNEL REVENUE COMPARISON CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales Volume</span>
            <DollarSign className="w-4 h-4 text-[#3B0C04]" />
          </div>
          <h3 className="text-2xl font-black text-[#3B0C04]">
            ৳{channelMetrics.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#6B5A52]">Across all sales channels combined</p>
        </div>

        {/* Metric 2: E-Commerce Sales */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#1E3A8A]/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#1E3A8A]">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>E-Commerce Online</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
              {channelMetrics.ecomCount} Orders
            </span>
          </div>
          <h3 className="text-2xl font-black text-[#1E3A8A]">
            ৳{channelMetrics.ecomRevenue.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#6B5A52]">Storefront website & landing pages</p>
        </div>

        {/* Metric 3: POS In-Store Sales */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#16834A]/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#16834A]">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              <span>POS In-Store Sales</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              {channelMetrics.posCount} Orders
            </span>
          </div>
          <h3 className="text-2xl font-black text-[#16834A]">
            ৳{channelMetrics.posRevenue.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#6B5A52]">Retail counter cash & card registers</p>
        </div>

        {/* Metric 4: Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8C7B72]">
            <span className="text-xs font-bold uppercase tracking-wider">Fulfillment Status</span>
            <Package className="w-4 h-4 text-[#D99E00]" />
          </div>
          <h3 className="text-2xl font-black text-[#3B0C04]">{orders.length} Total</h3>
          <p className="text-[11px] text-[#D99E00] font-bold">
            {orders.filter((o) => o.status === "PROCESSING" || o.status === "PENDING").length} Awaiting Dispatch
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS & CHANNEL TABS */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8DCD2] shadow-xs space-y-4">
        {/* Sales Channel Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8DCD2] pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setChannelFilter("ALL")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              channelFilter === "ALL"
                ? "bg-[#3B0C04] text-[#FFC40E] shadow-2xs"
                : "text-[#6B5A52] hover:bg-[#FFF7EE]"
            }`}
          >
            All Sales Channels ({orders.length})
          </button>

          <button
            onClick={() => setChannelFilter("ECOMMERCE")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              channelFilter === "ECOMMERCE"
                ? "bg-[#1E3A8A] text-white shadow-2xs"
                : "text-[#6B5A52] hover:bg-blue-50"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>E-Commerce Sales ({channelMetrics.ecomCount})</span>
          </button>

          <button
            onClick={() => setChannelFilter("POS")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              channelFilter === "POS"
                ? "bg-[#16834A] text-white shadow-2xs"
                : "text-[#6B5A52] hover:bg-emerald-50"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>POS In-Store Sales ({channelMetrics.posCount})</span>
          </button>

          <button
            onClick={() => setChannelFilter("LANDING_PAGE")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              channelFilter === "LANDING_PAGE"
                ? "bg-[#D99E00] text-black shadow-2xs"
                : "text-[#6B5A52] hover:bg-amber-50"
            }`}
          >
            <span>Landing Page Funnels</span>
          </button>

          <button
            onClick={() => setChannelFilter("MANUAL_PHONE")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              channelFilter === "MANUAL_PHONE"
                ? "bg-[#4B5563] text-white shadow-2xs"
                : "text-[#6B5A52] hover:bg-zinc-100"
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Phone Orders</span>
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8C7B72] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#6B5A52] shrink-0">Fulfillment Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-bold text-[#2B160F] outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="PROCESSING">Processing / Packing</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Out for Delivery</option>
              <option value="DELIVERED">Delivered & Complete</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Sales Channel</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Purchased Items</th>
                <th className="py-3 px-4 text-right">Total (৳)</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCD2]/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#8C7B72] font-bold">
                    No orders found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPOS = order.source === "POS";
                  const isLanding = order.source === "LANDING_PAGE";
                  const isPhone = order.source === "MANUAL_PHONE";

                  return (
                    <tr key={order.orderId} className="hover:bg-[#FFF7EE]/30 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-black text-[#3B0C04] text-xs block">
                          #{order.orderId}
                        </span>
                        <span className="text-[10px] text-[#8C7B72]">{order.date}</span>
                      </td>

                      {/* Sales Channel Badge */}
                      <td className="py-3.5 px-4">
                        {isPOS ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Store className="w-3 h-3" />
                            <span>POS IN-STORE</span>
                          </span>
                        ) : isLanding ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-200">
                            <Globe className="w-3 h-3" />
                            <span>LANDING PAGE</span>
                          </span>
                        ) : isPhone ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-zinc-100 text-zinc-800 border border-zinc-200">
                            <PhoneCall className="w-3 h-3" />
                            <span>PHONE ORDER</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                            <Globe className="w-3 h-3" />
                            <span>E-COMMERCE</span>
                          </span>
                        )}
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#2B160F]">{order.customer?.name}</div>
                        <div className="text-[11px] text-[#8C7B72]">{order.customer?.phone}</div>
                        <div className="text-[10px] text-[#6B5A52] max-w-xs truncate" title={order.customer?.address}>
                          {order.customer?.address}
                        </div>
                      </td>

                      {/* Purchased Items */}
                      <td className="py-3.5 px-4 max-w-xs text-[#6B5A52]">
                        {(order.items || []).map((it: any, idx: number) => (
                          <div key={idx} className="line-clamp-1 text-[11px]">
                            • {it.name} <span className="font-bold text-[#3B0C04]">(x{it.quantity})</span>
                          </div>
                        ))}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-black text-sm text-[#16834A]">
                        ৳{Number(order.total || 0).toLocaleString()}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#2B160F]">{order.paymentMethod}</div>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {order.paymentStatus || "PENDING"}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                          className={`h-7 px-2 rounded-lg text-[10px] font-black border outline-none cursor-pointer ${
                            order.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : order.status === "SHIPPED"
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : order.status === "PROCESSING"
                              ? "bg-amber-50 text-amber-700 border-amber-300"
                              : order.status === "CONFIRMED"
                              ? "bg-purple-50 text-purple-700 border-purple-300"
                              : "bg-zinc-50 text-zinc-700 border-zinc-300"
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg bg-[#FFF7EE] hover:bg-[#3B0C04] hover:text-[#FFC40E] text-[#3B0C04] transition-colors"
                          title="View Order Details & Print Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED ORDER SLIP MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-[#E8DCD2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <div>
                <h3 className="text-base font-black text-[#3B0C04]">
                  Order Details #{selectedOrder.orderId}
                </h3>
                <span className="text-[11px] text-[#8C7B72]">
                  Channel: {selectedOrder.source || "E-Commerce Store"} | Date: {selectedOrder.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-[#8C7B72] hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD2] space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#E8DCD2]">
                <div>
                  <span className="font-bold text-[#8C7B72] block">Customer Name:</span>
                  <span className="font-bold text-[#2B160F]">{selectedOrder.customer.name}</span>
                </div>
                <div>
                  <span className="font-bold text-[#8C7B72] block">Contact Phone:</span>
                  <span className="font-bold text-[#3B0C04]">{selectedOrder.customer.phone}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-[#8C7B72] block">Delivery Destination:</span>
                <span className="text-[#2B160F]">{selectedOrder.customer.address}</span>
              </div>

              {/* Items */}
              <div className="pt-2 border-t border-[#E8DCD2] space-y-1.5">
                <span className="font-bold text-[#3B0C04] block">Itemized Products:</span>
                {(selectedOrder.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-[#E8DCD2]">
                    <div>
                      <span className="font-bold text-[#2B160F] block">{item.name}</span>
                      <span className="text-[10px] text-[#8C7B72]">
                        Quantity: {item.quantity} × ৳{item.price}
                      </span>
                    </div>
                    <span className="font-black text-[#16834A]">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-2 border-t border-[#E8DCD2] flex justify-between items-center text-sm font-black">
                <span className="text-[#3B0C04]">Grand Total:</span>
                <span className="text-[#16834A]">৳{Number(selectedOrder.total || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#3B0C04] text-[#FFC40E] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#260700]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Packing Slip</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E8DCD2] font-bold text-xs text-[#6B5A52]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
