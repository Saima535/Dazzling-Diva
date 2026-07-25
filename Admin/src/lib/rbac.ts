import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/auth";

export async function requireAdminRole(
  allowedRoles: Array<
    | "super_admin"
    | "catalog_manager"
    | "order_manager"
    | "content_manager"
    | "support_manager"
  >,
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/login");
  }
  if (!allowedRoles.includes(admin.role)) {
    redirect("/dashboard");
  }
  return admin;
}
