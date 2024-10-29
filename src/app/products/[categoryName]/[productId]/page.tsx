"use client";

import React, { useState } from "react";
import { useProductContext } from "@/context/ProductContext";
import { ShoppingCart, Heart, Share2 } from "lucide-react";
import Image from "next/image";

import { useRouter } from 'next/navigation';

import { useCartContext } from "@/context/CartContext";
import { Product } from "@/app/types";



export default function Product({ params }: { params: { categoryName: string; productId: string } }) {
  const { products } = useProductContext();

  const router = useRouter();

  const { addToCart, cart } = useCartContext();


  const product = products?.find((p) => p._id === params.productId);

  console.log('colorproduct',product);

  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]?.asset?.url);

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };


  const handleAddToCart = () => {
    console.log(product?._id);
    if (product) {
      router.push(`/cart/${product?._id}`);
    } else {
      console.error('product is undefined');
    }
  }


  const handleAddToCart = (product: Product) => {
    console.log('Products available:', products);
    addToCart(product._id, products);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {selectedImage || product?.images?.[0]?.asset?.url ? (
                <Image
                  src={selectedImage || product?.images?.[0]?.asset?.url}
                  alt={product?.name}
                  className="object-cover w-full h-full"
                  width={500}
                  height={500}
                />
              ) : (
                <div className="skeleton h-full w-full" />
              )}
            </div>


            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product?.images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer">
                  <Image
                    src={image.asset.url}
                    alt={`${product?.name} - ${index + 1}`}
                    className="object-cover w-full h-full"
                    width={100}
                    height={100}
                    onClick={() => handleThumbnailClick(image.asset.url)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product?.name}</h1>
              <p className="text-gray-600 mt-2">{product?.type}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${product?.price}</p>
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
              <p className="text-gray-600">{product?.description}</p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-black text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800"
                onClick={() => handleAddToCart()}>
                <ShoppingCart />
                Add to Cart
              </button>
              <button className="w-full border border-black py-3 px-6 rounded-md hover:bg-gray-50">
                Buy Now
              </button>
            </div>
          </div>

  
          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product?.description}</p>
          </div>
  
          <div className="space-y-4" >
            <button className="w-full bg-black text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800" onClick={() => handleAddToCart(product!)} >
              <ShoppingCart />
              Add to Cart
            </button>
            <button className="w-full border border-black py-3 px-6 rounded-md hover:bg-gray-50">
              Buy Now
            </button>
          </div>

        </div>
      </div>
    </>

  );
}
