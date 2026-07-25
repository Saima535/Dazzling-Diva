import { NextRequest, NextResponse } from "next/server";

import { env } from "@/src/lib/env";
import { setCustomerTokens } from "@/src/lib/customer-session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await fetch(`${env.BACKEND_API_URL}/customers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: env.NEXT_PUBLIC_SITE_URL },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    return NextResponse.json(
      { success: false, error: payload.error ?? "Unable to sign in." },
      { status: response.status },
    );
  }

  await setCustomerTokens(payload.data.accessToken, payload.data.refreshToken);
  return NextResponse.json({ success: true, data: payload.data.customer });
}
