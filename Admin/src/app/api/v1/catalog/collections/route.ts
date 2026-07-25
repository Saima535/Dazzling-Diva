import { connectToDatabase } from "@/lib/db";
import { ok } from "@/lib/http";
import { CollectionModel } from "@/models/collection";

export async function GET() {
  await connectToDatabase();
  const collections = await CollectionModel.find({ status: "published" })
    .sort({ createdAt: -1 })
    .lean();
  return ok(collections);
}
