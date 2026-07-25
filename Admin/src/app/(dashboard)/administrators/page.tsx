import { listAdminUsers } from "@/modules/admin-users/service";

import { createAdminUserAction } from "../actions";

export default async function AdministratorsPage() {
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
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-sm text-white/60">{admin.email}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-white/45">{admin.role}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
