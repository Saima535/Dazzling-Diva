import { cookies } from "next/headers";

import { env } from "@/src/lib/env";

const accessCookieName = "dd_customer_access";
const refreshCookieName = "dd_customer_refresh";

export async function getCustomerToken() {
  const cookieStore = await cookies();
  return cookieStore.get(accessCookieName)?.value ?? null;
}

export async function setCustomerTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(accessCookieName, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  cookieStore.set(refreshCookieName, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearCustomerToken() {
  const cookieStore = await cookies();
  cookieStore.delete(accessCookieName);
  cookieStore.delete(refreshCookieName);
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(refreshCookieName)?.value ?? null;
}

export async function getCustomerAccessToken() {
  const accessToken = await getCustomerToken();
  if (accessToken) {
    return accessToken;
  }

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${env.BACKEND_API_URL}/customers/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: env.NEXT_PUBLIC_SITE_URL },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || !payload.success) {
    await clearCustomerToken();
    return null;
  }

  await setCustomerTokens(payload.data.accessToken, payload.data.refreshToken);
  return payload.data.accessToken as string;
}
