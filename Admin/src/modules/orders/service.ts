import { randomUUID } from "node:crypto";

import { z } from "zod";

import { connectToDatabase } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import { ProductModel } from "@/models/product";
import { OrderModel } from "@/models/order";
import { ShippingMethodModel } from "@/models/shipping-method";
import { validateCoupon } from "@/modules/coupons/service";
import { InventoryMovementModel } from "@/models/inventory-movement";

export const shippingInputSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  feeMinor: z.coerce.number().int().min(0),
  estimatedDelivery: z.string().default(""),
  codEnabled: z.boolean().default(true),
  enabled: z.boolean().default(true),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.email(),
  customerPhone: z.string().min(5),
  address: z.string().min(5),
  district: z.string().min(2),
  shippingMethodCode: z.string().min(2),
  items: z
    .array(
      z.object({
        productSlug: z.string().min(1),
        sku: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
  customerId: z.string().optional(),
  couponCode: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export async function createShippingMethod(
  input: z.input<typeof shippingInputSchema>,
) {
  const values = shippingInputSchema.parse(input);
  await connectToDatabase();
  const method = await ShippingMethodModel.create({
    ...values,
    code: values.code.toUpperCase(),
  });
  await recordAudit({
    action: "shipping.created",
    entityType: "shippingMethod",
    entityId: String(method._id),
    summary: method.code,
  });
  return method;
}

export async function createOrder(input: z.input<typeof createOrderSchema>) {
  const values = createOrderSchema.parse(input);
  await connectToDatabase();

  if (values.idempotencyKey) {
    const existing = await OrderModel.findOne({ idempotencyKey: values.idempotencyKey }).lean();
    if (existing) {
      return existing;
    }
  }

  const shippingMethod = await ShippingMethodModel.findOne({
    code: values.shippingMethodCode.toUpperCase(),
    enabled: true,
  }).lean();

  if (!shippingMethod) {
    throw new Error("A valid shipping method must be configured.");
  }

  const orderItems = [];
  let subtotalMinor = 0;

  for (const item of values.items) {
    const product = await ProductModel.findOne({
      slug: item.productSlug,
      status: "published",
    });

    if (!product) {
      throw new Error(`Product ${item.productSlug} is unavailable.`);
    }

    const variant = product.variants.find((entry) => entry.sku === item.sku);
    if (!variant) {
      throw new Error(`Variant ${item.sku} is unavailable.`);
    }

    if (variant.stockQuantity < item.quantity) {
      throw new Error(`Only ${variant.stockQuantity} units remain for ${product.name}.`);
    }

    const previousQuantity = variant.stockQuantity;
    variant.stockQuantity -= item.quantity;
    await product.save();
    await InventoryMovementModel.create({
      productId: String(product._id),
      productName: String(product.name),
      variantSku: variant.sku,
      movementType: "order_placed",
      quantityDelta: -item.quantity,
      previousQuantity,
      newQuantity: variant.stockQuantity,
      reason: "Checkout placement",
    });

    const lineTotalMinor = variant.priceMinor * item.quantity;
    subtotalMinor += lineTotalMinor;

    orderItems.push({
      productName: product.name,
      productSlug: product.slug,
      variantSku: variant.sku,
      quantity: item.quantity,
      unitPriceMinor: variant.priceMinor,
      lineTotalMinor,
    });
  }

  const shippingMinor = shippingMethod.feeMinor;
  const appliedCoupon = values.couponCode
    ? await validateCoupon(values.couponCode, subtotalMinor)
    : null;
  const discountMinor = appliedCoupon?.discountMinor ?? 0;
  const grandTotalMinor = subtotalMinor - discountMinor + shippingMinor;
  const orderNumber = `DD-${randomUUID().slice(0, 8).toUpperCase()}`;

  const order = await OrderModel.create({
    orderNumber,
    customerId: values.customerId,
    customerName: values.customerName,
    customerEmail: values.customerEmail,
    customerPhone: values.customerPhone,
    address: values.address,
    district: values.district,
    items: orderItems,
    subtotalMinor,
    discountMinor,
    shippingMinor,
    grandTotalMinor,
    couponCode: appliedCoupon?.coupon.code ?? "",
    idempotencyKey: values.idempotencyKey ?? "",
    statusHistory: [{ status: "pending", note: "Order created" }],
  });

  if (appliedCoupon?.coupon) {
    appliedCoupon.coupon.usageCount += 1;
    await appliedCoupon.coupon.save();
  }

  await recordAudit({
    action: "order.created",
    entityType: "order",
    entityId: String(order._id),
    summary: order.orderNumber,
  });

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "processing" | "packed" | "shipped" | "delivered" | "cancelled",
  note = "",
) {
  await connectToDatabase();
  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new Error("Order not found.");
  }

  if (status === "cancelled" && order.orderStatus !== "cancelled") {
    for (const item of order.items) {
      const product = await ProductModel.findOne({ slug: item.productSlug });
      const variant = product?.variants.find((entry) => entry.sku === item.variantSku);
      if (product && variant) {
        const previousQuantity = variant.stockQuantity;
        variant.stockQuantity += item.quantity ?? 0;
        await product.save();
        await InventoryMovementModel.create({
          productId: String(product._id),
          productName: String(product.name),
          variantSku: variant.sku,
          movementType: "order_cancelled",
          quantityDelta: item.quantity ?? 0,
          previousQuantity,
          newQuantity: variant.stockQuantity,
          reason: "Order cancelled",
          relatedOrderNumber: order.orderNumber,
        });
      }
    }
  }

  order.orderStatus = status;
  order.statusHistory.push({
    status,
    note,
    changedAt: new Date(),
  });
  await order.save();
  await recordAudit({
    action: "order.status_updated",
    entityType: "order",
    entityId: String(order._id),
    summary: `${order.orderNumber}:${status}`,
  });
  return order;
}

export async function updateOrderOperations(input: {
  orderId: string;
  paymentStatus?: "unpaid" | "pending" | "paid" | "failed" | "refunded";
  internalNote?: string;
}) {
  await connectToDatabase();
  const order = await OrderModel.findById(input.orderId);
  if (!order) {
    throw new Error("Order not found.");
  }

  if (input.paymentStatus) {
    order.paymentStatus = input.paymentStatus;
  }
  if (typeof input.internalNote === "string") {
    order.internalNote = input.internalNote;
  }
  await order.save();
  await recordAudit({
    action: "order.operations_updated",
    entityType: "order",
    entityId: String(order._id),
    summary: order.orderNumber,
  });
  return order;
}
