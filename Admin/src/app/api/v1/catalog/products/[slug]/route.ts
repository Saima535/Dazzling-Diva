import { connectToDatabase } from "@/lib/db";
import { ok, fail } from "@/lib/http";
import { ProductModel } from "@/models/product";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const product = await ProductModel.findOne({ slug, status: "published" }).lean();

  if (!product) {
    return fail("Product not found.", 404);
  }

  return ok(product);
}
