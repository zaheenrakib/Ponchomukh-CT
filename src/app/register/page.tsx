"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/context/cart-context";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useCart();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !password.trim()) return;

    showToast("✓ অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
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
              Create Account
            </h1>
            <p className="text-xs text-[#6B5A52]">
              পঞ্চমুখে নতুন কাস্টমার অ্যাকাউন্ট রেজিস্ট্রেশন করুন
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#2B160F] mb-1">
                আপনার নাম <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মোঃ সাকিব হাসান"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2B160F] mb-1">
                মোবাইল নম্বর <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2B160F] mb-1">
                ইমেইল অ্যাড্রেস (ঐচ্ছিক):
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2B160F] mb-1">
                পাসওয়ার্ড <span className="text-[#D64545]">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs focus:outline-none focus:border-[#3B0C04]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-sm shadow-sm transition-colors"
            >
              রেজিস্ট্রেশন সম্পন্ন করুন
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E8DCD2]/60 text-xs text-[#6B5A52]">
            <span>ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
            <Link href="/login" className="font-bold text-[#3B0C04] hover:underline">
              লগইন করুন (Login)
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
