import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const addressSchema = new Schema(
  {
    label: { type: String, default: "Default" },
    address: { type: String, required: true },
    district: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false },
);

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    addresses: { type: [addressSchema], default: [] },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

export type Customer = InferSchemaType<typeof customerSchema>;

export const CustomerModel =
  (models.Customer as Model<Customer>) ||
  model<Customer>("Customer", customerSchema);
