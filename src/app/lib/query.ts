// query.ts
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { CategoryProps, Product } from "../types";

export const getAllProducts = async (): Promise<Product[]> => {
  return await client.fetch<Product[]>(
    groq`*[_type=="product"]{
      _id,
      name,
      category-> {  
        name,
      },
      price,
      description,
      colorImageMap[] {
        color { hex },
        images[] {
          asset-> {
            _id,
            url
          }
        },
        sizes // Include the sizes field in the query
      }
    }`,
    {},
    { cache: "no-store" }
  );
};





export const getCategories = async (): Promise<CategoryProps[]> => {
  return await client.fetch<CategoryProps[]>(
    groq`*[_type == "category"]{
      _id,
      name,
      slug,
      image {
  asset-> {
    _id,
    url
  }
}
    }`,
    {},
    { cache: "no-store" }
  );
};

export const getProductsByCategory = async (category: string) => {
  return await client.fetch<Product[]>(
    groq`*[_type=="product" && category->name == ${category}]{
     _id,
      name,
      slug,
      image {
  asset-> {
    _id,
    url
  }
}
  }`,
    {},
    { cache: "no-store" }
  )

}