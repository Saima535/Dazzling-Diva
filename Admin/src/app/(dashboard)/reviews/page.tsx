import { listReviews } from "@/modules/reviews/service";

import { updateReviewStatusAction } from "../actions";

export default async function ReviewsPage() {
  const reviews = await listReviews();

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <div className="mt-5 space-y-3">
        {reviews.map((review) => (
          <article key={String(review._id)} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{review.productName}</p>
                <p className="mt-1 text-sm text-white/60">{review.rating}/5 · {review.title || "Untitled review"}</p>
                <p className="mt-2 text-sm text-white/70">{review.body || "No body provided."}</p>
              </div>
              <form action={updateReviewStatusAction} className="flex gap-2">
                <input type="hidden" name="reviewId" value={String(review._id)} />
                <select className="w-auto rounded-full px-3 py-2 text-xs" name="status" defaultValue={review.status}>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </select>
                <button className="rounded-full border border-white/10 px-3 py-2 text-xs">Apply</button>
              </form>
            </div>
          </article>
        ))}
        {!reviews.length ? <p className="text-sm text-white/65">No reviews yet.</p> : null}
      </div>
    </section>
  );
}
