import { getCustomerFromAuthorizationHeader } from "@/lib/customer-auth";
import { fail, ok } from "@/lib/http";
import { getCustomerOrders } from "@/modules/customers/service";

export async function GET(request: Request) {
  const customer = await getCustomerFromAuthorizationHeader(
    request.headers.get("authorization"),
  );

  if (!customer) {
    return fail("Unauthorized.", 401);
  }

  const orders = await getCustomerOrders(String(customer._id));
  return ok(orders);
}
