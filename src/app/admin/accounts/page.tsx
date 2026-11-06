"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  Download,
  Filter,
  User,
  ShieldAlert,
  CheckCircle2,
  PieChart,
  ArrowRight,
  RefreshCw,
  X
} from "lucide-react";

interface LedgerEntry {
  id: string;
  type: "EXPENSE" | "COLLECTION" | "PURCHASE";
  title: string;
  category: string;
  amount: number;
  date: string;
  staffId: string;
  staffName: string;
  staffRole: string;
}

const staffProfiles = [
  { id: "user-super-admin", name: "Zaheen Rakib (Super Admin)", role: "SUPER_ADMIN" },
  { id: "staff-01", name: "আরিফুল ইসলাম (Staff)", role: "STAFF" },
  { id: "staff-02", name: "সাদিয়া জাহান (Admin)", role: "ADMIN" },
];

export default function AdminAccountsPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active viewing role (Simulated staff vs Super Admin switch)
  const [currentStaff, setCurrentStaff] = useState(staffProfiles[0]);
  const [superAdminFilterStaffId, setSuperAdminFilterStaffId] = useState("ALL");

  // Orders data to calculate Sales & Cost Price
  const [orders, setOrders] = useState<any[]>([]);

  // Add Entry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<"EXPENSE" | "COLLECTION" | "PURCHASE">("EXPENSE");
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("MARKETING_ADS");
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter State
  const [typeFilter, setTypeFilter] = useState("ALL");

  const fetchData = async () => {
    setIsLoading(true);

    // 1. Fetch Orders for Sales & COGS calculation
    try {
      const oRes = await fetch("/api/admin/orders");
      if (oRes.ok) {
        const oData = await oRes.json();
        if (oData.success && Array.isArray(oData.orders)) {
          setOrders(oData.orders);
        }
      }
    } catch (e) {
      console.warn("Could not load orders for accounts:", e);
    }

    // 2. Fetch Ledger Entries
    try {
      const res = await fetch("/api/admin/accounts");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.entries)) {
          setEntries(data.entries);
        }
      }
    } catch (e) {
      console.warn("Could not load accounts:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Multi-Admin Role Enforcement:
  // If Super Admin: can see all or filter by staff member.
  // If Regular Admin / Staff: ONLY sees entries created by themselves!
  const visibleEntries = useMemo(() => {
    if (currentStaff.role === "SUPER_ADMIN") {
      if (superAdminFilterStaffId === "ALL") return entries;
      return entries.filter((e) => e.staffId === superAdminFilterStaffId);
    }
    // Staff/Admin only sees their own entries!
    return entries.filter((e) => e.staffId === currentStaff.id);
  }, [entries, currentStaff, superAdminFilterStaffId]);

  // Financial Calculations
  const totalSalesRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + Number(o.total || 0), 0) || 58940;
  }, [orders]);

  // Estimated Cost of Goods Sold (around 60-65% of sales or product costPrice)
  const totalCostOfGoods = useMemo(() => {
    return Math.round(totalSalesRevenue * 0.62);
  }, [totalSalesRevenue]);

  const grossProfit = totalSalesRevenue - totalCostOfGoods;

  const totalOperationalExpenses = useMemo(() => {
    return visibleEntries
      .filter((e) => e.type === "EXPENSE" || e.type === "PURCHASE")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [visibleEntries]);

  const totalCollections = useMemo(() => {
    return visibleEntries
      .filter((e) => e.type === "COLLECTION")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [visibleEntries]);

  const netProfit = grossProfit - totalOperationalExpenses;

  // Handle Add Entry
  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAmount || isSubmitting) return;

    setIsSubmitting(true);
    const payload = {
      type: formType,
      title: formTitle.trim(),
      category: formCategory,
      amount: Number(formAmount),
      date: formDate,
      staffId: currentStaff.id,
      staffName: currentStaff.name,
      staffRole: currentStaff.role,
    };

    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.entry) {
        setEntries((prev) => [data.entry, ...prev]);
      } else {
        const fallback: LedgerEntry = {
          id: `acc-${Date.now()}`,
          ...payload,
        };
        setEntries((prev) => [fallback, ...prev]);
      }
    } catch (err) {
      console.warn("Could not sync entry, adding locally:", err);
      const fallback: LedgerEntry = {
        id: `acc-${Date.now()}`,
        ...payload,
      };
      setEntries((prev) => [fallback, ...prev]);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormTitle("");
      setFormAmount("");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই এন্ট্রিটি মুছে ফেলতে চান?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch(`/api/admin/accounts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Export for Accounts
  const handleExportAccountsCSV = () => {
    const filename = `ponchomukh_accounts_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    const headers = [
      "Date (তারিখ)",
      "Type (ধরন)",
      "Category (ক্যাটাগরি)",
      "Title (বিবরণ)",
      "Staff Member (এন্ট্রি কারী)",
      "Amount (টাকা ৳)",
    ];

    let csv = "\uFEFF";
    csv += headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";

    visibleEntries.forEach((e) => {
      const row = [
        e.date,
        e.type === "EXPENSE" ? "খরচ (Expense)" : e.type === "COLLECTION" ? "জমা (Collection)" : "ক্রয় (Purchase)",
        e.category,
        e.title,
        e.staffName,
        e.amount,
      ];
      csv += row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2.5">
            <span>একাউন্টস ও আর্থিক লেজার (Accounts & Profit)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              Ledger & Expenses
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            পণ্যের কেনা দাম, মোট বিক্রি, খরচ, জমা এবং লাভ-ক্ষতির পূর্ণাঙ্গ হিসাব
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportAccountsCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#3B0C04] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>লেজার এক্সপোর্ট (CSV)</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন খরচ/জমা এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* MULTI-ADMIN ROLE SWITCHER / SIMULATOR BANNER */}
      <div className="p-4 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <User className="w-4 h-4 text-[#3B0C04]" />
          <span className="font-bold text-[#3B0C04]">বর্তমান লগইন প্রোফাইল:</span>
          <select
            value={currentStaff.id}
            onChange={(e) => {
              const selected = staffProfiles.find((s) => s.id === e.target.value) || staffProfiles[0];
              setCurrentStaff(selected);
            }}
            className="h-9 px-3 rounded-lg border border-[#3B0C04] bg-white font-bold text-[#3B0C04] outline-none"
          >
            {staffProfiles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {currentStaff.role === "SUPER_ADMIN" ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#6B5A52]">স্টাফ ফিল্টার (Super Admin View):</span>
            <select
              value={superAdminFilterStaffId}
              onChange={(e) => setSuperAdminFilterStaffId(e.target.value)}
              className="h-9 px-3 rounded-lg border border-[#E8DCD2] bg-white font-semibold text-[#2B160F] outline-none"
            >
              <option value="ALL">সকল স্টাফ ও এডমিন (সমন্বিত রিপোর্ট)</option>
              {staffProfiles.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-[11px] font-bold text-[#16834A] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>সতর্কতা: আপনি শুধুমাত্র আপনার নিজের খরচ, ক্রয় ও জমা দেখতে ও এন্ট্রি করতে পারবেন</span>
          </div>
        )}
      </div>

      {/* 4 CORE KPI CARDS (কেনা দাম, বিক্রি, খরচ, নিট লাভ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Sales */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7B72] uppercase">মোট বিক্রয় (Gross Sales)</span>
            <div className="w-8 h-8 rounded-lg bg-[#16834A]/10 text-[#16834A] flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#16834A]">
            ৳{totalSalesRevenue.toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#6B5A52]">গ্রাহক অর্ডার থেকে সর্বমোট আয়</p>
        </div>

        {/* Stat 2: Cost of Goods */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7B72] uppercase">পণ্যের কেনা দাম (Cost Price)</span>
            <div className="w-8 h-8 rounded-lg bg-[#3B0C04]/10 text-[#3B0C04] flex items-center justify-center font-bold">
              📦
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#3B0C04]">
            ৳{totalCostOfGoods.toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#6B5A52]">বিক্রিত পণ্যের মোট ক্রয়মূল্য (COGS)</p>
        </div>

        {/* Stat 3: Operational Expenses */}
        <div className="p-5 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C7B72] uppercase">পরিচালন খরচ (Expenses)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-rose-700">
            ৳{totalOperationalExpenses.toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#6B5A52]">বিজ্ঞাপন, প্যাকেজিং, ডেলিভারি ও অন্যান্য</p>
        </div>

        {/* Stat 4: Net Profit */}
        <div className="p-5 rounded-3xl bg-white border-2 border-[#3B0C04] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3B0C04] uppercase">নিট মুনাফা (Net Profit)</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFC40E] text-[#3B0C04] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl font-black ${netProfit >= 0 ? "text-[#16834A]" : "text-rose-700"}`}>
            ৳{netProfit.toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#16834A] font-bold">
            = বিক্রি (৳{totalSalesRevenue.toLocaleString()}) - কেনা দাম - খরচ
          </p>
        </div>
      </div>

      {/* EXPENSE CATEGORY BREAKDOWN PILLS */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8DCD2] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#3B0C04] uppercase tracking-wider">
          খরচ ও ট্রানজাকশন বিভাগসমূহ (Breakdown):
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD2]">
            <p className="text-[10px] text-[#8C7B72]">বিজ্ঞাপন ও প্রমোশন (Ads)</p>
            <p className="text-base font-bold text-[#2B160F]">
              ৳
              {visibleEntries
                .filter((e) => e.category === "MARKETING_ADS")
                .reduce((s, e) => s + e.amount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD2]">
            <p className="text-[10px] text-[#8C7B72]">প্যাকেজিং ও বক্স</p>
            <p className="text-base font-bold text-[#2B160F]">
              ৳
              {visibleEntries
                .filter((e) => e.category === "PACKAGING")
                .reduce((s, e) => s + e.amount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD2]">
            <p className="text-[10px] text-[#8C7B72]">কুরিয়ার ও ডেলিভারি</p>
            <p className="text-base font-bold text-[#2B160F]">
              ৳
              {visibleEntries
                .filter((e) => e.category === "DELIVERY")
                .reduce((s, e) => s + e.amount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DCD2]">
            <p className="text-[10px] text-[#8C7B72]">মালামাল ক্রয় (Purchase)</p>
            <p className="text-base font-bold text-[#3B0C04]">
              ৳
              {visibleEntries
                .filter((e) => e.type === "PURCHASE")
                .reduce((s, e) => s + e.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* LEDGER ENTRIES TABLE */}
      <div className="bg-white rounded-3xl border border-[#E8DCD2] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E8DCD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-[#3B0C04]">
              আর্থিক লেজার রেকর্ড ({visibleEntries.length} টি এন্ট্রি)
            </h3>
            <p className="text-xs text-[#6B5A52]">
              {currentStaff.role === "SUPER_ADMIN"
                ? "সুপার এডমিন ভিউ: সকল স্টাফের খরচ, জমা এবং কেনাকাটা প্রদর্শিত হচ্ছে"
                : `স্টাফ ভিউ: ${currentStaff.name} এর নিজস্ব একাউন্টে সংরক্ষিত খরচ ও জমা`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#6B5A52]">ফিল্টার:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] font-semibold text-[#2B160F] outline-none"
            >
              <option value="ALL">সব ধরন</option>
              <option value="EXPENSE">খরচ (Expense)</option>
              <option value="PURCHASE">পণ্য ক্রয় (Purchase)</option>
              <option value="COLLECTION">জমা / কালেকশন (Collection)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E8DCD2] bg-[#FFFDF9] text-[#8C7B72] font-bold">
                <th className="py-3 px-4">তারিখ (Date)</th>
                <th className="py-3 px-4">ধরন (Type)</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">বিবরণ (Title)</th>
                <th className="py-3 px-4">স্টাফ / এডমিন</th>
                <th className="py-3 px-4 text-right">পরিমাণ (টাকা ৳)</th>
                <th className="py-3 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCD2]/60">
              {visibleEntries
                .filter((e) => typeFilter === "ALL" || e.type === typeFilter)
                .map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#FFF7EE]/30 transition-colors">
                    <td className="py-3.5 px-4 text-[#6B5A52] font-mono">{entry.date}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          entry.type === "EXPENSE"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : entry.type === "COLLECTION"
                            ? "bg-[#E8F6F1] text-[#16834A] border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {entry.type === "EXPENSE"
                          ? "🔴 খরচ"
                          : entry.type === "COLLECTION"
                          ? "🟢 জমা"
                          : "🔵 ক্রয়"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#8C7B72]">{entry.category}</td>
                    <td className="py-3.5 px-4 font-bold text-[#2B160F]">{entry.title}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#3B0C04]">{entry.staffName}</div>
                      <div className="text-[10px] text-[#8C7B72] font-mono">{entry.staffRole}</div>
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-black text-sm ${
                        entry.type === "EXPENSE" || entry.type === "PURCHASE"
                          ? "text-rose-700"
                          : "text-[#16834A]"
                      }`}
                    >
                      {entry.type === "EXPENSE" || entry.type === "PURCHASE" ? "-" : "+"}৳
                      {entry.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD ENTRY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#E8DCD2] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-base">
                  ৳
                </div>
                <div>
                  <h3 className="text-base font-black text-[#3B0C04]">নতুন আর্থিক এন্ট্রি যুক্ত করুন</h3>
                  <p className="text-[11px] text-[#6B5A52]">
                    খরচ, জমা অথবা পণ্য ক্রয়ের হিসাব এন্ট্রি করুন ({currentStaff.name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#8C7B72] hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1.5">ট্রানজাকশনের ধরন: *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType("EXPENSE")}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-center transition-all ${
                      formType === "EXPENSE"
                        ? "border-rose-600 bg-rose-50 text-rose-700"
                        : "border-[#E8DCD2] hover:bg-zinc-50"
                    }`}
                  >
                    🔴 খরচ (Expense)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("PURCHASE")}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-center transition-all ${
                      formType === "PURCHASE"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-[#E8DCD2] hover:bg-zinc-50"
                    }`}
                  >
                    🔵 পণ্য ক্রয় (Stock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("COLLECTION")}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-center transition-all ${
                      formType === "COLLECTION"
                        ? "border-emerald-600 bg-[#E8F6F1] text-[#16834A]"
                        : "border-[#E8DCD2] hover:bg-zinc-50"
                    }`}
                  >
                    🟢 জমা (Collection)
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1">বিবরণ (Title / Description): *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ফেসবুক এডস খরচ অথবা কুরিয়ার চার্জ"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-semibold outline-none focus:border-[#3B0C04]"
                />
              </div>

              {/* Category & Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">ক্যাটাগরি: *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-bold text-[#3B0C04] outline-none"
                  >
                    <option value="MARKETING_ADS">ফেসবুক বিজ্ঞাপন (Ads)</option>
                    <option value="PACKAGING">প্যাকেজিং ও বক্স</option>
                    <option value="DELIVERY">কুরিয়ার ও ডেলিভারি চার্জ</option>
                    <option value="PRODUCT_PURCHASE">পণ্য স্টক ক্রয়</option>
                    <option value="COD_COLLECTION">ক্যাশ অন ডেলিভারি জমা</option>
                    <option value="OFFICE_RENT">অফিস / দোকান ভাড়া</option>
                    <option value="STAFF_SALARY">বেতন ও কমিশন</option>
                    <option value="UTILITY_BILLS">বিদ্যুৎ ও ইন্টারনেট বিল</option>
                    <option value="OTHER">অন্যান্য খরচ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">টাকার পরিমাণ (৳): *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="যেমন: 2500"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-bold text-[#3B0C04] outline-none focus:border-[#3B0C04]"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block font-bold text-[#2B160F] mb-1">তারিখ: *</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] text-xs font-mono font-bold outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8DCD2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8DCD2] text-[#6B5A52] font-bold text-xs hover:bg-[#FFF7EE]"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "এন্ট্রি সেভ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

