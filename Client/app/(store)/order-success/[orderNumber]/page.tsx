export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  return (
    <main className="mx-auto max-w-3xl px-5 py-20 text-center lg:px-8">
      <p className="text-sm uppercase tracking-[0.35em] text-white/45">Order placed</p>
      <h1 className="mt-4 text-4xl font-semibold">Thank you for your order</h1>
      <p className="mt-5 text-sm leading-7 text-white/70">
        Your order number is {orderNumber}. Use the tracking page any time for the latest status.
      </p>
    </main>
  );
}
