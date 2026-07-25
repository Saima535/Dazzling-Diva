import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "fixed",
    },
    valueMinor: { type: Number, required: true, min: 0 },
    minimumSubtotalMinor: { type: Number, default: 0, min: 0 },
    maxDiscountMinor: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export type Coupon = InferSchemaType<typeof couponSchema>;

export const CouponModel =
  (models.Coupon as Model<Coupon>) || model<Coupon>("Coupon", couponSchema);
