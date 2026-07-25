import { NextResponse } from "next/server";

import { clearCustomerToken } from "@/src/lib/customer-session";

export async function POST() {
  await clearCustomerToken();
  return NextResponse.json({ success: true });
}
