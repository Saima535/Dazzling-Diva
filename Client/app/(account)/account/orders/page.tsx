import Link from "next/link";
import { redirect } from "next/navigation";

import { getCustomerOrders } from "@/src/lib/api";
import { getCustomerToken } from "@/src/lib/customer-session";
import { formatMoney } from "@/src/lib/money";

export default async function AccountOrdersPage() {
  const token = await getCustomerToken();
  if (!token) {
    redirect("/account/login");
  }

  const orders = await getCustomerOrders(token).catch(() => []);

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">My orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.orderNumber}
            href={`/account/orders/${order.orderNumber}`}
            className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="mt-1 text-sm text-white/60">{order.orderStatus}</p>
              </div>
              <p>{formatMoney(order.grandTotalMinor)}</p>
            </div>
          </Link>
        ))}
        {!orders.length ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/15 p-6 text-sm text-white/60">
            No account-linked orders yet.
          </div>
        ) : null}
      </div>
    </main>
  );
}
