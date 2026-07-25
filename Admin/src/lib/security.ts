import { env } from "@/config/env";

export function assertAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return;
  }

  const allowed = [env.ADMIN_ORIGIN, env.CLIENT_ORIGIN];
  if (!allowed.includes(origin)) {
    throw new Error("Origin not allowed.");
  }
}
