export interface Image{
  asset: ImageAsset
}

export interface ImageAsset {
    _id: string;
    url: string;
}
export interface ColorImage {
  images: {asset: ImageAsset}[];
  color: {hex: string}
}

export interface Product {
  colorImageMap: ColorImage[]; // Example if it's an array of objects with specific properties
  category: {name: string};
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
  colorImageMap?: ColorImage[];
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