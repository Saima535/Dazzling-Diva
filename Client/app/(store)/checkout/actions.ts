"use server";

import { redirect } from "next/navigation";

import { clearCart, getCart } from "@/src/lib/cart";
import { createOrder } from "@/src/lib/api";

export async function placeOrderAction(formData: FormData) {
  const items = await getCart();

  if (!items.length) {
    throw new Error("Your cart is empty.");
  }

  const response = await createOrder({
    customerName: String(formData.get("customerName") ?? ""),
    customerEmail: String(formData.get("customerEmail") ?? ""),
    customerPhone: String(formData.get("customerPhone") ?? ""),
    address: String(formData.get("address") ?? ""),
    district: String(formData.get("district") ?? ""),
    shippingMethodCode: String(formData.get("shippingMethodCode") ?? "DHAKA"),
    items: items.map((item) => ({
      productSlug: item.productSlug,
      sku: item.sku,
      quantity: item.quantity,
    })),
  });

  await clearCart();
  redirect(`/order-success/${response.orderNumber}`);
}
