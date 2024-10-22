// import { useState } from 'react';
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';

export default async function Product({ params }) {
  const product = await client.fetch(groq`*[_type == "product" && _id == $id][0]`, {
    id: params.id
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src="/api/placeholder/600/600"
              alt={product.name}
              className="w-full h-full object-cover"
              width={10}
              height={10}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/api/placeholder/150/150"
                  alt={`${product.name} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.type}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${product.price}</p>
              <p className="text-green-600 text-sm">In Stock</p>
            </div>
            <div className="flex gap-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-black text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800">
              <ShoppingCart />
              Add to Cart
            </button>
            <button className="w-full border border-black py-3 px-6 rounded-md hover:bg-gray-50">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}