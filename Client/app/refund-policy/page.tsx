import { getPages } from "@/src/lib/api";

export default async function RefundPolicyPage() {
  const pages = await getPages().catch(() => null);
  return <main className="mx-auto max-w-4xl px-5 py-14 lg:px-8"><h1 className="text-4xl font-semibold">Refund Policy</h1><p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-white/70">{pages?.refundPolicyPage || "Update the refund policy content from Admin settings."}</p></main>;
}
