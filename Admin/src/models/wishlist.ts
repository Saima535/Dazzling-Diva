import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const wishlistSchema = new Schema(
  {
    customerId: { type: Types.ObjectId, ref: "Customer", unique: true, required: true },
    productIds: [{ type: Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

export type Wishlist = InferSchemaType<typeof wishlistSchema>;

export const WishlistModel =
  (models.Wishlist as Model<Wishlist>) ||
  model<Wishlist>("Wishlist", wishlistSchema);
