import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const collectionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    coverImageUrl: { type: String, default: "" },
    publishAt: { type: Date, default: null },
    unpublishAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type Collection = InferSchemaType<typeof collectionSchema>;

export const CollectionModel =
  (models.Collection as Model<Collection>) ||
  model<Collection>("Collection", collectionSchema);
