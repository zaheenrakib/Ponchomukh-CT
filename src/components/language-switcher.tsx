"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Globe, Check, ChevronDown } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "pill" | "compact" | "dropdown" | "drawer";
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "pill",
  className = "",
}) => {
  const { language, setLanguage, toggleLanguage, isBangla } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // VARIANT 1: COMPACT (For Mobile Header row)
  if (variant === "compact") {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] hover:bg-[#FFF7EE] active:scale-95 text-xs font-bold text-[#3B0C04] transition-all shadow-2xs ${className}`}
        title={isBangla ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
        aria-label="Switch Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#3B0C04]" />
        <span className="tracking-wide">
          {language === "bn" ? "EN" : "বাং"}
        </span>
      </button>
    );
  }

  // VARIANT 2: DRAWER (For Mobile Drawer Menu)
  if (variant === "drawer") {
    return (
      <div className={`space-y-2 p-3 rounded-xl bg-[#FFF7EE]/70 border border-[#E8DCD2] ${className}`}>
        <div className="flex items-center justify-between text-xs font-semibold text-[#6B5A52]">
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#3B0C04]" />
            <span>ভাষা / Language</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-[#3B0C04] px-1.5 py-0.5 rounded bg-white border border-[#E8DCD2]">
            {language === "bn" ? "বাংলা সক্রিয়" : "English Active"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLanguage("bn")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              language === "bn"
                ? "bg-[#3B0C04] text-[#FFC40E] shadow-sm"
                : "bg-white text-[#2B160F] hover:bg-[#FFFDF9] border border-[#E8DCD2]"
            }`}
          >
            <span>বাংলা</span>
            {language === "bn" && <Check className="w-3.5 h-3.5 text-[#FFC40E]" />}
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              language === "en"
                ? "bg-[#3B0C04] text-[#FFC40E] shadow-sm"
                : "bg-white text-[#2B160F] hover:bg-[#FFFDF9] border border-[#E8DCD2]"
            }`}
          >
            <span>English</span>
            {language === "en" && <Check className="w-3.5 h-3.5 text-[#FFC40E]" />}
          </button>
        </div>
      </div>
    );
  }

  // VARIANT 3: DROPDOWN (With globe and chevron)
  if (variant === "dropdown") {
    return (
      <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E8DCD2] bg-white hover:bg-[#FFF7EE] text-xs font-semibold text-[#2B160F] hover:text-[#3B0C04] transition-all shadow-2xs"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Globe className="w-3.5 h-3.5 text-[#3B0C04]" />
          <span>{language === "bn" ? "বাংলা" : "English"}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-[#8C7B72] transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl bg-white border border-[#E8DCD2] shadow-xl py-1 z-50 animate-in fade-in-50 duration-150">
            <button
              onClick={() => {
                setLanguage("bn");
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                language === "bn"
                  ? "bg-[#FFF7EE] text-[#3B0C04] font-bold"
                  : "text-[#2B160F] hover:bg-[#FFF7EE]/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">🇧🇩</span>
                <span>বাংলা</span>
              </span>
              {language === "bn" && <Check className="w-3.5 h-3.5 text-[#3B0C04]" />}
            </button>
            <button
              onClick={() => {
                setLanguage("en");
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                language === "en"
                  ? "bg-[#FFF7EE] text-[#3B0C04] font-bold"
                  : "text-[#2B160F] hover:bg-[#FFF7EE]/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">🇬🇧</span>
                <span>English</span>
              </span>
              {language === "en" && <Check className="w-3.5 h-3.5 text-[#3B0C04]" />}
            </button>
          </div>
        )}
      </div>
    );
  }

  // VARIANT 4: PILL SEGMENTED TOGGLE (Default for Desktop Header & announcement bar)
  return (
    <div
      role="group"
      aria-label="Language Switcher"
      className={`inline-flex items-center p-0.5 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] shadow-2xs ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
          language === "bn"
            ? "bg-[#3B0C04] text-[#FFC40E] shadow-2xs scale-[1.02]"
            : "text-[#6B5A52] hover:text-[#3B0C04] hover:bg-[#FFF7EE]"
        }`}
        title="বাংলা ভাষা নির্বাচন করুন"
      >
        <span>বাংলা</span>
      </button>
      <div className="w-px h-3.5 bg-[#E8DCD2]/70 mx-0.5" />
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
          language === "en"
            ? "bg-[#3B0C04] text-[#FFC40E] shadow-2xs scale-[1.02]"
            : "text-[#6B5A52] hover:text-[#3B0C04] hover:bg-[#FFF7EE]"
        }`}
        title="Switch to English"
      >
        <span>EN</span>
      </button>
    </div>
  );
};
