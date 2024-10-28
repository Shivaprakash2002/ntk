export interface Image {
  asset: {
    _id: string;
    url: string;
  };
}

export interface Product {
  category: string;
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

export interface CategoryProps{
  _id: string;
  name: string;
  slug: string;
  image: Image
}



export interface SlideItem {
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
}

export interface HeroSectionProps {
  slides?: SlideItem[];
}