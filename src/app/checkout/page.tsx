"use client"
import { useCartContext } from '@/context/CartContext';
import Image from 'next/image';
import React from 'react';

import { useState } from 'react';

export default function CheckoutForm() {
  const { cart, getCartTotal, emptyCart } = useCartContext();

  console.log('CheckoutCart', cart);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/send-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerDetails: formData,
          orderDetails: {
            items: cart,
            total: getCartTotal(),
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to submit order');

      setSubmitStatus('success');
      emptyCart();
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        additionalNotes: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* Order Summary */}
      <div className="mb-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        {cart.map((item) => (
          <div key={item.product._id} className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <Image
                //@ts-expect-error: src
                src={item?.selectedColorImage?.asset}
                alt={`${item.product.name} - ${item.selectedColor}`}
                className="w-12 h-12 object-cover rounded-md" // Adjust size as needed
                width={48}
                height={48}
              />
              <span>{item.product.name} x {item.quantity}</span>
            </div>
            <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>


      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Additional Notes</label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {submitStatus === 'success' && (
          <div className="p-4 bg-green-100 text-green-700 rounded">
            Order submitted successfully! Check your email for confirmation.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            Failed to submit order. Please try again.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Submitting...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}







