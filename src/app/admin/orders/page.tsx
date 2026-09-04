"use client";

import React, { useState, useEffect } from "react";
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
  MapPin
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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
            customer: { name: "তানভীর আহমেদ", phone: "01712-345678", email: "tanvir@gmail.com", address: "বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা-১২০৫" },
            items: [
              { name: "Sonifer SF-350 Portable Rechargeable Juicer & Blender", quantity: 1, price: 1299, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&auto=format&fit=crop&q=80" }
            ],
            subtotal: 1299,
            discount: 0,
            shippingFee: 60,
            total: 1359,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "PENDING",
            status: "PROCESSING"
          },
          {
            orderId: "PN10024",
            date: "০৪ সেপ্টেম্বর, ২০২৬",
            customer: { name: "সুমাইয়া আক্তার", phone: "01823-456789", email: "sumaiya@gmail.com", address: "সেক্টর ৩, উত্তরা, ঢাকা" },
            items: [
              { name: "Joyroom JR-T03S Pro ANC True Wireless Earbuds", quantity: 1, price: 1899, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80" }
            ],
            subtotal: 1899,
            discount: 0,
            shippingFee: 60,
            total: 1959,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "PENDING",
            status: "CONFIRMED"
          },
          {
            orderId: "PN10023",
            date: "০৩ সেপ্টেম্বর, ২০২৬",
            customer: { name: "মাহির ফয়সাল", phone: "01934-567890", email: "mahir@gmail.com", address: "জিইসি মোড়, চট্টগ্রাম" },
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
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
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
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone?.includes(search);
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            অর্ডার ব্যবস্থাপনা (Order Management)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            কাস্টমার অর্ডার প্রসেসিং, ডেলিভারি ট্র্যাকিং ও বিলিং স্ট্যাটাস আপডেট
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="অর্ডার আইডি, কাস্টমার নাম বা ফোন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B72]" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] font-semibold text-[#2B160F]"
          >
            <option value="ALL">সকল স্ট্যাটাস ({orders.length})</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E8DCD2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FFF7EE] border-b border-[#E8DCD2] text-[#3B0C04] font-bold">
              <tr>
                <th className="p-3.5">অর্ডার আইডি</th>
                <th className="p-3.5">গ্রাহকের নাম ও ফোন</th>
                <th className="p-3.5">তারিখ</th>
                <th className="p-3.5">বিল মোট</th>
                <th className="p-3.5">পেমেন্ট</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCD2]">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-[#FFFDF9]">
                  <td className="p-3.5 font-mono font-bold text-[#3B0C04]">
                    {order.orderId}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-[#2B160F]">{order.customer?.name || "Customer"}</p>
                    <p className="text-[11px] text-[#8C7B72]">{order.customer?.phone || "N/A"}</p>
                  </td>
                  <td className="p-3.5 text-[#6B5A52]">{order.date}</td>
                  <td className="p-3.5 font-black text-[#3B0C04]">৳{order.total}</td>
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
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS POPUP MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border border-[#E8DCD2] max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <div>
                <h2 className="text-base font-black text-[#3B0C04]">
                  অর্ডার বিস্তারিত: #{selectedOrder.orderId}
                </h2>
                <p className="text-[11px] text-[#8C7B72]">তারিখ: {selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#8C7B72] hover:text-[#2B160F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FFFDF9] border border-[#E8DCD2] text-xs">
              <div className="space-y-1">
                <p className="font-bold text-[#3B0C04] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> গ্রাহকের তথ্য
                </p>
                <p><strong>নাম:</strong> {selectedOrder.customer?.name}</p>
                <p><strong>মোবাইল:</strong> {selectedOrder.customer?.phone}</p>
                {selectedOrder.customer?.email && <p><strong>ইমেইল:</strong> {selectedOrder.customer?.email}</p>}
              </div>

              <div className="space-y-1">
                <p className="font-bold text-[#3B0C04] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> ডেলিভারি ঠিকানা
                </p>
                <p className="text-[#6B5A52] leading-relaxed">{selectedOrder.customer?.address || "ঢাকা, বাংলাদেশ"}</p>
              </div>
            </div>

            {/* Product Items Table */}
            <div>
              <h3 className="text-xs font-bold text-[#3B0C04] mb-2 uppercase tracking-wider">
                অর্ডারের পণ্যসমূহ:
              </h3>
              <div className="rounded-xl border border-[#E8DCD2] overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FFF7EE] text-[#3B0C04] font-bold border-b border-[#E8DCD2]">
                    <tr>
                      <th className="p-2.5">পণ্য</th>
                      <th className="p-2.5">পরিমাণ</th>
                      <th className="p-2.5">একক মূল্য</th>
                      <th className="p-2.5 text-right">মোট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCD2]">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-semibold text-[#2B160F]">{item.name}</td>
                        <td className="p-2.5 font-bold">{item.quantity}</td>
                        <td className="p-2.5">৳{item.price}</td>
                        <td className="p-2.5 text-right font-black text-[#3B0C04]">৳{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>সাবটোটাল:</span>
                <span className="font-bold">৳{selectedOrder.subtotal || selectedOrder.total - 60}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold">৳{selectedOrder.shippingFee || 60}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#3B0C04] pt-2 border-t border-[#E8DCD2]">
                <span>সর্বমোট প্রদেয়:</span>
                <span className="text-base">৳{selectedOrder.total}</span>
              </div>
            </div>

            {/* Status Workflow Controller */}
            <div className="pt-2 border-t border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2B160F]">স্ট্যাটাস পরিবর্তন করুন:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.orderId, e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#3B0C04] bg-[#FFFDF9] font-bold text-[#3B0C04] focus:outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="RETURNED">RETURNED</option>
                </select>
              </div>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#E8DCD2] text-xs font-bold text-[#2B160F] hover:bg-[#FFF7EE]"
              >
                <Printer className="w-4 h-4" />
                <span>ইনভয়েস প্রিন্ট</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
