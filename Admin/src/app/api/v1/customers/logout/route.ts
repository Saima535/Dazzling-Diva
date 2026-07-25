import { revokeCustomerRefreshFamily } from "@/lib/customer-auth";
import { ok } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as { refreshToken?: string };
  if (body.refreshToken) {
    await revokeCustomerRefreshFamily(body.refreshToken);
  }
  return ok({ success: true });
}
