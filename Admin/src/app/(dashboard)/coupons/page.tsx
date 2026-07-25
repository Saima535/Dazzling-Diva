import { requireAdminRole } from "@/lib/rbac";
import { listCoupons } from "@/modules/coupons/service";

import { createCouponAction } from "../actions";

export default async function CouponsPage() {
  await requireAdminRole(["super_admin", "content_manager", "order_manager"]);
  const coupons = await listCoupons();

  return (
    <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form action={createCouponAction} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Create coupon</h1>
        <div className="mt-5 space-y-4">
          <input name="code" placeholder="Coupon code" required />
          <select name="type" defaultValue="fixed">
            <option value="fixed">Fixed discount</option>
            <option value="percentage">Percentage discount</option>
          </select>
          <input name="valueMinor" placeholder="Value in minor units or percent" required />
          <input name="minimumSubtotalMinor" placeholder="Minimum subtotal in minor units" defaultValue="0" />
          <input name="maxDiscountMinor" placeholder="Maximum discount in minor units" defaultValue="0" />
          <label className="flex items-center gap-2 text-sm">
            <input className="w-auto" type="checkbox" name="active" defaultChecked />
            Active
          </label>
          <button className="rounded-full bg-[var(--brand-strong)] px-5 py-3">
            Save coupon
          </button>
        </div>
      </form>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">Existing coupons</h2>
        <div className="mt-5 space-y-3">
          {coupons.map((coupon) => (
            <article key={String(coupon._id)} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{coupon.code}</h3>
                  <p className="text-sm text-white/55">
                    {coupon.type} · value {coupon.valueMinor} · used {coupon.usageCount}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-white/45">
                  {coupon.active ? "active" : "inactive"}
                </span>
              </div>
            </article>
          ))}
          {!coupons.length ? <p className="text-sm text-white/65">No coupons created yet.</p> : null}
        </div>
      </div>
    </section>
  );
}
