import { fail, ok } from "@/lib/http";
import { createOrder } from "@/modules/orders/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    return ok({ orderNumber: order.orderNumber });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create order.";
    return fail(message, 400);
  }
}
