"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/context/cart-context";
import { Lock, Phone, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useCart();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;

    showToast("✓ সফলভাবে লগইন হয়েছে!");
    router.push("/account");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8DCD2] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center font-bold text-xl mx-auto">
              প
            </div>
            <h1 className="text-2xl font-black text-[#3B0C04]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#6B5A52]">
              আপনার পঞ্চমুখ অ্যাকাউন্টে লগইন করুন
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#2B160F] mb-1">
                মোবাইল নম্বর অথবা ইমেইল:
              </label>
              <input
                type="text"
                required
                placeholder="017XXXXXXXX অথবা user@email.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[#2B160F]">পাসওয়ার্ড:</label>
                <Link href="/forgot-password" className="text-[#3B0C04] font-semibold hover:underline">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-sm shadow-sm transition-colors"
            >
              লগইন করুন (Login)
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E8DCD2]/60 text-xs text-[#6B5A52]">
            <span>নতুন গ্রাহক? </span>
            <Link href="/register" className="font-bold text-[#3B0C04] hover:underline">
              অ্যাকাউন্ট তৈরি করুন (Register)
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
