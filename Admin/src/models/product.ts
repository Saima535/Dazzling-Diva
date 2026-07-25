import {
  InferSchemaType,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

const variantSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, uppercase: true },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    priceMinor: { type: Number, required: true, min: 0 },
    compareAtPriceMinor: { type: Number, default: 0, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: true },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    material: { type: String, default: "" },
    careInstructions: { type: String, default: "" },
    categoryId: { type: Types.ObjectId, ref: "Category" },
    collectionIds: [{ type: Types.ObjectId, ref: "Collection" }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    mostLoved: { type: Boolean, default: false },
    heroImageUrl: { type: String, default: "" },
    gallery: [{ url: String, alt: String }],
    variants: { type: [variantSchema], default: [] },
    publishAt: { type: Date, default: null },
    unpublishAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type Product = InferSchemaType<typeof productSchema>;

export const ProductModel =
  (models.Product as Model<Product>) || model<Product>("Product", productSchema);
