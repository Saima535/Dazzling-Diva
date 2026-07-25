import { connectToDatabase } from "@/lib/db";
import { ok, fail } from "@/lib/http";
import { CollectionModel } from "@/models/collection";
import { ProductModel } from "@/models/product";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const collection = await CollectionModel.findOne({
    slug,
    status: "published",
  }).lean();

  if (!collection) {
    return fail("Collection not found.", 404);
  }

  const products = await ProductModel.find({
    collectionIds: collection._id,
    status: "published",
  }).lean();

  return ok({ collection, products });
}
