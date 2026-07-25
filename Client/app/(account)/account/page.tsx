import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/src/components/logout-button";
import { getCustomerMe } from "@/src/lib/api";
import { getCustomerAccessToken } from "@/src/lib/customer-session";

export default async function AccountPage() {
  const token = await getCustomerAccessToken();
  if (!token) {
    redirect("/account/login");
  }

  const customer = await getCustomerMe(token).catch(() => null);
  if (!customer) {
    redirect("/account/login");
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">My account</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">Name</p>
          <p className="mt-3 font-medium">{customer.name}</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">Email</p>
          <p className="mt-3 font-medium">{customer.email}</p>
        </article>
        <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/55">Phone</p>
          <p className="mt-3 font-medium">{customer.phone || "Not added yet"}</p>
        </article>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/account/orders" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
          View orders
        </Link>
        <Link href="/account/reviews" className="rounded-full border border-white/10 px-5 py-3 text-sm">
          View reviews
        </Link>
        <Link href="/wishlist" className="rounded-full border border-white/10 px-5 py-3 text-sm">
          View wishlist
        </Link>
        <LogoutButton />
      </div>
    </main>
  );
}
