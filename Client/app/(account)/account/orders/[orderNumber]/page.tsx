import { redirect } from "next/navigation";

import { getCustomerOrders } from "@/src/lib/api";
import { ReviewForm } from "@/src/components/review-form";
import { getCustomerAccessToken } from "@/src/lib/customer-session";
import { formatMoney } from "@/src/lib/money";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const token = await getCustomerAccessToken();
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
      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Items and review history</h2>
        <div className="mt-4 space-y-4">
          {order.items.map((item, index) => (
            <article key={`${order.orderNumber}-${item.variantSku}-${index}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="font-medium">{item.productName}</p>
              <p className="mt-1 text-sm text-white/60">{item.variantSku} · qty {item.quantity}</p>
              {order.orderStatus === "delivered" ? (
                <ReviewForm productSlug={item.productSlug} productName={item.productName} />
              ) : (
                <p className="mt-3 text-sm text-white/55">Reviews open after delivery.</p>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Status timeline</h2>
        <div className="mt-4 space-y-3">
          {order.statusHistory?.map((entry, index) => (
            <div key={`${order.orderNumber}-timeline-${index}`} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="font-medium">{entry.status}</p>
              <p className="mt-1 text-sm text-white/60">{entry.note || "No note"}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
