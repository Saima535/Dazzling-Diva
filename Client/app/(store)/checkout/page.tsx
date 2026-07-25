import { getCart } from "@/src/lib/cart";
import { formatMoney } from "@/src/lib/money";

import { placeOrderAction } from "./actions";

export default async function CheckoutPage() {
  const items = await getCart();
  const subtotal = items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[1fr_360px] lg:px-8">
      <form action={placeOrderAction} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input name="customerName" placeholder="Full name" required />
          <input name="customerEmail" placeholder="Email" type="email" required />
          <input name="customerPhone" placeholder="Phone" required />
          <input name="district" placeholder="District" required />
          <input name="couponCode" placeholder="Coupon code (optional)" />
          <textarea className="md:col-span-2" name="address" placeholder="Delivery address" rows={4} required />
          <input name="shippingMethodCode" placeholder="Shipping code configured in Admin" defaultValue="DHAKA" />
        </div>
        <button className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-medium text-black">
          Place cash on delivery order
        </button>
      </form>
      <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <div key={item.sku} className="flex justify-between gap-3">
              <span>{item.name} x {item.quantity}</span>
              <span>{formatMoney(item.priceMinor * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between border-t border-white/10 pt-4">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
      </aside>
    </main>
  );
}
