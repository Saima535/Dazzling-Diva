import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const shippingMethodSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    feeMinor: { type: Number, required: true, min: 0 },
    estimatedDelivery: { type: String, default: "" },
    codEnabled: { type: Boolean, default: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ShippingMethod = InferSchemaType<typeof shippingMethodSchema>;

export const ShippingMethodModel =
  (models.ShippingMethod as Model<ShippingMethod>) ||
  model<ShippingMethod>("ShippingMethod", shippingMethodSchema);
