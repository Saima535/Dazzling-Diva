"use client";

import { useState, useTransition } from "react";

export function WishlistButton({ productId }: { productId: string }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        className="rounded-full border border-white/10 px-4 py-2 text-sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const response = await fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId }),
            });
            const result = await response.json();
            setMessage(result.success ? "Saved to wishlist" : result.error ?? "Unable to save");
          })
        }
      >
        {pending ? "Saving..." : "Wishlist"}
      </button>
      {message ? <span className="text-xs text-white/60">{message}</span> : null}
    </div>
  );
}
