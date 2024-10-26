// src/app/Home.tsx

"use client";

import React from "react";
import HeroSection from "./components/HeroSection";
import ProductCard from "./components/ProductCard";
import { Category } from "./components/Category";
import { useProductContext } from "@/context/ProductContext";

export default function Home() {
  const { products, productTypes } = useProductContext(); 

  console.log('Home',products);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        title="Discover Our Collection"
        subtitle="Find the perfect piece for your style"
        ctaText="Shop Now"
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-black">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(productTypes).map(([type, count]) => (
            <Category key={type} type={type} count={count} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-black">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard
              id={product._id}
              name={product.name}
              type={product.type}
              price={product.price}
              image={product.images?.[0]?.asset?.url}
              category={product.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
