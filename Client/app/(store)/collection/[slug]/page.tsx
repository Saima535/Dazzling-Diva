import { ProductCard } from "@/src/components/product-card";
import { getCollection } from "@/src/lib/api";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { collection, products } = await getCollection(slug);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">{collection.name}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
        {collection.description || "Browse the published products attached to this collection."}
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
