import { createReview } from "@/modules/reviews/service";
import { getCustomerFromAuthorizationHeader } from "@/lib/customer-auth";
import { fail, ok } from "@/lib/http";
import { assertAllowedOrigin } from "@/lib/security";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    assertAllowedOrigin(request);
    await checkRateLimit("reviews-post", 20, 60_000);
    const customer = await getCustomerFromAuthorizationHeader(
      request.headers.get("authorization"),
    );
    if (!customer) {
      return fail("Unauthorized.", 401);
    }
    const body = await request.json();
    const review = await createReview({
      ...body,
      customerId: String(customer._id),
    });
    return ok(review);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to submit review.", 400);
  }
}
