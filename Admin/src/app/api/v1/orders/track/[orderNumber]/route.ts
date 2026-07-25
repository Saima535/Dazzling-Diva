import { connectToDatabase } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { OrderModel } from "@/models/order";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  await connectToDatabase();
  const order = await OrderModel.findOne({ orderNumber }).lean();

  if (!order) {
    return fail("Order not found.", 404);
  }

  return ok(order);
}
