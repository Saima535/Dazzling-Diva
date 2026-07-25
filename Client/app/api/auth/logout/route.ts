import { NextResponse } from "next/server";

import { env } from "@/src/lib/env";
import { clearCustomerToken, getRefreshToken } from "@/src/lib/customer-session";

export async function POST() {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    await fetch(`${env.BACKEND_API_URL}/customers/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: env.NEXT_PUBLIC_SITE_URL },
      body: JSON.stringify({ refreshToken }),
    });
  }
  await clearCustomerToken();
  return NextResponse.json({ success: true });
}
