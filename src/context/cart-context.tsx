"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant } from "@/lib/mockData";

export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  productVariantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;
  
  // Navigation & Modal States
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categorySlug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("ponchomukh_cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("ponchomukh_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productVariantId === variant.id
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const newItems = [...prevItems];
        const newQty = newItems[existingItemIndex].quantity + quantity;
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: Math.min(newQty, variant.stock) // Cap at variant stock limit
        };
        return newItems;
      } else {
        // Item is new to cart
        return [
          ...prevItems,
          {
            id: `${product.id}-${variant.id}`,
            productId: product.id,
            productVariantId: variant.id,
            quantity: Math.min(quantity, variant.stock),
            product,
            variant
          }
        ];
      }
    });
    
    // Automatically open the cart drawer to show the added item
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productVariantId !== variantId)
    );
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productVariantId === variantId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.variant.stock)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.variant.price * item.quantity),
    0
  );

  // Example discount calculation: if subtotal > 150, apply 10% discount
  const cartDiscount = cartSubtotal > 150 ? cartSubtotal * 0.1 : 0;
  
  // Fixed shipping fee: free if subtotal > 200, otherwise flat 15
  const cartShippingFee = cartSubtotal > 200 || cartSubtotal === 0 ? 0 : 15;
  
  const cartTotal = cartSubtotal - cartDiscount + cartShippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTotal,
        
        // Modals
        selectedProduct,
        setSelectedProduct,
        isProductModalOpen,
        setIsProductModalOpen,
        
        // Filters
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
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
