import { Types } from "mongoose";
import { z } from "zod";

import { connectToDatabase } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import { slugify } from "@/lib/slug";
import { CategoryModel } from "@/models/category";
import { CollectionModel } from "@/models/collection";
import { ProductModel } from "@/models/product";

export const categoryInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().default(""),
  imageUrl: z.string().url().optional().or(z.literal("")).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  publishAt: z.string().optional().default(""),
  unpublishAt: z.string().optional().default(""),
});

export const collectionInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().default(""),
  coverImageUrl: z.string().url().optional().or(z.literal("")).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  publishAt: z.string().optional().default(""),
  unpublishAt: z.string().optional().default(""),
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
  publishAt: z.string().optional().default(""),
  unpublishAt: z.string().optional().default(""),
});

export async function createCategory(input: z.input<typeof categoryInputSchema>) {
  const values = categoryInputSchema.parse(input);
  await connectToDatabase();
  const category = await CategoryModel.create({
    ...values,
    slug: slugify(values.name),
    publishAt: values.publishAt ? new Date(values.publishAt) : null,
    unpublishAt: values.unpublishAt ? new Date(values.unpublishAt) : null,
  });
  await recordAudit({
    action: "category.created",
    entityType: "category",
    entityId: String(category._id),
    summary: category.name,
  });
  return category;
}

export async function createCollection(
  input: z.input<typeof collectionInputSchema>,
) {
  const values = collectionInputSchema.parse(input);
  await connectToDatabase();
  const collection = await CollectionModel.create({
    ...values,
    slug: slugify(values.name),
    publishAt: values.publishAt ? new Date(values.publishAt) : null,
    unpublishAt: values.unpublishAt ? new Date(values.unpublishAt) : null,
  });
  await recordAudit({
    action: "collection.created",
    entityType: "collection",
    entityId: String(collection._id),
    summary: collection.name,
  });
  return collection;
}

export async function createProduct(input: z.input<typeof productInputSchema>) {
  const values = productInputSchema.parse(input);
  await connectToDatabase();
  const product = await ProductModel.create({
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
    publishAt: values.publishAt ? new Date(values.publishAt) : null,
    unpublishAt: values.unpublishAt ? new Date(values.unpublishAt) : null,
    gallery: values.heroImageUrl
      ? [{ url: String(values.heroImageUrl), alt: values.name }]
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
  await recordAudit({
    action: "product.created",
    entityType: "product",
    entityId: String(product._id),
    summary: String(product.name),
  });
  return product;
}

export async function updateCategory(
  categoryId: string,
  input: z.input<typeof categoryInputSchema>,
) {
  const values = categoryInputSchema.parse(input);
  await connectToDatabase();
  const category = await CategoryModel.findByIdAndUpdate(
    categoryId,
    {
      ...values,
      slug: slugify(values.name),
      publishAt: values.publishAt ? new Date(values.publishAt) : null,
      unpublishAt: values.unpublishAt ? new Date(values.unpublishAt) : null,
    },
    { new: true },
  );
  if (!category) {
    throw new Error("Category not found.");
  }
  await recordAudit({
    action: "category.updated",
    entityType: "category",
    entityId: String(category._id),
    summary: category.name,
  });
  return category;
}

export async function updateCollection(
  collectionId: string,
  input: z.input<typeof collectionInputSchema>,
) {
  const values = collectionInputSchema.parse(input);
  await connectToDatabase();
  const collection = await CollectionModel.findByIdAndUpdate(
    collectionId,
    {
      ...values,
      slug: slugify(values.name),
      publishAt: values.publishAt ? new Date(values.publishAt) : null,
      unpublishAt: values.unpublishAt ? new Date(values.unpublishAt) : null,
    },
    { new: true },
  );
  if (!collection) {
    throw new Error("Collection not found.");
  }
  await recordAudit({
    action: "collection.updated",
    entityType: "collection",
    entityId: String(collection._id),
    summary: collection.name,
  });
  return collection;
}

export async function updateProduct(
  productId: string,
  input: z.input<typeof productInputSchema>,
) {
  const values = productInputSchema.parse(input);
  await connectToDatabase();
  const product = await ProductModel.findByIdAndUpdate(
    productId,
    {
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
      publishAt: values.publishAt ? new Date(values.publishAt) : null,
      unpublishAt: values.unpublishAt ? new Date(values.unpublishAt) : null,
      gallery: values.heroImageUrl ? [{ url: String(values.heroImageUrl), alt: values.name }] : [],
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
    },
    { new: true },
  );
  if (!product) {
    throw new Error("Product not found.");
  }
  await recordAudit({
    action: "product.updated",
    entityType: "product",
    entityId: String(product._id),
    summary: String(product.name),
  });
  return product;
}
