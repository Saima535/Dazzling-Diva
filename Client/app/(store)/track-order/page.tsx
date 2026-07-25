import { trackOrder } from "@/src/lib/api";
import { formatMoney } from "@/src/lib/money";

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { orderNumber } = await searchParams;
  const order = orderNumber ? await trackOrder(orderNumber).catch(() => null) : null;

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">Track your order</h1>
      <form className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
        <input name="orderNumber" placeholder="Enter order number" defaultValue={orderNumber ?? ""} />
      </form>
      {order ? (
        <article className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <p className="font-medium">{order.orderNumber}</p>
          <p className="mt-2 text-sm text-white/65">Customer: {order.customerName}</p>
          <p className="mt-2 text-sm text-white/65">Status: {order.orderStatus}</p>
          <p className="mt-2 text-sm text-white/65">Payment: {order.paymentStatus}</p>
          <p className="mt-2 text-sm text-white/65">Total: {formatMoney(order.grandTotalMinor)}</p>
        </article>
      ) : null}
    </main>
  );
}
