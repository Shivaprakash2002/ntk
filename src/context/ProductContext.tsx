"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Product } from "@/app/types/product";

interface ProductContextType {
  products: Product[] | null;
  productTypes: Record<string, number>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [productTypes, setProductTypes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await client.fetch<Product[]>(
        groq`*[_type=="product"]{
          _id,
          name,
          type,
          price,
          description,
          images[] {
            asset-> {
              _id,
              url
            }
          }
        }`
      );

      setProducts(fetchedProducts);

      const types = fetchedProducts.reduce<Record<string, number>>(
        (acc, product) => {
          if (!acc[product.type]) {
            acc[product.type] = 0;
          }
          acc[product.type]++;
          return acc;
        },
        {}
      );

      setProductTypes(types);
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, productTypes }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
