import { connectToDatabase } from "@/lib/db";
import { ok } from "@/lib/http";
import { SiteSettingsModel } from "@/models/site-settings";

export async function GET() {
  await connectToDatabase();
  const settings = await SiteSettingsModel.findOne().lean();
  return ok(settings);
}
