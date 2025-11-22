import { Schema, model } from "mongoose";

const AdjustmentSchema = new Schema(
  {
    adjustment_number: { type: String, required: true, unique: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    system_quantity: { type: Number, required: true }, // Before adjustment
    counted_quantity: { type: Number, required: true }, // After adjustment
    difference: { type: Number, required: true }, // counted - system
    reason: { 
      type: String, 
      enum: ["damage", "extra", "expired", "theft", "correction", "other"],
      required: true 
    },
    notes: { type: String },
    validated_at: { type: Date },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    validated_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model("Adjustment", AdjustmentSchema);
