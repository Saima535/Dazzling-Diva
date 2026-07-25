import { connectToDatabase } from "@/lib/db";
import { CategoryModel } from "@/models/category";
import { CollectionModel } from "@/models/collection";
import { CouponModel } from "@/models/coupon";
import { CustomerModel } from "@/models/customer";
import { OrderModel } from "@/models/order";
import { ProductModel } from "@/models/product";
import { SiteSettingsModel } from "@/models/site-settings";
import { AuditLogModel } from "@/models/audit-log";

export default async function DashboardPage() {
  await connectToDatabase();
  const [products, categories, collections, orders, settings, customers, coupons, audits] = await Promise.all([
    ProductModel.countDocuments(),
    CategoryModel.countDocuments(),
    CollectionModel.countDocuments(),
    OrderModel.countDocuments(),
    SiteSettingsModel.findOne().lean(),
    CustomerModel.countDocuments(),
    CouponModel.countDocuments(),
    AuditLogModel.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/45">Overview</p>
        <h1 className="mt-3 text-4xl font-semibold">Admin dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[
          ["Products", products],
          ["Categories", categories],
          ["Collections", collections],
          ["Orders", orders],
          ["Customers", customers],
          ["Coupons", coupons],
        ].map(([label, value]) => (
          <article key={label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/60">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </article>
        ))}
      </div>
      <article className="rounded-[1.5rem] border border-white/10 bg-[var(--surface-soft)] p-6">
        <h2 className="text-xl font-semibold">Readiness</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/75">
          <li>{settings ? "Site settings configured." : "Site settings still need configuration."}</li>
          <li>{products ? "Published catalog can now be assembled." : "No products exist yet."}</li>
          <li>{orders ? "Orders are flowing into the backend." : "No orders have been placed yet."}</li>
        </ul>
      </article>
      <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Recent audit activity</h2>
        <div className="mt-4 space-y-3 text-sm text-white/75">
          {audits.map((audit) => (
            <div key={String(audit._id)} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-medium">{audit.action}</p>
              <p className="mt-1 text-white/55">{audit.summary || audit.entityType}</p>
            </div>
          ))}
          {!audits.length ? <p>No audit events yet.</p> : null}
        </div>
      </article>
    </section>
  );
}
