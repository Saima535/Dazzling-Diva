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

let GET: typeof import("@/app/api/v1/openapi.json/route")["GET"];

before(async () => {
  const routeModule = (
    require("../../openapi.json/route") as {
      default?: typeof import("@/app/api/v1/openapi.json/route");
    }
  ).default ?? (require("../../openapi.json/route") as typeof import("@/app/api/v1/openapi.json/route"));
  ({ GET } = routeModule);
});

test("openapi route advertises the checkout and review contract", async () => {
  const response = await GET();

  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.version, "v1");
  assert.equal(payload.data.routes.includes("POST /api/v1/checkout/orders"), true);
  assert.equal(
    payload.data.routes.includes("GET /api/v1/catalog/products/:slug/reviews"),
    true,
  );
});
