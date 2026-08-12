"use client";

import React, { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = () => {
    setLoading(true);
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCustomers(data.customers);
        }
      })
      .catch((err) => console.error("Failed to load admin customers:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const formatBDT = (value: number) => {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phoneNumber?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-zinc-950 p-8 text-left text-zinc-900 dark:text-zinc-100">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
            Customer Management
          </h1>
          <p className="text-xs text-zinc-500 font-semibold">
            View registered users, order totals, and contact details
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 mb-6 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search customers by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-zinc-200 text-xs font-semibold outline-none focus:border-[#3B0C04]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 shadow-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-zinc-700 dark:text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-150 font-black text-zinc-400 uppercase text-[10px]">
                <th className="pb-3">Customer Name</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 font-bold">
                    Loading customer directory...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 font-bold">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 font-bold text-[#3B0C04]">{c.name}</td>
                    <td className="py-3 font-mono">{c.phoneNumber}</td>
                    <td className="py-3 text-zinc-500">{c.email || "N/A"}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        c.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-800" : "bg-zinc-100 text-zinc-700"
                      }`}>
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3 font-bold">{c.ordersCount} orders</td>
                    <td className="py-3 font-black text-rose-600">{formatBDT(c.totalSpent)}</td>
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
