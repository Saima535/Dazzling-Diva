import Image from "next/image";
import Link from "next/link";

import { formatMoney } from "@/src/lib/money";
import type { PublicProduct } from "@/src/lib/api";

import { AddToCartButton } from "./product-cart-button";

export function ProductCard({ product }: { product: PublicProduct }) {
  const price = product.variants[0]?.priceMinor ?? 0;

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-white/5">
          {product.heroImageUrl ? (
            <Image
              src={product.heroImageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/40">
              Image will appear after admin upload
            </div>
          )}
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">Dazzling Diva</p>
          <Link href={`/product/${product.slug}`} className="mt-2 block text-lg font-medium">
            {product.name}
          </Link>
        </div>
        <p className="text-sm text-white/65">{product.shortDescription || "Ready for your next occasion."}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">{formatMoney(price)}</span>
          <AddToCartButton
            productSlug={product.slug}
            sku={product.variants[0]?.sku ?? ""}
            name={product.name}
            priceMinor={price}
          />
        </div>
      </div>
    </article>
  );
}
