import { createHash, randomUUID } from "node:crypto";

import { SignJWT, jwtVerify } from "jose";

import { env } from "@/config/env";
import { connectToDatabase } from "@/lib/db";
import { CustomerModel } from "@/models/customer";
import { RefreshSessionModel } from "@/models/refresh-session";

function getAccessSecret() {
  return new TextEncoder().encode(env.AUTH_JWT_SECRET);
}

function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function issueCustomerAccessToken(customerId: string) {
  return new SignJWT({ sub: customerId, role: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getAccessSecret());
}

export async function issueCustomerRefreshToken(
  customerId: string,
  familyId: string = randomUUID(),
  rotatedFromHash = "",
  userAgent = "",
) {
  const refreshTokenId = randomUUID();
  const rawToken = `${familyId}.${refreshTokenId}`;
  const tokenHash = hashRefreshToken(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

  await RefreshSessionModel.create({
    ownerType: "customer",
    ownerId: customerId,
    tokenHash,
    familyId,
    expiresAt,
    rotatedFromHash,
    userAgent,
  });

  return rawToken;
}

export async function issueCustomerSessionTokens(customerId: string, userAgent = "") {
  const accessToken = await issueCustomerAccessToken(customerId);
  const refreshToken = await issueCustomerRefreshToken(customerId, randomUUID(), "", userAgent);
  return { accessToken, refreshToken };
}

export async function rotateCustomerRefreshToken(rawToken: string, userAgent = "") {
  await connectToDatabase();
  const tokenHash = hashRefreshToken(rawToken);
  const session = await RefreshSessionModel.findOne({ tokenHash });

  if (!session) {
    throw new Error("Refresh session not found.");
  }

  if (session.revokedAt) {
    await RefreshSessionModel.updateMany(
      { familyId: session.familyId, revokedAt: null },
      { revokedAt: new Date() },
    );
    throw new Error("Refresh token reuse detected.");
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    session.revokedAt = new Date();
    await session.save();
    throw new Error("Refresh session expired.");
  }

  session.revokedAt = new Date();
  await session.save();

  const accessToken = await issueCustomerAccessToken(session.ownerId);
  const refreshToken = await issueCustomerRefreshToken(
    session.ownerId,
    session.familyId,
    tokenHash,
    userAgent,
  );

  return {
    accessToken,
    refreshToken,
    ownerId: session.ownerId,
  };
}

export async function revokeCustomerRefreshFamily(rawToken: string) {
  await connectToDatabase();
  const tokenHash = hashRefreshToken(rawToken);
  const session = await RefreshSessionModel.findOne({ tokenHash });
  if (!session) {
    return;
  }
  await RefreshSessionModel.updateMany(
    { familyId: session.familyId, revokedAt: null },
    { revokedAt: new Date() },
  );
}

export async function getCustomerFromAuthorizationHeader(
  authorizationHeader: string | null,
) {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authorizationHeader.replace("Bearer ", "");
    const payload = await jwtVerify(token, getAccessSecret());
    await connectToDatabase();
    return CustomerModel.findById(payload.payload.sub).lean();
  } catch {
    return null;
  }
}
