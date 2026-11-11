import React from "react";

export const BRAND_LOGO_SRC = "/ponchomukh_logo_400x120_transparent.png";

interface BrandLogoMarkProps {
  className?: string;
  alt?: string;
}

/**
 * Renders the high-resolution Ponchomukh transparent emblem cropped cleanly
 * to its square graphic bounds, trimming the wide transparent horizontal
 * padding from the 400x120 source canvas.
 */
export const BrandLogoMark: React.FC<BrandLogoMarkProps> = ({
  className = "w-12 h-12",
  alt = "Ponchomukh Logo",
}) => {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
    >
      <img
        src={BRAND_LOGO_SRC}
        alt={alt}
        className="w-full h-full object-cover object-center select-none"
      />
    </span>
  );
};

