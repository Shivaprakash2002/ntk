import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CategoryProps } from "../types";

interface CategoryCardProps {
  category: CategoryProps;
}

export const Category: React.FC<CategoryCardProps> = ({ category }) => (
  <div className="relative overflow-hidden rounded-lg group shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <div className="relative h-64 bg-gray-200">
      <Image
        src={category.image?.asset.url || "/api/placeholder/400/320"} // Dynamic image or fallback
        alt={category.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
        <button className="mt-4 bg-white text-black px-6 py-2 rounded-md flex items-center gap-2 group-hover:bg-gray-100 transition-colors duration-200">
          Shop Now
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  </div>
);

export default Category;
