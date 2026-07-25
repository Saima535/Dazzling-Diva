import { connectToDatabase } from "@/lib/db";
import { ok, fail } from "@/lib/http";
import { CategoryModel } from "@/models/category";
import { ProductModel } from "@/models/product";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const category = await CategoryModel.findOne({ slug, status: "published" }).lean();

  if (!category) {
    return fail("Category not found.", 404);
  }

  const products = await ProductModel.find({
    categoryId: category._id,
    status: "published",
  }).lean();

  return ok({ category, products });
}
