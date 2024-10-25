import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ProductTypeCardProps } from '../types/product';

export const Category: React.FC<ProductTypeCardProps> = ({ type, count }) => (
  <div className="relative overflow-hidden rounded-lg group">
    <div className="relative h-64 bg-gray-200">
      <Image
        src="/api/placeholder/400/320"
        alt={type}
        fill
        className="object-cover"
      />
    </div>
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{type}</h3>
        <p className="text-gray-200">{count} Products</p>
        <button className="mt-4 bg-white text-black px-6 py-2 rounded-md flex items-center gap-2 group-hover:bg-gray-100">
          Shop Now
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  </div>
);

export default Category;