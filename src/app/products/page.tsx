"use client";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/types";
import { useProductContext } from "@/context/ProductContext";

export default function Page() {
  const {  products } = useProductContext();


  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      
      {products?.map((product: Product) => (
        <div
          className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
          key={product._id}
        >
          <ProductCard
            id={product._id}
            name={product.name}
            type={product.type}
            price={product.price}
            image={product.colorImageMap[0]?.images[0]?.asset.url}
            category={product.category?.name}
          />
          
        </div>
        
      ))}
      
    </div>
  );
}
