import { redirect } from "next/navigation";

import { ProductCard } from "@/src/components/product-card";
import { getCustomerToken } from "@/src/lib/customer-session";
import { getWishlist } from "@/src/lib/api";

export default async function WishlistPage() {
  const token = await getCustomerToken();
  if (!token) {
    redirect("/account/login");
  }

  const products = await getWishlist(token).catch(() => []);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">Wishlist</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
        {!products.length ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/15 p-6 text-sm text-white/60">
            Your wishlist is empty right now.
          </div>
        ) : null}
      </div>
    </main>
  );
}
