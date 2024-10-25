import { client } from "@/sanity/lib/client";
import { Product, ProductTypeCardProps } from "../types/product";
import { groq } from "next-sanity";

//query  for fetching products
export const products = await client.fetch<Product[]>(
  groq`*[_type == "product"]{
  _id,
  name,
  price,
  description,
  images,
  "category": category->{
    
    name,
    // Add other category fields you want to fetch
  }
  }`,
  {},
  { cache: "no-store" }
);

export const category = await client.fetch<ProductTypeCardProps[]>(
  groq`*[_type == "category"]{
        _id,
        name,
        slug,
        description,
        images,
        }`,
  {},
  { cache: "no-store" }
);
