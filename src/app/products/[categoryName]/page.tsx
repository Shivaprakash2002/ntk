"use client";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/types";
import { useProductContext } from "@/context/ProductContext";
import { useEffect } from "react";

export default function Page({ params }: { params: { categoryName: string } }) {
  const { products } = useProductContext();
  
  useEffect(() => {
    if (products) {
        console.log("Products: ", products);
    } else {
        console.log("Products are still loading...");
    }
}, [products]);


  const normalizeString = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

  const filteredProducts = products?.filter((product) =>
    product.category && normalizeString(product.category.name) === normalizeString(params.categoryName)
  );

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      
      {filteredProducts?.map((product: Product) => (
        <div
          className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
          key={product._id}
        >
          <ProductCard
            id={product._id}
            name={product.name}
            type={product.type}
            price={product.price}
            image={product.colorImageMap[0].images[0].asset.url}
            category={product.category?.name}
          />
          
        </div>
        
      ))}
      
    </div>
  );
}
