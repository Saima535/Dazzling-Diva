import { getCustomerFromAuthorizationHeader } from "@/lib/customer-auth";
import { fail, ok } from "@/lib/http";
import { listCustomerReviews } from "@/modules/reviews/service";

export async function GET(request: Request) {
  const customer = await getCustomerFromAuthorizationHeader(
    request.headers.get("authorization"),
  );

  if (!customer) {
    return fail("Unauthorized.", 401);
  }

  const reviews = await listCustomerReviews(String(customer._id));
  return ok(reviews);
}
