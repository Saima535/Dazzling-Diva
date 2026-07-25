import { NextRequest, NextResponse } from "next/server";

import { env } from "@/src/lib/env";
import { getCustomerToken } from "@/src/lib/customer-session";

export async function GET() {
  const token = await getCustomerToken();
  if (!token) {
    return NextResponse.json({ success: true, data: [] });
  }

  const response = await fetch(`${env.BACKEND_API_URL}/customers/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: NextRequest) {
  const token = await getCustomerToken();
  if (!token) {
    return NextResponse.json({ success: false, error: "Please sign in first." }, { status: 401 });
  }

  const body = await request.json();
  const response = await fetch(`${env.BACKEND_API_URL}/customers/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function DELETE(request: NextRequest) {
  const token = await getCustomerToken();
  if (!token) {
    return NextResponse.json({ success: false, error: "Please sign in first." }, { status: 401 });
  }

  const body = await request.json();
  const response = await fetch(`${env.BACKEND_API_URL}/customers/wishlist`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
