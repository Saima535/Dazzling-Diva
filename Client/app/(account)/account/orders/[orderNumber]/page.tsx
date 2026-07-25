export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <main className="mx-auto max-w-3xl px-5 py-14 lg:px-8"><h1 className="text-4xl font-semibold">Order {orderNumber}</h1><p className="mt-6 text-sm text-white/70">Detailed customer-account order pages are planned for the next phase.</p></main>;
}
