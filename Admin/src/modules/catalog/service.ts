import { Types } from "mongoose";
import { z } from "zod";

import { connectToDatabase } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { CategoryModel } from "@/models/category";
import { CollectionModel } from "@/models/collection";
import { ProductModel } from "@/models/product";

export const categoryInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().default(""),
  imageUrl: z.string().url().optional().or(z.literal("")).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const collectionInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().default(""),
  coverImageUrl: z.string().url().optional().or(z.literal("")).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const productInputSchema = z.object({
  name: z.string().min(2),
  shortDescription: z.string().default(""),
  description: z.string().default(""),
  material: z.string().default(""),
  careInstructions: z.string().default(""),
  heroImageUrl: z.string().url().optional().or(z.literal("")).default(""),
  categoryId: z.string().optional().default(""),
  collectionIds: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  mostLoved: z.boolean().default(false),
  variantSku: z.string().min(2),
  variantSize: z.string().default("Free Size"),
  variantColor: z.string().default("Default"),
  variantPriceMinor: z.coerce.number().min(0),
  variantCompareAtPriceMinor: z.coerce.number().min(0).default(0),
  variantStockQuantity: z.coerce.number().int().min(0),
});

export async function createCategory(input: z.input<typeof categoryInputSchema>) {
  const values = categoryInputSchema.parse(input);
  await connectToDatabase();
  return CategoryModel.create({
    ...values,
    slug: slugify(values.name),
  });
}

export async function createCollection(
  input: z.input<typeof collectionInputSchema>,
) {
  const values = collectionInputSchema.parse(input);
  await connectToDatabase();
  return CollectionModel.create({
    ...values,
    slug: slugify(values.name),
  });
}

export async function createProduct(input: z.input<typeof productInputSchema>) {
  const values = productInputSchema.parse(input);
  await connectToDatabase();
  return ProductModel.create({
    name: values.name,
    slug: slugify(values.name),
    shortDescription: values.shortDescription,
    description: values.description,
    material: values.material,
    careInstructions: values.careInstructions,
    heroImageUrl: values.heroImageUrl,
    categoryId: values.categoryId ? new Types.ObjectId(values.categoryId) : undefined,
    collectionIds: values.collectionIds.map((id) => new Types.ObjectId(id)),
    status: values.status,
    featured: values.featured,
    newArrival: values.newArrival,
    mostLoved: values.mostLoved,
    gallery: values.heroImageUrl
      ? [{ url: values.heroImageUrl, alt: values.name }]
      : [],
    variants: [
      {
        sku: values.variantSku,
        size: values.variantSize,
        color: values.variantColor,
        priceMinor: values.variantPriceMinor,
        compareAtPriceMinor: values.variantCompareAtPriceMinor,
        stockQuantity: values.variantStockQuantity,
      },
    ],
  });
}
