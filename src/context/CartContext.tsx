"use client"
import { Product } from "@/app/types";
import { createContext, ReactNode, useContext, useState, useCallback } from "react";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (productId: string, products: Product[]) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  emptyCart: () => void;
  getCartTotal: () => number;  // Changed return type to number
  getCartItemsCount: () => number;  // Changed return type to number
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((productId: string, products: Product[]) => {
    const product = products?.find((product) => product._id === productId);
    
    if (!product) {
      console.log("Product not found");
      return;
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product._id === productId
      );

      if (existingItemIndex >= 0) {
        // Create a new array to ensure state immutability
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1
        };
        return newCart;
      }
      
      // Add new item
      return [...prevCart, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.product._id !== productId);
      }

      return prevCart.map(item => 
        item.product._id === productId 
          ? { ...item, quantity } 
          : item
      );
    });
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const getCartItemsCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const emptyCart = useCallback(() => {
    setCart([]);
  }, []);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
    getCartTotal,
    getCartItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};