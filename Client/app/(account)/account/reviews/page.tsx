import { redirect } from "next/navigation";

import { getCustomerReviews } from "@/src/lib/api";
import { getCustomerAccessToken } from "@/src/lib/customer-session";

export default async function AccountReviewsPage() {
  const token = await getCustomerAccessToken();
  if (!token) {
    redirect("/account/login");
  }

  const reviews = await getCustomerReviews(token).catch(() => []);

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">My reviews</h1>
      <div className="mt-8 space-y-4">
        {reviews.map((review) => (
          <article key={review._id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="font-medium">{review.productName}</p>
            <p className="mt-1 text-sm text-white/60">{review.rating}/5 · {review.status}</p>
            <p className="mt-2 text-sm text-white/70">{review.title || "Untitled review"}</p>
            <p className="mt-2 text-sm text-white/70">{review.body || "No body provided."}</p>
          </article>
        ))}
        {!reviews.length ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/15 p-6 text-sm text-white/60">
            You have not submitted any reviews yet.
          </div>
        ) : null}
      </div>
    </main>
  );
}
