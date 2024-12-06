"use client"
import { Product } from "@/app/types";
import { createContext, ReactNode, useContext, useState, useCallback, useEffect } from "react";

export interface CartItem {
  selectedColorImage?: {
    asset: { url: string };
  };
  selectedColor: string;
  selectedSize: string; // Added size property
  product: Product;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (
    productId: string | undefined,
    color: string | number,
    products: Product[] | null,
    size: string, // Added size parameter
  ) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedColor: string | number, quantity: number) => void;
  emptyCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  setCart: (cart: CartItem[]) => void;
}

const CART_STORAGE_KEY = 'shopping-cart';

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart]);

  const addToCart = useCallback(
    (productId: string | undefined, color: string | number, products: Product[] | null, size: string) => {
      if (!productId || !products) {
        console.log("Invalid product ID or products list");
        return;
      }
  
      const product = products.find((product) => product._id === productId);
  
      if (!product) {
        console.log("Product not found");
        return;
      }
  
      const colorString = color.toString();
  
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) =>
            item.product._id === productId &&
            item.selectedColor === colorString &&
            item.selectedSize === size // Compare size as well
        );
  
        if (existingItemIndex >= 0) {
          const newCart = [...prevCart];
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + 1,
          };
          return newCart;
        }
  
        return [
          ...prevCart,
          {
            product,
            quantity: 1,
            selectedColor: colorString,
            selectedSize: size, // Include size
          },
        ];
      });
    },
    []
  );
  


  const removeFromCart = useCallback((productId: string, selectedColor: string) => {
    setCart(prevCart => prevCart.filter(item => 
      item.product._id !== productId || item.selectedColor !== selectedColor
    ));
  }, []);

  const updateQuantity = useCallback((
    productId: string, 
    selectedColor: string | number, 
    quantity: number
  ) => {
    const colorString = selectedColor.toString();
    
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => 
          item.product._id !== productId || item.selectedColor !== colorString
        );
      }

      return prevCart.map(item => 
        item.product._id === productId && item.selectedColor === colorString
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

  const value: CartContextProps = {
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