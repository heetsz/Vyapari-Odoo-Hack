import { Schema, model } from "mongoose";

const StockMoveSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    from_location_id: { type: Schema.Types.ObjectId, ref: "Location", default: null },
    to_location_id: { type: Schema.Types.ObjectId, ref: "Location", default: null },
    quantity: { type: Number, required: true },
    movement_type: { 
      type: String, 
      enum: ["receipt", "delivery", "adjustment", "internal_transfer"],
      required: true 
    },
    reference_id: { type: Schema.Types.ObjectId, required: true }, // ID of Receipt, Delivery, or Adjustment
    reference_model: { 
      type: String, 
      enum: ["Receipt", "Delivery", "Adjustment"],
      required: true 
    },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Index for faster queries
StockMoveSchema.index({ product_id: 1, created_at: -1 });
StockMoveSchema.index({ movement_type: 1 });

export default model("StockMove", StockMoveSchema);
