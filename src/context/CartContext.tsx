"use client"
import { Product } from "@/app/types";
import { createContext, ReactNode, useContext, useState, useCallback, useEffect } from "react";

interface CartItem {
  selectedColor: string;
  product: Product;
  quantity: number;
  selectedColorImage?: {
    asset : string
    url:string;
  };
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (productId: string, products: Product[]) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedColor: string, quantity: number) => void;
  emptyCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  setCart: (cart: CartItem[]) => void; // Add parameter to setCart
}

const CART_STORAGE_KEY = 'shopping-cart';

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with empty array to avoid hydration mismatch
  const [cart, setCart] = useState<CartItem[]>([]);

  console.log(
    'cardcontext',cart
  );
  
  // Handle localStorage in a separate useEffect
  useEffect(() => {
    // Only run this effect once on mount
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart]);

  const addToCart = useCallback((productId: string, color: string, products: Product[]) => {
    const product = products?.find((product) => product._id === productId);
    
    if (!product) {
        console.log("Product not found");
        return;
    }

    setCart(prevCart => {
        // Find the index of the existing cart item with the same product ID and selected color
        const existingItemIndex = prevCart.findIndex(
            item => item.product._id === productId && item.selectedColor === color
        );

        if (existingItemIndex >= 0) {
            // Increase quantity for the same product and color
            const newCart = [...prevCart];
            newCart[existingItemIndex] = {
                ...newCart[existingItemIndex],
                quantity: newCart[existingItemIndex].quantity + 1,
                selectedColor: color // Keep the selected color here
            };
            return newCart;
        }

        // If no existing item with the same color, add a new cart item with the color
        return [...prevCart, { product, quantity: 1, selectedColor: color }];
    });
}, []);



const removeFromCart = useCallback((productId: string, selectedColor: string) => {
  setCart(prevCart => prevCart.filter(item => item.product._id !== productId || item.selectedColor !== selectedColor));
}, []);

const updateQuantity = useCallback((productId: string, selectedColor: string, quantity: number) => {
  setCart(prevCart => {
    if (quantity <= 0) {
      return prevCart.filter(item => item.product._id !== productId || item.selectedColor !== selectedColor);
    }

    return prevCart.map(item => 
      item.product._id === productId && item.selectedColor === selectedColor
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
    setCart,
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