import { connectToDatabase } from "@/lib/db";
import { ok } from "@/lib/http";
import { CategoryModel } from "@/models/category";
import { HomePageConfigModel } from "@/models/homepage-config";
import { ProductModel } from "@/models/product";
import { SiteSettingsModel } from "@/models/site-settings";

export async function GET() {
  await connectToDatabase();

  const [homepage, settings, categories, featured, newArrivals, mostLoved] =
    await Promise.all([
      HomePageConfigModel.findOne().lean(),
      SiteSettingsModel.findOne().lean(),
      CategoryModel.find({ status: "published" }).sort({ createdAt: -1 }).limit(4).lean(),
      ProductModel.find({ status: "published", featured: true }).limit(4).lean(),
      ProductModel.find({ status: "published", newArrival: true }).limit(8).lean(),
      ProductModel.find({ status: "published", mostLoved: true }).limit(4).lean(),
    ]);

  return ok({
    homepage,
    settings,
    categories,
    featured,
    newArrivals,
    mostLoved,
    serverTime: new Date().toISOString(),
  });
}
