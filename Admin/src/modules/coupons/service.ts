import { z } from "zod";

import { recordAudit } from "@/lib/audit";
import { connectToDatabase } from "@/lib/db";
import { CouponModel } from "@/models/coupon";

export const couponInputSchema = z.object({
  code: z.string().min(2),
  type: z.enum(["percentage", "fixed"]).default("fixed"),
  valueMinor: z.coerce.number().int().min(0),
  minimumSubtotalMinor: z.coerce.number().int().min(0).default(0),
  maxDiscountMinor: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export async function createCoupon(input: z.input<typeof couponInputSchema>) {
  const values = couponInputSchema.parse(input);
  await connectToDatabase();
  const coupon = await CouponModel.create({
    ...values,
    code: values.code.toUpperCase(),
  });
  await recordAudit({
    action: "coupon.created",
    entityType: "coupon",
    entityId: String(coupon._id),
    summary: coupon.code,
  });
  return coupon;
}

export async function listCoupons() {
  await connectToDatabase();
  return CouponModel.find().sort({ createdAt: -1 }).lean();
}

export async function validateCoupon(code: string, subtotalMinor: number) {
  await connectToDatabase();
  const coupon = await CouponModel.findOne({
    code: code.toUpperCase(),
    active: true,
  });

  if (!coupon) {
    throw new Error("Coupon not found.");
  }

  if (subtotalMinor < coupon.minimumSubtotalMinor) {
    throw new Error("Order subtotal does not meet the coupon minimum.");
  }

  let discountMinor =
    coupon.type === "percentage"
      ? Math.floor((subtotalMinor * coupon.valueMinor) / 100)
      : coupon.valueMinor;

  if (coupon.maxDiscountMinor > 0) {
    discountMinor = Math.min(discountMinor, coupon.maxDiscountMinor);
  }

  discountMinor = Math.min(discountMinor, subtotalMinor);

  return {
    coupon,
    discountMinor,
  };
}
