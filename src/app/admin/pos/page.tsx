"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  X,
  RotateCcw,
  User,
  Barcode,
  Layers,
  Store,
  ArrowLeft,
  Clock,
  Sparkles,
  Percent,
  Receipt,
  Check,
  ChevronRight
} from "lucide-react";
import { mockProducts, Product } from "@/lib/mockData";

interface POSCartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export default function AdminPOSPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [cart, setCart] = useState<POSCartItem[]>([]);

  // Customer State
  const [customerType, setCustomerType] = useState<"WALK_IN" | "CUSTOM">("WALK_IN");
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("01700000000");

  // Payment & Billing State
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BKASH" | "CARD">("CASH");
  const [discountType, setDiscountType] = useState<"FLAT" | "PERCENT">("FLAT");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [cashTendered, setCashTendered] = useState<string>("");

  // Completed Receipt Modal State
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Barcode / Search Input Ref for barcode scanner support
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category?.name) set.add(p.category.name);
    });
    return ["ALL", ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === "ALL" ||
        p.category?.name?.toLowerCase() === selectedCategory.toLowerCase() ||
        p.category?.slug?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountType === "PERCENT") {
      return Math.round((subtotal * (discountValue || 0)) / 100);
    }
    return Number(discountValue) || 0;
  }, [subtotal, discountType, discountValue]);

  const grandTotal = Math.max(0, subtotal - discountAmount);

  const numericCashTendered = Number(cashTendered) || 0;
  const changeDue = Math.max(0, numericCashTendered - grandTotal);

  // Add Item to Cart
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const price = product.salePrice || product.basePrice;
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, unitPrice: price }];
    });
  };

  // Update Item Quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as POSCartItem[];
    });
  };

  // Remove Item
  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Clear Cart
  const handleClearCart = () => {
    if (cart.length === 0) return;
    if (confirm("Are you sure you want to clear current POS bill?")) {
      setCart([]);
      setDiscountValue(0);
      setCashTendered("");
    }
  };

  // Handle Quick Cash Buttons
  const handleQuickCash = (amount: number) => {
    setCashTendered(String(amount));
  };

  // Complete Sale
  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty! Select at least one product to checkout.");
      return;
    }

    setIsProcessing(true);

    const posOrderId = `POS-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const orderData = {
      orderId: posOrderId,
      orderNumber: posOrderId,
      date: formattedDate,
      rawDate: nowIso,
      source: "POS",
      orderNotes: `[POS] In-Store Counter Sale. Cashier: Super Admin. Payment: ${paymentMethod}`,
      customer: {
        name: customerType === "WALK_IN" ? "Walk-in Customer" : customerName.trim(),
        phone: customerType === "WALK_IN" ? "01700-000000" : customerPhone.trim(),
        email: "pos.customer@ponchomukh.com",
        address: "Ponchomukh Retail Counter #01, Dhaka",
      },
      items: cart.map((i) => ({
        name: i.product.name,
        sku: i.product.sku,
        quantity: i.quantity,
        price: i.unitPrice,
        image: i.product.images?.[0]?.imageUrl,
      })),
      subtotal,
      discount: discountAmount,
      shippingFee: 0,
      total: grandTotal,
      paidAmount: numericCashTendered > grandTotal ? grandTotal : numericCashTendered || grandTotal,
      changeAmount: changeDue,
      paymentMethod,
      paymentStatus: "PAID",
      status: "DELIVERED",
    };

    // Save locally
    try {
      const stored = JSON.parse(localStorage.getItem("ponchomukh_all_orders") || "[]");
      stored.unshift(orderData);
      localStorage.setItem("ponchomukh_all_orders", JSON.stringify(stored));
    } catch (e) {
      console.error("Local storage error:", e);
    }

    // Try posting to API
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orderData.customer.name,
          phone: orderData.customer.phone,
          division: "Dhaka",
          district: "Dhaka",
          addressLine: "POS Store Counter",
          deliveryArea: "INSIDE_DHAKA",
          source: "POS",
          orderNotes: orderData.orderNotes,
          items: cart.map((c) => ({
            productVariantId: c.product.variants?.[0]?.id,
            name: c.product.name,
            price: c.unitPrice,
            quantity: c.quantity,
          })),
        }),
      });
    } catch (e) {
      console.warn("API sync fallback:", e);
    }

    setCompletedOrder(orderData);
    setIsReceiptModalOpen(true);
    setCart([]);
    setDiscountValue(0);
    setCashTendered("");
    setIsProcessing(false);
  };

  return (
    <div className="-m-4 md:-m-8 flex flex-col h-[calc(100vh-4rem)] bg-[#F8FAF9] text-[#2B160F] overflow-hidden">
      {/* 1. TOP POS HEADER TOOLBAR */}
      <div className="h-14 bg-[#3B0C04] text-[#FFFDF9] px-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFC40E] transition-colors"
            title="Return to ERP Hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFC40E] text-[#3B0C04] flex items-center justify-center font-black text-sm">
              POS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white">
                  PONCHOMUKH RETAIL POS
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#16834A] text-white font-bold">
                  REGISTER #01 (ONLINE)
                </span>
              </div>
              <p className="text-[10px] text-zinc-300">
                Cashier: Super Administrator | Retail Store Counter
              </p>
            </div>
          </div>
        </div>

        {/* Global Search / Barcode Listener */}
        <div className="relative w-80 hidden md:block">
          <Barcode className="w-4 h-4 text-[#FFC40E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Scan Barcode or Search SKU / Title (F2)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-zinc-400 text-xs focus:outline-none focus:bg-white/20 focus:border-[#FFC40E]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/orders?channel=POS"
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-[#FFC40E]" />
            <span className="hidden sm:inline">POS Order Log</span>
          </Link>

          <button
            onClick={handleClearCart}
            disabled={cart.length === 0}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bill</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN POS WORKSPACE: LEFT CATALOG + RIGHT CART */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: PRODUCT CATALOG & CATEGORY SELECTOR */}
        <div className="flex-1 flex flex-col border-r border-[#E8DCD2] bg-[#F8FAF9] overflow-hidden">
          {/* Category Filter Bar */}
          <div className="p-3 border-b border-[#E8DCD2] bg-white flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <Layers className="w-4 h-4 text-[#8C7B72] shrink-0 ml-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[#3B0C04] text-[#FFC40E] shadow-2xs"
                    : "bg-[#FFF7EE] text-[#3B0C04] hover:bg-[#3B0C04]/10"
                }`}
              >
                {cat === "ALL" ? "All Catalog Items" : cat}
              </button>
            ))}
          </div>

          {/* Mobile search bar if on small screen */}
          <div className="p-2.5 bg-white border-b border-[#E8DCD2] md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C7B72] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E8DCD2] bg-[#FFFDF9] text-xs"
              />
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-[#8C7B72]">
                <Search className="w-10 h-10 stroke-1 text-[#8C7B72]" />
                <p className="text-sm font-bold text-[#3B0C04]">No products matched your search</p>
                <p className="text-xs">Try clearing your search query or selecting another category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map((product) => {
                  const price = product.salePrice || product.basePrice;
                  const inCartQty = cart.find((i) => i.product.id === product.id)?.quantity || 0;

                  return (
                    <button
                      key={product.id}
                      onClick={() => handleAddToCart(product)}
                      className="group relative p-2.5 bg-white rounded-2xl border border-[#E8DCD2] hover:border-[#3B0C04] shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between overflow-hidden cursor-pointer active:scale-98"
                    >
                      {/* In-Cart Badge */}
                      {inCartQty > 0 && (
                        <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-[#16834A] text-white text-xs font-black flex items-center justify-center shadow-xs">
                          {inCartQty}
                        </div>
                      )}

                      {/* Product Thumbnail */}
                      <div className="w-full aspect-square rounded-xl bg-[#FFFDF9] border border-[#E8DCD2]/50 overflow-hidden mb-2 relative">
                        <img
                          src={product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-2xs text-[9px] font-mono font-bold text-white">
                          {product.sku}
                        </span>
                      </div>

                      {/* Title & Price */}
                      <div className="space-y-1 w-full">
                        <h4 className="font-bold text-xs text-[#2B160F] line-clamp-2 leading-tight group-hover:text-[#3B0C04]">
                          {product.name}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm font-black text-[#16834A]">
                            ৳{price.toLocaleString()}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                              product.stock > 10
                                ? "bg-emerald-50 text-emerald-700"
                                : product.stock > 0
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {product.stock > 0 ? `Stock: ${product.stock}` : "Out"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: REAL-TIME POS REGISTER & BILLING TERMINAL */}
        <div className="w-full lg:w-96 xl:w-[420px] bg-white flex flex-col shrink-0 shadow-lg border-l border-[#E8DCD2] overflow-hidden">
          {/* Customer Bar */}
          <div className="p-3 border-b border-[#E8DCD2] bg-[#FFFDF9] space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#3B0C04] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#3B0C04]" />
                <span>Customer Profile</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setCustomerType("WALK_IN");
                    setCustomerName("Walk-in Customer");
                    setCustomerPhone("01700-000000");
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    customerType === "WALK_IN"
                      ? "bg-[#3B0C04] text-[#FFC40E]"
                      : "bg-[#FFF7EE] text-[#6B5A52]"
                  }`}
                >
                  Walk-in
                </button>
                <button
                  onClick={() => setCustomerType("CUSTOM")}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    customerType === "CUSTOM"
                      ? "bg-[#3B0C04] text-[#FFC40E]"
                      : "bg-[#FFF7EE] text-[#6B5A52]"
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {customerType === "CUSTOM" && (
              <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-8 px-2.5 rounded-lg border border-[#E8DCD2] text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Mobile 01XXXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-8 px-2.5 rounded-lg border border-[#E8DCD2] text-xs bg-white"
                />
              </div>
            )}
          </div>

          {/* Cart Items Area */}
          <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#E8DCD2]/60">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-[#8C7B72]">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF7EE] border border-[#E8DCD2] flex items-center justify-center text-[#3B0C04]">
                  <ShoppingCart className="w-6 h-6 stroke-1" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#3B0C04]">Register Cart is Empty</h4>
                  <p className="text-xs text-[#8C7B72]">
                    Click any product card from the left catalog or scan a barcode to add items.
                  </p>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                      src={item.product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100"}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E8DCD2] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#2B160F] truncate" title={item.product.name}>
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-[#8C7B72]">
                        ৳{item.unitPrice.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Adjustment Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded bg-[#FFF7EE] hover:bg-[#3B0C04] hover:text-[#FFC40E] text-[#3B0C04] font-bold flex items-center justify-center border border-[#E8DCD2] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-black text-xs text-[#3B0C04]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, 1)}
                      className="w-6 h-6 rounded bg-[#FFF7EE] hover:bg-[#3B0C04] hover:text-[#FFC40E] text-[#3B0C04] font-bold flex items-center justify-center border border-[#E8DCD2] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="text-right shrink-0 min-w-16">
                    <span className="font-black text-[#16834A] block">
                      ৳{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-[#8C7B72] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment, Discounts & Grand Total Footer */}
          <div className="p-4 border-t border-[#E8DCD2] bg-[#FFFDF9] space-y-3 shrink-0">
            {/* Calculation summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B5A52]">
                <span>Items Subtotal:</span>
                <span className="font-bold text-[#2B160F]">৳{subtotal.toLocaleString()}</span>
              </div>

              {/* Discount Input Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#6B5A52]">Discount:</span>
                <div className="flex items-center gap-1 w-44">
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="h-7 px-1.5 rounded border border-[#E8DCD2] bg-white text-[11px] font-bold"
                  >
                    <option value="FLAT">৳ Flat</option>
                    <option value="PERCENT">% Off</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discountValue || ""}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full h-7 px-2 rounded border border-[#E8DCD2] bg-white text-[11px] text-right font-bold"
                  />
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center pt-2 border-t border-[#E8DCD2]">
                <span className="text-sm font-black text-[#3B0C04]">Total Payable:</span>
                <span className="text-xl font-black text-[#16834A]">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selectors */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#6B5A52] block">Payment Method:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CASH")}
                  className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === "CASH"
                      ? "bg-[#3B0C04] text-[#FFC40E] border-[#3B0C04]"
                      : "bg-white text-[#3B0C04] border-[#E8DCD2] hover:bg-[#FFF7EE]"
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("BKASH")}
                  className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === "BKASH"
                      ? "bg-[#D12053] text-white border-[#D12053]"
                      : "bg-white text-[#D12053] border-[#E8DCD2] hover:bg-rose-50"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>bKash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === "CARD"
                      ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                      : "bg-white text-[#1E3A8A] border-[#E8DCD2] hover:bg-blue-50"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
              </div>
            </div>

            {/* Cash Tender & Change Return (Only if Cash) */}
            {paymentMethod === "CASH" && (
              <div className="p-2.5 rounded-xl bg-white border border-[#E8DCD2] space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#6B5A52] font-bold">Cash Received:</span>
                  <input
                    type="number"
                    placeholder="Enter cash..."
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-32 h-8 px-2 rounded-lg border border-[#3B0C04] bg-[#FFF7EE] text-right font-black text-sm text-[#3B0C04] focus:outline-none"
                  />
                </div>

                {/* Quick Cash Presets */}
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleQuickCash(grandTotal)}
                    className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-[10px] font-bold"
                  >
                    Exact
                  </button>
                  <button
                    onClick={() => handleQuickCash(500)}
                    className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-[10px] font-bold"
                  >
                    ৳500
                  </button>
                  <button
                    onClick={() => handleQuickCash(1000)}
                    className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-[10px] font-bold"
                  >
                    ৳1000
                  </button>
                  <button
                    onClick={() => handleQuickCash(2000)}
                    className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-[10px] font-bold"
                  >
                    ৳2000
                  </button>
                </div>

                {/* Change Return */}
                <div className="flex justify-between items-center pt-1 border-t border-[#E8DCD2]/60">
                  <span className="font-bold text-[#8C7B72]">Change Return:</span>
                  <span className="font-black text-sm text-emerald-700">
                    ৳{changeDue.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Checkout CTA Button */}
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0 || isProcessing}
              className="w-full h-12 rounded-xl bg-[#3B0C04] hover:bg-[#260700] text-[#FFC40E] font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>COMPLETE SALE & PRINT INVOICE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. THERMAL INVOICE / RECEIPT MODAL */}
      {isReceiptModalOpen && completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-[#E8DCD2] space-y-4 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCD2]">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#16834A]" />
                <h3 className="text-sm font-black text-[#3B0C04]">POS Official Invoice Receipt</h3>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1 rounded-lg text-[#8C7B72] hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Thermal Receipt Container */}
            <div
              id="printable-pos-receipt"
              className="p-5 rounded-2xl bg-[#FFFDF9] border border-dashed border-[#8C7B72] text-left text-xs space-y-3 font-mono"
            >
              {/* Receipt Header */}
              <div className="text-center space-y-1 border-b border-zinc-200 pb-3">
                <h2 className="font-black text-base text-[#3B0C04] tracking-tight">PONCHOMUKH ERP</h2>
                <p className="text-[10px] text-zinc-500">Retail Outlet & Express Counter</p>
                <p className="text-[10px] text-zinc-500">Dhanmondi, Dhaka | Hotline: 01712-345678</p>
                <div className="pt-1 text-[10px] font-bold text-zinc-700">
                  Invoice #: {completedOrder.orderId}
                </div>
                <div className="text-[10px] text-zinc-500">{completedOrder.date}</div>
              </div>

              {/* Customer Info */}
              <div className="text-[11px] space-y-0.5 border-b border-zinc-200 pb-2">
                <div>Customer: {completedOrder.customer.name}</div>
                <div>Phone: {completedOrder.customer.phone}</div>
                <div>Cashier: Super Administrator</div>
                <div>Channel: POS In-Store Sales</div>
              </div>

              {/* Items Table */}
              <div className="space-y-1.5 border-b border-zinc-200 pb-2">
                {completedOrder.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start text-[11px]">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-zinc-800 line-clamp-1">{it.name}</p>
                      <p className="text-[10px] text-zinc-500">
                        {it.quantity} × ৳{it.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-zinc-900 shrink-0">
                      ৳{(it.quantity * it.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1 text-[11px] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{completedOrder.subtotal.toLocaleString()}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>-৳{completedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-[#3B0C04] pt-1 border-t border-zinc-300">
                  <span>Net Total:</span>
                  <span>৳{completedOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600 pt-1">
                  <span>Payment Mode:</span>
                  <span className="font-bold uppercase">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Paid Amount:</span>
                  <span>৳{completedOrder.paidAmount.toLocaleString()}</span>
                </div>
                {completedOrder.changeAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Change Returned:</span>
                    <span>৳{completedOrder.changeAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Footer barcode & thank you */}
              <div className="text-center pt-3 border-t border-dashed border-zinc-300 space-y-1 text-[10px] text-zinc-500">
                <p className="font-bold text-zinc-800">*** THANK YOU FOR SHOPPING ***</p>
                <p>Goods purchased can be exchanged within 7 days with this invoice.</p>
                <p className="font-mono text-[9px]">{completedOrder.orderId}</p>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#3B0C04] text-[#FFC40E] font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-[#260700] transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt</span>
              </button>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E8DCD2] text-xs font-bold text-[#6B5A52] hover:bg-zinc-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

