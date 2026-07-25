import { SignJWT, jwtVerify } from "jose";

import { env } from "@/config/env";
import { connectToDatabase } from "@/lib/db";
import { CustomerModel } from "@/models/customer";

function getSecret() {
  return new TextEncoder().encode(env.AUTH_REFRESH_TOKEN_SECRET);
}

export async function issueCustomerToken(customerId: string) {
  return new SignJWT({ sub: customerId, role: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(getSecret());
}

export async function getCustomerFromAuthorizationHeader(
  authorizationHeader: string | null,
) {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authorizationHeader.replace("Bearer ", "");
    const payload = await jwtVerify(token, getSecret());
    await connectToDatabase();
    return CustomerModel.findById(payload.payload.sub).lean();
  } catch {
    return null;
  }
}
