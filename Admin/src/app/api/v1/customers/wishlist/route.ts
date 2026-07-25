import { getCustomerFromAuthorizationHeader } from "@/lib/customer-auth";
import { fail, ok } from "@/lib/http";
import { checkRateLimit } from "@/lib/rate-limit";
import { assertAllowedOrigin } from "@/lib/security";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/modules/customers/service";

export async function GET(request: Request) {
  const customer = await getCustomerFromAuthorizationHeader(
    request.headers.get("authorization"),
  );

  if (!customer) {
    return fail("Unauthorized.", 401);
  }

  const wishlist = await getWishlist(String(customer._id));
  return ok(wishlist);
}

export async function POST(request: Request) {
  assertAllowedOrigin(request);
  await checkRateLimit("wishlist-post", 60, 60_000);
  const customer = await getCustomerFromAuthorizationHeader(
    request.headers.get("authorization"),
  );

  if (!customer) {
    return fail("Unauthorized.", 401);
  }

  const body = (await request.json()) as { productId?: string };
  if (!body.productId) {
    return fail("productId is required.", 400);
  }

  await addToWishlist(String(customer._id), body.productId);
  const wishlist = await getWishlist(String(customer._id));
  return ok(wishlist);
}

export async function DELETE(request: Request) {
  assertAllowedOrigin(request);
  await checkRateLimit("wishlist-delete", 60, 60_000);
  const customer = await getCustomerFromAuthorizationHeader(
    request.headers.get("authorization"),
  );

  if (!customer) {
    return fail("Unauthorized.", 401);
  }

  const body = (await request.json()) as { productId?: string };
  if (!body.productId) {
    return fail("productId is required.", 400);
  }

  await removeFromWishlist(String(customer._id), body.productId);
  const wishlist = await getWishlist(String(customer._id));
  return ok(wishlist);
}
