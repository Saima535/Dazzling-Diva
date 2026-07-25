import { connectToDatabase } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { InventoryMovementModel } from "@/models/inventory-movement";
import { OrderModel } from "@/models/order";
import { ShippingMethodModel } from "@/models/shipping-method";

import { createShippingMethodAction, updateOrderStatusAction } from "../actions";

export default async function OrdersPage() {
  await connectToDatabase();
  const [orders, shippingMethods, movements] = await Promise.all([
    OrderModel.find().sort({ createdAt: -1 }).lean(),
    ShippingMethodModel.find().sort({ createdAt: -1 }).lean(),
    InventoryMovementModel.find().sort({ createdAt: -1 }).limit(10).lean(),
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
                  <div className="text-right">
                    <p className="text-sm">{formatMoney(order.grandTotalMinor)}</p>
                    <form action={updateOrderStatusAction} className="mt-2 flex gap-2">
                      <input type="hidden" name="orderId" value={String(order._id)} />
                      <select className="w-auto rounded-full px-3 py-2 text-xs" name="status" defaultValue={order.orderStatus}>
                        {["pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled"].map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button className="rounded-full border border-white/10 px-3 py-2 text-xs">
                        Update
                      </button>
                    </form>
                  </div>
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
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Inventory movements</h2>
          <div className="mt-5 space-y-3">
            {movements.map((movement) => (
              <div key={String(movement._id)} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="font-medium">{movement.productName}</p>
                <p className="mt-1 text-sm text-white/60">
                  {movement.variantSku} · {movement.movementType} · {movement.quantityDelta}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
