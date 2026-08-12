"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ponchomukh.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMsg(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-[#E8DCD2] dark:border-zinc-800 p-8 shadow-xl text-left space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-[#3B0C04] text-[#FFC40E] font-black flex items-center justify-center text-xl mx-auto shadow-md">
            P
          </div>
          <h1 className="font-sans font-black text-2xl text-[#3B0C04] dark:text-white">
            Ponchomukh Admin
          </h1>
          <p className="text-xs font-semibold text-zinc-500">
            Please sign in to access the control panel
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ponchomukh.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8DCD2] text-xs font-semibold outline-none focus:border-[#3B0C04]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8DCD2] text-xs font-semibold outline-none focus:border-[#3B0C04]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-white font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Panel"}
          </button>
        </form>

        <div className="p-3 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2] text-[11px] text-zinc-600 font-medium leading-relaxed">
          💡 <strong>Default Admin Credentials:</strong><br />
          Email: <code className="font-bold text-[#3B0C04]">admin@ponchomukh.com</code><br />
          Password: <code className="font-bold text-[#3B0C04]">admin123</code>
        </div>

      </div>
    </div>
  );
}
