import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const auditLogSchema = new Schema(
  {
    actorId: { type: String, default: "system" },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    summary: { type: String, default: "" },
  },
  { timestamps: true },
);

export type AuditLog = InferSchemaType<typeof auditLogSchema>;

export const AuditLogModel =
  (models.AuditLog as Model<AuditLog>) ||
  model<AuditLog>("AuditLog", auditLogSchema);
