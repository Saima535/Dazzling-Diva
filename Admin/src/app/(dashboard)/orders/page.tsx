import { connectToDatabase } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { OrderModel } from "@/models/order";
import { ShippingMethodModel } from "@/models/shipping-method";

import { createShippingMethodAction } from "../actions";

export default async function OrdersPage() {
  await connectToDatabase();
  const [orders, shippingMethods] = await Promise.all([
    OrderModel.find().sort({ createdAt: -1 }).lean(),
    ShippingMethodModel.find().sort({ createdAt: -1 }).lean(),
  ]);

  return (
    <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form action={createShippingMethodAction} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Shipping method</h1>
        <div className="mt-5 space-y-4">
          <input name="name" placeholder="Name" required />
          <input name="code" placeholder="Code" required />
          <input name="feeMinor" placeholder="Fee in minor units" required />
          <input name="estimatedDelivery" placeholder="Estimated delivery" />
          <label className="flex items-center gap-2 text-sm">
            <input className="w-auto" type="checkbox" name="codEnabled" defaultChecked />
            COD enabled
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input className="w-auto" type="checkbox" name="enabled" defaultChecked />
            Active
          </label>
          <button className="rounded-full bg-[var(--brand-strong)] px-5 py-3">
            Save shipping method
          </button>
        </div>
      </form>
      <div className="space-y-6">
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Shipping methods</h2>
          <div className="mt-5 space-y-3">
            {shippingMethods.map((method) => (
              <div key={String(method._id)} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="font-medium">{method.name}</p>
                <p className="text-sm text-white/60">
                  {method.code} · {formatMoney(method.feeMinor)}
                </p>
              </div>
            ))}
            {!shippingMethods.length && (
              <p className="text-sm text-white/65">
                Add at least one shipping method before checkout can be used.
              </p>
            )}
          </div>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Orders</h2>
          <div className="mt-5 space-y-3">
            {orders.map((order) => (
              <div key={String(order._id)} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-white/60">{order.customerName}</p>
                  </div>
                  <p className="text-sm">{formatMoney(order.grandTotalMinor)}</p>
                </div>
              </div>
            ))}
            {!orders.length && (
              <p className="text-sm text-white/65">
                Orders will appear here once customers complete checkout.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
