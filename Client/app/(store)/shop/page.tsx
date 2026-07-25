import { ProductCard } from "@/src/components/product-card";
import { SectionHeading } from "@/src/components/section-heading";
import { getProducts } from "@/src/lib/api";

export default async function ShopPage() {
  const products = await getProducts().catch(() => []);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <SectionHeading
        eyebrow="Shop"
        title="Published collection"
        copy="This catalog is rendered entirely from the central Admin API."
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
        {!products.length && (
          <div className="rounded-[1.5rem] border border-dashed border-white/12 p-6 text-sm text-white/60">
            No published products are live yet.
          </div>
        )}
      </div>
    </main>
  );
}
