"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { Phone, Mail, MapPin, MessageSquare, Check } from "lucide-react";

function ContactContent() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12 text-left space-y-10">
        <div className="text-center space-y-2">
          <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04] dark:text-white">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-zinc-500">
            আমরা সাহায্য করতে প্রস্তুত! যেকোনো প্রয়োজনে আমাদের জানান।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Details */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-[#E8DCD2] space-y-6">
            <h2 className="font-sans font-black text-lg text-[#3B0C04] border-b border-zinc-150 pb-2">
              Get In Touch
            </h2>

            <div className="space-y-4 text-xs font-semibold text-zinc-700">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#3B0C04]" />
                <div>
                  <span className="text-zinc-400 text-[10px] block">Phone</span>
                  <span>+880 1700-000000</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                <div>
                  <span className="text-zinc-400 text-[10px] block">WhatsApp</span>
                  <span>+880 1700-000000</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#3B0C04]" />
                <div>
                  <span className="text-zinc-400 text-[10px] block">Email</span>
                  <span>support@ponchomukh.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#3B0C04]" />
                <div>
                  <span className="text-zinc-400 text-[10px] block">Address</span>
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-[#E8DCD2]">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-[#3B0C04]">বার্তা সফলভাবে পাঠানো হয়েছে!</h3>
                <p className="text-xs text-zinc-500">আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-sans font-black text-lg text-[#3B0C04] border-b border-zinc-150 pb-2">
                  Send a Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-600 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] text-xs font-semibold outline-none focus:border-[#3B0C04]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-600 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01700000000"
                      className="w-full h-10 px-3 rounded-xl border border-[#E8DCD2] text-xs font-semibold outline-none focus:border-[#3B0C04]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your query..."
                    className="w-full p-3 rounded-xl border border-[#E8DCD2] text-xs font-semibold outline-none focus:border-[#3B0C04]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-white font-bold text-xs transition-all shadow-md"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default function ContactPage() {
  return (
    <CartProvider>
      <ContactContent />
    </CartProvider>
  );
}
