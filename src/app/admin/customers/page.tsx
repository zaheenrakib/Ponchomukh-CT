"use client";

import React, { useState } from "react";
import { Users, Search, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([
    {
      id: "cust-1",
      name: "তানভীর আহমেদ",
      phone: "01712-345678",
      email: "tanvir.ahmed@example.com",
      joinedDate: "০১ আগস্ট, ২০২৬",
      totalOrders: 4,
      totalSpent: 6450,
      status: "ACTIVE"
    },
    {
      id: "cust-2",
      name: "সুমাইয়া আক্তার",
      phone: "01823-456789",
      email: "sumaiya.akter@example.com",
      joinedDate: "১৫ আগস্ট, ২০২৬",
      totalOrders: 2,
      totalSpent: 3850,
      status: "ACTIVE"
    },
    {
      id: "cust-3",
      name: "রফিকুল ইসলাম",
      phone: "01934-567890",
      email: "rafiqul.islam@example.com",
      joinedDate: "২০ আগস্ট, ২০২৬",
      totalOrders: 1,
      totalSpent: 1299,
      status: "ACTIVE"
    }
  ]);

  const [search, setSearch] = useState("");

  const toggleStatus = (id: string) => {
    setCustomers(
      customers.map((c) =>
        c.id === id ? { ...c, status: c.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" } : c
      )
    );
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04]">
            কাস্টমার তালিকা (Customers)
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            নিবন্ধিত কাস্টমারদের অর্ডার ও লেনদেন পর্যবেক্ষণ করুন
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs flex items-center gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="নাম, ফোন বা ইমেইল দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B72]" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8DCD2] shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FFF7EE] border-b border-[#E8DCD2] text-[#3B0C04] font-bold">
            <tr>
              <th className="p-3.5">কাস্টমার নাম</th>
              <th className="p-3.5">মোবাইল & ইমেইল</th>
              <th className="p-3.5">নিবন্ধন তারিখ</th>
              <th className="p-3.5">মোট অর্ডার</th>
              <th className="p-3.5">মোট ব্যয় (Spent)</th>
              <th className="p-3.5">স্ট্যাটাস</th>
              <th className="p-3.5 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DCD2]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#FFFDF9]">
                <td className="p-3.5 font-bold text-[#2B160F]">{c.name}</td>
                <td className="p-3.5">
                  <p className="font-semibold text-[#3B0C04]">{c.phone}</p>
                  <p className="text-[11px] text-[#8C7B72]">{c.email}</p>
                </td>
                <td className="p-3.5 text-[#6B5A52]">{c.joinedDate}</td>
                <td className="p-3.5 font-bold">{c.totalOrders} টি</td>
                <td className="p-3.5 font-black text-[#3B0C04]">৳{c.totalSpent}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === "ACTIVE" ? "bg-[#E8F6F1] text-[#16834A]" : "bg-[#D64545]/10 text-[#D64545]"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => toggleStatus(c.id)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      c.status === "ACTIVE"
                        ? "bg-[#D64545]/10 text-[#D64545] hover:bg-[#D64545] hover:text-white"
                        : "bg-[#E8F6F1] text-[#16834A]"
                    }`}
                  >
                    {c.status === "ACTIVE" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
