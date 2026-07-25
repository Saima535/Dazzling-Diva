import { NextRequest, NextResponse } from "next/server";

import { getCart, setCart } from "@/src/lib/cart";

export async function GET() {
  const items = await getCart();
  return NextResponse.json({ success: true, data: items });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    productSlug: string;
    sku: string;
    name: string;
    priceMinor: number;
    quantity: number;
  };

  const items = await getCart();
  const existing = items.find((item) => item.sku === body.sku);

  if (existing) {
    existing.quantity += body.quantity;
  } else {
    items.push(body);
  }

  await setCart(items);
  return NextResponse.json({ success: true, data: items });
}
