import { connectToDatabase } from "@/lib/db";
import { logEvent } from "@/lib/logger";
import { RateLimitModel } from "@/models/rate-limit";

export async function checkRateLimit(key: string, limit: number, windowMs: number) {
  await connectToDatabase();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  const current = await RateLimitModel.findOne({ key });

  if (!current || current.expiresAt <= now) {
    await RateLimitModel.findOneAndUpdate(
      { key },
      { key, count: 1, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    return;
  }

  if (current.count >= limit) {
    logEvent("warn", { action: "rate_limit.blocked", key, limit });
    throw new Error("Too many requests. Please try again shortly.");
  }

  current.count += 1;
  await current.save();
}
