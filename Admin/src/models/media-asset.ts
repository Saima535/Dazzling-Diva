import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const mediaAssetSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true },
    secureUrl: { type: String, required: true },
    folder: { type: String, default: "dazzling-diva" },
    altText: { type: String, default: "" },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    format: { type: String, default: "" },
    bytes: { type: Number, default: 0 },
    uploadedBy: { type: String, default: "system" },
    usageReferences: { type: [String], default: [] },
  },
  { timestamps: true },
);

export type MediaAsset = InferSchemaType<typeof mediaAssetSchema>;

export const MediaAssetModel =
  (models.MediaAsset as Model<MediaAsset>) ||
  model<MediaAsset>("MediaAsset", mediaAssetSchema);
