import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "super_admin",
        "catalog_manager",
        "order_manager",
        "content_manager",
        "support_manager",
      ],
      default: "super_admin",
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    lastLoginAt: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true },
);

export type AdminUser = InferSchemaType<typeof adminUserSchema>;

export const AdminUserModel =
  (models.AdminUser as Model<AdminUser>) ||
  model<AdminUser>("AdminUser", adminUserSchema);
