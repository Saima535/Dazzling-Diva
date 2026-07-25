import { ok } from "@/lib/http";
import { listApprovedReviewsForProduct } from "@/modules/reviews/service";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const reviews = await listApprovedReviewsForProduct(slug);
  return ok(reviews);
}
