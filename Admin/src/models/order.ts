import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const orderLineSchema = new Schema(
  {
    productName: String,
    productSlug: String,
    variantSku: String,
    quantity: Number,
    unitPriceMinor: Number,
    lineTotalMinor: Number,
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    items: { type: [orderLineSchema], default: [] },
    subtotalMinor: { type: Number, required: true },
    discountMinor: { type: Number, default: 0 },
    shippingMinor: { type: Number, required: true },
    grandTotalMinor: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    idempotencyKey: { type: String, default: "", index: true },
    paymentMethod: { type: String, default: "cod" },
    paymentStatus: { type: String, default: "unpaid" },
    orderStatus: { type: String, default: "pending" },
  },
  { timestamps: true },
);

export type Order = InferSchemaType<typeof orderSchema>;

export const OrderModel =
  (models.Order as Model<Order>) || model<Order>("Order", orderSchema);
