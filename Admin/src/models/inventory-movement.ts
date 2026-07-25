import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const inventoryMovementSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    variantSku: { type: String, required: true },
    movementType: {
      type: String,
      enum: [
        "initial",
        "manual_adjustment",
        "order_placed",
        "order_cancelled",
        "correction",
      ],
      required: true,
    },
    quantityDelta: { type: Number, required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    reason: { type: String, default: "" },
    relatedOrderNumber: { type: String, default: "" },
  },
  { timestamps: true },
);

export type InventoryMovement = InferSchemaType<typeof inventoryMovementSchema>;

export const InventoryMovementModel =
  (models.InventoryMovement as Model<InventoryMovement>) ||
  model<InventoryMovement>("InventoryMovement", inventoryMovementSchema);
