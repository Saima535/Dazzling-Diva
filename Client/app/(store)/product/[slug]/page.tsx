import Image from "next/image";

import { AddToCartButton } from "@/src/components/product-cart-button";
import { formatMoney } from "@/src/lib/money";
import { getProduct } from "@/src/lib/api";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const primaryVariant = product.variants[0];

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-2 lg:px-8">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
        {product.heroImageUrl ? (
          <Image src={product.heroImageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/45">
            Product image will appear after admin upload
          </div>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/45">Dazzling Diva</p>
        <h1 className="mt-4 text-4xl font-semibold">{product.name}</h1>
        <p className="mt-4 text-sm leading-7 text-white/70">
          {product.description || product.shortDescription || "This product is ready for merchandising from the admin app."}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-2xl font-semibold">{formatMoney(primaryVariant?.priceMinor ?? 0)}</span>
          {primaryVariant?.compareAtPriceMinor ? (
            <span className="text-sm text-white/45 line-through">
              {formatMoney(primaryVariant.compareAtPriceMinor)}
            </span>
          ) : null}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Size</p>
            <p className="mt-2">{primaryVariant?.size || "Free Size"}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Color</p>
            <p className="mt-2">{primaryVariant?.color || "Default"}</p>
          </div>
        </div>
        <div className="mt-8">
          <AddToCartButton
            productSlug={product.slug}
            sku={primaryVariant?.sku ?? ""}
            name={product.name}
            priceMinor={primaryVariant?.priceMinor ?? 0}
          />
        </div>
      </div>
    </main>
  );
}
