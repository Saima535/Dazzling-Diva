import { connectToDatabase } from "@/lib/db";
import { CategoryModel } from "@/models/category";
import { CollectionModel } from "@/models/collection";
import { OrderModel } from "@/models/order";
import { ProductModel } from "@/models/product";
import { SiteSettingsModel } from "@/models/site-settings";

export default async function DashboardPage() {
  await connectToDatabase();
  const [products, categories, collections, orders, settings] = await Promise.all([
    ProductModel.countDocuments(),
    CategoryModel.countDocuments(),
    CollectionModel.countDocuments(),
    OrderModel.countDocuments(),
    SiteSettingsModel.findOne().lean(),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/45">Overview</p>
        <h1 className="mt-3 text-4xl font-semibold">Admin dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Products", products],
          ["Categories", categories],
          ["Collections", collections],
          ["Orders", orders],
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
    </section>
  );
}
