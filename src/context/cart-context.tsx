"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, ProductVariant } from "@/lib/mockData";

export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  productVariantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface AppliedCoupon {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
}

export type DeliveryZone = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";

interface ToastInfo {
  id: string;
  message: string;
  type?: "success" | "info" | "error";
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number, openDrawer?: boolean) => void;
  addProductToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;

  // Delivery & Coupon
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Navigation & Modal States
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categorySlug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toasts
  toasts: ToastInfo[];
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("INSIDE_DHAKA");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = useCallback((message: string, type: "success" | "info" | "error" = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("ponchomukh_cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      const storedWishlist = localStorage.getItem("ponchomukh_wishlist");
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
      const storedCoupon = localStorage.getItem("ponchomukh_coupon");
      if (storedCoupon) {
        setAppliedCoupon(JSON.parse(storedCoupon));
      }
    } catch (e) {
      console.error("Failed to load initial storage", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ponchomukh_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ponchomukh_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

  // Save coupon to localStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem("ponchomukh_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("ponchomukh_coupon");
      }
    } catch (e) {
      console.error("Failed to update coupon storage", e);
    }
  }, [appliedCoupon]);

  const addToCart = (
    product: Product,
    variant: ProductVariant,
    quantity: number = 1,
    openDrawer: boolean = true
  ) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productVariantId === variant.id
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const currentQty = newItems[existingItemIndex].quantity;
        const maxStock = variant.stock || 99;
        const newQty = Math.min(currentQty + quantity, maxStock);
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQty,
        };
        return newItems;
      } else {
        return [
          ...prevItems,
          {
            id: `${product.id}-${variant.id}`,
            productId: product.id,
            productVariantId: variant.id,
            quantity: Math.min(quantity, variant.stock || 99),
            product,
            variant,
          },
        ];
      }
    });

    showToast(`✓ "${product.name}" কার্টে যোগ করা হয়েছে!`);
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const addProductToCart = (
    product: Product,
    quantity: number = 1,
    openDrawer: boolean = true
  ) => {
    const defaultVariant = product.variants?.[0] || {
      id: `var-${product.id}-default`,
      productId: product.id,
      sku: product.sku,
      price: product.salePrice ?? product.basePrice,
      stock: product.stock || 25,
      selectedOptions: [],
    };
    addToCart(product, defaultVariant, quantity, openDrawer);
  };

  const removeFromCart = (variantId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productVariantId !== variantId)
    );
    showToast("পণ্যটি কার্ট থেকে সরানো হয়েছে।", "info");
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productVariantId === variantId) {
          const maxStock = item.variant.stock || 99;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Wishlist Actions
  const addToWishlist = (product: Product) => {
    if (!wishlist.some((item) => item.id === product.id)) {
      setWishlist((prev) => [...prev, product]);
      showToast(`❤️ "${product.name}" উইশলিস্টে যুক্ত হয়েছে!`);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    showToast("পণ্যটি উইশলিস্ট থেকে সরানো হয়েছে।", "info");
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Coupon Logic
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "PONCHO10") {
      setAppliedCoupon({
        code: "PONCHO10",
        type: "PERCENTAGE",
        value: 10,
        minOrderAmount: 500,
        maxDiscountAmount: 300,
      });
      showToast("🎉 কুপন 'PONCHO10' সফলভাবে প্রয়োগ করা হয়েছে!");
      return { success: true, message: "১০% ছাড় প্রয়োগ করা হয়েছে!" };
    } else if (cleanCode === "WELCOME50") {
      setAppliedCoupon({
        code: "WELCOME50",
        type: "FIXED",
        value: 50,
        minOrderAmount: 300,
      });
      showToast("🎉 কুপন 'WELCOME50' সফলভাবে প্রয়োগ করা হয়েছে!");
      return { success: true, message: "৳৫০ ফ্ল্যাট ছাড় প্রয়োগ করা হয়েছে!" };
    } else {
      return { success: false, message: "অকার্যকর কুপন কোড।" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("কুপন কোড মুছে ফেলা হয়েছে।", "info");
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.variant.price * item.quantity),
    0
  );

  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "PERCENTAGE") {
      const calculated = (cartSubtotal * appliedCoupon.value) / 100;
      cartDiscount = appliedCoupon.maxDiscountAmount
        ? Math.min(calculated, appliedCoupon.maxDiscountAmount)
        : calculated;
    } else {
      cartDiscount = appliedCoupon.value;
    }
  }

  // Delivery charge rule: Inside Dhaka ৳60, Outside Dhaka ৳120
  const cartShippingFee = cartItems.length === 0 ? 0 : deliveryZone === "INSIDE_DHAKA" ? 60 : 120;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        addProductToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTotal,

        // Delivery & Coupon
        deliveryZone,
        setDeliveryZone,
        appliedCoupon,
        applyCoupon,
        removeCoupon,

        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,

        // Modals
        selectedProduct,
        setSelectedProduct,
        isProductModalOpen,
        setIsProductModalOpen,

        // Filters
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,

        // Toasts
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}

      {/* Global Toast Notification Container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              toast.type === "error"
                ? "bg-[#D64545] text-white"
                : toast.type === "info"
                ? "bg-[#260700] text-white"
                : "bg-[#3B0C04] text-[#FFC40E] border border-[#D99E00]/40"
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
