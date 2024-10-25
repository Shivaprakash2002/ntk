export interface Product {
    _id: string;
    name: string;
    type: string;
    price: number;
    description: string;
    images: string[];
    category: string
  }
  
  export interface ProductCardProps {
    name: string;
    type: string;
    price: number;
    image?: string;
    category: string
  }
  
  export interface ProductTypeCardProps {
    type: string;
    count: number;
  }