"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, RefreshCw, Ticket, CheckCircle2 } from "lucide-react";

interface CouponItem {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageCount: number;
  expiryDate: string;
  status: string;
}

const fallbackCoupons: CouponItem[] = [
  {
    id: "coup-1",
    code: "PONCHO10",
    type: "PERCENTAGE",
    value: 10,
    minOrder: 500,
    maxDiscount: 300,
    usageCount: 42,
    expiryDate: "2026-12-31",
    status: "ACTIVE"
  },
  {
    id: "coup-2",
    code: "WELCOME50",
    type: "FIXED",
    value: 50,
    minOrder: 300,
    maxDiscount: 50,
    usageCount: 89,
    expiryDate: "2026-10-31",
    status: "ACTIVE"
  }
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>(fallbackCoupons);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [val, setVal] = useState(10);
  const [minOrder, setMinOrder] = useState(500);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.coupons) && data.coupons.length > 0) {
          setCoupons(data.coupons);
        }
      }
    } catch (err) {
      console.warn("Could not load coupons from DB, using fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const newCoupon: CouponItem = {
      id: `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value: Number(val),
      minOrder: Number(minOrder),
      maxDiscount: type === "PERCENTAGE" ? 300 : Number(val),
      usageCount: 0,
      expiryDate: "2026-12-31",
      status: "ACTIVE"
    };

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCoupon.code,
          type,
          value: newCoupon.value,
          minOrder: newCoupon.minOrder,
          maxDiscount: newCoupon.maxDiscount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.coupon) {
          newCoupon.id = data.coupon.id;
        }
      }
    } catch (err) {
      console.warn("Could not persist coupon to DB:", err);
    } finally {
      setCoupons((prev) => [newCoupon, ...prev]);
      setIsSubmitting(false);
      setIsAddOpen(false);
      setCode("");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this coupon code?")) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/admin/coupons?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Could not delete coupon from DB:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#3B0C04] flex items-center gap-2">
            <span>Discounts & Promo Coupons</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B0C04] text-[#FFC40E] font-bold">
              Marketing
            </span>
          </h1>
          <p className="text-xs text-[#6B5A52] mt-0.5">
            Create and manage promotional discount coupons, order spend thresholds, and usage limits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCoupons}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-[#3B0C04] text-xs font-bold shadow-xs disabled:opacity-50 transition-colors"
            title="Refresh Coupon List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Coupon</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8DCD2] shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FFF7EE] border-b border-[#E8DCD2] text-[#3B0C04] font-bold">
            <tr>
              <th className="p-3.5">Coupon Code</th>
              <th className="p-3.5">Discount Type</th>
              <th className="p-3.5">Benefit Value</th>
              <th className="p-3.5">Min. Order Threshold</th>
              <th className="p-3.5">Total Redemptions</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DCD2]">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-[#FFFDF9] transition-colors">
                <td className="p-3.5 font-mono font-black text-sm text-[#3B0C04]">
                  {c.code}
                </td>
                <td className="p-3.5 text-[#6B5A52]">
                  {c.type === "PERCENTAGE" ? "Percentage (%)" : "Fixed Discount (৳)"}
                </td>
                <td className="p-3.5 font-bold text-[#16834A]">
                  {c.type === "PERCENTAGE" ? `${c.value}% OFF` : `৳${c.value} OFF`}
                </td>
                <td className="p-3.5 font-medium text-[#2B160F]">৳{c.minOrder.toLocaleString()}</td>
                <td className="p-3.5 text-[#6B5A52] font-semibold">{c.usageCount} uses</td>
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F6F1] text-[#16834A] text-[10px] font-bold border border-[#16834A]/20">
                    {c.status}
                  </span>
                </td>
                <td className="p-3.5 text-center">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg text-[#D64545] hover:bg-[#D64545]/10 transition-colors"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-[#E8DCD2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-sm">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#3B0C04]">Create Promo Coupon</h3>
                  <p className="text-[11px] text-[#6B5A52]">Generate campaign discount vouchers</p>
                </div>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8C7B72] hover:text-[#2B160F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#2B160F] mb-1">Coupon Code: *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PONCHO20, EIDSPECIAL"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] uppercase font-mono font-bold bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">Discount Type:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] font-medium focus:outline-none focus:border-[#3B0C04]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#2B160F] mb-1">Benefit Value:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={val}
                    onChange={(e) => setVal(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] font-semibold focus:outline-none focus:border-[#3B0C04]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2B160F] mb-1">Minimum Order Amount (৳):</label>
                <input
                  type="number"
                  min="0"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] bg-[#FFFDF9] font-semibold focus:outline-none focus:border-[#3B0C04]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DCD2]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8DCD2] text-[#6B5A52] font-bold hover:bg-[#FFF7EE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#3B0C04] text-[#FFC40E] font-bold shadow-sm hover:bg-[#260700] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Generating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
