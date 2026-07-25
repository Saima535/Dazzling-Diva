import { ProductCard } from "@/src/components/product-card";
import { getProducts } from "@/src/lib/api";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await getProducts().catch(() => []);
  const term = (q ?? "").toLowerCase();
  const filtered = term
    ? products.filter((product) =>
        `${product.name} ${product.shortDescription} ${product.description}`
          .toLowerCase()
          .includes(term),
      )
    : products;

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">Search</h1>
      <form className="mt-6">
        <input name="q" placeholder="Search products" defaultValue={q ?? ""} />
      </form>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
