"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Language, translations } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, params?: Record<string, string | number>, fallback?: string) => string;
  formatNumber: (value: number | string) => string;
  formatPrice: (amount: number) => string;
  isBangla: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "ponchomukh_lang";

// Bengali digit mapping
const bnDigits: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("bn");

  // Load persisted language choice on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang === "bn" || savedLang === "en") {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        // Default to Bengali
        document.documentElement.lang = "bn";
      }
    } catch {
      // LocalStorage error fallback
      document.documentElement.lang = "bn";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn("Could not save language to localStorage:", e);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === "bn" ? "en" : "bn";
    setLanguage(nextLang);
  };

  // Safe translation retriever supporting nested keys like "nav.home"
  const t = useMemo(() => {
    return (path: string, params?: Record<string, string | number>, fallback?: string): string => {
      const currentDict = translations[language] || translations.bn;
      const keys = path.split(".");
      
      let current: any = currentDict;
      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = current[key];
        } else {
          current = undefined;
          break;
        }
      }

      let result = typeof current === "string" ? current : (fallback ?? path);

      // If params are provided, interpolate {key}
      if (params && typeof result === "string") {
        Object.entries(params).forEach(([paramKey, val]) => {
          result = result.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(val));
        });
      }

      return result;
    };
  }, [language]);

  // Format numbers to Bengali digits if current language is Bangla
  const formatNumber = (value: number | string): string => {
    const str = String(value);
    if (language !== "bn") return str;
    return str.replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
  };

  // Format price with Currency symbol and commas
  const formatPrice = (amount: number): string => {
    const formattedWithCommas = new Intl.NumberFormat("en-US").format(amount);
    if (language === "bn") {
      const bnNumber = formattedWithCommas.replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
      return `৳${bnNumber}`;
    }
    return `৳${formattedWithCommas}`;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    formatNumber,
    formatPrice,
    isBangla: language === "bn",
    isEnglish: language === "en",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
