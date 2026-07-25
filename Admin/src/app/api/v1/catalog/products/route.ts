import { connectToDatabase } from "@/lib/db";
import { ok } from "@/lib/http";
import { ProductModel } from "@/models/product";

export async function GET() {
  await connectToDatabase();
  const products = await ProductModel.find({ status: "published" })
    .sort({ createdAt: -1 })
    .lean();
  return ok(products);
}
