"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CategoryProps, Product } from "@/app/types";
import { getAllProducts, getCategories } from "@/app/lib/query";

interface ProductContextType {
  products: Product[] | null;
  productTypes: Record<string, number>;
  categories: CategoryProps[] | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [productTypes, setProductTypes] = useState<Record<string, number>>({});
  const [categories, setCategories] = useState<CategoryProps[] | null>(null);
  

  useEffect(() => {
    const fetchProducts = async () => {
      
      const fetchedProducts = await getAllProducts();

      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
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
  }, []); // Watch selectedCategory for changes

  return (
    <ProductContext.Provider value={{ products, categories, productTypes}}>
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
