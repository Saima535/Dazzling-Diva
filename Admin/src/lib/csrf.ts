import { createHash, randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { env } from "@/config/env";

export const csrfCookieName = "dd_csrf";

function signToken(token: string) {
  return createHash("sha256")
    .update(`${token}:${env.CSRF_SECRET}`)
    .digest("hex");
}

export function buildCsrfCookieValue(token: string) {
  return `${token}.${signToken(token)}`;
}

export function createCsrfCookieValue() {
  const token = randomBytes(24).toString("hex");
  return buildCsrfCookieValue(token);
}

export async function getCsrfTokenForForm() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(csrfCookieName)?.value;
  if (!cookieValue) {
    return "";
  }
  return cookieValue.split(".")[0] ?? "";
}

export async function assertValidCsrfToken(submittedToken: string) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(csrfCookieName)?.value;
  if (!cookieValue) {
    throw new Error("Missing CSRF cookie.");
  }

  const [token, signature] = cookieValue.split(".");
  if (!token || !signature) {
    throw new Error("Invalid CSRF cookie.");
  }

  if (submittedToken !== token || signToken(token) !== signature) {
    throw new Error("CSRF validation failed.");
  }
}
