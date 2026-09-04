import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#3B0C04",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "পঞ্চমুখ (Ponchomukh) | পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ",
  description: "পঞ্চমুখ একটি modern Bangladesh-focused e-commerce platform। Gadgets, Electronics, Home & Kitchen, Travel Accessories এবং Lifestyle পণ্য সবচেয়ে সহজে ও দ্রুত ডেলিভারিতে পান।",
  keywords: ["Ponchomukh", "পঞ্চমুখ", "E-commerce Bangladesh", "Online Shopping BD", "Gadgets", "Electronics", "Cash on Delivery BD"],
  authors: [{ name: "Ponchomukh Team" }],
  openGraph: {
    title: "পঞ্চমুখ (Ponchomukh) — পছন্দে, প্রয়োজনে, প্রাপ্তিতে — পঞ্চমুখ",
    description: "আপনার পছন্দের পণ্য, এখন এক ঠিকানায়। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    type: "website",
    locale: "bn_BD",
    siteName: "Ponchomukh E-Commerce",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body className="bg-[#FFFDF9] text-[#2B160F] font-sans antialiased selection:bg-[#FFC40E]/30 selection:text-[#3B0C04] min-h-screen flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
