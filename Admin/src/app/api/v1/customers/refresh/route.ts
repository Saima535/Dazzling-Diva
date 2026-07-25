import { rotateCustomerRefreshToken } from "@/lib/customer-auth";
import { fail, ok } from "@/lib/http";
import { checkRateLimit } from "@/lib/rate-limit";
import { assertAllowedOrigin } from "@/lib/security";
import { CustomerModel } from "@/models/customer";

export async function POST(request: Request) {
  try {
    assertAllowedOrigin(request);
    await checkRateLimit("customer-refresh", 60, 60_000);
    const body = (await request.json()) as { refreshToken?: string };
    if (!body.refreshToken) {
      return fail("Refresh token is required.", 400);
    }

    const rotated = await rotateCustomerRefreshToken(
      body.refreshToken,
      request.headers.get("user-agent") ?? "",
    );
    const customer = await CustomerModel.findById(rotated.ownerId).lean();
    if (!customer) {
      return fail("Customer not found.", 404);
    }

    return ok({
      accessToken: rotated.accessToken,
      refreshToken: rotated.refreshToken,
      customer: {
        id: String(customer._id),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to refresh session.", 401);
  }
}
