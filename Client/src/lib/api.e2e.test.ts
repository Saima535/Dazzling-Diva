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

test("client API smoke flow can place and then track an order through the backend contract", async () => {
  const seenRequests: string[] = [];

  globalThis.fetch = (async (url) => {
    const requestUrl = String(url);
    seenRequests.push(requestUrl);

    if (requestUrl.endsWith("/checkout/orders")) {
      return {
        ok: true,
        async json() {
          return {
            success: true,
            data: { orderNumber: "DD-SMOKE-1" },
          };
        },
      } as Response;
    }

    return {
      ok: true,
      async json() {
        return {
          success: true,
          data: {
            orderNumber: "DD-SMOKE-1",
            customerName: "Ayesha",
            orderStatus: "pending",
            paymentStatus: "unpaid",
            grandTotalMinor: 4650,
          },
        };
      },
    } as Response;
  }) as typeof fetch;

  const order = await api.createOrder({
    customerName: "Ayesha",
    customerEmail: "ayesha@example.com",
    customerPhone: "01700000000",
    address: "1 Gulshan Avenue",
    district: "Dhaka",
    shippingMethodCode: "DHAKA",
    idempotencyKey: "checkout-smoke-1",
    items: [{ productSlug: "silk-saree", sku: "SKU-1", quantity: 1 }],
  });
  const tracked = await api.trackOrder(order.orderNumber);

  assert.deepEqual(seenRequests, [
    "http://localhost:3001/api/v1/checkout/orders",
    "http://localhost:3001/api/v1/orders/track/DD-SMOKE-1",
  ]);
  assert.equal(tracked.orderStatus, "pending");
  assert.equal(tracked.grandTotalMinor, 4650);
});
