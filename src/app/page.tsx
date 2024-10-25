import React from "react";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import HeroSection from "./components/HeroSection";
import ProductCard from "./components/ProductCard";
import  { Category } from "./components/Category";
import { Product } from "./types/product";
import { urlFor } from "@/sanity/lib/image";
import { products } from "./lib/query";

export default async function Home() {
  

  const timestamp = new Date().getTime();
  // Group products by type
  const productTypes = products.reduce<Record<string, number>>(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = 0;
      }
      acc[product.category]++;
      return acc;
    },
    {}
  );

  console.log(products)

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        title="Discover Our Collection"
        subtitle="Find the perfect piece for your style"
        ctaText="Shop Now"
      />

      {/* Product Types Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-black">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(productTypes).map(([type, count]) => (
            <Category key={type} type={type} count={count} />
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-black">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id}
              name={product.name}
              type={product.type}
              price={product.price}
              image={`${urlFor(product.images[0]).url()}?t=${timestamp}`}
              category={product.category?.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
