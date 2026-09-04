"use client";

import React, { useState } from "react";
import { X, Truck, Sparkles } from "lucide-react";
import Link from "next/link";

interface AnnouncementBarProps {
  text?: string;
  link?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  text = "🚚 সারা বাংলাদেশে হোম ডেলিভারি | Cash on Delivery Available",
  link = "/shop"
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#3B0C04] text-[#FFC40E] border-b border-[#260700] text-xs md:text-sm font-medium transition-all duration-200">
      <div className="container-custom h-9 flex items-center justify-between">
        {/* Left decoration spacer for balance on desktop */}
        <div className="hidden md:flex items-center gap-2 text-white/70 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FFC40E]" />
          <span>অফিসিয়াল স্টোর</span>
        </div>

        {/* Center message */}
        <div className="flex-1 text-center truncate px-2">
          {link ? (
            <Link
              href={link}
              className="inline-flex items-center justify-center gap-1.5 hover:underline hover:text-white transition-colors"
            >
              <span>{text}</span>
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center gap-1.5">
              <span>{text}</span>
            </span>
          )}
        </div>

        {/* Right close button */}
        <div className="flex items-center">
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded hover:bg-black/20 text-[#FFC40E]/80 hover:text-white transition-colors"
            aria-label="Close Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
