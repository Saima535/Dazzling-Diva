import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const refreshSessionSchema = new Schema(
  {
    ownerType: {
      type: String,
      enum: ["customer"],
      required: true,
    },
    ownerId: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    familyId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    revokedAt: { type: Date, default: null },
    rotatedFromHash: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export type RefreshSession = InferSchemaType<typeof refreshSessionSchema>;

export const RefreshSessionModel =
  (models.RefreshSession as Model<RefreshSession>) ||
  model<RefreshSession>("RefreshSession", refreshSessionSchema);
