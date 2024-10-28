"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemsCount } = useCartContext();

  return (
    <nav className="relative bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            STORE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-600 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <User className="h-5 w-5" />
            </button>
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative text-gray-600">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg">
          <div className="px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4 py-2">
              <button className="text-gray-600 hover:text-gray-900">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;