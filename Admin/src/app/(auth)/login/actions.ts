"use server";

import { redirect } from "next/navigation";

import { connectToDatabase } from "@/lib/db";
import { setAdminSession, verifyPassword } from "@/lib/auth";
import { AdminUserModel } from "@/models/admin-user";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  await connectToDatabase();
  const admin = await AdminUserModel.findOne({ email });

  if (!admin) {
    redirect("/login?error=1");
  }

  const valid = await verifyPassword(admin.passwordHash, password);
  if (!valid) {
    redirect("/login?error=1");
  }

  await setAdminSession(String(admin._id));
  redirect("/dashboard");
}
