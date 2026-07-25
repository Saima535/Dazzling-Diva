import { redirect } from "next/navigation";

import { getCustomerOrders } from "@/src/lib/api";
import { getCustomerToken } from "@/src/lib/customer-session";
import { formatMoney } from "@/src/lib/money";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const token = await getCustomerToken();
  if (!token) {
    redirect("/account/login");
  }

  const { orderNumber } = await params;
  const orders = await getCustomerOrders(token).catch(() => []);
  const order = orders.find((entry) => entry.orderNumber === orderNumber);

  if (!order) {
    redirect("/account/orders");
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">Order {order.orderNumber}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">Status</p>
          <p className="mt-3 font-medium">{order.orderStatus}</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">Payment</p>
          <p className="mt-3 font-medium">{order.paymentStatus}</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">Total</p>
          <p className="mt-3 font-medium">{formatMoney(order.grandTotalMinor)}</p>
        </article>
      </div>
    </main>
  );
}
