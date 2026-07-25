import { connectToDatabase } from "@/lib/db";
import { ok } from "@/lib/http";
import { ProductModel } from "@/models/product";

export async function GET() {
  await connectToDatabase();
  const now = new Date();
  const products = await ProductModel.find({ status: "published" })
    .find({
      $and: [
        { $or: [{ publishAt: null }, { publishAt: { $lte: now } }] },
        { $or: [{ unpublishAt: null }, { unpublishAt: { $gt: now } }] },
      ],
    })
    .sort({ createdAt: -1 })
    .lean();
  return ok(products);
}
