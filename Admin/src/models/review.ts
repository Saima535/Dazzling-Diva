import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const reviewSchema = new Schema(
  {
    customerId: { type: Types.ObjectId, ref: "Customer", required: true },
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: "" },
    body: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifiedPurchase: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type Review = InferSchemaType<typeof reviewSchema>;

export const ReviewModel =
  (models.Review as Model<Review>) || model<Review>("Review", reviewSchema);
