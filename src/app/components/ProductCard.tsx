"use client";
import { ShoppingCart } from 'lucide-react'; 
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 

interface ProductCardProps {
  name: string;
  type: string;
  price: number;
  image: string;
  category: string;
  id : string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id , name, type, price, image, category }) => {
  const router = useRouter();

  console.log('id',id);


  const handleCartPage = () => {
    if (id) {
      router.push(`/products/categoryname/${id}`);
    } else {
      console.error('ID is undefined');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 bg-gray-200">
        <Image 
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <span className="text-sm text-blue-600 font-medium">{type}</span>
        <h3 className="text-lg font-semibold mt-1">{name}</h3>
        <h3>{category}</h3>
        <p className="text-gray-600 mt-1">${price}</p>
        <button 
          className="mt-3 w-full bg-black text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800"
          onClick={handleCartPage}
        >
          <ShoppingCart size={20} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
