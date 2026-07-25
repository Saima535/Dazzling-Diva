import Link from "next/link";

import { getCart } from "@/src/lib/cart";
import { formatMoney } from "@/src/lib/money";

export default async function CartPage() {
  const items = await getCart();
  const subtotal = items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">Cart</h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <article key={item.sku} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-white/55">SKU {item.sku}</p>
              </div>
              <div className="text-right text-sm">
                <p>Qty {item.quantity}</p>
                <p className="mt-1 font-medium">{formatMoney(item.priceMinor * item.quantity)}</p>
              </div>
            </div>
          </article>
        ))}
        {!items.length && (
          <div className="rounded-[1.5rem] border border-dashed border-white/15 p-6 text-sm text-white/60">
            Your cart is empty. Start from the shop and add a published product.
          </div>
        )}
      </div>
      <div className="mt-8 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-white/70">Subtotal</p>
        <p className="text-xl font-semibold">{formatMoney(subtotal)}</p>
      </div>
      <Link
        href="/checkout"
        className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
      >
        Continue to checkout
      </Link>
    </main>
  );
}
