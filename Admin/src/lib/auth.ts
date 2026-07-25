import argon2 from "argon2";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/config/env";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/models/admin-user";

const sessionCookieName = "dd_admin_session";

function getJwtSecret() {
  return new TextEncoder().encode(env.AUTH_JWT_SECRET);
}

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export async function issueAdminSession(adminUserId: string) {
  return new SignJWT({ sub: adminUserId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getJwtSecret());
}

export async function setAdminSession(adminUserId: string) {
  const token = await issueAdminSession(adminUserId);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) {
    return null;
  }

  try {
    const payload = await jwtVerify(token, getJwtSecret());
    await connectToDatabase();
    return AdminUserModel.findById(payload.payload.sub).lean();
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/login");
  }

  return admin;
}
