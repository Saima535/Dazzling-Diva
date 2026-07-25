"use client";

import { useState, useTransition } from "react";

export function ReviewForm({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName: string;
}) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mt-4 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const response = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productSlug,
              rating: Number(formData.get("rating") ?? 5),
              title: String(formData.get("title") ?? ""),
              body: String(formData.get("body") ?? ""),
            }),
          });
          const result = await response.json();
          setMessage(
            response.ok && result.success
              ? `Review submitted for ${productName}.`
              : result.error ?? "Unable to submit review.",
          );
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-[140px_1fr]">
        <select name="rating" defaultValue="5">
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} stars
            </option>
          ))}
        </select>
        <input name="title" placeholder="Review title" />
      </div>
      <textarea name="body" rows={4} placeholder="Share your experience" />
      <button className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black" disabled={pending}>
        {pending ? "Submitting..." : "Submit review"}
      </button>
      {message ? <p className="text-sm text-white/70">{message}</p> : null}
    </form>
  );
}
