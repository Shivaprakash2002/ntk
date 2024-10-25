import React from 'react';
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import HeroSection from './components/HeroSection';
import ProductCard from './components/ProductCard';
import ProductTypeCard from './components/ProductTypeCard';
import { Product } from './types/product';

export default async function Home() {
  const products = await client.fetch<Product[]>(groq`*[_type=="product"]{
    _id,
    name,
    type,
    price,
    description,
    images[]{
      asset->{
        _id,
        url
      }
    }
  }`);

  // Group products by type
  const productTypes = products.reduce<Record<string, number>>((acc, product) => {
    if (!acc[product.type]) {
      acc[product.type] = 0;
    }
    acc[product.type]++;
    return acc;
  }, {});

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
            <ProductTypeCard key={type} type={type} count={count} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-black">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              name={product.name}
              type={product.type}
              price={product.price}
              image={product.images?.[0]?.asset?.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
