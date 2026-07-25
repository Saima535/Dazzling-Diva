import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

export type Category = InferSchemaType<typeof categorySchema>;

export const CategoryModel =
  (models.Category as Model<Category>) || model<Category>("Category", categorySchema);
