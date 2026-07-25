import { cookies } from "next/headers";

export type CartItem = {
  productSlug: string;
  sku: string;
  name: string;
  priceMinor: number;
  quantity: number;
};

const cookieName = "dd_cart";

export async function getCart() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(cookieName)?.value;
  if (!raw) {
    return [] as CartItem[];
  }

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [] as CartItem[];
  }
}

export async function setCart(items: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearCart() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}
