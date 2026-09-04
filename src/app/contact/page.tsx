"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useCart } from "@/context/cart-context";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const { showToast } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setSubmitted(true);
    showToast("✓ আপনার বার্তা সফলভাবে পাঠানো হয়েছে!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Header Breadcrumb */}
        <div className="bg-[#FFF7EE] border-b border-[#E8DCD2] py-8 text-center">
          <div className="container-custom max-w-xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-[#3B0C04]">
              যোগাযোগ করুন (Contact Us)
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5A52]">
              যেকোনো প্রশ্ন, তথ্য বা অভিযোগের জন্য আমাদের হেল্পলাইনে যোগাযোগ করুন
            </p>
          </div>
        </div>

        <div className="container-custom py-10 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Contact Info */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#3B0C04]">কাস্টমার কেয়ার সাপোর্ট</h2>
                <p className="text-xs text-[#6B5A52] mt-1">
                  আমাদের সাপোর্ট টিম সপ্তাহে ৭ দিন সকাল ১০টা থেকে রাত ১০টা পর্যন্ত আপনাদের সেবায় নিয়োজিত।
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF7EE] text-[#3B0C04] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#2B160F] block">হটলাইন নম্বর:</strong>
                    <a href="tel:+8801700000000" className="text-[#3B0C04] font-bold hover:underline">
                      +880 1700-000000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 text-[#075E54] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div>
                    <strong className="text-[#2B160F] block">হোয়াটসঅ্যাপ সাপোর্ট:</strong>
                    <a
                      href="https://wa.me/8801700000000"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#075E54] font-bold hover:underline"
                    >
                      +880 1700-000000 (সরাসরি চ্যাট)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF7EE] text-[#3B0C04] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#2B160F] block">ইমেইল ঠিকানা:</strong>
                    <a href="mailto:support@ponchomukh.com" className="text-[#3B0C04] font-bold hover:underline">
                      support@ponchomukh.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF7EE] text-[#3B0C04] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#2B160F] block">অফিস ও ওয়্যারহাউজ ঠিকানা:</strong>
                    <span className="text-[#6B5A52]">বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা-১২০৫, বাংলাদেশ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8DCD2] shadow-xs">
              <h2 className="text-lg font-bold text-[#3B0C04] mb-4">আমাদের মেসেজ পাঠান</h2>

              {submitted ? (
                <div className="p-8 text-center rounded-xl bg-[#E8F6F1] border border-[#16834A]/30 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#16834A] mx-auto" />
                  <h3 className="text-sm font-bold text-[#16834A]">
                    আপনার মেসেজ সফলভাবে গৃহীত হয়েছে!
                  </h3>
                  <p className="text-xs text-[#6B5A52]">
                    আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#2B160F] mb-1">আপনার নাম: *</label>
                    <input
                      type="text"
                      required
                      placeholder="মোঃ সাকিব হাসান"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2B160F] mb-1">মোবাইল নম্বর: *</label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2B160F] mb-1">ইমেইল (ঐচ্ছিক):</label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2B160F] mb-1">বার্তা / প্রশ্ন: *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="আপনার প্রশ্ন বা মতামত বিস্তারিত লিখুন..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] focus:outline-none focus:border-[#3B0C04]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-lg bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>মেসেজ পাঠান (Send Message)</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
