import { Rule, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
    },
    {
      name: "colorImageMap",
      title: "Color & Image Map",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "color",
              title: "Color",
              type: "color",
              options: {
                disableAlpha: true,
              },
            },
            {
              name: "images",
              title: "Images",
              type: "array",
              of: [{ type: "image" }],
              options: {
                layout: "grid", // Optional: arranges the images in a grid view for better visualization
              },
            },
            {
              name: "sizes",
              title: "Sizes",
              type: "array",
              of: [{ type: "string" }],
              options: {
                layout: "tags", // Optional: allows easy tagging of sizes like S, M, L, XL
              },
            },
          ],
        },
      ],
    },    
    {
      name: "description",
      title: "Description",
      type: "string",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: { type: "category" },
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
});
