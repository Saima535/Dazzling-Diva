import { requireAdminRole } from "@/lib/rbac";
import { listAdminUsers } from "@/modules/admin-users/service";

import { createAdminUserAction, updateAdminUserAction } from "../actions";

export default async function AdministratorsPage() {
  await requireAdminRole(["super_admin"]);
  const admins = await listAdminUsers();

  return (
    <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form action={createAdminUserAction} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Create administrator</h1>
        <div className="mt-5 space-y-4">
          <input name="name" placeholder="Name" required />
          <input name="email" placeholder="Email" type="email" required />
          <input name="password" placeholder="Password" type="password" required />
          <select name="role" defaultValue="support_manager">
            <option value="super_admin">Super admin</option>
            <option value="catalog_manager">Catalog manager</option>
            <option value="order_manager">Order manager</option>
            <option value="content_manager">Content manager</option>
            <option value="support_manager">Support manager</option>
          </select>
          <button className="rounded-full bg-[var(--brand-strong)] px-5 py-3">
            Save administrator
          </button>
        </div>
      </form>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">Administrators</h2>
        <div className="mt-5 space-y-3">
          {admins.map((admin) => (
            <article key={String(admin._id)} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-sm text-white/60">{admin.email}</p>
                </div>
                <div className="w-full max-w-sm">
                  <form action={updateAdminUserAction} className="grid gap-2">
                    <input type="hidden" name="adminUserId" value={String(admin._id)} />
                    <select name="role" defaultValue={admin.role}>
                      <option value="super_admin">Super admin</option>
                      <option value="catalog_manager">Catalog manager</option>
                      <option value="order_manager">Order manager</option>
                      <option value="content_manager">Content manager</option>
                      <option value="support_manager">Support manager</option>
                    </select>
                    <select name="status" defaultValue={admin.status}>
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                    <input name="password" type="password" placeholder="Optional new password" />
                    <button className="rounded-full border border-white/10 px-4 py-2 text-xs">
                      Update administrator
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
