import { fail, ok } from "@/lib/http";
import { checkRateLimit } from "@/lib/rate-limit";
import { assertAllowedOrigin } from "@/lib/security";
import { validateCoupon } from "@/modules/coupons/service";

export async function POST(request: Request) {
  try {
    assertAllowedOrigin(request);
    await checkRateLimit("coupon-validate", 60, 60_000);
    const body = (await request.json()) as {
      code?: string;
      subtotalMinor?: number;
    };

    if (!body.code) {
      return fail("Coupon code is required.", 400);
    }

    const result = await validateCoupon(body.code, Number(body.subtotalMinor ?? 0));
    return ok({
      code: result.coupon.code,
      discountMinor: result.discountMinor,
    });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Unable to validate coupon.",
      400,
    );
  }
}
