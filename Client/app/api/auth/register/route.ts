import { NextRequest, NextResponse } from "next/server";

import { env } from "@/src/lib/env";
import { setCustomerToken } from "@/src/lib/customer-session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await fetch(`${env.BACKEND_API_URL}/customers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    return NextResponse.json(
      { success: false, error: payload.error ?? "Unable to register." },
      { status: response.status },
    );
  }

  await setCustomerToken(payload.data.token);
  return NextResponse.json({ success: true, data: payload.data.customer });
}
