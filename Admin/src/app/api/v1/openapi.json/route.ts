import { ok } from "@/lib/http";

export async function GET() {
  return ok({
    name: "Dazzling Diva Admin API",
    version: "v1",
    routes: [
      "GET /api/v1/health",
      "GET /api/v1/content/home",
      "GET /api/v1/content/pages",
      "GET /api/v1/catalog/categories",
      "GET /api/v1/catalog/categories/:slug",
      "GET /api/v1/catalog/collections",
      "GET /api/v1/catalog/collections/:slug",
      "GET /api/v1/catalog/products",
      "GET /api/v1/catalog/products/:slug",
      "POST /api/v1/checkout/orders",
      "GET /api/v1/orders/track/:orderNumber",
    ],
  });
}
