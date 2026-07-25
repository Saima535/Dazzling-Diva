import { connectToDatabase } from "@/lib/db";
import { requireAdminRole } from "@/lib/rbac";
import { CustomerModel } from "@/models/customer";

export default async function CustomersPage() {
  await requireAdminRole(["super_admin", "support_manager", "order_manager"]);
  await connectToDatabase();
  const customers = await CustomerModel.find().sort({ createdAt: -1 }).lean();

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <div className="mt-5 space-y-3">
        {customers.map((customer) => (
          <article key={String(customer._id)} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{customer.name}</h3>
                <p className="text-sm text-white/55">{customer.email}</p>
                <p className="mt-1 text-sm text-white/55">{customer.phone || "No phone"}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-white/45">
                {customer.status}
              </span>
            </div>
          </article>
        ))}
        {!customers.length ? <p className="text-sm text-white/65">No customers registered yet.</p> : null}
      </div>
    </section>
  );
}
