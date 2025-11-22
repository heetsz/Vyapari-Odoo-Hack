import { Schema, model } from "mongoose";

const StockSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    location_id: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    quantity: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

// Ensure unique combination of product and location
StockSchema.index({ product_id: 1, location_id: 1 }, { unique: true });

export default model("Stock", StockSchema);
