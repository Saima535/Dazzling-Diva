import { checkRateLimit } from "@/lib/rate-limit";
import { assertAllowedOrigin } from "@/lib/security";
import { fail, ok } from "@/lib/http";
import { registerCustomer } from "@/modules/customers/service";

export async function POST(request: Request) {
  try {
    assertAllowedOrigin(request);
    await checkRateLimit("customer-register", 10, 60_000);
    const body = await request.json();
    const result = await registerCustomer(body);
    return ok(result);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to register.", 400);
  }
}
