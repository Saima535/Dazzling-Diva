import { NextResponse } from "next/server";

import { clearCart } from "@/src/lib/cart";

export async function POST() {
  await clearCart();
  return NextResponse.json({ success: true });
}
