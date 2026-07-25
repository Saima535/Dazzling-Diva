import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const rateLimitSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

export type RateLimit = InferSchemaType<typeof rateLimitSchema>;

export const RateLimitModel =
  (models.RateLimit as Model<RateLimit>) ||
  model<RateLimit>("RateLimit", rateLimitSchema);
