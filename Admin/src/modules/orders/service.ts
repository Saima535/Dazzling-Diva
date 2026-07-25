import { randomUUID } from "node:crypto";

import { z } from "zod";

import { connectToDatabase } from "@/lib/db";
import { ProductModel } from "@/models/product";
import { OrderModel } from "@/models/order";
import { ShippingMethodModel } from "@/models/shipping-method";

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
});

export async function createShippingMethod(
  input: z.input<typeof shippingInputSchema>,
) {
  const values = shippingInputSchema.parse(input);
  await connectToDatabase();
  return ShippingMethodModel.create({
    ...values,
    code: values.code.toUpperCase(),
  });
}

export async function createOrder(input: z.input<typeof createOrderSchema>) {
  const values = createOrderSchema.parse(input);
  await connectToDatabase();

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

    variant.stockQuantity -= item.quantity;
    await product.save();

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
  const grandTotalMinor = subtotalMinor + shippingMinor;
  const orderNumber = `DD-${randomUUID().slice(0, 8).toUpperCase()}`;

  return OrderModel.create({
    orderNumber,
    customerName: values.customerName,
    customerEmail: values.customerEmail,
    customerPhone: values.customerPhone,
    address: values.address,
    district: values.district,
    items: orderItems,
    subtotalMinor,
    shippingMinor,
    grandTotalMinor,
  });
}
