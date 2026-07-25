"use client";

import { useTransition } from "react";

export function AddToCartButton({
  productSlug,
  sku,
  name,
  priceMinor,
}: {
  productSlug: string;
  sku: string;
  name: string;
  priceMinor: number;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="rounded-full border border-white/10 px-4 py-2 text-sm"
      disabled={pending || !sku}
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productSlug, sku, name, priceMinor, quantity: 1 }),
          });
        });
      }}
    >
      {pending ? "Adding..." : "Add to cart"}
    </button>
  );
}
