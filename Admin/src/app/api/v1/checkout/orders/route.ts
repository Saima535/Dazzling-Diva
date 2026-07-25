import { fail, ok } from "@/lib/http";
import { getCustomerFromAuthorizationHeader } from "@/lib/customer-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { assertAllowedOrigin } from "@/lib/security";
import { createOrder } from "@/modules/orders/service";

export async function POST(request: Request) {
  try {
    assertAllowedOrigin(request);
    await checkRateLimit("checkout-orders", 30, 60_000);
    const body = await request.json();
    const customer = await getCustomerFromAuthorizationHeader(
      request.headers.get("authorization"),
    );
    const order = await createOrder({
      ...body,
      customerId: customer ? String(customer._id) : undefined,
      customerEmail: customer?.email ?? body.customerEmail,
      customerName: customer?.name ?? body.customerName,
      customerPhone: customer?.phone ?? body.customerPhone,
      idempotencyKey: body.idempotencyKey,
    });
    return ok({ orderNumber: order.orderNumber });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create order.";
    return fail(message, 400);
  }
}
