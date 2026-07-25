import { connectToDatabase } from "@/lib/db";
import { ok } from "@/lib/http";
import { CategoryModel } from "@/models/category";

export async function GET() {
  await connectToDatabase();
  const categories = await CategoryModel.find({ status: "published" })
    .sort({ createdAt: -1 })
    .lean();
  return ok(categories);
}
