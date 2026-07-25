import { Types } from "mongoose";
import { z } from "zod";

import { recordAudit } from "@/lib/audit";
import { connectToDatabase } from "@/lib/db";
import { OrderModel } from "@/models/order";
import { ProductModel } from "@/models/product";
import { ReviewModel } from "@/models/review";

export const reviewInputSchema = z.object({
  customerId: z.string(),
  productId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().default(""),
  body: z.string().default(""),
});

export async function createReview(input: z.input<typeof reviewInputSchema>) {
  const values = reviewInputSchema.parse(input);
  await connectToDatabase();

  const product = await ProductModel.findById(values.productId).lean();
  if (!product) {
    throw new Error("Product not found.");
  }

  const deliveredOrder = await OrderModel.findOne({
    customerId: new Types.ObjectId(values.customerId),
    orderStatus: "delivered",
    "items.productSlug": product.slug,
  }).lean();

  if (!deliveredOrder) {
    throw new Error("Only delivered purchases can be reviewed.");
  }

  const review = await ReviewModel.create({
    customerId: new Types.ObjectId(values.customerId),
    productId: new Types.ObjectId(values.productId),
    productName: product.name,
    rating: values.rating,
    title: values.title,
    body: values.body,
  });

  await recordAudit({
    action: "review.created",
    entityType: "review",
    entityId: String(review._id),
    summary: String(product.name),
  });

  return review;
}

export async function listReviews() {
  await connectToDatabase();
  return ReviewModel.find().sort({ createdAt: -1 }).lean();
}

export async function setReviewStatus(reviewId: string, status: "approved" | "rejected") {
  await connectToDatabase();
  const review = await ReviewModel.findByIdAndUpdate(
    reviewId,
    { status },
    { new: true },
  );
  if (!review) {
    throw new Error("Review not found.");
  }
  await recordAudit({
    action: "review.status_updated",
    entityType: "review",
    entityId: String(review._id),
    summary: status,
  });
  return review;
}
