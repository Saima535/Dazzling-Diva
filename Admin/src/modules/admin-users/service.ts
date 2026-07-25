import { z } from "zod";

import { hashPassword } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { connectToDatabase } from "@/lib/db";
import { AdminUserModel } from "@/models/admin-user";

export const adminUserInputSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum([
    "super_admin",
    "catalog_manager",
    "order_manager",
    "content_manager",
    "support_manager",
  ]),
});

export async function listAdminUsers() {
  await connectToDatabase();
  return AdminUserModel.find().sort({ createdAt: -1 }).lean();
}

export async function createAdminUser(input: z.input<typeof adminUserInputSchema>) {
  const values = adminUserInputSchema.parse(input);
  await connectToDatabase();
  const existing = await AdminUserModel.findOne({ email: values.email.toLowerCase() });
  if (existing) {
    throw new Error("Admin email already exists.");
  }

  const admin = await AdminUserModel.create({
    name: values.name,
    email: values.email.toLowerCase(),
    passwordHash: await hashPassword(values.password),
    role: values.role,
  });
  await recordAudit({
    action: "admin_user.created",
    entityType: "adminUser",
    entityId: String(admin._id),
    summary: admin.email,
  });
  return admin;
}

export async function updateAdminUser(
  adminUserId: string,
  input: {
    role?: "super_admin" | "catalog_manager" | "order_manager" | "content_manager" | "support_manager";
    status?: "active" | "disabled";
    password?: string;
  },
) {
  await connectToDatabase();
  const admin = await AdminUserModel.findById(adminUserId);
  if (!admin) {
    throw new Error("Administrator not found.");
  }

  if (input.role) {
    admin.role = input.role;
  }
  if (input.status) {
    admin.status = input.status;
  }
  if (input.password) {
    admin.passwordHash = await hashPassword(input.password);
    admin.passwordChangedAt = new Date();
  }
  await admin.save();
  await recordAudit({
    action: "admin_user.updated",
    entityType: "adminUser",
    entityId: String(admin._id),
    summary: admin.email,
  });
  return admin;
}
