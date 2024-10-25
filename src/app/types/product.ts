export interface Image {
  asset: {
    _id: string;
    url: string;
  };
}

export interface Product {
  category: any;
  _id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  images: Image[]; 
}

export interface ProductCardProps {
  name: string;
  type: string;
  price: number;
  image?: string;
}

export interface ProductTypeCardProps {
  type: string;
  count: number;
}
