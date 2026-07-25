import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { before, test } from "node:test";

const require = createRequire(__filename);

function setEnv(key: string, value: string) {
  process.env[key] ??= value;
}

setEnv("MONGO_URI", "mongodb://127.0.0.1:27017/dazzling-diva-test");
setEnv("Cloud_Name", "demo");
setEnv("Cloudinary_API_Key", "test-key");
setEnv("Cloudinary_API_Secret", "test-secret");
setEnv("AUTH_JWT_SECRET", "test-auth-secret-with-32-char-minimum");
setEnv("AUTH_REFRESH_TOKEN_SECRET", "test-refresh-secret-with-32-char-min");
setEnv("CSRF_SECRET", "test-csrf-secret-with-32-char-minimum");
setEnv("CLIENT_ORIGIN", "http://localhost:3000");
setEnv("ADMIN_ORIGIN", "http://localhost:3001");
setEnv("CLIENT_INTERNAL_URL", "http://localhost:3000");
setEnv("REVALIDATION_SECRET", "test-revalidation-secret-with-32-char");
setEnv("DEFAULT_TIMEZONE", "Asia/Dhaka");
setEnv("DEFAULT_CURRENCY", "BDT");
setEnv("NODE_ENV", "test");

let createOrderSchema: typeof import("@/modules/orders/service")["createOrderSchema"];
let shippingInputSchema: typeof import("@/modules/orders/service")["shippingInputSchema"];
let buildCheckoutProductFilter: typeof import("@/modules/orders/service")["buildCheckoutProductFilter"];
let isDuplicateKeyError: typeof import("@/modules/orders/service")["isDuplicateKeyError"];

before(async () => {
  const serviceModule = (
    require("./service") as { default?: typeof import("@/modules/orders/service") }
  ).default ?? (require("./service") as typeof import("@/modules/orders/service"));
  ({ createOrderSchema, shippingInputSchema, buildCheckoutProductFilter, isDuplicateKeyError } =
    serviceModule);
});

test("createOrderSchema rejects empty carts and preserves idempotency keys", () => {
  const values = createOrderSchema.parse({
    customerName: "Ayesha",
    customerEmail: "ayesha@example.com",
    customerPhone: "01700000000",
    address: "1 Gulshan Avenue",
    district: "Dhaka",
    shippingMethodCode: "dhaka",
    idempotencyKey: "checkout-1",
    items: [{ productSlug: "silk-saree", sku: "SKU-1", quantity: 1 }],
  });

  assert.equal(values.idempotencyKey, "checkout-1");
  assert.equal(values.items[0]?.quantity, 1);
  assert.throws(
    () =>
      createOrderSchema.parse({
        customerName: "Ayesha",
        customerEmail: "ayesha@example.com",
        customerPhone: "01700000000",
        address: "1 Gulshan Avenue",
        district: "Dhaka",
        shippingMethodCode: "dhaka",
        items: [],
      }),
    /Too small/,
  );
});

test("buildCheckoutProductFilter keeps publish and unpublish windows in separate OR branches", () => {
  const now = new Date("2026-07-25T10:00:00.000Z");
  const filter = buildCheckoutProductFilter("silk-saree", now);

  assert.equal(filter.slug, "silk-saree");
  assert.equal(filter.status, "published");
  assert.equal(filter.$and.length, 2);
  assert.deepEqual(filter.$and[0], {
    $or: [{ publishAt: null }, { publishAt: { $lte: now } }],
  });
  assert.deepEqual(filter.$and[1], {
    $or: [{ unpublishAt: null }, { unpublishAt: { $gt: now } }],
  });
});

test("checkout helpers enforce numeric shipping input and duplicate-key detection", () => {
  const shipping = shippingInputSchema.parse({
    name: "Dhaka Standard",
    code: "dhaka",
    feeMinor: "150",
  });

  assert.equal(shipping.feeMinor, 150);
  assert.equal(shipping.codEnabled, true);
  assert.equal(isDuplicateKeyError({ code: 11000 }), true);
  assert.equal(isDuplicateKeyError({ code: 500 }), false);
});
