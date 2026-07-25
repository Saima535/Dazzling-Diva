import { checkRateLimit } from "@/lib/rate-limit";
import { assertAllowedOrigin } from "@/lib/security";
import { fail, ok } from "@/lib/http";
import { loginCustomer } from "@/modules/customers/service";

export async function POST(request: Request) {
  try {
    assertAllowedOrigin(request);
    await checkRateLimit("customer-login", 20, 60_000);
    const body = await request.json();
    const result = await loginCustomer(
      body,
      request.headers.get("user-agent") ?? "",
    );
    return ok(result);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to sign in.", 400);
  }
}
