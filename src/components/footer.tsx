"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard
} from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/social-icons";

export const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { t } = useLanguage();

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
              <p className="font-bold text-[#FFC40E]">{t("trustBanner.fastDelivery")}</p>
              <p className="text-[#8C7B72] text-[11px]">{t("trustBanner.fastDeliverySub")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#FFC40E]">{t("trustBanner.cod")}</p>
              <p className="text-[#8C7B72] text-[11px]">{t("trustBanner.codSub")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#FFC40E]">{t("trustBanner.returns")}</p>
              <p className="text-[#8C7B72] text-[11px]">{t("trustBanner.returnsSub")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B0C04] text-[#FFC40E] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#FFC40E]">{t("trustBanner.trusted")}</p>
              <p className="text-[#8C7B72] text-[11px]">{t("trustBanner.trustedSub")}</p>
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
              {t("footer.quote")}
            </p>
            <p className="text-xs text-[#E8DCD2]/80 leading-relaxed">
              {t("footer.brandStory")}
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
                {t("footer.quickLinks")}
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
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#FFC40E] transition-colors">
                  {t("nav.allProducts")}
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-[#FFC40E] transition-colors">
                  {t("nav.newArrivals")}
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=bestseller" className="hover:text-[#FFC40E] transition-colors">
                  {t("nav.bestSellers")}
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=offers" className="hover:text-[#FFC40E] transition-colors">
                  {t("nav.specialOffers")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFC40E] transition-colors">
                  {t("nav.about")}
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
                {t("footer.customerService")}
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
                  {t("nav.orderTracking")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FFC40E] transition-colors">
                  {t("footer.faq")}
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#FFC40E] transition-colors">
                  {t("footer.shipping")}
                </Link>
              </li>
              <li>
                <Link href="/return-refund-policy" className="hover:text-[#FFC40E] transition-colors">
                  {t("footer.returnRefund")}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#FFC40E] transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-[#FFC40E] transition-colors">
                  {t("footer.terms")}
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
                {t("footer.contactInfo")}
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
                <span>{t("footer.address")}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFC40E] shrink-0" />
                <a href="tel:+8801700000000" className="hover:text-[#FFC40E]">
                  {t("footer.phone")} ({t("footer.supportTime")})
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FFC40E] shrink-0" />
                <a href="mailto:support@ponchomukh.com" className="hover:text-[#FFC40E]">
                  {t("footer.email")}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FFC40E] shrink-0" />
                <span>{t("footer.supportTime")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-white/10 py-5 bg-[#1A0400] text-center text-xs text-[#8C7B72]">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {t("common.brandName")}। {t("common.allRightsReserved")}</p>
          <p className="text-[11px] text-[#E8DCD2]/60">
            Secure Shopping with Cash on Delivery & SSL Payment Integration Ready
          </p>
        </div>
      </div>
    </footer>
  );
};
