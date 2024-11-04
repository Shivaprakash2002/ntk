"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, X, RefreshCw } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import Link from 'next/link';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity,
  } = useCartContext();
  
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cart.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
 
  const total = subtotal + shipping;

  // Handle quantity update with loading state
  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(productId);
    
    updateQuantity(productId, newQuantity);

    // Simulate API call
    setTimeout(() => setIsUpdating(null), 500);
  };



  console.log(cart)
  return (
    <div className="min-h-screen bg-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-black">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            {cart.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-900 text-lg">Your cart is empty</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                {cart.map((item) => (
                  <div 
                    key={item.product._id}
                    className="flex items-center gap-4 p-4 border-b last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product?.images[0]?.asset.url}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium">{item.product.name}</h3>
                      {/* <div className="text-sm text-gray-500 mt-1">
                        {item.product.size && <span>Size: {item.product.size} </span>}
                        {item.product.color && <span>• Color: {item.product.color}</span>}
                      </div> */}
                      <div className="text-lg font-medium mt-2">
                        ₹{item.product.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityUpdate(item.product._id, item.quantity - 1)}
                        className="p-1 rounded hover:bg-gray-100"
                        disabled={isUpdating === item.product._id}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityUpdate(item.product._id, item.quantity + 1)}
                        className="p-1 rounded hover:bg-gray-100"
                        disabled={isUpdating === item.product._id}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Update Indicator */}
                    {isUpdating === item.product._id && (
                      <div className="w-6 h-6 animate-spin">
                        <RefreshCw size={24} />
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-black">Order Summary</h2>
              
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span>₹{shipping.toFixed(2)}</span>
                  )}
                </div>
               
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout">
              <button 
                className="w-full mt-6 bg-black text-white py-3 rounded-md hover:bg-gray-800 
                transition-colors font-medium disabled:bg-gray-400"
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
              </Link>

              {shipping > 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  Add ₹{(100 - subtotal).toFixed(2)} more to get free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;