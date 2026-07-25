import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createCsrfCookieValue, csrfCookieName } from "@/lib/csrf";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https:;",
  );

  if (request.nextUrl.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  if (!request.cookies.get(csrfCookieName)?.value) {
    response.cookies.set(csrfCookieName, createCsrfCookieValue(), {
      httpOnly: false,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
