"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { User, Package, Heart } from "lucide-react";

function AccountContent() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2B160F] dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-left">
        <h1 className="font-sans font-black text-2xl sm:text-3xl text-[#3B0C04] dark:text-white mb-8">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-[#E8DCD2] space-y-2 font-bold text-xs">
            <a href="/account" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#3B0C04] text-white">
              <User className="h-4 w-4" />
              <span>Dashboard</span>
            </a>

            <a href="/order-tracking" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-700 hover:bg-[#FFF7EE]">
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </a>

            <a href="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-700 hover:bg-[#FFF7EE]">
              <Heart className="h-4 w-4" />
              <span>Wishlist</span>
            </a>
          </aside>

          {/* Main Account Details */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-[#E8DCD2] space-y-4">
              <h2 className="font-sans font-black text-lg text-[#3B0C04] border-b border-zinc-100 pb-2">
                Account Overview
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2]">
                  <span className="text-zinc-400 text-[10px] uppercase font-bold block">Customer Name</span>
                  <span className="font-bold text-[#3B0C04] text-sm">Zaheen Rakib</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FFF7EE] border border-[#E8DCD2]">
                  <span className="text-zinc-400 text-[10px] uppercase font-bold block">Phone Number</span>
                  <span className="font-bold text-[#3B0C04] text-sm">+880 1700-000000</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <CartProvider>
      <AccountContent />
    </CartProvider>
  );
}
