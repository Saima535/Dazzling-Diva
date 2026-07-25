import assert from "node:assert/strict";
import { afterEach, before, test } from "node:test";

process.env.BACKEND_API_URL ??= "http://localhost:3001/api/v1";
process.env.NEXT_PUBLIC_SITE_URL ??= "http://localhost:3000";
process.env.REVALIDATION_SECRET ??= "test-revalidation-secret";

const originalFetch = globalThis.fetch;
let api: typeof import("@/src/lib/api");

before(async () => {
  api = await import("@/src/lib/api");
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("createOrder sends the checkout payload and customer authorization header", async () => {
  let capturedUrl = "";
  let capturedInit: RequestInit | undefined;

  globalThis.fetch = (async (url, init) => {
    capturedUrl = String(url);
    capturedInit = init;
    return {
      ok: true,
      async json() {
        return {
          success: true,
          data: { orderNumber: "DD-CLIENT-1" },
        };
      },
    } as Response;
  }) as typeof fetch;

  const result = await api.createOrder(
    {
      customerName: "Ayesha",
      customerEmail: "ayesha@example.com",
      customerPhone: "01700000000",
      address: "1 Gulshan Avenue",
      district: "Dhaka",
      shippingMethodCode: "DHAKA",
      couponCode: "VIP",
      idempotencyKey: "checkout-client-1",
      items: [{ productSlug: "silk-saree", sku: "SKU-1", quantity: 1 }],
    },
    "customer-token",
  );

  assert.equal(result.orderNumber, "DD-CLIENT-1");
  assert.equal(capturedUrl, "http://localhost:3001/api/v1/checkout/orders");
  assert.equal(
    (capturedInit?.headers as Record<string, string>).Authorization,
    "Bearer customer-token",
  );

  const payload = JSON.parse(String(capturedInit?.body));
  assert.equal(payload.idempotencyKey, "checkout-client-1");
  assert.equal(payload.items[0].sku, "SKU-1");
});

test("api helpers surface backend envelope errors as thrown exceptions", async () => {
  globalThis.fetch = (async () =>
    ({
      ok: false,
      async json() {
        return {
          success: false,
          error: "Coupon not found.",
        };
      },
    }) as Response) as typeof fetch;

  await assert.rejects(
    api.validateCoupon("missing", 4500),
    /Coupon not found/,
  );
});
