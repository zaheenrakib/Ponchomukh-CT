"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  MessageCircle,
  Video,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard
} from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/social-icons";

export const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#260700] text-white border-t border-[#3B0C04] mt-auto">
      {/* Trust Mini Banner above footer columns */}
      <div className="border-b border-white/10 py-6 bg-[#1A0400]">
        <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#FFC40E]">দ্রুত ডেলিভারি</p>
              <p className="text-[#8C7B72] text-[11px]">সারা বাংলাদেশে হোম ডেলিভারি</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#FFC40E]">ক্যাশ অন ডেলিভারি</p>
              <p className="text-[#8C7B72] text-[11px]">পণ্য হাতে পেয়ে মূল্য পরিশোধ</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#FFC40E]">৭ দিনের রিটার্ন</p>
              <p className="text-[#8C7B72] text-[11px]">সহজ রিটার্ন ও রিপ্লেসমেন্ট</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#FFC40E]">১০০% বিশ্বস্ত শপিং</p>
              <p className="text-[#8C7B72] text-[11px]">যাচাইকৃত ও অরিজিনাল পণ্য</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFC40E] text-[#260700] flex items-center justify-center font-bold text-lg shadow-sm">
                প
              </div>
              <span className="text-2xl font-black tracking-tight text-[#FFC40E]">
                PONCHOMUKH
              </span>
            </Link>
            <p className="text-xs font-semibold text-[#FFC40E]/90 italic">
              “পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ।”
            </p>
            <p className="text-xs text-[#E8DCD2]/80 leading-relaxed">
              পঞ্চমুখ একটি আধুনিক ও বিশ্বস্ত বাংলাদেশি ই-কমার্স প্ল্যাটফর্ম। দৈনন্দিন প্রয়োজনীয় গ্যাজেট, ইলেকট্রনিক্স, হোম-কিচেন ও লাইফস্টাইল পণ্য পৌঁছে দিচ্ছি আপনার দোরগোড়ায়।
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com/ponchomukh"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#FFC40E] hover:text-[#260700] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/ponchomukh"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#FFC40E] hover:text-[#260700] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#FFC40E] hover:text-[#260700] flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection("quick-links")}
            >
              <h3 className="text-sm font-bold text-[#FFC40E] uppercase tracking-wider mb-4">
                কুইক লিঙ্কসমূহ
              </h3>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSection === "quick-links" ? "rotate-180" : ""
                }`}
              />
            </div>
            <ul
              className={`space-y-2.5 text-xs text-[#E8DCD2]/80 ${
                openSection === "quick-links" ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/" className="hover:text-[#FFC40E] transition-colors">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#FFC40E] transition-colors">
                  সকল পণ্য (Shop)
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-[#FFC40E] transition-colors">
                  নতুন পণ্য (New Arrivals)
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=bestseller" className="hover:text-[#FFC40E] transition-colors">
                  বেস্ট সেলার (Best Sellers)
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=offers" className="hover:text-[#FFC40E] transition-colors">
                  স্পেশাল অফার (Special Offers)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFC40E] transition-colors">
                  আমাদের সম্পর্কে (About Us)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service & Legal */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection("customer-service")}
            >
              <h3 className="text-sm font-bold text-[#FFC40E] uppercase tracking-wider mb-4">
                কাস্টমার সাপোর্ট & পলিসি
              </h3>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSection === "customer-service" ? "rotate-180" : ""
                }`}
              />
            </div>
            <ul
              className={`space-y-2.5 text-xs text-[#E8DCD2]/80 ${
                openSection === "customer-service" ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/order-tracking" className="hover:text-[#FFC40E] transition-colors">
                  অর্ডার ট্র্যাকিং (Track Order)
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FFC40E] transition-colors">
                  সাধারণ প্রশ্ন ও উত্তর (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#FFC40E] transition-colors">
                  ডেলিভারি পলিসি (Shipping Policy)
                </Link>
              </li>
              <li>
                <Link href="/return-refund-policy" className="hover:text-[#FFC40E] transition-colors">
                  রিটার্ন ও রিফান্ড (Return & Refund)
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#FFC40E] transition-colors">
                  প্রাইভেসি পলিসি (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-[#FFC40E] transition-colors">
                  শর্তাবলী (Terms & Conditions)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Business Details */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer md:cursor-default"
              onClick={() => toggleSection("contact-info")}
            >
              <h3 className="text-sm font-bold text-[#FFC40E] uppercase tracking-wider mb-4">
                যোগাযোগের ঠিকানা
              </h3>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSection === "contact-info" ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`space-y-3 text-xs text-[#E8DCD2]/80 ${
                openSection === "contact-info" ? "block" : "hidden md:block"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFC40E] shrink-0 mt-0.5" />
                <span>বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা-১২০৫, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFC40E] shrink-0" />
                <a href="tel:+8801700000000" className="hover:text-[#FFC40E]">
                  +880 1700-000000 (সকাল ১০টা - রাত ১০টা)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FFC40E] shrink-0" />
                <a href="mailto:support@ponchomukh.com" className="hover:text-[#FFC40E]">
                  support@ponchomukh.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FFC40E] shrink-0" />
                <span>সপ্তাহে ৭ দিন সার্বক্ষণিক সেবা</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-white/10 py-5 bg-[#1A0400] text-center text-xs text-[#8C7B72]">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} PONCHOMUKH (পঞ্চমুখ)। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-[11px] text-[#E8DCD2]/60">
            Secure Shopping with Cash on Delivery & SSL Payment Integration Ready
          </p>
        </div>
      </div>
    </footer>
  );
};
