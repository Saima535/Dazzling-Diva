import { getCustomerFromAuthorizationHeader } from "@/lib/customer-auth";
import { fail, ok } from "@/lib/http";

export async function GET(request: Request) {
  const customer = await getCustomerFromAuthorizationHeader(
    request.headers.get("authorization"),
  );

  if (!customer) {
    return fail("Unauthorized.", 401);
  }

  return ok({
    id: String(customer._id),
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
  });
}
