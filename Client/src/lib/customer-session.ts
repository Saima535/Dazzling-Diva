import { cookies } from "next/headers";

const customerCookieName = "dd_customer_token";

export async function getCustomerToken() {
  const cookieStore = await cookies();
  return cookieStore.get(customerCookieName)?.value ?? null;
}

export async function setCustomerToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(customerCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearCustomerToken() {
  const cookieStore = await cookies();
  cookieStore.delete(customerCookieName);
}
